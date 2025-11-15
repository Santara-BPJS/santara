#!/bin/bash
set -e

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
