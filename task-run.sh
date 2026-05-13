#!/bin/bash

# Wrapper script to run the task-bridge.js Node.js script

NODE_SCRIPT="Code/chad-cms/task-bridge.js"
SUPABASE_ENV_FILE="Code/chad-cms/.env"

# Load environment variables from .env file
if [ -f "$SUPABASE_ENV_FILE" ]; then
  export $(grep -v '^#' "$SUPABASE_ENV_FILE" | xargs)
fi

if [ "$#" -lt 1 ]; then
  echo "Usage: $0 <action> [args...]"
  echo "Actions: create <title> [description] [priority] [status] [tags] [owner] [due_date]"
  echo "         list"
  exit 1
fi

ACTION=$1
shift

# Execute the Node.js script with the provided action and arguments
node "$NODE_SCRIPT" "$ACTION" "$@"
