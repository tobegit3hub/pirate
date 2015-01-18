# Pirate

[![Build Status](https://drone.io/github.com/tobegit3hub/pirate/status.png)](https://drone.io/github.com/tobegit3hub/pirate/latest) [![GoDoc](https://godoc.org/github.com/tobegit3hub/pirate?status.svg)](https://godoc.org/github.com/tobegit3hub/pirate) [![Gitter](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/tobegit3hub/pirate?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

## Introduction

Pirate which sounds like "private" is the website of private docker-registry.

Key Features:
  
  * Lightweight UI for private registry's information like images/configuration
  * Readonly mode to be used anonymous
  * (TODO) link to internal/external web sites for more detail information for each image

For quick start, checkout the [demo website](http://96.126.127.93:9527/).

![](screenshot.png)

## Usage

Please run like below 

	docker run -d -p 5000:5000 --name registry registry
	docker run -d -p 9527:9527 --link registry:registry tobegit3hub/pirate

* Then monitor your docker daemon in <http://127.0.0.1:9527>.
* For boot2docker users, please run `boot2docker ip` to find out the real IP.

### Configuration ###

So far follow configurations are supported, you can pass via like `-e PIRATE_MODE=readonly` for `docker run` command.

 * `PIRATE_MODE=readonly|DELETE`   : default is `DELETE`, disable DELETE operation for each image, good for anonymous access
 * `REGISTRY_URL=<registry url>`   : default is `registry:5000`, don't put `http` in front.
 
Planned to have
 
 * `PIRATE_URL_ALIAS`  : add extra url, see #13
 * `PIRATE_DOC_REF`    : give wiki link as reference, see #5

## Testing 

Tag local testing images 

	docker tag hello-world localhost:5000/hello-world
	docker tag hello-world localhost:5000/hello-world:1.0
	docker tag hello-world localhost:5000/larrycai/hello-world
	
Push images into registry
 
	docker push localhost:5000/hello-world
	docker push localhost:5000/hello-world:1.0
	docker push localhost:5000/larrycai/hello-world

## Get Involved

Pirate is implemented in Go and JavaScript with tools like Beego, AngularJS, Bootstrap, Bower, JQuery and Docker. You can fork the repository and send pull-request as you want.

* Setup go path and try `echo $GOPATH`
* `go get github.com/astaxie/beego`
* `go get github.com/beego/bee`
* `go get github.com/tobegit3hub/pirate`
* `bee run seagull` for dubuging 
* or `./pirate` or `sudo ./pirate` to access /var/run/docker.sock

### Debug locally inside docker

git clone the code to the local directly, it is ok for Windows & MacOS as well, for example `~/git/docker/pirate`

Then simple use shared folder to debug it
    
	$ docker run -it -p 9527:9527 --link registry:registry -v $PWD:/go/src/github.com/tobegit3hub/pirate tobegit3hub/pirate bash
	root@55640c0fb4f3:/go/src/github.com/tobegit3hub/pirate# bee run pirate

More detail in [seagull-design-and-implement](docs/2014-10-14-seagull-design-and-implement.md) and we have excellent documents in [docs](https://github.com/tobegit3hub/seagull/tree/master/docs).

