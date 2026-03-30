import React, { useState, useEffect } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

/**
 * A simple Chart component mimicking TensorBoard that parses CSV data.
 * Usage in markdown:
 * ```csvchart
 * {"title": "Loss Curve", "xLabel": "Epoch", "yLabel": "Loss"}
 * epoch,loss
 * 1,2.5
 * 2,1.8
 * 3,1.3
 * 4,0.9
 * 5,0.7
 * ```
 */
const CsvChart = ({ content }) => {
  const [data, setData] = useState([]);
  const [config, setConfig] = useState({ title: '', xLabel: '', yLabel: '' });
  const [lines, setLines] = useState([]);

  useEffect(() => {
    try {
      const lines = content.trim().split('\n');
      let configObj = {};
      let startIndex = 0;

      // Check if first line is JSON config
      if (lines[0].startsWith('{') && lines[0].endsWith('}')) {
        configObj = JSON.parse(lines[0]);
        startIndex = 1;
      }
      setConfig(configObj);

      if (startIndex >= lines.length) return;

      const headers = lines[startIndex].split(',').map(h => h.trim());
      if (headers.length < 2) return;

      const xAxisKey = headers[0];
      const yAxisKeys = headers.slice(1);
      setLines(yAxisKeys);

      const parsedData = lines.slice(startIndex + 1).map(line => {
        const values = line.split(',').map(v => parseFloat(v.trim()));
        const obj = { [xAxisKey]: values[0] };
        yAxisKeys.forEach((key, i) => {
          obj[key] = values[i + 1];
        });
        return obj;
      }).filter(obj => !isNaN(obj[xAxisKey]));

      setData(parsedData);
    } catch (e) {
      console.error("Error parsing CsvChart data", e);
    }
  }, [content]);

  if (!data.length) {
    return <div>Invalid chart data</div>;
  }

  const xAxisKey = Object.keys(data[0]).find(k => !lines.includes(k));

  const colors = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#0088FE'];

  return (
    <div style={{ margin: '2rem 0', width: '100%', height: 400, backgroundColor: '#f9f9f9', padding: '1rem', borderRadius: '8px' }}>
      {config.title && <h3 style={{ textAlign: 'center', marginBottom: '1rem' }}>{config.title}</h3>}
      <ResponsiveContainer width="100%" height="80%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey={xAxisKey}
            label={{ value: config.xLabel || xAxisKey, position: 'insideBottomRight', offset: -5 }}
          />
          <YAxis
            label={{ value: config.yLabel || '', angle: -90, position: 'insideLeft' }}
          />
          <Tooltip />
          <Legend wrapperStyle={{ paddingTop: '20px' }} />
          {lines.map((line, ix) => (
            <Line
              key={line}
              type="monotone"
              dataKey={line}
              stroke={colors[ix % colors.length]}
              activeDot={{ r: 8 }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CsvChart;
