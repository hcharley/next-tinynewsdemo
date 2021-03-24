import React, { useState, useEffect } from 'react';
import { getMetricsData } from '../../../lib/analytics';

const DailySessions = (props) => {
  const INITIAL_STATE = {
    labels: [],
    values: [],
  };
  const [geoReportData, setGeoReportData] = useState(INITIAL_STATE);

  useEffect(() => {
    const pageViewsMetric = 'ga:pageviews';
    const sessionsMetric = 'ga:sessions';
    const geoDimensions = ['ga:country', 'ga:region'];

    getMetricsData(
      props.viewID,
      props.startDate,
      props.endDate,
      [sessionsMetric, pageViewsMetric],
      geoDimensions
    )
      .then((response) => {
        const queryResult = response.result.reports[0].data.rows;

        let labels = [];
        let values = [];

        queryResult.forEach((row) => {
          let label = row.dimensions.join(' - ');
          let value = row.metrics[0].values[0];

          labels.push(label);
          values.push(value);
        });

        setGeoReportData({
          ...geoReportData,
          labels,
          values,
        });
      })
      .catch((error) => console.error(error));
  }, []);

  return (
    <section className="section">
      <div className="content">
        <p className="subtitle is-5">Sessions by geographic region</p>

        <table className="table is-fullwidth" style={{ width: '100%' }}>
          <thead>
            <tr>
              <th>Country - Region</th>
              <th>Sessions</th>
            </tr>
          </thead>
          <tbody>
            {geoReportData.labels.map((label, i) => (
              <tr>
                <td>{label}</td>
                <td> {geoReportData.values[i]} </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default DailySessions;
