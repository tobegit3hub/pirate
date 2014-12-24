# Pirate

[![Build Status](https://drone.io/github.com/tobegit3hub/pirate/status.png)](https://drone.io/github.com/tobegit3hub/pirate/latest) [![GoDoc](https://godoc.org/github.com/tobegit3hub/pirate?status.svg)](https://godoc.org/github.com/tobegit3hub/pirate) [![Gitter](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/tobegit3hub/pirate?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

## Introduction

Pirate which sounds like "private" is the website of private docker-registry.

For quick start, checkout the [demo website](http://96.126.127.93:9527/).

![](screenshot.png)

## Usage

```
docker run -d -p 9527:9527 tobegit3hub/pirate
```

Then go to <http://127.0.0.1:9527> and add your private registry.

## Notice

Pirate need CORS requests for docker-registry so you should start registry like this.

```
docker run -d -p 5000:5000 -e CORS_ORIGINS="'*'" registry
```

