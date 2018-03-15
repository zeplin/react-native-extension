#!/bin/bash
set -e

if [[ $NODE_ENV == "prod" ]]
then
    S3_PATH=$S3_PATH_PROD
else
    S3_PATH=$S3_PATH_DEV
fi

EXTENSION_PATHNAME=react-native
TEMP_PATHNAME=${EXTENSION_PATHNAME}-$(git rev-parse HEAD)

aws s3 sync ./dist ${S3_PATH}/${TEMP_PATHNAME} --delete
aws s3 cp ./dist/manifest.json ${S3_PATH}/${TEMP_PATHNAME}/manifest.json --cache-control 'max-age=0, no-cache, no-store'
aws s3 cp ./dist/README.md ${S3_PATH}/${TEMP_PATHNAME}/README.md --cache-control 'max-age=0, no-cache, no-store'
aws s3 sync ${S3_PATH}/${TEMP_PATHNAME} ${S3_PATH}/${EXTENSION_PATHNAME}
aws s3 rm --recursive ${S3_PATH}/${TEMP_PATHNAME}