FROM golang:1.4
MAINTAINER tobe tobeg3oogle@gmail.com

# Install dependency
RUN go get github.com/astaxie/beego

COPY . /go/src/github.com/tobegit3hub/pirate/
WORKDIR /go/src/github.com/tobegit3hub/pirate/
RUN go build pirate.go

# below data is useful to pirate GUI
COPY README.md Dockerfile PIRATE.ini /app/

# Expose the port
EXPOSE 9527

# Run the server
CMD ["./pirate"]
