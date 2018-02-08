#!/bin/bash
aws s3 sync ./dist ${S3_PATH} --delete
find ./dist -name manifest.json | cut -d'/' -f 3- | xargs -I {} aws s3 cp ./dist/{} ${S3_PATH}/{} --cache-control 'max-age=0, no-cache, no-store'