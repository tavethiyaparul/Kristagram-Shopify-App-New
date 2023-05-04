import { React, useCallback, useEffect, useState } from "react";
import Box from "@mui/material/Box";
import { DataGrid, gridClasses } from "@mui/x-data-grid";
import { getAppLocation, updateLocation } from "../../API/api";
import { Stack } from "@mui/system";
import {
  Avatar,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Snackbar,
  Switch,
  styled,
  Card,
  CardContent,
  TextField,
  Typography,
  Paper,
  ImageList,
  ImageListItem,
  CardMedia,
} from "@mui/material";
import axios from "axios";
import CloseIcon from "@mui/icons-material/Close";
import Delete from "@mui/icons-material/Delete";
import Carousel from "react-material-ui-carousel";

const Rent = () => {
  const [loader, setLoader] = useState(false);

  // state
  const [rentVal, setRentVal] = useState();

  // getrent
  const getRentAPI = async () => {
    setLoader(true);
    const res = await axios.get(`/api/v1/allrentproduct`);
    console.log("....", res?.data?.rent);
    setRentVal(res?.data?.rent);
    setLoader(false);
    return res;
  };
  const deleteRentAPI = async (id) => {
    console.log("id", id);
    const res = await axios.delete(`/api/v1/deleterentproduct/${id}`);
    console.log("&&&", res);
    return res;
  };
  const [deleteId, setDeleteId] = useState("");
  const [deleteRes, setDeleteRes] = useState();
  useEffect(() => {
    getRentAPI();
  }, [deleteRes]);

  // delete model
  const [deleteDialog, setDeleteDialog] = useState(false);

  const handleClickOpenDialog = () => {
    setDeleteDialog(true);
  };

  const handleCloseDialog = () => {
    setDeleteDialog(false);
  };

  // details model
  const [loderCount, setLoaderCount] = useState();

  const [openCountDialog, setCountDialog] = useState(false);

  const handleClickOpenCountDialog = () => {
    setCountDialog(true);
  };

  const handleCloseCountDialog = () => {
    setCountDialog(false);
  };

  const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    "& .MuiDialogContent-root": {
      padding: theme.spacing(2),
    },
    "& .MuiDialogActions-root": {
      padding: theme.spacing(1),
    },
  }));

  function BootstrapDialogTitle(props) {
    const { children, onClose, ...other } = props;

    return (
      <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
        {children}
        {onClose ? (
          <IconButton
            aria-label="close"
            onClick={onClose}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon onClick={handleCloseCountDialog} />
          </IconButton>
        ) : null}
      </DialogTitle>
    );
  }

  const [img, setImg] = useState();
  const [openImgDialog, setOpenImgDialog] = useState(false);
  //image open dialog
  const handleClickImg = () => {
    setOpenImgDialog(true);
  };

  //image close dialog
  const handleCloseImg = () => {
    setOpenImgDialog(false);
  };

  const [userName, setUserName] = useState();
  const [rentByUser, setRentByUser] = useState();
  const getRentByUser = async (id) => {
    console.log("iddd", id);
    setLoaderCount(true);
    const res = await axios.get(`/api/v1/allrentproduct`, {
      params: { user_id: id },
    });
    console.log("rent pair bu user", res?.data?.rent);
    setRentByUser(res?.data?.rent);
    setLoaderCount(false);
    return res;
  };

  const columns = [
    {
      align: "left",
      sortable: false,
      field: "profile_image",
      headerName: "Image",
      minWidth: 100,
      width: 100,
      renderCell: (params) => {
        return (
          <Stack>
            <span>
              <Avatar
                sx={{
                  height: "40px",
                  width: "40px",
                }}
                alt="Kristagram"
                src={params.row.product_images[0]}
                onClick={() => {
                  handleClickImg();
                  setImg(params.row.product_images);
                  // handleClickImg();
                }}
              />
            </span>
          </Stack>
        );
      },
    },

    {
      align: "left",
      sortable: false,
      // editable: true,
      field: "name",
      headerName: "Title",
      width: 50,
      minWidth: 50,
      flex: 1,
      renderCell: (params) => {
        return (
          <Stack>
            <span>
              {params.row.name ? capitalizeFirst(params.row.name) : "-"}
            </span>
          </Stack>
        );
      },
    },
    {
      align: "left",
      sortable: false,
      // editable: true,
      field: "content",
      headerName: "Price",
      width: 50,
      minWidth: 50,
      flex: 1,
      renderCell: (params) => {
        return (
          <Stack>
            <span>{params.row.currency + params.row.price}</span>
          </Stack>
        );
      },
    },

    {
      align: "left",
      sortable: false,
      // editable: true,
      field: "firstName",
      headerName: "User Info",
      width: 250,
      minWidth: 250,
      renderCell: (params) => {
        return (
          <Stack>
            <span>
              <b>Name : </b>
              {params.row.firstName
                ? capitalizeFirst(params.row.firstName) +
                  " " +
                  capitalizeFirst(params.row.lastName)
                : "-"}
            </span>
            <span>
              <b>Phone : </b>
              {params.row.phone
                ? params.row.country_code
                  ? params.row.country_code + " " + params.row.phone
                  : params.row.phone
                : "-"}
            </span>
          </Stack>
        );
      },
    },
    {
      align: "left",
      sortable: false,
      // editable: true,
      field: "status",
      headerName: "Status",
      width: 50,
      minWidth: 50,
      flex: 1,
      renderCell: (params) => {
        return (
          <Stack>
            <span
              style={{
                color:
                  params.row.status === "Available for rent" ? "green" : "red",
              }}
            >
              {params.row.status}
            </span>
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
    {
      align: "left",
      sortable: false,
      field: "count",
      headerName: "Details",
      width: 50,
      minWidth: 50,
      flex: 1,

      renderCell: (params) => {
        return (
          <Stack>
            <button
              variant="outlined"
              style={{ marginBottom: "5px" }}
              onClick={() => {
                getRentByUser(params.row.user_id);
                handleClickOpenCountDialog();
                setUserName(
                  capitalizeFirst(params.row.firstName) +
                    " " +
                    capitalizeFirst(params.row.lastName)
                );
              }}
            >
              <b>View Details </b>
            </button>
          </Stack>
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
  rentVal?.map((item) => {
    return rows.push({
      id: item?._id,
      createdAt: formatDate(item?.createdAt),
      name: item?.rent_product_title,
      price: item?.rent_product_price,
      currency: item?.user?.currency,
      user_id: item?.user?._id,
      product_images: item?.rent_product_image,
      firstName: item?.user?.first_name,
      lastName: item?.user?.last_name,
      country_code: item?.user?.country_code,
      phone: item?.user?.phone,
      typeOfUser: item?.user?.type_of_user,
      status:
        item?.is_rent === true
          ? "Available for rent"
          : "Not Available for rent",
    });
  });

  const columnsInnerTable = [
    {
      align: "left",
      sortable: false,
      field: "profile_image",
      headerName: "Image",
      minWidth: 100,
      width: 100,
      renderCell: (params) => {
        return (
          <Stack>
            <span>
              <Avatar
                sx={{
                  height: "40px",
                  width: "40px",
                }}
                alt="Kristagram"
                src={params.row.product_images[0]}
                // onClick={() => {
                //   handleClickImg();
                //   setImg(params.row.product_images);
                //   // handleClickImg();
                // }}
              />
            </span>
          </Stack>
        );
      },
    },

    {
      align: "left",
      sortable: false,
      // editable: true,
      field: "name",
      headerName: "Title",
      width: 50,
      minWidth: 50,
      flex: 1,
      renderCell: (params) => {
        return (
          <Stack>
            <span>
              {params.row.name ? capitalizeFirst(params.row.name) : "-"}
            </span>
          </Stack>
        );
      },
    },
    {
      align: "left",
      sortable: false,
      // editable: true,
      field: "content",
      headerName: "Price",
      width: 50,
      minWidth: 50,
      flex: 1,
      renderCell: (params) => {
        return (
          <Stack>
            <span>{params.row.currency + params.row.price}</span>
          </Stack>
        );
      },
    },

    {
      align: "left",
      sortable: false,
      // editable: true,
      field: "status",
      headerName: "Status",
      width: 50,
      minWidth: 50,
      flex: 1,
      renderCell: (params) => {
        return (
          <Stack>
            <span
              style={{
                color:
                  params.row.status === "Available for rent" ? "green" : "red",
              }}
            >
              {params.row.status}
            </span>
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
  ];

  const rowsInnerTable = [];
  rentByUser?.map((item) => {
    return rowsInnerTable.push({
      id: item?._id,
      createdAt: formatDate(item?.createdAt),
      name: item?.rent_product_title,
      price: item?.rent_product_price,
      currency: item?.user?.currency,
      product_images: item?.rent_product_image,
      firstName: item?.user?.first_name,
      lastName: item?.user?.last_name,
      country_code: item?.user?.country_code,
      phone: item?.user?.phone,
      typeOfUser: item?.user?.type_of_user,
      status:
        item?.is_rent === true
          ? "Available for rent"
          : "Not Available for rent",
    });
  });

  const capitalizeFirst = (s) => {
    if (typeof s !== "string") return "";
    return s.charAt(0).toUpperCase() + s.slice(1);
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
  const handleCellClick = (param, event) => {
    event.stopPropagation();
  };

  const handleRowClick = (param, event) => {
    event.stopPropagation();
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
                  [`& .${gridClasses.cell}`]: {
                    py: 2,
                  },
                }}
                getRowHeight={() => "auto"}
                rowHeight={60}
                rows={rows}
                columns={columns}
                pageSize={10}
                rowsPerPageOptions={[10]}
                experimentalFeatures={{ newEditingApi: true }}
                hideFooterSelectedRowCount={true}
                // disableColumnMenu={true}
              />
            </Box>
          </div>

          <BootstrapDialog
            onClose={handleCloseImg}
            aria-labelledby="customized-dialog-title"
            open={openImgDialog}
            fullWidth={true}
            maxWidth={"sm"}
          >
            <BootstrapDialogTitle
              id="customized-dialog-title"
              onClose={handleCloseImg}
            >
              Images
            </BootstrapDialogTitle>
            <DialogContent dividers>
              <Typography>
                <>
                  <div>
                    {img ? (
                      <ImageList cols={2}>
                        {img?.map((item) => (
                          <ImageListItem key={item}>
                            <img src={item} />
                          </ImageListItem>
                        ))}
                      </ImageList>
                    ) : (
                      <Box sx={{ textAlign: "center" }}>
                        <CircularProgress />
                      </Box>
                    )}
                  </div>
                  <br />
                </>
              </Typography>
            </DialogContent>
          </BootstrapDialog>
          {/* delete dialog */}
          <Dialog
            open={deleteDialog}
            onClose={handleCloseDialog}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">
              <div>{"Are you sure you went to remove this product?"}</div>
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
                  const res = deleteRentAPI(deleteId);
                  setDeleteRes(res);
                  handleCloseDialog();
                }}
                autoFocus
              >
                Remove
              </Button>
            </DialogActions>
          </Dialog>
          {/* details dialog */}
          <BootstrapDialog
            onClose={handleCloseCountDialog}
            aria-labelledby="customized-dialog-title"
            open={openCountDialog}
            fullWidth={true}
            maxWidth={"lg"}
          >
            <BootstrapDialogTitle
              id="customized-dialog-title"
              onClose={handleCloseCountDialog}
            >
              User Details {`${"( " + userName + " )"}`}
            </BootstrapDialogTitle>
            <DialogContent dividers>
              <Typography>
                {loderCount ? (
                  <Box sx={{ textAlign: "center" }}>
                    <CircularProgress />
                  </Box>
                ) : (
                  <>
                    <div>
                      {rentByUser ? (
                        <div>
                          <Box sx={{ height: 400, width: "100%" }}>
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
                                [`& .${gridClasses.cell}`]: {
                                  py: 2,
                                },
                              }}
                              getRowHeight={() => "auto"}
                              rowHeight={60}
                              rows={rowsInnerTable}
                              columns={columnsInnerTable}
                              onCellClick={handleCellClick}
                              onRowClick={handleRowClick}
                              pageSize={10}
                              rowsPerPageOptions={[10]}
                              experimentalFeatures={{ newEditingApi: true }}
                              hideFooterSelectedRowCount={true}

                              // disableColumnMenu={true}
                            />
                          </Box>
                        </div>
                      ) : (
                        <Box sx={{ textAlign: "center" }}>
                          <CircularProgress />
                        </Box>
                      )}
                    </div>
                    {/* <Button
                      className="edithover"
                      startIcon={
                        <Delete style={{ color: "red", fontSize: 30 }} />
                      }
                      onClick={async () => {
                        console.log("......id", innerTableByData?._id);
                        // setDeleteId(innerTableByData?._id); // id for delete
                        handleClickOpenDialog();
                      }}
                    ></Button> */}
                    <br />
                  </>
                )}
              </Typography>
            </DialogContent>
          </BootstrapDialog>
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
export default Rent;
