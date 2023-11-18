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
    if (query.resourceId) filters.push({ match: { resourceId: query.resourceId } });
    if (query.traceId) filters.push({ match: { traceId: query.traceId } });
    if (query.spanId) filters.push({ match: { spanId: query.spanId } });
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
    const help_text = `
    Usage:
        node searcher.js --level <level> --message <message> --resourceId <resourceId> --traceId <traceId> --spanId <spanId> --commit <commit> --metadata.parentResourceId <parentResourceId> --startDate <startDate> --endDate <endDate>

    Available Filters and Options:
        --help                    Display this help message
        --limit                   Number of results to return (default: 10)
        --level                   Log level (e.g., error, warning, info)
        --message                 Log message
        --resourceId              Resource ID
        --traceId                 Trace ID
        --spanId                  Span ID
        --commit                  Commit ID
        --metadata.parentResourceId  Parent Resource ID
        --startDate               Start date for log search (format: YYYY-MM-DDTHH:mm:ssZ)
        --endDate                 End date for log search (format: YYYY-MM-DDTHH:mm:ssZ)

    Example:
        node searcher.js --level error
        node searcher.js --level error --message "Failed to connect" --limit 3
        node searcher.js --resourceId "server-8211"
        node searcher.js --startDate 2023-11-01T17:11:55.982264Z --endDate 2023-11-03T17:12:02.364139Z
        node searcher.js --startDate 2023-11-01T17:11:55.982264Z
        
    `;

    console.log(help_text);
}
