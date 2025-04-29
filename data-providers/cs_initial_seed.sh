#!/bin/bash

# Start Docker containers
docker-compose up -d

# 1. Initial seed of Czech Republic companies data
echo "Downloading data from RES..."
cd res && bash cs-download-latest.sh
echo "Downloading data from RES completed successfully."
echo "Importing companies data into database..."
docker-compose exec app bash -c "npm run import-cs-res-csv"
echo "Importing companies data into database completed successfully."
echo "Downloading VAT numbers from ARES..."
docker-compose exec app bash -c "npm run import-cs-ares-vat"
echo "Downloading VAT numbers from ARES completed successfully."

# 2. Initial seed of Czech Republic addresses data
docker-compose exec app bash -c 'echo "Downloading and converting data from OSM..."'
docker-compose exec app bash -c 'cd data-providers/osm && bash cs-download-convert.sh'
docker-compose exec app bash -c 'echo "Downloading and converting data from OSM completed successfully."'
docker-compose exec app bash -c 'echo "Importing addresses data into database..."'
docker-compose exec app bash -c 'npm run import-cs-osm'
docker-compose exec app bash -c 'echo "Importing addresses data into database completed successfully."ś
