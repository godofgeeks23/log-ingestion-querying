const { Client } = require('@elastic/elasticsearch');

const client = new Client({ node: 'http://localhost:9200' }); // Update with your Elasticsearch server details

async function searchLogs(query) {
    try {
        const response = await client.search({
            index: 'logs',
            body: {
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

try {
    const query = parseCommandLineArgs(args);

    // Perform search
    searchLogs(query);
} catch (error) {
    console.error('Error:', error.message);
    displayHelp();
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
    console.log('  node cli.js --level <level> --message <message> --resourceId <resourceId> --startDate <startDate> --endDate <endDate>');
    console.log('\nExample:');
    console.log('  node cli.js --level error --message "Failed to connect" --resourceId server-1234');
}
