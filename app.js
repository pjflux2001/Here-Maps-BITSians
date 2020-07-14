var express = require("express"),
	app = express(),
	bodyParser = require("body-parser"),
	mongoose = require("mongoose"),
	pug = require("pug"),
	Esri = require("./models/esri.js")

//MIDDLEWARE for Authentication

function isAuthenticated(req,res,next){
//check whether logged in
// if they are, attach the user to request object and then call next
// if not send redirect to login page 
// with a message saying log in
}

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

app.get('/dashboard',isAuthenticated,function(req,res){
	res.render('dashboard.ejs');
})
//==========AJAX TESTING ROUTES =========

app.get("/test",function(req,res){
	res.render("test.ejs");
})

//========API Routes=========
app.get("/api/getdata",function(req,res){
	Esri.find({},function(err,data){
		if(err){
			res.send(err);
		} else {
			res.send(data);
		}
	}).limit(10);
});
//========THIS SEARCHES FOR A SPECIFIC MONGO ID=========//
app.get("/api/id",(req,res) =>{
	var _id = req.query._id;
	Esri.find({_id:_id},function(err,data){
		if(err){
			res.send(err);
		} else {
			res.send(data);
		}
	})
});
//=============Fuzzy Search based on raw data ==========//

app.get("/api/fuzzy",(req,res) =>{
	var COUNTY_NAME = req.query.COUNTY_NAME;
	var STATE_NAME = req.query.STATE_NAME;
	var HOSPITAL_NAME = req.query.HOSPITAL_NAME;
	var HQ_CITY = req.query.HQ_CITY;
	Esri.find({STATE_NAME:{$regex:STATE_NAME,$options:"$i"},COUNTY_NAME:{$regex:COUNTY_NAME,$options:"$i"},HOSPITAL_NAME:{$regex:HOSPITAL_NAME,$options:"$i"},HQ_CITY:{$regex:HQ_CITY,$options:"$i"}},function(err,data){
		if(err){
			res.send(err);
		} else {
			res.send(data);
		}
	})
});


//===============get request Fallback========

app.get("*", (req,res) => {
    res.render("404.ejs");
  });


//========================//
//LISTENER PROCESS
var port = process.env.PORT || 31000
app.listen(port,process.env.IP,function(){
	console.log("Server started at port:"+port);
})
