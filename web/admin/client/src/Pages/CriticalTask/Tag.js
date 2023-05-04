import { React, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  MenuItem,
  Select,
  Snackbar,
  Stack,
  TextField,
} from "@mui/material";
import Box from "@mui/material/Box";
import { DataGrid, gridClasses } from "@mui/x-data-grid";
import Delete from "@mui/icons-material/Delete";
import CloseIcon from "@mui/icons-material/Close";
import {
  getAllTagApi,
  createTagAPI,
  tagStatusEditAPI,
  deleteTag,
  getUserDetailsAdmin,
} from "../../API/api";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import FormControl from "@mui/material/FormControl";

const Tag = () => {
  const navigate = useNavigate();

  // tag pagination
  const [pageState, setPageState] = useState({
    isLoading: false,
    total: 0,
    page: 1,
    pageSize: 10,
  });

  // delete tag api call
  const deleteData = async (id) => {
    await deleteTag(id);
  };

  // flag value for show contain only critical admin details
  const [adminFlagVal, setAdminFlag] = useState("");
  // delete dialog open close
  const [deleteDialog, setDeleteDialog] = useState(false);
  // snackbar open close
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

  //delete dialog open
  const handleClickOpenDialog = () => {
    setDeleteDialog(true);
  };
  // delete dialog close
  const handleCloseDialog = () => {
    setDeleteDialog(false);
  };

  // get admin data api
  const userAdminData = async () => {
    const responce = await getUserDetailsAdmin();
    setAdminFlag(responce.data.users.flag);
  };

  // edit aprove,pending,suspend user from critical admin
  const [userStatus, setUserStatus] = useState();

  // status [approve,panding,suspend] refresh karavva mate
  const [statusRef, setStatusRef] = useState("");

  useEffect(() => {
    userAdminData();
    // console.log("document.cookie", document.cookie);

    if (!document.cookie) {
      navigate("/");
    }
  }, [document.cookie]);

  // edit dialog
  const [editopen, seteditOpen] = useState(false);

  useEffect(() => {
    getTag();
  }, [
    pageState.page,
    pageState.pageSize,
    pageState.total,
    statusRef,
    editopen,
  ]);

  // get all tag array
  const [arr, setarr] = useState([]);

  // set snack msg
  const [snackMsg, setSnackMsg] = useState("");

  // textfield value
  const [textFieldValue, setTextFieldValue] = useState({
    tagName: "",
    tagStatus: "pending",
  });
  const capitalizeFirst = (s) => {
    if (typeof s !== 'string') return ''
    return s.charAt(0).toUpperCase() + s.slice(1)
  }
  // textfield input event
  const inputEvent = (e) => {
    const { name, value } = e.target;
    setTextFieldValue((prev) => {
      return {
        ...prev,
        [name]: capitalizeFirst(value),
      };
    });
  };

  // get all tag api
  const getTag = async () => {
    setPageState((old) => ({ ...old, isLoading: true }));
    const data = await getAllTagApi(pageState.pageSize, pageState.page);
    setarr(data.data.tag);
    setPageState((old) => ({
      ...old,
      total: data.data.total_tag,
      isLoading: false,
    }));
  };

  // craete tag api
  const createTag = async (name, status) => {
    const data = await createTagAPI(name, status);
    return data;
  };

  function camelSentence(str) {
    return (" " + str)
      .toLowerCase()
      .replace(/[^a-zA-Z0-9]+(.)/g, function (match, chr) {
        return chr.toUpperCase();
      });
  }

  const columns = [
    {
      sortable: false,
      field: "name",
      headerName: "Tag Name",
      minWidth: 80,
      width: 80,
      flex: 1,
      renderCell: (params) => {
        return (
          <Stack>
            <span>{camelSentence(params.row.values.name)}</span>
          </Stack>
        );
      },
    },
    {
      field: "pending",
      headerName: "Pending",
      sortable: false,
      minWidth: 80,
      width: 80,
      flex: 1,
      renderCell: (params) => {
        return (
          <div>
            <Button
              variant="contained"
              color="primary"
              width="100%"
              sx={{
                backgroundColor: "red",
                "&:hover": {
                  backgroundColor: "red",
                  boxShadow: "none",
                },
              }}
              disabled={params.row.values.status == "pending" ? false : true}
            >
              <b>Pending</b>
            </Button>
          </div>
        );
      },
    },
    {
      field: "approved",
      headerName: "Approved",
      width: 150,
      flex: 1,
      sortable: false,
      minWidth: 80,
      flex: 1,
      renderCell: (params) => {
        return (
          <div>
            <Button
              variant="contained"
              color="primary"
              width="100%"
              sx={{
                backgroundColor: "green",
                "&:hover": {
                  backgroundColor: "green",
                  boxShadow: "none",
                },
              }}
              disabled={params.row.values.status == "approved" ? false : true}
            >
              <b>Approved</b>
            </Button>
          </div>
        );
      },
    },
    {
      sortable: false,
      minWidth: 80,
      field: "suspended",
      headerName: "Suspended",
      width: 110,
      flex: 1,
      renderCell: (params) => {
        return (
          <div>
            <Button
              variant="contained"
              color="primary"
              width="100%"
              sx={{
                backgroundColor: "#ffcc00",
                "&:hover": {
                  backgroundColor: "#ffcc00",
                  boxShadow: "none",
                },
              }}
              disabled={params.row.values.status == "suspended" ? false : true}
            >
              <b>Suspended</b>
            </Button>
          </div>
        );
      },
    },
    adminFlagVal == "true"
      ? {
          sortable: false,
          minWidth: 80,
          field: "action",
          headerName: "Action",
          flex: 1,
          width: 160,
          renderCell: (params) => {
            return (
              <div>
                <Button
                  className="edithover"
                  startIcon={
                    <MoreHorizIcon
                      style={{
                        color: "gray",
                        fontSize: 30,
                      }}
                    />
                  }
                  onClick={() => {
                    setUserStatus(params.row.values.id);
                    handleClickOpenEdit();
                  }}
                ></Button>
              </div>
            );
          },
        }
      : { hide: true },
  ];

  const rows = [];
  arr.map((item, i) => {
    return rows.push({
      id: i + 1,
      values: {
        id: item?._id,
        name: item?.name,
        status: item?.status,
      },
    });
  });

  // save tag dialog
  const [createopen, setCreateOpen] = useState(false);

  // save tag open dialog
  const handleClickOpenCreate = () => {
    setCreateOpen(true);
  };
  // close save tag dialog
  const handleCloseCreate = (value) => {
    textFieldValue.tagName = "";

    setCreateOpen(false);
  };
  // status update api call
  const tagStatusEdit = async (status) => {
    let data = {
      status: status,
      tagId: userStatus,
    };
    let res = await tagStatusEditAPI(data);
  };

  // open edit dialog
  const handleClickOpenEdit = () => {
    seteditOpen(true);
  };

  // close edit dialog
  const handleCloseEdit = (value) => {
    seteditOpen(false);
  };

  const data =
    arr.length === 0 ? (
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
      <Box sx={{ height: 630, width: "100%", marginTop: "10px" }}>
        <DataGrid
          sx={{
            [`& .${gridClasses.cell}:focus, & .${gridClasses.cell}:focus-within`]:
              {
                outline: "none",
              },
            [`& .${gridClasses.columnHeader}:focus, & .${gridClasses.columnHeader}:focus-within`]:
              {
                outline: "none",
              },
          }}
          rows={rows}
          columns={columns}
          rowCount={pageState.total}
          loading={pageState.isLoading}
          rowsPerPageOptions={[10]}
          pagination
          page={pageState.page - 1}
          pageSize={pageState.pageSize}
          paginationMode="server"
          onPageChange={(newPage) => {
            setPageState((old) => ({ ...old, page: newPage + 1 }));
          }}
          onPageSizeChange={(newPageSize) => {
            setPageState((old) => ({ ...old, pageSize: newPageSize }));
          }}
          disableColumnMenu={true}
          hideFooterSelectedRowCount={true}
          // disableSelectionOnClick={true}
        />
      </Box>
    );

  return (
    <div style={{ paddingTop: "20px" }}>
      {/* <PersistentDrawer /> */}
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
        Create Tag
      </Button>
     
      {data}
      <Dialog
        open={createopen}
        onClose={handleCloseCreate}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Request To Tag"}</DialogTitle>
        <DialogContent>
          <div>
            <br />
            <TextField
              inputProps={{ style: { fontSize: 15 } }} // font size of input text
              id="outlined-basic"
              size="small"
              name="tagName"
              variant="outlined"
              label="Tag New Name"
              value={textFieldValue.tagName}
              onChange={inputEvent}
            />
            <br />
            <br />
            <Select
              sx={{ width: "100%", height: "50px" }}
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              name="tagStatus"
              value={textFieldValue.tagStatus}
              onChange={inputEvent}
            >
              <MenuItem value={"pending"} name={"pending"}>
                Pending
              </MenuItem>
              <MenuItem value={"approved"} name={"approved"}>
                Approved
              </MenuItem>
              <MenuItem value={"suspended"} name={"suspended"}>
                Suspended
              </MenuItem>
            </Select>
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
                    const val = await createTag(
                      textFieldValue.tagName,
                      textFieldValue.tagStatus
                    );
                    if (textFieldValue.tagName == "") {
                      setSnackMsg("Enter Tag Name");
                      handleClick();
                    }
                    if (val.data.success) {
                      setSnackMsg("save successfully");
                      handleClick();
                      handleCloseCreate();
                    } else {
                      setSnackMsg("Enter valid value");
                      handleClick();
                      handleCloseCreate();
                    }
                    getTag();
                  }}
                >
                  Save
                </Button>
              </Stack>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      <Dialog
        open={editopen}
        onClose={handleCloseEdit}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        height="400px"
      >
        <div style={{ display: "flex", placeContent: "space-between" }}>
          <DialogTitle id="alert-dialog-title">{"Tag Status"}</DialogTitle>
          <Button
            startIcon={<Delete style={{ color: "red", fontSize: 30 }} />}
            onClick={async () => {
              handleClickOpenDialog();
            }}
          ></Button>
        </div>
        <DialogContent>
          <div>
            <FormControl style={{ width: "100%" }}>
              <br />
              <div style={{ width: "100%" }}>
                <Stack spacing={2} direction="row" style={{ width: "100%" }}>
                  <Button
                    variant="contained"
                    color="primary"
                    sx={{
                      backgroundColor: "red",
                      width: "32%",
                      "&:hover": {
                        backgroundColor: "red",
                        boxShadow: "none",
                      },
                    }}
                    onClick={async () => {
                      await tagStatusEdit("pending");
                      setStatusRef("pending");
                      handleCloseEdit();
                    }}
                  >
                    <b>Pending</b>
                  </Button>
                  <Button
                    variant="contained"
                    color="primary"
                    sx={{
                      backgroundColor: "green",
                      width: "32%",
                      "&:hover": {
                        backgroundColor: "green",
                        boxShadow: "none",
                      },
                    }}
                    onClick={async () => {
                      await tagStatusEdit("approved");
                      setStatusRef("approved");
                      handleCloseEdit();
                    }}
                  >
                    <b>Approved</b>
                  </Button>

                  <Button
                    variant="contained"
                    color="primary"
                    sx={{
                      backgroundColor: "#ffcc00",
                      width: "32%",
                      "&:hover": {
                        backgroundColor: "#ffcc00",
                        boxShadow: "none",
                      },
                    }}
                    onClick={async () => {
                      await tagStatusEdit("suspended");
                      setStatusRef("suspended");
                      handleCloseEdit();
                    }}
                  >
                    <b>Suspended</b>
                  </Button>
                </Stack>
              </div>
              <br />
            </FormControl>
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
          {"Are you sure to delete User ?"}
        </DialogTitle>

        <DialogActions>
          <Button
            onClick={() => {
              handleCloseDialog();
              handleCloseEdit();
            }}
          >
            Disagree
          </Button>
          <Button
            onClick={() => {
              deleteData(userStatus);
              handleCloseDialog();
              handleCloseEdit();
            }}
            autoFocus
          >
            Agree
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
  );
};

export default Tag;
