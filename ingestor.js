const { Client } = require('@elastic/elasticsearch');
const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

// Elasticsearch client
const esClient = new Client({ node: 'http://localhost:9200' }); // Update with your Elasticsearch server URL

// Middleware for parsing JSON in the request body
app.use(bodyParser.json());

// Log ingestion endpoint
app.post('/ingest', async (req, res) => {
  try {
    const logData = req.body;

    // Index the log data into Elasticsearch
    const indexResponse = await esClient.index({
      index: 'logs', // Update with your desired Elasticsearch index name
      body: logData,
    });

    console.log('Log ingested:', indexResponse.body);

    res.status(201).json({ status: 'success' });
  } catch (error) {
    console.error('Error ingesting log:', error.message);
    res.status(500).json({ status: 'error', message: 'Error ingesting log' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Log Ingester is listening on http://localhost:${port}`);
});
