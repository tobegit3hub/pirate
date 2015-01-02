// Go offers built-in support for JSON encoding and
// decoding, including to and from built-in and custom
// data types.

package main

import "encoding/json"
import "fmt"

// search result
//  {"num_results": 2, "query": "", "results": [{"description": "", "name": "library/hello-world"}, 
//  {"description": "", "name": "larrycai/hello-world"}]}
// repo result
//  {"latest": "04c5d3b7b0656168630d3ba35d8889bd0e9caafcaeb3004d2bfbc47e7c5d35d2",
//   "trusty": "04c5d3b7b0656168630d3ba35d8889bd0e9caafcaeb3004d2bfbc47e7c5d35d2"}

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
    str := `{"latest": "04c5d3b7b0656168630d3ba35d8889bd0e9caafcaeb3004d2bfbc47e7c5d35d2",
             "trusty": "04c5d3b7b0656168630d3ba35d8889bd0e9caafcaeb3004d2bfbc47e7c5d35d2"}`
    return str
}

func main() {

    result := `{"num_results": 2, "query": "", "results": [{"description": "", "name": "library/hello-world"}, 
    {"description": "", "name": "larrycai/hello-world"}]}`

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
}