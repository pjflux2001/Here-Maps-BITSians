var express = require("express"),
	app = express(),
	mongoose = require("mongoose"),
	bodyParser = require("body-parser")

app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine","ejs");

//MONGO CONFIGRATION
/* var uri = process.env.DATABASEURI || "mongodb://localhost/map_beds_app"

mongoose.connect(uri,{
	useNewUrlParser:true,
	useCreateIndex:true,
}).then(()=>{
	console.log("Connected to Database");
}).catch(err =>{
	console.log("ERROR:",err.message);
});
*/

//Serving HomePage
app.get('/',function(req,res){
	res.render("index");
})
//LISTENER PROCESS
var port = process.env.PORT || 31000
app.listen(port,process.env.IP,function(){
	console.log("Server started at port:"+port);
})
