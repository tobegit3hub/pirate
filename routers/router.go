package routers

import (
	"github.com/astaxie/beego"
	"github.com/tobegit3hub/pirate/controllers"
)

func init() {
	/* Pass to Angular router */
	beego.Router("/", &controllers.MainController{})
	beego.Router("/containers", &controllers.MainController{})
	beego.Router("/images", &controllers.MainController{})
	beego.Router("/images/:id", &controllers.MainController{})
	beego.Router("/images/:user/:repo", &controllers.MainController{})
	beego.Router("/configuration", &controllers.MainController{})
	beego.Router("/dockerhub", &controllers.MainController{})

	/* HTTP API for docker remote API */
	beego.Router("/dockerregistryapi/images/json", &controllers.DockerregistryapiController{}, "get:GetImages")
	beego.Router("/dockerregistryapi/images/:id/json", &controllers.DockerregistryapiController{}, "get:GetImage")
	beego.Router("/dockerregistryapi/images/info", &controllers.DockerregistryapiController{}, "get:GetImageInfo")
	beego.Router("/dockerregistryapi/images/:user/:repo/json", &controllers.DockerregistryapiController{}, "get:GetUserImage")
	beego.Router("/dockerregistryapi/repositories/:name/:repo/tags/:tag", &controllers.DockerregistryapiController{}, "delete:DeleteImage")
	beego.Router("/dockerregistryapi/version", &controllers.DockerregistryapiController{}, "get:GetVersion")
	beego.Router("/dockerregistryapi/info", &controllers.DockerregistryapiController{}, "get:GetInfo")
	// beego.Router("/dockerregistryapi/images/search", &controllers.DockerregistryapiController{}, "get:GetSearchImages")
	// beego.Router("/dockerapi/events", &controllers.DockerregistryapiController{}, "get:GetEvents") // Not support yet
}
