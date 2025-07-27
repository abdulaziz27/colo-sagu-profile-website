#!/bin/bash
echo "Starting Colo Sagu API..."
npm install
pm2 start ecosystem.config.js --env production
pm2 save
pm2 startup
echo "API started successfully!"
echo "Check status with: pm2 status"
echo "View logs with: pm2 logs colo-sagu-api"
