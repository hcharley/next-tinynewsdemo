import {
  hasuraInsertDataImport,
  hasuraInsertCustomDimension,
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

async function getSubscribers(params) {
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
                expression: 'ga:sessions',
              },
            ],
            dimensions: [
              {
                name: 'ga:dimension4',
              },
            ],
          },
        ],
      },
    });
    console.log('GA response:', response);

    let insertPromises = [];
    if (
      !response ||
      !response.data ||
      !response.data.reports ||
      !response.data.reports[0] ||
      !response.data.reports[0].data ||
      !response.data.reports[0].data.rows
    ) {
      console.log('No data from GA for subscriber clicks on ' + startDate);
      insertPromises.push(
        hasuraInsertCustomDimension({
          url: apiUrl,
          orgSlug: apiToken,
          count: 0,
          label: 'isSubscriber',
          dimension: 'dimension5',
          date: startDate,
        }).then((result) => {
          if (result.errors) {
            return { status: 'error', errors: result.errors };
          } else {
            return { status: 'ok', result: result, errors: [] };
          }
        })
      );
    } else {
      response.data.reports[0].data.rows.forEach((row) => {
        insertPromises.push(
          hasuraInsertCustomDimension({
            url: apiUrl,
            orgSlug: apiToken,
            count: row.metrics[0].values[0],
            label: 'isSubscriber',
            dimension: 'dimension5',
            date: startDate,
          }).then((result) => {
            if (result.errors) {
              return { status: 'error', errors: result.errors };
            } else {
              return { status: 'ok', result: result, errors: [] };
            }
          })
        );
      });
    }

    let returnResults = { errors: [], results: [] };

    for await (let result of insertPromises) {
      if (result['errors'] && result['errors'].length > 0) {
        returnResults['errors'].push(result['errors']);
      }
      if (result['result']) {
        returnResults['results'].push(result['result']);
      }
    }
    return returnResults;
  } catch (e) {
    console.error('caught error:', e);
    return { errors: [e] };
  }
}

export default async (req, res) => {
  const { startDate, endDate } = req.query;

  console.log('data import subscriber data:', startDate, endDate);
  const results = await getSubscribers({
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
    successFlag = false;
    resultNotes = results.errors;
  }

  const auditResult = await hasuraInsertDataImport({
    url: apiUrl,
    orgSlug: apiToken,
    table_name: 'ga_subscribers',
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
    name: 'ga_subscribers',
    startDate: startDate,
    endDate: endDate,
    status: 'ok',
    message: resultNotes,
    audit: auditStatus,
  });
};
