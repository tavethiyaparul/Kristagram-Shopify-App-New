import React, { useEffect, useState } from "react";
import {
  styled,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Snackbar,
  IconButton,
  DialogActions,
  CircularProgress,
} from "@mui/material";
import { Link } from "react-router-dom";
import axios from "axios";
import Delete from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { Box, Stack } from "@mui/system";
import CloseIcon from "@mui/icons-material/Close";

export default function User() {
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

  const [data, setData] = useState();
  const [loader, setLoader] = useState(false);
  const [delData, setDelData] = useState();
  // snackbar state's
  const [snackMsg, setSnackMsg] = useState("");
  const [open, setOpen] = useState(false);
  const handleClick = () => {
    setOpen(true);
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  const createUserAPI = async (email, user_access) => {
    try {
      const data = {
        email: email.toLowerCase(),
        user_access: user_access,
      };
      const res = await axios.post(`/api/v1/createuser`, data);
      console.log("&&&", res);
      setSnackMsg("save successfully");
    } catch (error) {
      console.log("error", error);
      setSnackMsg("Email already exist");
    }
  };

  const getUserAPI = async () => {
    try {
      setLoader(true);
      const res = await axios.get(`/api/v1/getuser`);
      console.log("....", res);
      setData(res?.data?.WebAdminUser);
      setLoader(false);
    } catch (error) {
      setLoader(false);
      console.log("error", error);
    }
  };

  const updateUserAPI = async (user) => {
    const res = await axios.put(`/api/v1/updateuser`, user);
    console.log("&&&update", res);
    return setSnackMsg("save successfully");
    // return res;
  };

  const deleteUserAPI = async (id) => {
    const res = await axios.delete(`/api/v1/deletewebuser/${id}`);
    console.log("&&&", res);
    setDelData(res);
    return setSnackMsg("Delete successfully");
  };

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

  // textfield value
  const [textFieldValue, setTextFieldValue] = useState({
    email: "",
    id: "",
  });

  // create dialog state's
  const [createOpen, setCreateOpen] = useState(false);

  const handleClickOpenCreate = () => {
    setCreateOpen(true);
  };

  const handleCloseCreate = (value) => {
    textFieldValue.email = "";
    setCreateOpen(false);
  };

  const capitalizeFirst = (s) => {
    if (typeof s !== "string") return "";
    return s.charAt(0).toUpperCase() + s.slice(1);
  };

  // textfield input event
  const inputEvent = (e) => {
    const { name, value } = e.target;
    setTextFieldValue((prev) => {
      return {
        ...prev,
        [name]: value.toLowerCase(),
      };
    });
  };

  // delete dialog state's
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [delId, setDelId] = useState();
  //delete dialog open
  const handleClickOpenDialog = () => {
    setDeleteDialog(true);
  };
  // delete dialog close
  const handleCloseDialog = () => {
    setDeleteDialog(false);
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
  useEffect(() => {
    getUserAPI();
  }, [delData]);
  return (
    <>
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
        <div>
          <div style={{ paddingTop: "20px" }}>
            <Button
              variant="outlined"
              style={{
                background: "#273746",
                color: "white",
                borderColor: "white",
              }}
              onClick={async () => {
                handleClickOpenCreate();
              }}
            >
              Create User
            </Button>
          </div>
          <StyledTable>
            <TableHead>
              <THead>
                <TableCell>Email</TableCell>
                <TableCell>Created At</TableCell>
                <TableCell>Action</TableCell>
              </THead>
            </TableHead>

            <TableBody>
              {data?.map((user) => (
                <TBody key={user._id}>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{formatDate(user.createdAt)}</TableCell>
                  <TableCell>
                    <Button
                      className="edithover"
                      startIcon={
                        <EditIcon style={{ color: "primary", fontSize: 30 }} />
                      }
                      onClick={async () => {
                        const temp = { ...textFieldValue };
                        temp.email = user.email;
                        temp.id = user._id;
                        setTextFieldValue(temp);
                        handleClickOpenCreate();
                      }}
                    ></Button>
                    <Button
                      className="edithover"
                      startIcon={
                        <Delete style={{ color: "red", fontSize: 30 }} />
                      }
                      onClick={async () => {
                        setDelId(user._id);
                        handleClickOpenDialog();
                      }}
                    ></Button>
                  </TableCell>
                </TBody>
              ))}
            </TableBody>
          </StyledTable>
          {/* create user dialog */}
          <Dialog
            open={createOpen}
            onClose={handleCloseCreate}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
            fullWidth={true}
            maxWidth={"xs"}
          >
            <DialogTitle id="alert-dialog-title">
              {"Request to user email"}
            </DialogTitle>
            <DialogContent>
              <div>
                <br />
                <TextField
                  inputProps={{ style: { fontSize: 15 } }} // font size of input text
                  id="fullWidth"
                  size="small"
                  name="email"
                  variant="outlined"
                  label="Enter Email"
                  value={textFieldValue.email}
                  onChange={inputEvent}
                  fullWidth
                />
                <br />
                <br />

                <div style={{ textAlign: "center" }}>
                  <Stack spacing={2} direction="row" style={{ width: "100%" }}>
                    <Button
                      variant="contained"
                      color="primary"
                      sx={{
                        backgroundColor: "#273746",
                        width: "50%",
                        "&:hover": {
                          backgroundColor: "#273746",
                          boxShadow: "none",
                        },
                      }}
                      onClick={async () => {
                        handleCloseCreate();
                        setTextFieldValue({});
                      }}
                    >
                      Cancel
                    </Button>{" "}
                    <Button
                      variant="contained"
                      color="primary"
                      sx={{
                        width: "50%",
                        backgroundColor: "#ff6600",
                        "&:hover": {
                          backgroundColor: "#ff6600",
                          boxShadow: "none",
                        },
                      }}
                      onClick={async () => {
                        if (textFieldValue.email == "") {
                          setSnackMsg("Enter User Email");
                          handleClick();
                        } else if (textFieldValue.email != "") {
                          textFieldValue.id
                            ? await updateUserAPI(textFieldValue)
                            : await createUserAPI(
                                textFieldValue.email.toLowerCase()
                              );

                          handleClick();
                          handleCloseCreate();
                        } else {
                          setSnackMsg("Enter valid value");
                          handleClick();
                          handleCloseCreate();
                        }
                        getUserAPI();
                        setTextFieldValue({});
                      }}
                    >
                      Save
                    </Button>
                  </Stack>
                </div>
              </div>
            </DialogContent>
          </Dialog>
          {/* delete dialog */}
          <Dialog
            open={deleteDialog}
            onClose={handleCloseDialog}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">
              {"Are you sure you went to remove this user?"}
            </DialogTitle>

            <DialogActions>
              <Button
                variant="contained"
                color="primary"
                sx={{
                  backgroundColor: "#273746",
                  "&:hover": {
                    backgroundColor: "#273746",
                    boxShadow: "none",
                  },
                }}
                onClick={() => {
                  handleCloseDialog();
                }}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                color="primary"
                sx={{
                  backgroundColor: "red",
                  "&:hover": {
                    backgroundColor: "red",
                    boxShadow: "none",
                  },
                }}
                onClick={() => {
                  deleteUserAPI(delId);
                  handleCloseDialog();
                }}
                autoFocus
              >
                Remove
              </Button>
            </DialogActions>
          </Dialog>
          <Snackbar
            anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
            open={open}
            autoHideDuration={6000}
            onClose={handleClose}
            message={snackMsg}
            action={action}
          />
        </div>
      )}
    </>
  );
}
