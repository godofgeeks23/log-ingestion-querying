const { Client } = require('@elastic/elasticsearch');

const client = new Client({ node: 'http://localhost:9200' }); // Update with your Elasticsearch server details

async function searchLogs(query, limit) {
    try {
        const response = await client.search({
            index: 'logs',
            body: {
                size: limit || 10,
                query: {
                    bool: {
                        must: buildFilters(query),
                    },
                },
            },
        });

        const hits = response.body.hits.hits;

        console.log(`Found ${hits.length} results:`);
        hits.forEach((hit) => {
            console.log(hit._source);
        });
    } catch (error) {
        console.error('Error during search:', error);
    }
}

function buildFilters(query) {
    const filters = [];

    // Add filters based on command-line parameters
    if (query.level) filters.push({ term: { level: query.level } });
    if (query.message) filters.push({ match: { message: query.message } });
    if (query.resourceId) filters.push({ term: { resourceId: query.resourceId } });
    if (query.traceId) filters.push({ term: { traceId: query.traceId } });
    if (query.spanId) filters.push({ term: { spanId: query.spanId } });
    if (query.commit) filters.push({ term: { commit: query.commit } });
    if (query['metadata.parentResourceId']) {
        filters.push({ term: { 'metadata.parentResourceId': query['metadata.parentResourceId'] } });
    }
    // Add filters for other fields

    // Date range filter
    if (query.startDate || query.endDate) {
        const rangeFilter = {
            range: {
                timestamp: {},
            },
        };

        if (query.startDate) rangeFilter.range.timestamp.gte = query.startDate;
        if (query.endDate) rangeFilter.range.timestamp.lte = query.endDate;

        filters.push(rangeFilter);
    }

    return filters;
}

// Parse command-line arguments
const args = process.argv.slice(2);

if (args.length === 0 || (args.length === 1 && args[0] === 'help')) {
    displayHelp();
} else {
    try {
        const query = parseCommandLineArgs(args);

        // check if limit is specified
        if (query.limit) {
            query.limit = parseInt(query.limit);
        }

        const limit = query.limit || 10;
        // remove limit from query object and pass it to searchLogs
        delete query.limit;

        // Perform search
        searchLogs(query, limit);
    } catch (error) {
        console.error('Error:', error.message);
        displayHelp();
    }
}

function parseCommandLineArgs(args) {
    const query = {};

    if (args.length % 2 !== 0) {
        throw new Error('Invalid number of arguments');
    }

    for (let i = 0; i < args.length; i += 2) {
        const key = args[i].replace('--', '');
        const value = args[i + 1];

        query[key] = value;
    }

    return query;
}

function displayHelp() {
    console.log('Usage:');
    console.log('  node cli.js --level <level> --message <message> --resourceId <resourceId> --traceId <traceId> --spanId <spanId> --commit <commit> --metadata.parentResourceId <parentResourceId> --startDate <startDate> --endDate <endDate>');
    console.log('\nAvailable Filters and Options:');
    console.log('  --help                    Display this help message');
    console.log('  --limit                    Number of results to return (default: 10)')
    console.log('  --level                   Log level (e.g., error, warning, info)');
    console.log('  --message                 Log message');
    console.log('  --resourceId              Resource ID');
    console.log('  --traceId                 Trace ID');
    console.log('  --spanId                  Span ID');
    console.log('  --commit                  Commit ID');
    console.log('  --metadata.parentResourceId  Parent Resource ID');
    console.log('  --startDate               Start date for log search (format: YYYY-MM-DDTHH:mm:ssZ)');
    console.log('  --endDate                 End date for log search (format: YYYY-MM-DDTHH:mm:ssZ)');
    console.log('\nExample:');
    console.log('  node cli.js --level error --message "Failed to connect" --resourceId server-1234');
}
