<!-- Improved compatibility of back to top link: See: https://github.com/othneildrew/Best-README-Template/pull/73 -->
<a name="readme-top"></a>
<!--
*** Thanks for checking out the Best-README-Template. If you have a suggestion
*** that would make this better, please fork the repo and create a pull request
*** or simply open an issue with the tag "enhancement".
*** Don't forget to give the project a star!
*** Thanks again! Now go create something AMAZING! :D
-->



<!-- PROJECT SHIELDS -->
<!--
*** I'm using markdown "reference style" links for readability.
*** Reference links are enclosed in brackets [ ] instead of parentheses ( ).
*** See the bottom of this document for the declaration of the reference variables
*** for contributors-url, forks-url, etc. This is an optional, concise syntax you may use.
*** https://www.markdownguide.org/basic-syntax/#reference-style-links
-->

[![LinkedIn][linkedin-shield]][https://www.linkedin.com/in/aviralsrivastav23/]

[![Twitter][twitter-shield]][https://twitter.com/godofgeeks_]

[![GitHub][github-shield]][https://github.com/godofgeeks23]



<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="https://github.com/github_username/repo_name">
    <img src="images/logo.png" alt="Logo" width="80" height="80">
  </a>

<h3 align="center">Logs Ingestor and Query system</h3>

  <p align="center">
    project_description
    <br />
    <a href="https://github.com/github_username/repo_name"><strong>Explore the docs »</strong></a>
    <br />
    <br />
    <a href="https://github.com/github_username/repo_name">View Demo</a>
    ·
    <a href="https://github.com/github_username/repo_name/issues">Report Bug</a>
    ·
    <a href="https://github.com/github_username/repo_name/issues">Request Feature</a>
  </p>
</div>



<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#usage">Usage</a></li>
    <li><a href="#roadmap">Roadmap</a></li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
    <li><a href="#acknowledgments">Acknowledgments</a></li>
  </ol>
</details>



<!-- ABOUT THE PROJECT -->
## About The Project

[![Product Name Screen Shot][product-screenshot]](https://example.com)


<p align="right">(<a href="#readme-top">back to top</a>)</p>



### Built With

* [![Node][Node.js]][Node.js-url]
* [![Elasticsearch][Elasticsearch.com]][Elasticsearch-url]

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- GETTING STARTED -->
## Getting Started

This is an example of how you may give instructions on setting up your project locally.
To get a local copy up and running follow these simple example steps.

### Prerequisites

This project requires the following software to be installed on your system:

NodeJS (version used - v20.2.0)

Docker (version used 24.0.7)

### Installation

1. Start the elasticsearch cluster using docker-compose
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
   pm2 start ingestor.js -i max
    ```

    This will start the ingestor in cluster mode, utilizing all the cores of the system.


<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- USAGE EXAMPLES -->
## Usage

### Using the ingestor

After the ingestor server is up and running, we can start sending logs to it over HTTP at port 3000.

Mainly 2 routes are exposed by the ingestor:

1. /ingest_single - To send a single log to the ingestor

2. /ingest_bulk - To send multiple logs to the ingestor at once

A sample cURL request to /ingest_bulk is as follows:
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

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- ROADMAP -->
## Roadmap

- [ ] Feature 1
- [ ] Feature 2
- [ ] Feature 3
    - [ ] Nested Feature

See the [open issues](https://github.com/github_username/repo_name/issues) for a full list of proposed features (and known issues).

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- CONTACT -->
## Contact

Aviral Srivastava - [@godofgeeks_](https://twitter.com/godofgeeks_) - aviralji4@gmail.com

LinkedIn: [https://www.linkedin.com/in/aviralsrivastav23/](https://www.linkedin.com/in/aviralsrivastav23/)

<p align="right">(<a href="#readme-top">back to top</a>)</p>




<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->
[contributors-shield]: https://img.shields.io/github/contributors/github_username/repo_name.svg?style=for-the-badge
[contributors-url]: https://github.com/github_username/repo_name/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/github_username/repo_name.svg?style=for-the-badge
[forks-url]: https://github.com/github_username/repo_name/network/members
[stars-shield]: https://img.shields.io/github/stars/github_username/repo_name.svg?style=for-the-badge
[stars-url]: https://github.com/github_username/repo_name/stargazers
[issues-shield]: https://img.shields.io/github/issues/github_username/repo_name.svg?style=for-the-badge
[issues-url]: https://github.com/github_username/repo_name/issues
[license-shield]: https://img.shields.io/github/license/github_username/repo_name.svg?style=for-the-badge
[license-url]: https://github.com/github_username/repo_name/blob/master/LICENSE.txt
[linkedin-shield]: https://img.shields.io/badge/-LinkedIn-black.svg?style=for-the-badge&logo=linkedin&colorB=555
[linkedin-url]: https://linkedin.com/in/linkedin_username
[twitter-shield]: https://img.shields.io/badge/-Twitter-black.svg?style=for-the-badge&logo=twitter&colorB=555
[twitter-url]: https://twitter.com/twitter_username
[github-shield]: https://img.shields.io/badge/-Github-black.svg?style=for-the-badge&logo=github&colorB=555
[github-url]: https://github.com/godofgeeks23
[product-screenshot]: images/screenshot.png
[JQuery.com]: https://img.shields.io/badge/jQuery-0769AD?style=for-the-badge&logo=jquery&logoColor=white
[JQuery-url]: https://jquery.com 
