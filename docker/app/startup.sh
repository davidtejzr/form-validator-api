#!/bin/bash

graceful_shutdown() {
  echo "Shutting down the container..."
  exit 0
}

trap 'graceful_shutdown' SIGINT SIGTERM

while true; do
  sleep 1
done
