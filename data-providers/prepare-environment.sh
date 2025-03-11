#!/bin/bash

# 1. Install Osmium Tool
# Update package lists
echo "Updating package lists..."
apt-get update

# Install required dependencies
echo "Installing dependencies..."
apt-get install -y \
  build-essential \
  cmake \
  libboost-all-dev \
  libbz2-dev \
  libprotobuf-dev \
  protobuf-compiler \
  libosmium2-dev \
  liblua5.1-dev \
  libexpat1-dev \
  zlib1g-dev \
  git

# Install Osmium Tool
echo "Installing Osmium Tool..."
apt-get install -y osmium-tool

# Verify the installation
echo "Verifying Osmium Tool installation..."
osmium --version

echo "Osmium Tool installation completed successfully."