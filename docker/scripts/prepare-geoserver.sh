#!/bin/sh

set -x
set +e

cd /opt/app/data_directory/s3

mkdir ../workspaces

cp -r s3_tmp/workspaces/pub ../workspaces/.

mv s3_tmp/styles ../.
mv s3_tmp/legendsamples ../.
mv s3_tmp/wfs ../.

cp ../s3-runtime/*.xml ../.
cp ../s3-runtime/*.properties ../.

cp ../s3-runtime-pub/*.xml ../workspaces/pub/.

mkdir ../user_projections
cp ../s3-runtime-userprojections/* ../user_projections/.

mkdir ../gwc
cp ../s3-runtime/geowebcache.xml ../gwc/.

mkdir ../www
echo '{"info": ""}' > ../www/info.json
