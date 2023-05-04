import mongoose from "mongoose";

const countrySchema = new mongoose.Schema({
 
  Country_Name: {
    type: String
  },
  Country_Code: {
    type: String
  },
  Country_Flag: {
    type: String
  },
  Currency: {
    type: String
  },
  Currency_Symbol: {
    type: String
  },
  Status: {
    type: Boolean
  },
  iso3: {
    type: String
  },
  iso2: {
    type: String
  },
  Phone_code: {
    type: String
  },
  States:{
    type:Array
  },
})

const Countries = mongoose.model("countries", countrySchema);
export default Countries;
