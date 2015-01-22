#!/bin/bash

docker run -d -p 5000:5000 --name registry registry
docker run -d -p 9527:9527 --link registry:registry tobegit3hub/pirate
