
<a name="readme-top"></a>

[![LinkedIn][linkedin-shield]][LinkedIn-url]
[![Twitter][twitter-shield]][twitter-url]
[![GitHub][github-shield]][github-url]

<!-- PROJECT LOGO -->
<br />
<div align="center">

<a href="https://github.com/dyte-submissions/november-2023-hiring-godofgeeks23">
    <img src="images/logo.png" alt="Logo" width="80" height="80">
  </a>

<h3 align="center">Logs Ingestor and Query system</h3>

  <p align="center">
    A system aimed at ingesting large amount of logs and querying them efficiently. Built using Node and Elasticsearch. 
    <br />
    <a href="https://github.com/dyte-submissions/november-2023-hiring-godofgeeks23"><strong>Explore the docs »</strong></a>
    <br />
    <br />
  </p>
</div>

<!-- ABOUT THE PROJECT -->

## About The Project

[![Product Name Screen Shot][product-screenshot]](https://github.com/dyte-submissions/november-2023-hiring-godofgeeks23)



### Built With

- Node
- Elasticsearch
- Docker



<!-- GETTING STARTED -->

## Getting Started

To get a local copy up and running follow these simple steps.

### Prerequisites

This project requires the following software to be installed on your system:

* NodeJS (version used - v20.2.0)

* Docker (version used 24.0.7)

### Installation

1. Starting Elasticsearch

   We can setup either a single node cluster or multinode cluster. Both of these methods are described below:

   1.1 Starting a single node cluster

   ```
   docker pull docker.elastic.co/elasticsearch/elasticsearch:7.5.2
   ```

   ```
   docker run -p 9200:9200 -p 9300:9300 -e "discovery.type=single-node" docker.elastic.co/elasticsearch/elasticsearch:7.5.2
   ```

   OR

   1.2 Start the elasticsearch cluster using docker-compose

   ```sh
   docker compose up
   ```

   NOTE - The docker compose may exit after a few seconds. Due to a error as -

   ```
   elasticsearch_1  | max virtual memory areas vm.max_map_count [65530] is too low, increase to at least [262144]
   ```

   This issue is known and can be fixed by running the following command on the host machine:

   ```
   sudo sysctl -w vm.max_map_count=262144
   ```

2. Install node packages

   ```sh
   npm i
   ```

3. Start the ingestor (single instance mode)

   ```sh
   node ingestor.js
   ```

   NOTE: For better performance, use the following command to start the ingestor:

   ```
   npm i -g pm2
   ```

   ```
   pm2 start ingestor.js -i max
   ```

   This will start the ingestor in cluster mode, utilizing all the cores of the system.



<!-- USAGE EXAMPLES -->

## Usage

### Using the ingestor

After the ingestor server is up and running, we can start sending logs to it over HTTP at port 3000.

Mainly 2 routes are exposed by the ingestor:

1. `/ingest_single` - To send a single log to the ingestor

2. `/ingest_bulk` - To send multiple logs to the ingestor at once

A sample `cURL` request to `/ingest_single` is as follows:

```
curl --location 'http://localhost:3000/ingest_single' \
--header 'Content-Type: application/json' \
--data '{
    "level": "info",
    "message": "Timeout error",
    "resourceId": "server-1093",
    "timestamp": "2023-10-26T17:15:07.408828Z",
    "traceId": "c3-z1-123",
    "spanId": "span-847",
    "commit": "8e768407",
    "metadata": { "parentResourceId": "server-9991" }
}'
```

A sample `cURL` request to `/ingest_bulk` is as follows:

```
curl --location 'http://localhost:3000/ingest_bulk' \
--header 'Content-Type: application/json' \
--data '[
  {
    "level": "info",
    "message": "Timeout error",
    "resourceId": "server-1093",
    "timestamp": "2023-10-26T17:15:07.408828Z",
    "traceId": "c3-z1-123",
    "spanId": "span-847",
    "commit": "8e768407",
    "metadata": { "parentResourceId": "server-9991" }
  },
  {
    "level": "warning",
    "message": "Timeout error",
    "resourceId": "server-8919",
    "timestamp": "2023-11-01T17:15:07.408868Z",
    "traceId": "a3-x2-789",
    "spanId": "span-320",
    "commit": "7e236379",
    "metadata": { "parentResourceId": "server-6718" }
  }
]'
```

### Using the querying CLI

The querying CLI can be used to query the logs stored in the elasticsearch cluster.

The CLI can be started using the following command:

```
node searcher.js
```

The CLI displays the help information about its commands and usage. These are also given as follows -

```
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
```



<!-- Design -->

## Design

![System Design][system-design]

### Why Elasticsearch?

For efficient full-text search, Elasticsearch is a powerful choice. It provides scalability and speed for searching through large volumes of logs.

Full-Text Search and Querying:

  Elasticsearch is designed for full-text search, making it well-suited for log data that often needs to be queried based on various fields.

Indexing:

  Elasticsearch uses inverted indices for fast text-based search. This enables it to perform searches across large volumes of data efficiently.

Scalability:

  Elasticsearch is horizontally scalable, allowing you to add more nodes to your cluster as your data volume grows. It automatically distributes data across nodes, providing high scalability.

Sharding:

  Elasticsearch implements sharding, where it divides an index into multiple shards, each of which can be hosted on a separate node. This improves parallelism and helps distribute the data load.

Real-Time Data:

  Elasticsearch provides real-time search capabilities, making it suitable for scenarios where near real-time analysis of logs is crucial.

Flexibility:

  It supports dynamic mapping, allowing you to index documents without predefining their structure. This flexibility is beneficial when dealing with diverse log formats. 
  So we can process logs of other format as well.

RESTful API:

  Elasticsearch provides a RESTful API, making it easy to integrate with other tools - apart from the CLI tool that we have built, for querying the logs.

We have options for single node cluster and multi node cluster. Though multinode clusters are resource expensive but they have some pros over the other as follows:

* Scalability: Distributed architecture allows for horizontal scaling. You can add more nodes to handle increased data volumes and query loads.

* High Availability: Improved fault tolerance with data replication across nodes. Even if one node fails, the cluster can continue to operate.

* Performance: Enhanced performance for large-scale deployments. Distributing data and queries across multiple nodes can improve response times.


### Why NodeJS?

Node.js is well-suited for building scalable and asynchronous applications. It is efficient for handling a large number of concurrent connections due to its asynchronous, event-driven nature. 

### Why Docker?

Containerized applications using Docker for easy deployment and scalability.




<!-- Features -->

## Features

### Ingestor

- [x] Can ingest large amount of logs
- [x] Scalability - as elasticsearch cluster is horizontally scalable, and also the ingestor can be run in cluster mode for multi core systems
- [x] Elasticsearch used - which supports other search interfaces like DSL querying and also support for Native SQL RESTP API for intuitive querying

### Querying CLI

- [x] Filter based search support
- [x] Date range based search support
- [x] Multiple filters can be combined to form complex queries

## Further Improvements

- [ ] Make CLI more robust using Node CLI libraries like Commannder
- [ ] Regex based search support
- [ ] More configurable options for elastic db and ingestor
- [ ] Monitoring - adding monitoring and error-handling mechanisms to track the health of the log ingester and detect issues promptly.
- [ ] Testing using JMeter

<!-- CONTACT -->

## Contact

Aviral Srivastava - [@godofgeeks\_](https://twitter.com/godofgeeks_) - aviralji4@gmail.com

LinkedIn: [https://www.linkedin.com/in/aviralsrivastav23/](https://www.linkedin.com/in/aviralsrivastav23/)



<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->

[linkedin-shield]: https://img.shields.io/badge/-LinkedIn-black.svg?style=for-the-badge&logo=linkedin&colorB=555
[linkedin-url]: https://www.linkedin.com/in/aviralsrivastav23/
[twitter-shield]: https://img.shields.io/badge/-Twitter-black.svg?style=for-the-badge&logo=twitter&colorB=555
[twitter-url]: https://twitter.com/godofgeeks_
[github-shield]: https://img.shields.io/badge/-Github-black.svg?style=for-the-badge&logo=github&colorB=555
[github-url]: https://github.com/godofgeeks23
[product-screenshot]: images/productname.png
[system-design]: images/systemdesign.png
[logo]: images/logo.png