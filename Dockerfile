FROM golang
MAINTAINER tobe tobeg3oogle@gmail.com

# Install dependency
RUN go get github.com/astaxie/beego

# Add source code
Add . /go/src/github.com/tobegit3hub/pirate/
WORKDIR /go/src/github.com/tobegit3hub/pirate/

# Compile
RUN go build pirate.go

# This should be the same as httpport in conf/app.conf
EXPOSE 9527

# Run the server
CMD ["./pirate"]
