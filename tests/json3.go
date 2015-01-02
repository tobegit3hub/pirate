// Go offers built-in support for JSON encoding and
// decoding, including to and from built-in and custom
// data types.

package main

import "encoding/json"
import "fmt"

//{"ApiVersion":"1.16","Arch":"amd64","GitCommit":"5bc2ff8",
// "GoVersion":"go1.3.3","KernelVersion":"3.16.7-tinycore64","Os":"linux","Version":"0.9.0"}
/*  below is get from v1/_ping 
	{"host": ["Linux", "661a9d2360c3", "3.16.7-tinycore64", "#1 SMP Tue Dec 16 23:03:39 UTC 2014",
	"x86_64", "x86_64"], 
	"launch": ["/usr/local/bin/gunicorn", "--access-logfile", "-", "--error-logfile", "-", 
	    "--max-requests", "100", "-k", "gevent", "--graceful-timeout", "3600", "-t",
		"3600", "-w", "4", "-b", "0.0.0.0:5000", "--reload", "docker_registry.wsgi:application"], 
	"versions": {"SocketServer": "0.4", "argparse": "1.1", "backports.lzma": "0.0.3", "blinker": "1.3", 
	"docker_registry.app": "0.9.0", "docker_registry.core": "2.0.3", "docker_registry.server": "0.9.0", 
	"werkzeug": "0.9.6", "yaml": "3.11", "zlib": "1.0"}}
*/	

type configuration struct {
    KernelVersion string
    Os string
    Version string
	ApiVersion string
	GoVersion string
	Arch string
	GitCommit string
}

type ping struct {
    Host []string
    Launch []string
	Versions interface{}
}

func main() {

    result := `{"host": ["Linux", "661a9d2360c3", "3.16.7-tinycore64", "#1 SMP Tue Dec 16 23:03:39 UTC 2014",
	"x86_64", "x86_64"], 
	"launch": ["/usr/local/bin/gunicorn", "--access-logfile", "-", "--error-logfile", "-", 
	    "--max-requests", "100", "-k", "gevent", "--graceful-timeout", "3600", "-t",
		"3600", "-w", "4", "-b", "0.0.0.0:5000", "--reload", "docker_registry.wsgi:application"], 
	"versions": {"SocketServer": "0.4", "argparse": "1.1", "backports.lzma": "0.0.3", "blinker": "1.3", 
	"docker_registry.app": "0.9.0", "docker_registry.core": "2.0.3", "docker_registry.server": "0.9.0", 
	"werkzeug": "0.9.6", "yaml": "3.11", "zlib": "1.0"}}`

    var pingResult ping
    json.Unmarshal([]byte(result),&pingResult)
	
    fmt.Println(pingResult)
    fmt.Println("Host:",pingResult.Host)
	fmt.Println("Host:",pingResult.Host[2])
	fmt.Println("Launch:",pingResult.Launch)
	fmt.Println("Versions:",pingResult.Versions)
	m := pingResult.Versions.(map[string]interface{})

	var config configuration
	config.KernelVersion = pingResult.Host[2]
	config.Os            = pingResult.Host[0]
	config.GitCommit     = pingResult.Host[1]
	config.Version       = m["docker_registry.server"].(string)

    configJson,_ := json.Marshal(config)
    fmt.Println("config:",string(configJson))
}