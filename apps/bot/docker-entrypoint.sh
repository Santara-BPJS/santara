#!/bin/bash
set -e

# Verify Chromium is installed
if [ ! -f "/usr/bin/chromium" ]; then
    echo "ERROR: Chromium not found at /usr/bin/chromium"
    exit 1
fi

echo "Chromium version: $(chromium --version 2>&1 || echo 'Unable to get version')"

# Fix permissions on data directories at runtime
# This is necessary because Docker volumes are created as root
if [ "$(id -u)" = "0" ]; then
    # Running as root - fix permissions and switch to botuser
    echo "Fixing permissions on /app/data..."
    chown -R botuser:botuser /app/data

    # Switch to botuser and execute the command
    exec gosu botuser "$@"
else
    # Already running as botuser
    exec "$@"
fi
