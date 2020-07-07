var express = require("express"),
	app = express(),
	bodyParser = require("body-parser"),
	mongoose = require("mongoose"),
	pug = require("pug"),
	Esri = require("./models/esri.js")

//MONGO CONFIGRATION
 var uri = process.env.DATABASEURI || "mongodb+srv://sudhanshumohan:hesoyam@cluster0-3z3hj.mongodb.net/hospital_data?retryWrites=true&w=majority"

mongoose.connect(uri,{
	useNewUrlParser:true,
	useCreateIndex:true,
	useUnifiedTopology:true
}).then(()=>{
	console.log("Connected to Database");
}).catch(err =>{
	console.log("ERROR:",err.message);
});

//==========================
//SOME OTHER PACKAGES CONFIG
//==========================

app.set("view engine","ejs");
app.set("view engine","pug");
//setting view engine to ejs
app.use(express.static(__dirname + '/public'));
//serving custom resources
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

//using bodyparser so recieve req object

//Serving HomePage
app.get("/",function(req,res){
	res.render("about.ejs");
});
app.get("/map",function(req,res){
	Esri.find({},function(err,foundObj){
		if(err){
			console.log(err);
		} else {
			res.render("index.ejs",{foundArr:foundObj});
		}
	}).limit(100);
	});
app.get("/technology",function(req,res){
	res.render("technology.ejs");
});
app.get("/contact",function(req,res){
	res.render("contact.ejs");
});
app.get("/login",function(req,res){
	res.render("login.ejs");
});

//LISTENER PROCESS
var port = process.env.PORT || 31000
app.listen(port,process.env.IP,function(){
	console.log("Server started at port:"+port);
})
