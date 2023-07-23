const express=require("express");
const bodyParser=require("body-parser");
const request=require("request");
const https=require("https");
require('dotenv').config();

const app=express();
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));

app.get("/",function(req,res){
  res.sendFile(__dirname+"/signup.html");
})

app.post("/",function(req,res){
    const first=req.body.first;
    const last=req.body.last;
    const email=req.body.email;
    // api-key=c55772ba8bfc669e1f5f200cf5c29ff0-us21
    // 8af0c84fef.
    const data={
        members:[
             {
                email_address:email,
                status:"subscribed",
                merge_fields:{
                    FNAME:first,
                    LNAME:last
                }
             }
        ]
    };
    const jsondata=JSON.stringify(data);
    const api_key=process.env.API_KEY;
    const url="https://us21.api.mailchimp.com/3.0/lists/8af0c84fef";
    const option={
        method:"POST",
        headers:{
            Authorization:"auth "+api_key+"-us21"
   
        }
    };
    const request=https.request(url,option,function(response){
       if(response.statusCode === 200){
        res.sendFile(__dirname+"/sucess.html");
       }else{
        res.sendFile(__dirname+"/failure.html");
       }
       response.on("data",function(data){
        console.log(JSON.parse(data));
       });
    });
    request.write(jsondata);
    request.end();

});

app.post("/failure",function(req,res){
     res.redirect("/");
});

app.listen(process.env.PORT || 3000,function(){
    console.log("server 3000 started");
})





