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

app.get("/api/getall",apiController.getAll);
app.get("/api/",apiController.getId);
app.put("/api/",apiController.updateId);
app.post("/api/",apiController.createHospital);
app.delete("/api/",apiController.deleteHospital);
app.get("/api/fuzzy",apiController.fuzzySearch);


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
