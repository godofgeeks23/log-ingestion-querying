If the docker-compose up command fails with the following error:
```
elasticsearch_1  | max virtual memory areas vm.max_map_count [65530] is too low, increase to at least [262144]
```
then, on the host machine, run the following command:
```
sudo sysctl -w vm.max_map_count=262144
```
This command sets the system property vm.max_map_count to 262144. This is the value required to run Elasticsearch on Docker.

## Multicore Setup

To utilize multiple cores of a capable system, run ingestor using the following command:
```
pm2 start ingestor.js -i max
```
