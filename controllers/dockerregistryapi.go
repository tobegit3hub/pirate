package controllers

/*
 * The docker API controller to access docker unix socket and reponse JSON data
 *
 * Refer to https://docs.docker.com/reference/api/docker_remote_api_v1.14/ for docker remote API
 * Refer to https://github.com/Soulou/curl-unix-socket to know how to access unix docket
 */

import (
	"github.com/astaxie/beego"

	"fmt"
	"io/ioutil"
	"net/http"
	
//	"strconv"
	"strings"
	"encoding/json"
)

/* Give address and method to request docker unix socket */
func RequestRegistry(address, method string) string {
	REGISTRY_URL := "http://registry:5000/v1"

	registry_url := REGISTRY_URL + address
	
	reader := strings.NewReader("")

	request, err := http.NewRequest(method, registry_url, reader)
	if err != nil {
		fmt.Println("Error to create http request", err)
		return ""
	}

	client := &http.Client{}
	response, err := client.Do(request)
	if err != nil {
		fmt.Println("Error to achieve http request over unix socket", err)
		return ""
	}

	body, err := ioutil.ReadAll(response.Body)
	if err != nil {
		fmt.Println("Error, get invalid body in answer")
		return ""
	}
	//fmt.Println(body)

	/* An example to get continual stream from events, but it's for stdout
		_, err = io.Copy(os.Stdout, res.Body)
		if err != nil && err != io.EOF {
			fmt.Println("Error, get invalid body in answer")
			return ""
	   }
	*/

	defer response.Body.Close()
	fmt.Println(string(body))
	return string(body)
}

/* It's a beego controller */
type DockerregistryapiController struct {
	beego.Controller
}

type image struct {
    Name string
    Id string
    Tag string
}

type repository struct {
    Description string
    Name string
}

type search struct {
    Num_results int
    Query string
    Results []repository
}

func getTags(name string) string {
	address := "/repositories/" + name + "/tags"
	fmt.Println(address)
	result := RequestRegistry(address, "GET")
    return result
}

/* Wrap docker remote API to get images */
func (this *DockerregistryapiController) GetImages() {
	// https://github.com/docker/docker-registry/issues/63
	
    // search for all repository
	address := "/search"	
	result := RequestRegistry(address, "GET")
	fmt.Println("result:",result)
	
	var searchResult search
    json.Unmarshal([]byte(result),&searchResult)
    fmt.Println(searchResult)
    fmt.Println(searchResult.Results)
  
    var f interface{}
    images := make([]image,0)
    var oneimage image
    for _, repo := range searchResult.Results {
        fmt.Println(repo)
        tags := getTags(repo.Name)
        json.Unmarshal([]byte(tags), &f)
        m := f.(map[string]interface{})
        for k, v := range m {
          fmt.Println("tag name:",k,",id:",v)
          oneimage.Name =  repo.Name
          oneimage.Tag = k
          oneimage.Id = v.(string)
          images = append(images,oneimage)
        }
    }
    fmt.Println(images)
    all,_ := json.Marshal(images)
    fmt.Println(string(all))
	
	this.Ctx.WriteString(string(all))
}

/* Wrap docker remote API to get data of image */
func (this *DockerregistryapiController) GetImage() {
	id := this.GetString(":id")
	address := "/images/" + id + "/json"
	result := RequestRegistry(address, "GET")
	this.Ctx.WriteString(result)
}

/* Wrap docker remote API to get data of user image */
func (this *DockerregistryapiController) GetUserImage() {
	user := this.GetString(":user")
	repo := this.GetString(":repo")
	address := "/repositories/" + user + "/" + repo + "/tags"
	fmt.Println(address)
	result := RequestRegistry(address, "GET")
	this.Ctx.WriteString(result)
}

/* Wrap docker remote API to delete image */
func (this *DockerregistryapiController) DeleteImage() {
	id := this.GetString(":id")
	address := "/images/" + id
	result := RequestRegistry(address, "DELETE")
	this.Ctx.WriteString(result)
}

type version struct {
    ApiVersion string 
	Arch string
	GitCommit string
	GoVersion string
	KernelVersion string
	Os string
	Version string
}

//{"ApiVersion":"1.16","Arch":"amd64","GitCommit":"5bc2ff8",
// "GoVersion":"go1.3.3","KernelVersion":"3.16.7-tinycore64","Os":"linux","Version":"0.9.0"}
/* "host": [
        "Linux",
        "661a9d2360c3",
        "3.16.7-tinycore64",
        "#1 SMP Tue Dec 16 23:03:39 UTC 2014",
        "x86_64",
        "x86_64"
    ],
*/	
/* ToDo: Wrap docker remote API to get version info */
func (this *DockerregistryapiController) GetVersion() {
//	address := "/_ping"
//	result := RequestRegistry(address, "GET")
	result := `{"ApiVersion":"1.16","Arch":"amd64","GitCommit":"5bc2ff8",
	"GoVersion":"go1.3.3","KernelVersion":"3.16.7-tinycore64","Os":"linux","Version":"0.9.0"}`
	this.Ctx.WriteString(result)
}

/* Wrap docker remote API to get docker info */
func (this *DockerregistryapiController) GetInfo() {
	address := "/_ping"
	result := RequestRegistry(address, "GET")
	this.Ctx.WriteString(result)
}

