#!/bin/bash

# Start Docker containers
docker-compose up -d

# 1. Updating companies data for Czech Republic
echo "Downloading data from RES..."
cd res && bash cs-download-latest.sh
echo "Downloading data from RES completed successfully."
echo "Importing missing companies to the database..."
docker-compose exec app bash -c "npm run import-cs-res-csv"
echo "Importing missing companies to the database completed successfully."
echo "Downloading missing VAT numbers from ARES..."
docker-compose exec app bash -c "npm run import-cs-ares-vat"
echo "Downloading VAT numbers from ARES completed successfully."