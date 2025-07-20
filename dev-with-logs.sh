#!/bin/bash

# Script to run yarn dev with automatic log capture
# Usage: ./dev-with-logs.sh

LOG_DIR="./logs"
LOG_FILE="$LOG_DIR/yarn-dev.log"
TIMESTAMP=$(date '+%Y-%m-%d %H:%M:%S')

# Add session separator to log
echo "" >> "$LOG_FILE"
echo "=== DEV SESSION STARTED: $TIMESTAMP ===" >> "$LOG_FILE"
echo "" >> "$LOG_FILE"

echo "Starting yarn dev with logging to: $LOG_FILE"
echo "Press Ctrl+C to stop the dev server and logging"

# Run vite dev directly and capture both stdout and stderr to the log file
# while also displaying output in terminal
npx vite dev 2>&1 | tee -a "$LOG_FILE"

# Add session end marker
TIMESTAMP_END=$(date '+%Y-%m-%d %H:%M:%S')
echo "" >> "$LOG_FILE"
echo "=== DEV SESSION ENDED: $TIMESTAMP_END ===" >> "$LOG_FILE"
echo "" >> "$LOG_FILE"

echo "Development server stopped. Logs appended to: $LOG_FILE"