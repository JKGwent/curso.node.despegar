console.log("class 2");

const http = require("http");
const fs = require("fs");

var dynamicURL ={};
const add = (url, cb)=> dynamicURL[url]= cb;


add("GET", "/stats", (req, res)=>{
    res.end(JSON.stringify({
       version:1,
        time: new Date()
    }));
})


const isDynamic = (req, res)=>{
    if(dynamicURL[req.url]){
        dynamicURL[req.url](req, res);
    }else return null;
}

const getQS = (req)=>{
    req.query = {};
    let pars = req.url.split("?");
    req.url = pars[0];
    if(pars.length>1){
        pars[1].split("&").forEach((e)=>{
            let q=e.split("=");
            req.query[q[0]] = q[1];
        });
    }
}


const getStaticFile =(f)=>{
    try{
        let url = f.replace("/", "");
        return fs.readFileSync("./"+url);
    }catch(e){
        return null;
    }
}


const serverCB = (req, res)=>{

    getQS(req);

    let content = getStaticFile(req.url);
    if(content) return res.end(content);
    else if (isDynamic(req, res)) return null;
    else res.end("not found");


}

http.createServer(serverCB).listen(3000);