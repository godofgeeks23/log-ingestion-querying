#!/usr/bin/env node

const { Command } = require('commander');
const { Client } = require('@elastic/elasticsearch');

const program = new Command();

program
  .version('1.0.0')
  .description('Elasticsearch Log Search CLI');

program
  .option('-l, --level <level>', 'Filter logs by level')
  .option('-m, --message <message>', 'Filter logs by message')
  .option('-r, --resourceId <resourceId>', 'Filter logs by resourceId')
  .option('-t, --timestamp <timestamp>', 'Filter logs by timestamp')
  .option('-tr, --traceId <traceId>', 'Filter logs by traceId')
  .option('-s, --spanId <spanId>', 'Filter logs by spanId')
  .option('-c, --commit <commit>', 'Filter logs by commit')
  .option('-p, --parentResourceId <parentResourceId>', 'Filter logs by parentResourceId')
  .option('--limit <limit>', 'Limit the number of results')
  .option('--start <start>', 'Start timestamp for date range')
  .option('--end <end>', 'End timestamp for date range')
  .parse(process.argv);

const {
  level,
  message,
  resourceId,
  timestamp,
  traceId,
  spanId,
  commit,
  parentResourceId,
  limit,
  start,
  end,
} = program;

// Create Elasticsearch client
const client = new Client({ node: 'http://localhost:9200' }); // Update with your Elasticsearch server URL

// Build Elasticsearch query based on provided options
const buildQuery = () => {
  const must = [];
  if (level) must.push({ term: { level } });
  if (message) must.push({ match: { message } });
  if (resourceId) must.push({ term: { resourceId } });
  if (timestamp) must.push({ term: { timestamp } });
  if (traceId) must.push({ term: { traceId } });
  if (spanId) must.push({ term: { spanId } });
  if (commit) must.push({ term: { commit } });
  if (parentResourceId) must.push({ term: { 'metadata.parentResourceId': parentResourceId } });

  // Date range filter
  if (start || end) {
    must.push({
      range: {
        timestamp: {
          gte: start || 'now-1d/d',
          lte: end || 'now/d',
        },
      },
    });
  }

  return {
    size: limit || 10,
    query: {
      bool: {
        must,
      },
    },
  };
};

// Perform the Elasticsearch search
const searchLogs = async () => {
  const query = buildQuery();

  try {
    const { body } = await client.search({
      index: 'logs',
      body: query,
    });

    console.log('Search Results:', JSON.stringify(body.hits.hits, null, 2));
  } catch (error) {
    console.error('Error:', error.meta.body.error);
  }
};

// Execute the search
searchLogs();
