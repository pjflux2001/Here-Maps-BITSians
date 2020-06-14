var mongoose = require("mongoose");

var esriSchema = new mongoose.Schema({
	X:number,
	Y:number,
	FID:number,
	HOSPITAL_NAME:String,
	HOSPITAL_TYPE:String,
	HQ_ADDRESS:String,
	HQ_CITY:String,
	HQ_STATE:String,
	HQ_ZIP_CODE:number,
	COUNTY_NAME:String,
	STATE_NAME:String,
	FIPS:number,
	NUM_LICENSED_BEDS:number,
	NUM_STAFFED_BEDS:number,
	NUM_ICU_BEDS:number,
	ADULT_ICU_BEDS:number,
	PEDI_ICU_BEDS:String,
	BED_UTILIZATION:number,
	Potential_Increase_In_Bed_Capac:number,
	AVG_VENTILATOR_USAGE:number
},{collection:"esri"});

module.export = mongoose.model("ESRI",esriSchema);
