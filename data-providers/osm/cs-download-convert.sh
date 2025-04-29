#!/bin/bash

set -e  # Exit on any error
set -u  # Treat unset variables as errors
set -o pipefail  # Catch errors in pipelines

# URL souboru OSM PBF
PBF_URL="https://download.geofabrik.de/europe/czech-republic-latest.osm.pbf"

# Definice souborových cest
DATA_DIR="data"
PBF_FILE="$DATA_DIR/czech-republic-latest.osm.pbf"
OSM_FILE="$DATA_DIR/temp.osm"
FILTERED_OSM_FILE="$DATA_DIR/addresses.osm"
GEOJSON_FILE="$DATA_DIR/addresses.geojson"

# Vytvoření adresáře, pokud neexistuje
mkdir -p "$DATA_DIR"

# Stažení souboru PBF, pokud neexistuje
if [ ! -f "$PBF_FILE" ]; then
    echo "Downloading OSM PBF file..."
    curl -o "$PBF_FILE" "$PBF_URL"
else
    echo "PBF file already exists, skipping download."
fi

# Konverze PBF na OSM
echo "Converting PBF to OSM..."
./osmconvert "$PBF_FILE" -o="$OSM_FILE"

# Filtrace adres (pouze koncové adresní body)
echo "Filtering addresses..."
./osmfilter "$OSM_FILE" --keep="addr:housenumber=*" -o="$FILTERED_OSM_FILE"

# Konverze OSM na GeoJSON
echo "Converting OSM to GeoJSON..."
osmium export "$FILTERED_OSM_FILE" -o "$GEOJSON_FILE" --overwrite

echo "Cleaning up temporary files..."
rm -f "$OSM_FILE" "$FILTERED_OSM_FILE"
rm -f  "$PBF_FILE"

echo "Process completed successfully."
