package routers

import (
	"github.com/tobegit3hub/pirate/controllers"
	"github.com/astaxie/beego"
)

func init() {
    beego.Router("/", &controllers.MainController{})
}
