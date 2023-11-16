const { Client } = require('@elastic/elasticsearch');
const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

// Elasticsearch client
const esClient = new Client({ node: 'http://localhost:9200' }); // Update with your Elasticsearch server URL

// Middleware for parsing JSON in the request body
// app.use(bodyParser.json());
// set limit of request body size
app.use(express.json({ limit: '50mb' }));


// Log ingestion endpoint
app.post('/ingest_single', async (req, res) => {
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

app.post('/ingest_bulk', async (req, res) => {
    try {
        const logsData = req.body;

        // Ensure logsData is an array
        if (!Array.isArray(logsData)) {
            return res.status(400).json({ status: 'error', message: 'Invalid request format. Expecting an array of logs.' });
        }

        // Index the logs data into Elasticsearch in bulk
        const body = logsData.flatMap(log => [{ index: { _index: 'logs' } }, log]);

        const bulkResponse = await esClient.bulk({ body });

        if (bulkResponse.errors) {
            console.error('Error ingesting logs in bulk:', bulkResponse.errors);
            return res.status(500).json({ status: 'error', message: 'Error ingesting logs in bulk' });
        }

        console.log('Logs ingested in bulk:', bulkResponse.body);

        res.status(201).json({ status: 'success' });
    } catch (error) {
        console.error('Error ingesting logs:', error.message);
        res.status(500).json({ status: 'error', message: 'Error ingesting logs' });
    }
});

app.post('/search', async (req, res) => {
    try {
        const { index, query, size } = req.body;
        const response = await esClient.search({ index, body: { query }, size: size });
        res.json(response.body.hits.hits);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// function to translate sql query to elasticsearch query
function translateSqlToEsQuery(sqlQuery) {
    const esquery = esClient.sql.translate({ body: { query: sqlQuery } });
    return esquery.body.query;
}

// api to get results of sql query
app.post('/search_sql', async (req, res) => {
    try {
        const { query, size } = req.body;
        const response = await esClient.sql.query({ body: { query } });
        res.json(response.body.rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// api to get results of sql query
app.post('/search_sql_translate', async (req, res) => {
    try {
        const { index, query, size } = req.body;
        const response = await esClient.search({ index, body: esClient.sql.translate({ body: { query: query } }) , size: size });
        res.json(response.body.hits.hits);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Log Ingester is listening on http://localhost:${port}`);
});
