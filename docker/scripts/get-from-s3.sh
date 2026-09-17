#!/bin/sh

# set -o allexport
# source /vault/secrets/config
# set +o allexport

# Replace "$S3_<VAR>" variables with values from Vault

curl -fL https://github.com/minio/mc/releases/download/RELEASE.2025-08-13T08-35-41Z/mc.linux-amd64.RELEASE.2025-08-13T08-35-41Z \
    --create-dirs \
    -o /tmp/minio-binaries/mc

chmod +x /tmp/minio-binaries/mc

wget https://github.com/mikefarah/yq/releases/download/v4.53.2/yq_linux_amd64 \
    -O /tmp/minio-binaries/yq

chmod +x /tmp/minio-binaries/yq

export PATH=$PATH:/tmp/minio-binaries/

mc alias set s3 $S3_ENDPOINT_URL $S3_ACCESS_KEY $S3_SECRET_KEY

# possible to not be empty if s3-init fails and automatically reruns
cd /opt/app/data_directory
rm -rf s3 styles workspaces legendsamples *.xml

mc stat s3/$S3_BUCKET/data.zip --json > data_stats.json

yq -oy -p=json \
    data_stats.json | yq -o yaml \
    '. as $item ireduce({"s3-data": {} }; .s3-data = $item )' > data_stats.yaml

mc mirror --preserve --overwrite --no-color --json s3/$S3_BUCKET /opt/app/data_directory/s3

set +e

cd /opt/app/data_directory/s3
unzip data.zip
