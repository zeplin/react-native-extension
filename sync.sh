#!/bin/bash
aws s3 sync ./dist ${S3_PATH}/react-native --delete
aws s3 cp ./dist/manifest.json ${S3_PATH}/react-native/manifest.json --cache-control 'max-age=0, no-cache, no-store'
