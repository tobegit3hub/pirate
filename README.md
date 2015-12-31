# Pirate

[![Build Status](https://drone.io/github.com/tobegit3hub/pirate/status.png)](https://drone.io/github.com/tobegit3hub/pirate/latest) [![GoDoc](https://godoc.org/github.com/tobegit3hub/pirate?status.svg)](https://godoc.org/github.com/tobegit3hub/pirate) [![Gitter](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/tobegit3hub/pirate?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

## Introduction

Private is the admin dashboard for [docker distribution](https://github.com/docker/distribution).

![](screenshot.png)

## Usage

Please run like below 

```
docker run -d -p 5000:5000 --name registry registry
docker run -d -p 9527:9527 --link registry:registry tobegit3hub/pirate
```

* Then monitor your docker daemon in <http://127.0.0.1:9527>.
* For boot2docker users, please run `boot2docker ip` to find out the real IP.

## Testing 

Tag local testing images

```
docker tag hello-world localhost:5000/hello-world
docker tag hello-world localhost:5000/hello-world:1.0
docker tag hello-world localhost:5000/larrycai/hello-world
```
	
Push images into registry

```
docker push localhost:5000/hello-world
docker push localhost:5000/hello-world:1.0
docker push localhost:5000/larrycai/hello-world
```

## Get Involved

Pirate is implemented in Go and JavaScript with tools like Beego, AngularJS, Bootstrap, Bower, JQuery and Docker. You can fork the repository and send pull-request as you want.

* Setup go path and try `echo $GOPATH`
* `go get github.com/tobegit3hub/pirate`
* `go build`
* `./pirate`


