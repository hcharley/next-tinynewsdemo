import {
  hasuraInsertDataImport,
  hasuraInsertReadingFrequency,
} from '../../../lib/analytics';

const { google } = require('googleapis');
const googleAnalyticsViewID = process.env.NEXT_PUBLIC_ANALYTICS_VIEW_ID;

const apiUrl = process.env.HASURA_API_URL;
const apiToken = process.env.ORG_SLUG;

const credsEmail = process.env.GOOGLE_CREDENTIALS_EMAIL;
const credsPrivateKey = process.env.GOOGLE_CREDENTIALS_PRIVATE_KEY;
const scopes = [
  'https://www.googleapis.com/auth/drive',
  'https://www.googleapis.com/auth/analytics',
  'https://www.googleapis.com/auth/analytics.edit',
];
const auth = new google.auth.JWT(credsEmail, null, credsPrivateKey, scopes);
const analyticsreporting = google.analyticsreporting({ version: 'v4', auth });

async function getReadingFrequency(params) {
  let startDate = params['startDate'];
  let endDate = params['endDate'];
  let googleAnalyticsViewID = params['viewID'];
  let apiUrl = params['apiUrl'];

  try {
    const response = await analyticsreporting.reports.batchGet({
      requestBody: {
        reportRequests: [
          {
            viewId: googleAnalyticsViewID,
            dateRanges: [
              {
                startDate: startDate,
                endDate: endDate,
              },
            ],
            metrics: [
              {
                expression: 'ga:pageviews',
              },
            ],
            dimensions: [
              {
                name: 'ga:dimension2',
              },
              {
                name: 'ga:date',
              },
            ],
          },
        ],
      },
    });
    console.log('GA response:', response);

    if (
      !response ||
      !response.data ||
      !response.data.reports ||
      !response.data.reports[0] ||
      !response.data.reports[0].data ||
      !response.data.reports[0].data.rows
    ) {
      const error = new Error('No rows returned for ' + startDate);
      error.code = '404';
      throw error;
    }

    let objects = [];
    response.data.reports[0].data.rows.forEach((row) => {
      objects.push({
        count: row.metrics[0].values[0],
        category: row.dimensions[0],
        date: row.dimensions[1],
      });
    });

    let returnResults = { errors: [], results: [] };

    hasuraInsertReadingFrequency({
      url: apiUrl,
      orgSlug: apiToken,
      objects: objects,
    }).then((result) => {
      console.log('hasura insert result:', result);
      if (result.errors) {
        returnResults['errors'].push(result.errors);
        returnResults['status'] = 'error';
      } else {
        returnResults['results'].push(result);
        returnResults['status'] = 'ok';
      }
    });
    console.log('returning this:', returnResults);
    return returnResults;
  } catch (e) {
    console.error('caught error:', e);
    return { errors: [e] };
  }
}

export default async (req, res) => {
  const { startDate, endDate } = req.query;

  console.log('data import reading frequency:', startDate, endDate);
  const results = await getReadingFrequency({
    startDate: startDate,
    endDate: endDate,
    viewID: googleAnalyticsViewID,
    apiUrl: apiUrl,
  });

  let resultNotes =
    results.results && results.results[0] && results.results[0].data
      ? results.results[0].data
      : JSON.stringify(results);

  let successFlag = true;
  if (results.errors && results.errors.length > 0) {
    if (results.errors[0].code && results.errors[0].code === '404') {
      successFlag = true;
    } else {
      successFlag = false;
    }
    resultNotes = results.errors;
  }

  const auditResult = await hasuraInsertDataImport({
    url: apiUrl,
    orgSlug: apiToken,
    table_name: 'ga_reading_frequency',
    start_date: startDate,
    end_date: endDate,
    success: successFlag,
    notes: JSON.stringify(resultNotes),
  });

  const auditStatus = auditResult.data ? 'ok' : 'error';

  if (results.errors && results.errors.length > 0) {
    return res
      .status(500)
      .json({ status: 'error', errors: resultNotes, audit: auditStatus });
  }

  res.status(200).json({
    name: 'ga_reading_frequency',
    startDate: startDate,
    endDate: endDate,
    status: 'ok',
    message: resultNotes,
    audit: auditStatus,
  });
};
