import { React, useCallback, useEffect, useState } from "react";
import Box from "@mui/material/Box";
import { DataGrid, gridClasses } from "@mui/x-data-grid";
import { getAppLocation, updateLocation } from "../../../API/api";
import { Stack } from "@mui/system";
import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Snackbar,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import axios from "axios";
import CloseIcon from "@mui/icons-material/Close";
import Delete from "@mui/icons-material/Delete";

const WishListCategory = () => {
  const [loader, setLoader] = useState(false);
  // switch value
  const [checked, setChecked] = useState(false);
  const [checkedId, setCheckedId] = useState("");

  useEffect(() => {}, [checked, checkedId]);

  const handleChange = (event, id) => {
    if (checkedId == id) {
      setChecked(event.target.checked);
    }
  };

  // state
  const [getCategoryVal, setGetCategoryVal] = useState();

  const createCategoryAPI = async (content, status) => {
    const data = {
      content: content,
      status: status,
    };
    const res = await axios.post(`/api/v1/createcategory`, data);
    console.log("&&&", res);
    return res;
  };
  const getCategoryAPI = async () => {
    setLoader(true);
    const res = await axios.get(`/api/v1/getcategory`);
    console.log("&&&", res?.data?.wishlist);
    setGetCategoryVal(res?.data?.wishlist);
    setLoader(false);
    return res;
  };

  const updateCategoryAPI = async (user) => {
    const res = await axios.put(`/api/v1/updatecategory`, user);
    console.log("&&&update", res);
    return res;
  };
  const deleteCategoryAPI = async (id) => {
    const res = await axios.delete(`/api/v1/deletecategory/${id}`);
    console.log("&&&", res);
    return res;
  };
  const [deleteId, setDeleteId] = useState("");
  const [deleteRes, setDeleteRes] = useState();
  useEffect(() => {
    getCategoryAPI();
  }, [deleteRes]);

  // delete dialog open close
  const [deleteDialog, setDeleteDialog] = useState(false);

  //delete dialog open
  const handleClickOpenDialog = () => {
    setDeleteDialog(true);
  };

  // delete dialog close
  const handleCloseDialog = () => {
    setDeleteDialog(false);
  };

  const columns = [
    {
      align: "left",
      sortable: false,
      // editable: true,
      field: "content",
      headerName: "Message",
      width: 50,
      minWidth: 50,
      flex: 1,
      renderCell: (params) => {
        return (
          <Stack>
            <span>
              {params.row.content ? capitalizeFirst(params.row.content) : "-"}
            </span>
          </Stack>
        );
      },
    },
    {
      align: "left",
      sortable: false,
      field: "Status",
      headerName: "Status",
      width: 50,
      minWidth: 50,
      flex: 1,
      renderCell: (params) => {
        return (
          <Stack>
            <Switch
              checked={params.row.id == checkedId ? checked : params.row.status}
              onChange={async (e) => {
                setCheckedId(params.row.id);
                handleChange(e, params.row.id);
                let data = {
                  id: params.row.id,
                  status: e.target.checked,
                };
                const response = await updateCategoryAPI(data);
              }}
            />
            {/* <span>{params.row.Status ? params.row.Status : "-"}</span> */}
          </Stack>
        );
      },
    },
    {
      align: "left",
      sortable: false,
      field: "createdAt",
      headerName: "Created At",
      width: 50,
      minWidth: 50,
      flex: 1,
      renderCell: (params) => {
        return (
          <Stack>
            {params.row.createdAt.split(",")[0]}
            {" , "}
            <br /> {params.row.createdAt.split(",")[1]}
          </Stack>
        );
      },
    },
    {
      align: "left",
      sortable: false,
      field: "updatedAt",
      headerName: "Updated At",
      width: 50,
      minWidth: 50,
      flex: 1,
      renderCell: (params) => {
        return (
          <Stack>
            {params.row.updatedAt.split(",")[0]}
            {" , "}
            <br /> {params.row.updatedAt.split(",")[1]}
          </Stack>
        );
      },
    },
    {
      align: "left",
      sortable: false,
      field: "action",
      headerName: "Action",
      minWidth: 100,
      width: 100,
      flex: 1,
      renderCell: (params) => {
        return (
          <div>
            <Button
              className="edithover"
              startIcon={<Delete style={{ color: "red", fontSize: 30 }} />}
              onClick={async () => {
                console.log("params.row.id", params.row.id);
                setDeleteId(params.row.id);
                handleClickOpenDialog();
              }}
            ></Button>
          </div>
        );
      },
    },
  ];
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
  const rows = [];
  getCategoryVal?.map((item) => {
    return rows.push({
      id: item?._id,
      status: item?.status,
      content: item?.content,
      createdAt: formatDate(item?.createdAt),
      updatedAt: formatDate(item?.updatedAt),
    });
  });

  const useFakeMutation = () => {
    return useCallback(
      (user) =>
        new Promise((resolve, reject) =>
          setTimeout(async () => {
            console.log("....user", user);
            const response = await updateCategoryAPI(user);
            if (user.name?.trim() === "") {
              reject(
                new Error("Error while saving user: name can't be empty.")
              );
            } else {
              resolve({ ...user, name: user.name?.toUpperCase() });
            }
          }, 200)
        ),
      []
    );
  };

  const mutateRow = useFakeMutation();

  const processRowUpdate = useCallback(
    async (newRow) => {
      const response = await mutateRow(newRow);
      return response;
    },
    [mutateRow]
  );

  // textfield value
  const [textFieldValue, setTextFieldValue] = useState({
    message: "",
    status: true,
  });
  const capitalizeFirst = (s) => {
    if (typeof s !== "string") return "";
    return s.charAt(0).toUpperCase() + s.slice(1);
  };
  // textfield input event
  const inputEvent = (e) => {
    // console.log("ee", e.target.name);
    const { name, value } = e.target;

    setTextFieldValue((prev) => {
      return {
        ...prev,
        [name]: capitalizeFirst(value),
      };
    });
  };

  // set snack msg
  const [snackMsg, setSnackMsg] = useState("");
  // snackbar open close
  const [open, setOpen] = useState(false);
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
  const handleClick = () => {
    setOpen(true);
  };
  // save span dialog
  const [createopen, setCreateOpen] = useState(false);

  // save span open dialog
  const handleClickOpenCreate = () => {
    setCreateOpen(true);
  };
  // close save span dialog
  const handleCloseCreate = (value) => {
    textFieldValue.message = "";
    textFieldValue.status = true;
    setCreateOpen(false);
  };

  return (
    <div style={{ padding: "10px" }}>
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
          <div>
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
              Add Category
            </Button>
            <br />
            <br />
            <Box sx={{ height: 700, width: "100%" }}>
              <DataGrid
                sx={{
                  [`& .${gridClasses.cell}:focus, & .${gridClasses.cell}:focus-within`]:
                    {
                      outline: "none !important",
                    },
                  [`& .${gridClasses.columnHeader}:focus, & .${gridClasses.columnHeader}:focus-within`]:
                    {
                      outline: "none !important",
                    },
                }}
                rowHeight={60}
                rows={rows}
                columns={columns}
                pageSize={10}
                rowsPerPageOptions={[10]}
                experimentalFeatures={{ newEditingApi: true }}
                hideFooterSelectedRowCount={true}
                processRowUpdate={processRowUpdate}
                disableColumnMenu={true}
              />
            </Box>
          </div>
          {/* create msg dialog */}
          <Dialog
            open={createopen}
            onClose={handleCloseCreate}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
            fullWidth
            maxWidth={"sm"}
          >
            <DialogTitle id="alert-dialog-title">
              {"Request To Message"}
            </DialogTitle>
            <DialogContent>
              <div>
                <br />
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  inputProps={{ style: { fontSize: 15 } }} // font size of input text
                  id="outlined-basic"
                  name="message"
                  variant="outlined"
                  label="Message"
                  autoComplete="off"
                  value={textFieldValue.message}
                  onChange={inputEvent}
                />
                <br />
                <br />
                <Stack direction="row" spacing={1} alignItems="center">
                  <Typography>Status : </Typography>
                  <Switch
                    name="status"
                    checked={textFieldValue.status}
                    onChange={(event) => {
                      const temp = { ...textFieldValue };
                      temp.status = event.target.checked;
                      setTextFieldValue(temp);
                      console.log("{}{}{}{", textFieldValue);
                    }}
                  />
                </Stack>
                {/* <FormGroup >
                  <FormControlLabel 
                    control={
                      <Switch
                        name="status"
                        checked={textFieldValue.status}
                        onChange={(event) => {
                          const temp = { ...textFieldValue };
                          temp.status = event.target.checked;
                          setTextFieldValue(temp);
                          console.log("{}{}{}{", textFieldValue);
                        }}
                      />
                    }
                    label="Status"
                    
                    labelPlacement="start"
                  />
                </FormGroup> */}
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
                      }}
                    >
                      Cancel
                    </Button>
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
                        console.log("values", textFieldValue);
                        if (textFieldValue.message == "") {
                          console.log("*********");
                          setSnackMsg("Enter Message");
                          handleClick();
                        } else {
                          const val = await createCategoryAPI(
                            textFieldValue.message,
                            textFieldValue.status
                          );
                          console.log("++++++", val);

                          console.log("val", val);
                          if (val.data.success) {
                            setSnackMsg("save successfully");
                            handleClick();
                            handleCloseCreate();
                          } else {
                            setSnackMsg("Enter valid value");
                            handleClick();
                            handleCloseCreate();
                          }
                          getCategoryAPI();
                        }
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
              {"Are you sure you went to remove category?"}
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
                  const res = deleteCategoryAPI(deleteId);
                  setDeleteRes(res);
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
    </div>
  );
};

export default WishListCategory;
