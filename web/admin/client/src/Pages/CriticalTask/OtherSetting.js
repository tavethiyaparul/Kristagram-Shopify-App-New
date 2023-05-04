import React, { useEffect, useState } from "react";
import {
  styled,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Button,
  TextField,
  Snackbar,
  IconButton,
  Box,
  CircularProgress,
  useThemeProps,
} from "@mui/material";
import { getAppStatus } from "../../API/api";
import { ChromePicker } from "react-color";

import CloseIcon from "@mui/icons-material/Close";
import axios from "axios";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

export default function OtherSetting() {
  const StyledTable = styled(Table)`
    width: 100%;
    margin: 20px auto 0 auto;
  `;

  const THead = styled(TableRow)`
    background: #fff;
    & > th {
      color: #000000;
      font-size: 16px;
      font-weight: bold;
    }
  `;

  const TBody = styled(TableRow)`
    & > td {
      font-size: 15px;
    }
  `;

  const formatDate = (dateString) => {
    const options =
      ("en-US",
      {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        hour12: true,
        minute: "2-digit",
        // second: "2-digit",
      });
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  const [loader, setLoader] = useState(false);

  const [input, setInput] = useState({
    forcefullyUpdate: "compulsory",
    androidVersion: "",
    iosVersion: "",
    createdAt: "",
    locationRadius: 0,
    _id: "",

    contain: "",
    font_size: 0,
    font_color: "#000000",

    containMore: "",
    font_sizeMore: 0,
    font_colorMore: "#000000",
  });

  const inputEvent = (e) => {
    const { name, value } = e.target;
    console.log("name, value ", name, value);
    setInput((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
  };
  const [colors, setColors] = useState({
    hex: "",
  });
  const [colors2, setColors2] = useState({
    hex: "",
  });
  console.log("inpigtyftc", input);
  function hexToColorObject(hex) {
    // Convert hex to RGB
    const r = parseInt(hex.slice(1, 3), 16) / 255;
    const g = parseInt(hex.slice(3, 5), 16) / 255;
    const b = parseInt(hex.slice(5, 7), 16) / 255;

    // Find the minimum and maximum values of R, G, B
    const min = Math.min(r, g, b);
    const max = Math.max(r, g, b);

    // Calculate the luminosity
    const l = (min + max) / 2;

    if (min === max) {
      // The color is a shade of gray
      return {
        hsl: { hue: 0, saturation: 0, lightness: Math.round(l * 100) },
        rgb: {
          red: Math.round(r * 255),
          green: Math.round(g * 255),
          blue: Math.round(b * 255),
        },
        hsv: { hue: 0, saturation: 0, value: Math.round(max * 100) },
        hex: hex,
        source: "rgb",
      };
    }

    // Calculate the hue
    let h;
    if (max === r) {
      h = ((g - b) / (max - min) + 6) % 6;
    } else if (max === g) {
      h = (b - r) / (max - min) + 2;
    } else {
      h = (r - g) / (max - min) + 4;
    }
    h = Math.round(h * 60);

    // Calculate the saturation
    const s = Math.round(((max - min) / (1 - Math.abs(2 * l - 1))) * 100);

    // Calculate the value
    const v = Math.round(max * 100);

    return {
      // hsl: { hue: h, saturation: s, lightness: Math.round(l * 100) },
      rgb: {
        red: Math.round(r * 255),
        green: Math.round(g * 255),
        blue: Math.round(b * 255),
      },
      // hsv: { hue: h, saturation: s, value: v },
      hex: hex,
      // source: "rgb"
    };
  }

  const hexColor = "#703434";
  const colorObject = hexToColorObject(hexColor);
  console.log(colorObject); // { hsl: { hue: 0, saturation: 40, lightness: 30 }, rgb: { red: 112, green: 52, blue: 52 }, hsv: { hue: 0, saturation: 54, value: 44 }, hex: '#703434', source: 'rgb' }

  const getStatusData = async () => {
    setLoader(true);
    try {
      const res = await getAppStatus();
      console.log("res", res.data.app[0]);
      setInput({
        _id: res.data.app[0]._id,
        forcefullyUpdate: res.data.app[0].forcefullyUpdate,
        androidVersion: res.data.app[0].androidVersion,
        iosVersion: res.data.app[0].iosVersion,
        createdAt: res.data.app[0].createdAt,
        locationRadius: res?.data?.app[0]?.location_radius,
        contain: res?.data?.app[0]?.location_with_no_selection?.contain,
        font_size: res?.data?.app[0]?.location_with_no_selection?.font_size,
        font_color: res?.data?.app[0]?.location_with_no_selection?.font_color,

        containMore:
          res?.data?.app[0]?.location_with_no_more_selected_result?.contain,
        font_sizeMore:
          res?.data?.app[0]?.location_with_no_more_selected_result?.font_size,
        font_colorMore:
          res?.data?.app[0]?.location_with_no_more_selected_result?.font_color,
      });
      // setColors(res?.data?.app[0]?.location_with_no_selection?.font_color)
      // console.log("iiiiiii",input.font_color)
      // let temp = { ...colors };
      // temp.hax = input.font_color;
      // setColors(temp);

      // let temp2 = { ...colors2 };
      // temp.hax = input.font_colorMore;
      // setColors2(temp2);

      // console.log("ooooo", colors, colors2);

      setLoader(false);
    } catch (error) {
      setLoader(false);
      console.log("error", error);
    }
  };
  const [updateRes, setUpdateRes] = useState();
  useEffect(() => {
    getStatusData();
  }, [updateRes]);

  const [open, setOpen] = useState(false);
  const [snackMsg, setSnackMsg] = useState({
    message: "",
    msgColor: "",
  });
  const handleClick = () => {
    setOpen(true);
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  const action = (
    <div>
      <IconButton
        size="small"
        aria-label="close"
        color="inherit"
        onClick={handleClose}
      >
        <CloseIcon fontSize="small" />
      </IconButton>
    </div>
  );

  const updateLocationRadius = async (id, location_radius) => {
    let data = {
      id: id,
      location_radius: Number(location_radius),
    };
    console.log("data", data);
    try {
      const res = await axios.put(`/api/v1/updateappstatus`, data);
      console.log("updateappstatus - res", res);
      setUpdateRes(res);
      setSnackMsg({
        ...snackMsg,
        message: "Save successfully",
        msgColor: "green",
      });
      handleClick();
      return res;
    } catch (error) {
      console.log("error", error);
      setSnackMsg({
        ...snackMsg,
        message: "Something went wrong !!",
        msgColor: "red",
      });
      handleClick();
    }
  };

  const updateWithNoSelection = async (id, contain, fontSize, fontColor) => {
    console.log("00000", id, contain, fontSize, fontColor);
    let location_with_no_selection = {
      id: id,
      contain: contain,
      font_size: Number(fontSize),
      font_color: fontColor,
    };
    console.log("data", location_with_no_selection);

    try {
      const res = await axios.put(
        `/api/v1/updateappstatus`,
        location_with_no_selection
      );
      console.log("updateappstatus - res", res);
      setUpdateRes(res);
      setSnackMsg({
        ...snackMsg,
        message: "Save successfully",
        msgColor: "green",
      });
      handleClick();
      return res;
    } catch (error) {
      console.log("error", error);
      setSnackMsg({
        ...snackMsg,
        message: "Something went wrong !!",
        msgColor: "red",
      });
      handleClick();
    }
  };

  const updateWithNoSelectionMore = async (
    id,
    contain,
    fontSize,
    fontColor
  ) => {
    console.log("00000", id, contain, fontSize, fontColor);
    let location_with_no_more_selected_result = {
      id: id,
      contain_more: contain,
      font_size_more: Number(fontSize),
      font_color_more: fontColor,
    };
    console.log("data", location_with_no_more_selected_result);
    try {
      const res = await axios.put(
        `/api/v1/updateappstatus`,
        location_with_no_more_selected_result
      );
      console.log("updateappstatus - res", res);
      setUpdateRes(res);
      setSnackMsg({
        ...snackMsg,
        message: "Save successfully",
        msgColor: "green",
      });
      handleClick();
      return res;
    } catch (error) {
      console.log("error", error);
      setSnackMsg({
        ...snackMsg,
        message: "Something went wrong !!",
        msgColor: "red",
      });
      handleClick();
    }
  };
  // for color picker
  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
  };

  const colorPicker = (e) => {
    // let temp = { ...input };
    // temp.font_color = "";
    // setInput(temp);
    // console.log("input", input);

    const newColor = {
      hex: e.hex,
      rgb: "(" + e.rgb.r + "," + e.rgb.g + "," + e.rgb.b + "," + e.rgb.a + ")",
    };
    console.log("ee", e, newColor);
    // setColors(newColor);
    let temp = { ...input };
    temp.font_color = newColor.hex;
    setInput(temp);
  };
  const [colorPickerOpen, setOpenColorPicker] = useState(false);
  const handleOpenColorPicker = () => setOpenColorPicker(true);
  const handleCloseColorPicker = () => setOpenColorPicker(false);

  // 2nd
  const colorPicker2 = (e) => {
    // let temp = { ...input };

    // temp.font_colorMore = "";
    // setInput(temp);
    const newColor = {
      hex: e.hex,
      rgb: "(" + e.rgb.r + "," + e.rgb.g + "," + e.rgb.b + "," + e.rgb.a + ")",
    };
    // setColors2(newColor);
    let temp = { ...input };
    temp.font_colorMore = newColor.hex;
    setInput(temp);
  };
  const [colorPickerOpen2, setOpenColorPicker2] = useState(false);
  const handleOpenColorPicker2 = () => setOpenColorPicker2(true);
  const handleCloseColorPicker2 = () => setOpenColorPicker2(false);

  return (
    <div>
      <br />
      <br />
      {loader ? (
        <div
          style={{
            height: "75vh",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Box sx={{ textAlign: "center" }}>
            <CircularProgress />
          </Box>
        </div>
      ) : (
        <>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <p className="p_width">
              <p>
                <b>Radius Search</b>
              </p>
              <TextField
                InputProps={{ sx: { height: "50px" } }}
                name="locationRadius"
                id="outlined-basic1"
                variant="outlined"
                value={input?.locationRadius}
                onChange={inputEvent}
                required
              />
            </p>
            <Button
              variant="contained"
              color="primary"
              sx={{
                width: "150px",
                height: "50px",
                backgroundColor: "#273746",
                "&:hover": {
                  backgroundColor: "#273746",
                  boxShadow: "none",
                },
              }}
              onClick={async () => {
                console.log("input?.locationRadius", input?.locationRadius);
                if (
                  input?.locationRadius === "" ||
                  input?.locationRadius === 0
                ) {
                  setSnackMsg({
                    ...snackMsg,
                    message: "Please enter Radius number",
                    msgColor: "red",
                  });

                  handleClick();
                } else if (
                  Math.sign(input?.locationRadius) === 1 &&
                  Number.isInteger(parseFloat(input?.locationRadius))
                ) {
                  console.log("done");
                  updateLocationRadius(input?._id, input?.locationRadius);
                } else {
                  setSnackMsg({
                    ...snackMsg,
                    message: "Please enter positive number",
                    msgColor: "red",
                  });

                  handleClick();
                }
              }}
            >
              Save
            </Button>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              width: "100%",
            }}
          >
            <p className="p_width" style={{ width: "50%" }}>
              <p>
                <b>With no data</b>
              </p>
              <div style={{ width: "100%" }}>
                <TextField
                  InputProps={{ sx: { height: "50px", width: "100%" } }}
                  name="contain"
                  id="outlined-basic"
                  variant="outlined"
                  value={input?.contain}
                  onChange={inputEvent}
                  required
                />
              </div>
            </p>
            <div
              style={{
                width: "300px",
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <TextField
                InputProps={{ sx: { height: "50px", width: "70px" } }}
                name="font_size"
                type="number"
                id="outlined-basic"
                variant="outlined"
                value={input?.font_size}
                onChange={inputEvent}
                required
              />
              <Button
                variant="contained"
                color="primary"
                sx={{
                  width: "50px",
                  height: "50px",
                  backgroundColor: input.font_color,
                  "&:hover": {
                    backgroundColor: input.font_color,
                    boxShadow: "none",
                  },
                }}
                onClick={handleOpenColorPicker}
              ></Button>
              <Button
                variant="contained"
                color="primary"
                sx={{
                  width: "150px",
                  height: "50px",
                  backgroundColor: "#273746",
                  "&:hover": {
                    backgroundColor: "#273746",
                    boxShadow: "none",
                  },
                }}
                onClick={async () => {
                  console.log("input?.font_size", input?.font_size);

                  if (input?.font_size === "" || input?.font_size === 0) {
                    setSnackMsg({
                      ...snackMsg,
                      message: "Please enter only number values",
                      msgColor: "red",
                    });

                    handleClick();
                  } else if (
                    Math.sign(input?.font_size) === 1 &&
                    Number.isInteger(parseFloat(input?.font_size))
                  ) {
                    console.log("done");
                    updateWithNoSelection(
                      input?._id,
                      input?.contain,
                      input?.font_size,
                      input?.font_color
                    );
                  } else {
                    setSnackMsg({
                      ...snackMsg,
                      message: "Please enter only number values",
                      msgColor: "red",
                    });

                    handleClick();
                  }
                }}
              >
                Save
              </Button>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <p className="p_width">
              <p>
                <b>With data finish</b>
              </p>

              <TextField
                InputProps={{ sx: { height: "50px" } }}
                name="containMore"
                id="outlined-basic"
                variant="outlined"
                value={input?.containMore}
                onChange={inputEvent}
                required
              />
            </p>
            <div
              style={{
                width: "300px",
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <TextField
                InputProps={{ sx: { height: "50px", width: "70px" } }}
                name="font_sizeMore"
                type="number"
                id="outlined-basic"
                variant="outlined"
                value={input?.font_sizeMore}
                onChange={inputEvent}
                required
              />
              {console.log("&&&&&", input)}
              <Button
                variant="contained"
                color="primary"
                sx={{
                  width: "50px",
                  height: "50px",
                  backgroundColor: input.font_colorMore,
                  "&:hover": {
                    backgroundColor: input.font_colorMore
                     ,
                    boxShadow: "none",
                  },
                }}
                onClick={handleOpenColorPicker2}
              ></Button>
              <Button
                variant="contained"
                color="primary"
                sx={{
                  width: "150px",
                  height: "50px",
                  backgroundColor: "#273746",
                  "&:hover": {
                    backgroundColor: "#273746",
                    boxShadow: "none",
                  },
                }}
                onClick={async () => {
                  if (
                    input?.font_sizeMore === "" ||
                    input?.font_sizeMore === 0
                  ) {
                    setSnackMsg({
                      ...snackMsg,
                      message: "Please enter only number values",
                      msgColor: "red",
                    });

                    handleClick();
                  } else if (
                    Math.sign(input?.font_sizeMore) === 1 &&
                    Number.isInteger(parseFloat(input?.font_sizeMore))
                  ) {
                    console.log("done");
                    updateWithNoSelectionMore(
                      input?._id,
                      input?.containMore,
                      input?.font_sizeMore,
                      input?.font_colorMore
                    );
                  } else {
                    setSnackMsg({
                      ...snackMsg,
                      message: "Please enter only number values",
                      msgColor: "red",
                    });

                    handleClick();
                  }
                }}
              >
                Save
              </Button>
            </div>
          </div>
        </>
      )}
      {/* color picker  */}

      <Dialog open={colorPickerOpen} onClose={handleCloseColorPicker}>
        <DialogTitle>Choose Color </DialogTitle>
        <DialogContent>
          <div style={{ width: "50%", float: "left" }}>
            <ChromePicker
              color={input.font_color !== null && input.font_color}
              onChange={(e) => {
                console.log("eeee", e);
                colorPicker(e);
              }}
              disableAlpha
              renderers={false}
            />
          </div>
        </DialogContent>
        {/* <DialogActions>
          <Button onClick={handleCloseColorPicker}>Cancel</Button>
          <Button onClick={handleCloseColorPicker}>Apply</Button>
        </DialogActions> */}
      </Dialog>
      {/* 2nd */}
      <Dialog open={colorPickerOpen2} onClose={handleCloseColorPicker2}>
        <DialogTitle>Choose Color </DialogTitle>
        <DialogContent>
          <div style={{ width: "50%", float: "left" }}>
            <ChromePicker
              color={input.font_colorMore !== null && input.font_colorMore}
              onChange={(e) => colorPicker2(e)}
              disableAlpha
              renderers={false}
            />
          </div>
        </DialogContent>
        {/* <DialogActions>
          <Button onClick={handleCloseColorPicker}>Cancel</Button>
          <Button onClick={handleCloseColorPicker}>Apply</Button>
        </DialogActions> */}
      </Dialog>
      <Snackbar
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        open={open}
        autoHideDuration={6000}
        onClose={handleClose}
        ContentProps={{
          sx: {
            background: `${snackMsg.msgColor}`,
          },
        }}
        message={snackMsg.message}
        action={action}
      />
    </div>
  );
}
