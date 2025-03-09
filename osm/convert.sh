#!/bin/bash

set -e  # Exit on any error
set -u  # Treat unset variables as errors
set -o pipefail  # Catch errors in pipelines

# Define file paths
PBF_FILE="../data/czech-republic-latest.osm.pbf"
OSM_FILE="../data/temp.osm"
FILTERED_OSM_FILE="../data/addresses.osm"
GEOJSON_FILE="../data/addresses.geojson"

echo "Converting PBF to OSM..."
./osmconvert "$PBF_FILE" -o="$OSM_FILE"

echo "Filtering addresses..."
./osmfilter "$OSM_FILE" --keep="addr:housenumber=*" -o="$FILTERED_OSM_FILE"

echo "Converting OSM to GeoJSON..."
node --max_old_space_size=16384 `which osmtogeojson` "$FILTERED_OSM_FILE" > "$GEOJSON_FILE"

echo "Cleaning up temporary files..."
# rm -f "$OSM_FILE" "$FILTERED_OSM_FILE"

echo "Process completed successfully."
