import { React, useEffect, useState } from "react";
import PersistentDrawer from "../../components/persistentDrawer";
import { useNavigate } from "react-router-dom";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { createAppStatus, getAppStatus } from "../../API/api.js";
import Snackbar from "@mui/material/Snackbar";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { Box, CircularProgress } from "@mui/material";

const AppStatus = () => {
  const navigate = useNavigate();

  useEffect(() => {
    getStatusData();
    // console.log("document.cookie", document.cookie);
    if (!document.cookie) {
      navigate("/");
    }
  }, [document.cookie]);

  const [input, setInput] = useState({
    forcefullyUpdate: "compulsory",
    androidVersion: "",
    iosVersion: "",
  });

  const [statusSuccess, setStatusSuccess] = useState();
  // console.log("input value", input);
  const [open, setOpen] = useState(false);
  const [snackMsg, setSnackMsg] = useState("sucesss");
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

  const inputEvent = (e) => {
    const { name, value } = e.target;

    setInput((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
  };

  const getStatusData = async () => {
    const res = await getAppStatus();
    setInput({
      forcefullyUpdate: res?.data?.app[0]?.forcefullyUpdate,
      androidVersion: res?.data?.app[0]?.androidVersion,
      iosVersion: res?.data?.app[0]?.iosVersion,
    });
    setStatusSuccess(res.data.success);
    // console.log("status get res", res.data.app[0]);
  };

  return (
    <div style={{ padding: "10px" }}>
      {/* <PersistentDrawer /> */}
      {statusSuccess ? (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <TableHead>
            <TableRow>
              <TableCell align="center" colSpan={2} sx={{ border: "none" }}>
                <h1>App Status</h1>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell sx={{ border: "none" }}>
                <h3>Forcefully Update : </h3>
              </TableCell>
              <TableCell sx={{ border: "none" }}>
                <Select
                  sx={{ width: "100%", height: "50px" }}
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  name="forcefullyUpdate"
                  value={input.forcefullyUpdate}
                  onChange={inputEvent}
                >
                  <MenuItem value={"compulsory"} name={"compulsory"}>
                    Compulsory
                  </MenuItem>
                  <MenuItem value={"min_app_version"} name={"min app version"}>
                    Min App Version
                  </MenuItem>
                  <MenuItem value={"not_specify"} name={"not soecify"}>
                    Not Specify
                  </MenuItem>
                </Select>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell sx={{ border: "none" }}>
                <h3>Android Version : </h3>
              </TableCell>
              <TableCell sx={{ border: "none" }}>
                <TextField
                  InputProps={{ sx: { height: "50px" } }}
                  id="outlined-basic"
                  name="androidVersion"
                  variant="outlined"
                  value={input.androidVersion}
                  onChange={inputEvent}
                  required
                  error={input?.androidVersion?.length === 0}
                  helperText={
                    input?.androidVersion?.length === 0
                      ? "Android Version is required"
                      : ""
                  }
                  // inputProps={{ style: { fontSize: 15 } }}
                />
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell sx={{ border: "none" }}>
                <h3>IOS Version : </h3>
              </TableCell>
              <TableCell sx={{ border: "none" }}>
                <TextField
                  InputProps={{ sx: { height: "50px" } }}
                  id="outlined-basic"
                  name="iosVersion"
                  variant="outlined"
                  value={input.iosVersion}
                  onChange={inputEvent}
                  required
                  error={input?.iosVersion?.length === 0}
                  helperText={
                    input?.iosVersion?.length === 0
                      ? "IOS Version is required"
                      : ""
                  }
                  // inputProps={{ style: { fontSize: 15 } }}
                />
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell align="center" colSpan={2} sx={{ border: "none" }}>
                <Button
                  variant="contained"
                  color="primary"
                  sx={{
                    width: "100%",
                    height: "50px",
                    backgroundColor: "#273746",
                    "&:hover": {
                      backgroundColor: "#273746",
                      boxShadow: "none",
                    },
                  }}
                  onClick={async () => {
                    if (input.androidVersion != "" && input.iosVersion != "") {
                      const val = await createAppStatus(input);
                      // console.log("valii", val);
                      if (val.data.success) {
                        setSnackMsg("save successfully");
                        handleClick();
                      }
                    } else {
                      setSnackMsg("Enter valid value");
                      handleClick();
                    }
                  }}
                >
                  Save
                </Button>
              </TableCell>
            </TableRow>
          </TableHead>
        </div>
      ) : (
        <div
          // className="dhr"
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
      )}
      <Snackbar
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        open={open}
        autoHideDuration={6000}
        onClose={handleClose}
        message={snackMsg}
        action={action}
      />
    </div>
  );
};

export default AppStatus;
