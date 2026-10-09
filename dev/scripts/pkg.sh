#!/usr/bin/env bash

mkdir -p pkg
cd dist
zip -r -FS '../pkg/userChromeCompanion@soulhotel.net.xpi' . -x ".*" && cd ..