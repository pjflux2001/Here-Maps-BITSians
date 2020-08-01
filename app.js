const { functionsIn } = require("lodash");

var express = require("express"),
	app = express(),
	bodyParser = require("body-parser"),
	mongoose = require("mongoose"),
	//pug = require("pug"),
	nodemailer = require('nodemailer'),
	Esri = require("./models/esri.js");

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
	useUnifiedTopology:true,
	useFindAndModify: false
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
	})
	});
app.get("/AboutProject",function(req,res){
	res.render("AboutProject.ejs");
});
app.get("/login",function(req,res){
	res.render("login.ejs");
});

app.get('/dashboard',isAuthenticated,function(req,res){
	res.render('dashboard.ejs');
});

// ======== plasma bank ========= //
app.get("/index_plasma",function(req,res){
	res.render("index_plasma.ejs");
});
app.get("/amenities",function(req,res){
	res.render("amenities.ejs");
});
app.get("/form_donor",function(req,res){
	res.render("form_donor.ejs");
});
app.get("/form_patient",function(req,res){
	res.render("form_patient.ejs");
});
app.get("/common_pool",function(req,res){
	res.render("common_pool.ejs");
});
app.get("/plasma_bank",function(req,res){
	res.render("plasma_bank.ejs");
});
//==========AJAX TESTING ROUTES =========

app.get("/test",function(req,res){
	res.render("test.ejs");
});

//========API Routes============//
//========THIS API GETS ALL THE DATA===========//
app.get("/api/getall",function(req,res){
	Esri.find({},function(err,data){
		if(err){
			res.send(err);
		} else {
			res.send(data);
		}
	}).limit(10);
});
//========THIS SEARCHES FOR A SPECIFIC MONGO ID=========//
app.get("/api/",(req,res) =>{
	var _id = req.query._id;
	Esri.findById(_id,function(err,data){
		if(err){
			res.send(err);
		} else {
			res.send(data);
		}
	})
});
//===========THIS API Route Searches and Updates the document ============//
app.put("/api/",(req,res)=>{
	Esri.findByIdAndUpdate(req.body._id,req.body,{upsert:false,new:true},function(err,updatedObject){
		if(err){
			console.log(err);
		} else {
			res.send(updatedObject);
		}
	})
});
//=================THIS API Creates New Documents================//
app.post("/api/",(req,res)=>{
	var newEsri = new Esri({
	X:req.body.X,
	Y:req.body.Y,
	FID:req.body.FID,
	HOSPITAL_NAME:req.body.HOSPITAL_NAME,
	HOSPITAL_TYPE:req.body.HOSPITAL_TYPE,
	HQ_ADDRESS:req.body.HQ_ADDRESS,
	HQ_CITY:req.body.HQ_CITY,
	HQ_STATE:req.body.HQ_STATE,
	HQ_ZIP_CODE:req.body.HQ_ZIP_CODE,
	COUNTY_NAME:req.body.COUNTY_NAME,
	STATE_NAME:req.body.STATE_NAME,
	FIPS:req.body.FIPS,
	NUM_LICENSED_BEDS:req.body.NUM_LICENSED_BEDS,
	NUM_STAFFED_BEDS:req.body.NUM_STAFFED_BEDS,
	NUM_ICU_BEDS:req.body.NUM_ICU_BEDS,
	ADULT_ICU_BEDS:req.body.ADULT_ICU_BEDS,
	PEDI_ICU_BEDS:req.body.PEDI_ICU_BEDS,
	BED_UTILIZATION:req.body.BED_UTILIZATION,
	Potential_Increase_In_Bed_Capac:req.body.Potential_Increase_In_Bed_Capac,
	AVG_VENTILATOR_USAGE:req.body.AVG_VENTILATOR_USAGE	
	});
	newEsri.save(function(err,obj){
		if(err){
			console.log(err);
		} else {
			res.send(obj);
		}
	});
});
//==================DELELTE BY ID=============//
app.delete("/api/",(req,res)=>{
	Esri.findByIdAndRemove(req.body._id,function(err,deletedObj){
		if(err){
			console.log(err);
		} else {
			res.send(deletedObj);
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


//===============get request Fallback===========//

app.get("*", (req,res) => {
    res.render("404.ejs");
  });


// using Twilio SendGrid's v3 Node.js Library
// https://github.com/sendgrid/sendgrid-nodejs
app.post("/email",function(req,res){
	var email =  req.body.email;
	var name =  req.body.name;
	var number = req.body.number;
	var age = req.body.age;
	var gender = req.body.gender;
	var country = req.body.country;
	var state = req.body.state;
	var city = req.body.city;
	var bg = req.body.bg;
	/*console.log(email);
	sgMail.setApiKey("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");
	const msg = {
	to: email,
	from: 'pj.flux2001@gmail.com',
	subject: 'Team BITSians : Success',
	text: 'Dear '+name+', Your form has been successfully pushed into our database. It will expire in next 72 hours, hence take the required steps to comply with the same. The information that was pushed into this form : Age : <br>Gender : <br>Country : <br>State : <br>City : <br>Blood Group :'+ bg +' We will contact you @'+number+' in case of any emergency. Best Regards, Team BITSians ',
	html: 'Dear '+name+',<br><br>Your form has been successfully pushed into our database. It will expire in next <strong>72 hours</strong>, hence take the required steps to comply with the same.<br><br>The information that was pushed into this form :<br><p>Age : '+age+'<br>Gender : '+gender+'<br>Country : '+country+'<br>State : '+state+'<br>City : '+city+'<br>Blood Group : '+ bg +'<br></p>We will contact you @'+number+' in case of any emergency.<br><br> Best Regards,<br> Team BITSians',
	};
	sgMail.send(msg);*/
	let transport = nodemailer.createTransport({
		host: 'smtp.googlemail.com',
          port: 465,
          secure: true,
		auth: {
		  user: 'carequest69@gmail.com',
		  pass: 'CareQuest@69'
		}
	});
	const message1 = {
		from: 'CareQuest <carequest69@gmail.com>', // Sender address
		to: email,         // List of recipients
		subject: 'CareQuest : Form Submission Success', // Subject line
		html: 'Dear '+name+',<br><br>Your form has been successfully pushed into our database. It will expire in next <strong>72 hours</strong>, hence take the required steps to comply with the same.<br><br>The information that was pushed into this form :<br><p>Age : '+age+'<br>Gender : '+gender+'<br>Country : '+country+'<br>State : '+state+'<br>City : '+city+'<br>Blood Group : '+ bg +'<br></p>We will contact you @'+number+' in case of any emergency.<br><br> Best Regards,<br> Team CareQuest'// Plain text body
	};
	transport.sendMail(message1, function(err, info) {
		if (err) {
		  console.log(err)
		} else {
		  console.log(info);
		}
	});
	res.render("common_pool");
})

//========================//
//LISTENER PROCESS
var port = process.env.PORT || 31000
app.listen(port,process.env.IP,function(){
	console.log("Server started at port:"+port);
});
