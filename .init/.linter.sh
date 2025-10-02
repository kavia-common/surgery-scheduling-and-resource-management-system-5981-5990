#!/bin/bash
cd /home/kavia/workspace/code-generation/surgery-scheduling-and-resource-management-system-5981-5990/schedule_manager_frontend
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

