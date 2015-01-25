package controllers

/*
 * The docker API controller to access docker unix socket and reponse JSON data
 *
 * Refer to https://docs.docker.com/reference/api/registry_api/ for docker registry API
 */

import (
	"github.com/astaxie/beego"
    "os"
	"fmt"
	"io/ioutil"
	"net/http"
	"errors"
	"strings"
	"encoding/json"
	"os/exec"
	"regexp"
)

/* Give address and method to request docker registry API */
func RequestRegistry(address, method string) string {
	REGISTRY_URL := "registry:5000"
	if os.Getenv("REGISTRY_URL") != "" {
	   REGISTRY_URL = os.Getenv("REGISTRY_URL")
	} else {
	   // set varible to be used in configuration
	   os.Setenv("REGISTRY_URL", REGISTRY_URL)
	}
    // fmt.Println(os.Environ())
	registry_url := "http://" + REGISTRY_URL + "/v1" + address
    //fmt.Println(registry_url)

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
	// fmt.Println("http result body:",string(body))
	return string(body)
}

/*
 * Here list all the official Registry API
 *
 */

func registryGetId(id string) (string) {
	address := "/images/" + id + "/json"
	result := RequestRegistry(address, "GET")
	return result
}

func registryGetTags(id string) (string) {
	address := "/images/" + id + "/json"
	result := RequestRegistry(address, "GET")
	return result	
}

func registryGetAncestry(id string) (string) {
	address := "/images/" + id + "/ancestry"
	result := RequestRegistry(address, "GET")
	return result	
}

func registryGetTagsByName(name string) string {
	address := "/repositories/" + name + "/tags"
	fmt.Println(address)
	result := RequestRegistry(address, "GET")
    return result
}

func registryDeleteImage(name,repo,tag string) string {
	address := "/repositories/" + name + "/" + repo + "/tags/" + tag
	result := RequestRegistry(address, "DELETE")
    return result
}

func registryGetTagsByUserRepo(user,repo string) string {
	address := "/repositories/" + user + "/" + repo + "/tags"
	fmt.Println(address)
	result := RequestRegistry(address, "GET")
	return result
}

func registryPing() string {
	address := "/_ping"
	result := RequestRegistry(address, "GET")
	return result
}

/*
 * registry Hacked API 
 *
 */
 
// https://github.com/docker/docker-registry/issues/63
func registryGetAllImages() string {
	address := "/search"	
	result := RequestRegistry(address, "GET")
	return result
}	

/*
 * structure
 *
 */ 
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

/*
 * internal hacked solution to get images' detail
 *
 */
const README_MD_FILE = "app/README.md"
const DOCKERFILE_FILE = "app/Dockerfile"
const BUILD_LOG_FILE = "app/BUILD.log"
const PIRATE_INI_FILE = "app/PIRATE.ini"
const REGISTRY_PATH = "/registry/images"

func readFileFromTar(filelist string, tarfile string, extracted_file string)(string, error) {
   
    if strings.Index(string(filelist),extracted_file) != -1 {
        fmt.Printf("found the file %s\n", extracted_file)
        cmd := fmt.Sprintf("tar -xOf %s %s",tarfile, extracted_file)
        dat1, err1 := exec.Command("sh","-c",cmd).Output()
        return string(dat1),err1
   }
   return "",errors.New("can't find the file")
}

// ini part is referred https://github.com/vaughan0/go-ini/blob/master/ini.go
var assignRegex  = regexp.MustCompile(`^([^=]+)=(.*)$`)

func getIni(ini string)(map[string]string) {
    var abc=map[string]string{}
    lines := strings.Split(ini, "\n")
    for i, line := range lines {
		fmt.Println(i, line)
				line = strings.TrimSpace(line)
		if len(line) == 0 {
			// Skip blank lines
			continue
		}
		if line[0] == ';' || line[0] == '#' {
			// Skip comments
			continue
		}

		if groups := assignRegex.FindStringSubmatch(line); groups != nil {
			key, val := groups[1], groups[2]
			key, val = strings.TrimSpace(key), strings.TrimSpace(val)
			abc[key] = val
		}

    }
    return abc
}

func getReadme(id string)(string,string,string,error) {
    layerfile := REGISTRY_PATH + "/" + id + "/layer"
	
	cmd := "tar -tf "+ layerfile
    out, err := exec.Command("sh","-c",cmd).Output()
    if err != nil {
       fmt.Printf("shall not happen !! %s", err)
    } 
   
    // fmt.Printf("========================  %s", out)
	
    dat1, err1 := readFileFromTar(string(out), layerfile,README_MD_FILE)
	dat2, err2 := readFileFromTar(string(out), layerfile,DOCKERFILE_FILE)
	dat3, err3 := readFileFromTar(string(out), layerfile,PIRATE_INI_FILE)
	
	if err1 != nil && err2 != nil && err3 != nil {
		return "","","",errors.New("can't find the file")
		
	} 
    return string(dat1),string(dat2),string(dat3),nil
}

/* Wrap docker remote API to get images */
func (this *DockerregistryapiController) GetImages() {
    // search for all repository
	result := registryGetAllImages()
	// fmt.Println("result:",result)
	
	var searchResult search
    json.Unmarshal([]byte(result),&searchResult)
    
    var f interface{}
    images := make([]image,0)
    var oneimage image
    for _, repo := range searchResult.Results {
        fmt.Println(repo)
        tags := registryGetTagsByName(repo.Name)
        json.Unmarshal([]byte(tags), &f)
        m := f.(map[string]interface{})
        for k, v := range m {
          oneimage.Name =  repo.Name
          oneimage.Tag = k
          oneimage.Id = v.(string)
          images = append(images,oneimage)
        }
    }
    all,_ := json.Marshal(images)
    fmt.Println(string(all))
	
	this.Ctx.WriteString(string(all))
}

