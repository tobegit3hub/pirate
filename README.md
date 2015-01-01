# Pirate

[![Build Status](https://drone.io/github.com/tobegit3hub/pirate/status.png)](https://drone.io/github.com/tobegit3hub/pirate/latest) [![GoDoc](https://godoc.org/github.com/tobegit3hub/pirate?status.svg)](https://godoc.org/github.com/tobegit3hub/pirate) [![Gitter](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/tobegit3hub/pirate?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

## Introduction

Pirate which sounds like "private" is the website of private docker-registry.

For quick start, checkout the [demo website](http://96.126.127.93:9527/).

![](screenshot.png)

## Usage

Please run like below 

	docker run -d -p 5000:5000 --name registry registry
	docker run -d -p 9527:9527 -v /var/run/docker.sock:/var/run/docker.sock --link registry:registry tobegit3hub/pirate

* Then monitor your docker daemon in <http://127.0.0.1:9527>.
* For boot2docker users, please run `boot2docker ip` to find out the real IP.

## Testing 

Fill images into registry to show how it works

	docker tag hello-world localhost:5000/hello-world
	docker tag hello-world localhost:5000/hello-world:1.0
	docker tag hello-world localhost:5000/larrycai/hello-world
	docker push localhost:5000/hello-world
	docker push localhost:5000/hello-world:1.0
	docker push localhost:5000/larrycai/hello-world

## Screenshot

![](https://raw.github.com/tobegit3hub/pirate/master/screenshot.png)
![](https://raw.github.com/tobegit3hub/pirate/master/static/img/images-page.png)
![](https://raw.github.com/tobegit3hub/pirate/master/static/img/image-page.png)


## Get Involved

Pirate is implemented in Go and JavaScript with tools like Beego, AngularJS, Bootstrap, Bower, JQuery and Docker. You can fork the repository and send pull-request as you want.

* Setup go path and try `echo $GOPATH`
* `go get github.com/astaxie/beego`
* `go get github.com/beego/bee`
* `go get github.com/tobegit3hub/pirate`
* `bee run seagull` for dubuging 
* or `./pirate` or `sudo ./pirate` to access /var/run/docker.sock

More detail in [seagull-design-and-implement](docs/2014-10-14-seagull-design-and-implement.md) and we have excellent documents in [docs](https://github.com/tobegit3hub/seagull/tree/master/docs).

