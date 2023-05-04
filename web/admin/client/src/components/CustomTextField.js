import React from "react";
import TextField from "@mui/material/TextField";

const CustomTextField = (props) => {
  return (
    <>
      <TextField
        inputProps={{ style: { fontSize: 15 } }} // font size of input text
        id="outlined-basic"
        size="small"
        name={props.name}
        variant="outlined"
        value={props.labelText}
        label={props.hintText}
        style={props.style}
        onChange={props.onChange}
      />
    </>
  );
};

export default CustomTextField;