/* Wrap docker remote API to get data of image */
func (this *DockerregistryapiController) GetImage() {
	id := this.GetString(":id")
	result := registryGetId(id)
	this.Ctx.WriteString(result)
}

/* Wrap docker remote API to get data of user image */
func (this *DockerregistryapiController) GetUserImage() {
	user := this.GetString(":user")
	repo := this.GetString(":repo")
	result := registryGetTagsByUserRepo(user,repo)
	this.Ctx.WriteString(result)
}

/* Wrap docker remote API to delete image */
func (this *DockerregistryapiController) DeleteImage() {
	name := this.GetString(":name")
	repo := this.GetString(":repo")
	tag := this.GetString(":tag")
	var result string
	if  os.Getenv("PIRATE_MODE") == "readonly" {
	    fmt.Println("readonly mode, delete is not allowed, it shall not be seen in UI !!!!")
	    result = "" 
	} else {
		result = registryDeleteImage(name,repo,tag)
	}
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

type configuration struct {
    KernelVersion string
	RegistryServer string
	PirateMode string
	PirateUrlAlias string
    Os string
    Version string
	ApiVersion string
	GoVersion string
	Arch string
	GitCommit string
	Host string
	Launch string
}

type ping struct {
    Host []string
    Launch []string
	Versions interface{}
}

type imageInfo struct {
    Id,Name,Tag, ParentId string
	Author, Architecture, Created, Comment string
	DockerVersion, Os, Size string

	Readme string
	Dockerfile string

	Pirate map[string]string
	Layers []string
    Tags map[string]string
	
}

const DOCKERHUB_URL="https://registry.hub.docker.com/u"

/*
 * Functions are used by controller 
 */
 
/* It's a beego controller */
type DockerregistryapiController struct {
	beego.Controller
}

/* Wrap docker registry API to get version info */
func (this *DockerregistryapiController) GetVersion() {
	result := registryPing()
	
	// unmarshall the docker ping result to internal data
    var pingResult ping
    json.Unmarshal([]byte(result),&pingResult)
	m := pingResult.Versions.(map[string]interface{})

    // fill the internal data structure
	var config configuration
	config.Os            = pingResult.Host[0]
	config.GitCommit     = pingResult.Host[1]
	config.KernelVersion = pingResult.Host[2]	
	config.Version       = m["docker_registry.server"].(string)
	
	// add pirate environment
	config.RegistryServer = os.Getenv("REGISTRY_URL")
	config.PirateMode = os.Getenv("PIRATE_MODE")
	config.PirateUrlAlias = os.Getenv("PIRATE_URL_ALIAS")
	if(config.PirateUrlAlias == ""){
		config.PirateUrlAlias = config.RegistryServer
	}

    configJson,_ := json.Marshal(config)
    
	this.Ctx.WriteString(string(configJson))
}

/* Wrap docker remote API to get docker info */
func (this *DockerregistryapiController) GetInfo() {
	result := registryPing()
	this.Ctx.WriteString(result)
}

func (this *DockerregistryapiController) GetImageInfo() {
	var id, name, tag string

	this.Ctx.Input.Bind(&id, "id")
	this.Ctx.Input.Bind(&name, "name")
	this.Ctx.Input.Bind(&tag, "tag")
	fmt.Printf("id:%s,name:%s,tag:%s", id, name, tag)
	
	// send message for image
	result := registryGetId(id)
	
	var objmap map[string]json.RawMessage
	json.Unmarshal([]byte(result), &objmap)

	var info imageInfo

	info.ParentId = string(objmap["parent"])	
	info.Architecture = string(objmap["architecture"])	
	info.Created=string(objmap["created"])
	info.Author = string(objmap["author"])
	info.Os = string(objmap["os"])
	info.Comment = ""
	info.DockerVersion = string(objmap["docker_version"])
	info.Size = string(objmap["Size"])

	layers := registryGetAncestry(id)
	var ancestries[]string
	json.Unmarshal([]byte(layers), &ancestries)
	
    readme := ""
	dockerfile := ""
	piratefile := ""
	
    for i:=0;i<len(ancestries);i++ {      // i is used to control the depth of the layer
		id = ancestries[i] 
        fmt.Println("i=",i, "Check id: " + id)
        dat1, dat2,dat3, err := getReadme(id)
        if err == nil || i > 5  {
            // readme = contents
			readme = dat1
			dockerfile = dat2
			piratefile= dat3
            break  // found README
        }
    }
    if readme == "" {
	    url := DOCKERHUB_URL + "/" + name 
	    readme = fmt.Sprintf("Not find in docker image, mostly you could try [%s](%s)",url,url)
    }
	
	if dockerfile == "" {
	    url := DOCKERHUB_URL + "/" + name + "/dockerfile"
	    dockerfile = fmt.Sprintf("Not found in docker image, mostly you want to check %s",url)
	}

    info.Readme = readme
	info.Id = id
	info.Name = name
	info.Tag = tag
	info.Dockerfile = dockerfile
	
	tags := registryGetTagsByName(name)
	var nameValue map[string]string
	json.Unmarshal([]byte(tags), &nameValue)
    info.Tags = nameValue
	info.Layers = ancestries
	info.Pirate = getIni(piratefile)
	
    all,_ := json.MarshalIndent(info,"","  ")
    fmt.Println(string(all))
	
	this.Ctx.WriteString(string(all))
}

