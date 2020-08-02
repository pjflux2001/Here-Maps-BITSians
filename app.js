/**
 * Module dependencies.
 */

const express = require("express");
const compression = require("compression");
const session = require("express-session");
const bodyParser = require("body-parser");
const logger = require('morgan');
const chalk = require('chalk');
const errorHandler = require('errorhandler');
const expressStatusMonitor = require('express-status-monitor');
const lusca = require('lusca');
const dotenv = require('dotenv');
const mongoose = require("mongoose");
const passport = require('passport');
const nodemailer = require('nodemailer')
const Esri = require("./models/esri.js")
const { functionsIn } = require("lodash");


/**
 * Load environment variables from .env file, where API keys and passwords are configured.
 */
dotenv.config({ path: '.env' });

/**
 * Controllers (route handlers).
 */
const homeController = require('./controllers/home');
const apiController = require('./controllers/api');



const app = express();

//==================
//MONGO CONFIGRATION
//===================
mongoose.connect(process.env.DATABASEURI,{
	useNewUrlParser:true,
	useCreateIndex:true,
	useUnifiedTopology:true,
	useFindAndModify: false
}).then(()=>{
	console.log("Connected to Database",chalk.green('✓'));
}).catch(err =>{
	console.log('MongoDB connection error. Please make sure MongoDB is running.', chalk.red('✗'),err.message);
});

//==========================
//SOME OTHER PACKAGES CONFIG
//==========================
//setting view engines to ejs
app.set("view engine","ejs");
app.use(expressStatusMonitor());
app.use(compression());

//serving custom resources
app.use(express.static(__dirname + '/public'));

//using bodyparser so recieve req object
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

//Express Session

//PASSPORT=> INITISLISE , SESSION


//lusca for security
app.use(lusca.xframe('SAMEORIGIN'));
app.use(lusca.xssProtection(true));
//to remove the webserver identification
app.disable('x-powered-by');
//created the copy of request header and saved it in response header
app.use((req, res, next) => {
	res.locals.user = req.user;
	next();
  });

//path protection middlewares

/**
 * Error Handler.
 */
if (process.env.NODE_ENV === 'development') {
	// only use in development
	app.use(errorHandler());
  } else {
	app.use((err, req, res, next) => {
	  console.error(err);
	  res.status(500).send('Server Error');
	});
  }

/**
 * Primary app routes.
 */
app.get('/', homeController.index);
app.get("/map",homeController.getMap);
app.get("/AboutProject",homeController.aboutDev);
app.get("/login",homeController.getLogin);
app.get('/dashboard',homeController.getDashboard);

// ======== plasma bank Routes ==========//
app.get("/index_plasma",homeController.getStatistics);
app.get("/amenities",homeController.getAmenities);
app.get("/form_donor",homeController.getDonorForm);
app.get("/form_patient",homeController.getPatientForm);
app.get("/common_pool",homeController.getCommonPool);
app.get("/plasma_bank",homeController.getPlasmaBank);

//========== AJAX TESTING ROUTES =========//

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
	console.log("Server started at port:"+port ,chalk.green('✓'));
	console.log('  Press CTRL-C to stop');
});
