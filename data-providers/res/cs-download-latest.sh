#!/bin/bash

URL="https://opendata.csu.gov.cz/soubory/od/od_org03/res_data.csv"
TARGET_DIR="data"

# Vytvoření adresáře, pokud neexistuje
mkdir -p "$TARGET_DIR"

# Download the file and save it to the target directory
echo "Downloading data from $URL..."
curl -L "$URL" -o "$TARGET_DIR/res_data.csv"

# Verify download
if [ -f "$TARGET_DIR/res_data.csv" ]; then
  echo "Download completed successfully. File saved to $TARGET_DIR/res_data.csv"
else
  echo "Download failed."
fi
