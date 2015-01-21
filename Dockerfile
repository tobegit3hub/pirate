FROM golang:1.4
MAINTAINER tobe tobeg3oogle@gmail.com

# Install dependency
RUN go get github.com/astaxie/beego

# Build pirate
Add . /go/src/github.com/tobegit3hub/pirate/
WORKDIR /go/src/github.com/tobegit3hub/pirate/
RUN go build pirate.go

ADD . /app

# Expose the port
EXPOSE 9527

# Run the server
CMD ["./pirate"]
