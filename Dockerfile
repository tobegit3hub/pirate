
# Base image is in https://registry.hub.docker.com/_/golang/
# Refer to https://blog.golang.org/docker for usage

FROM golang
MAINTAINER tobe tobeg3oogle@gmail.com
ENV REFREST_AT 20141230

# ENV GOPATH /go

# Install dependency
RUN go get github.com/astaxie/beego
RUN go get github.com/beego/bee
# RUN go get github.com/tobegit3hub/pirate

Add . /go/src/github.com/tobegit3hub/pirate/

# Go to the folder of seagull
WORKDIR /go/src/github.com/tobegit3hub/pirate/

# Build the project
RUN go build pirate.go

# This should be the same as httpport in conf/app.conf
EXPOSE 9527

# Run the server
CMD ["./pirate"]

