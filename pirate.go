package main

import (
	"github.com/astaxie/beego"
	_ "github.com/tobeg3oogle/pirate/routers"
)

/* The main function of beego application */
func main() {
	beego.Run()
}
