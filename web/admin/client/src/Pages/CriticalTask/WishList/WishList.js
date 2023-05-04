import { React, useCallback, useEffect, useState } from "react";
import Box from "@mui/material/Box";
import { DataGrid, gridClasses } from "@mui/x-data-grid";
import { getAppLocation, updateLocation } from "../../../API/api";
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

const WishList = () => {
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
  // const getCategoryAPI = async () => {
  //   setLoader(true);
  //   const res = await axios.get(`/api/v1/getcategory`);
  //   console.log("&&&", res?.data?.wishlist);
  //   setGetCategoryVal(res?.data?.wishlist);
  //   setLoader(false);
  //   return res;
  // };

  // getwishlist
  const getWishlistAPI = async () => {
    setLoader(true);
    const res = await axios.get(`/api/v1/getwishlist`);
    console.log("....", res);
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
    getWishlistAPI();
    // getCategoryAPI();
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

  // details dialog
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
  const itemData = [
    {
      img: "https://images.unsplash.com/photo-1551963831-b3b1ca40c98e",
      title: "Breakfast",
    },
    {
      img: "https://images.unsplash.com/photo-1551782450-a2132b4ba21d",
      title: "Burger",
    },
    {
      img: "https://images.unsplash.com/photo-1522770179533-24471fcdba45",
      title: "Camera",
    },
    {
      img: "https://images.unsplash.com/photo-1444418776041-9c7e33cc5a9c",
      title: "Coffee",
    },
    {
      img: "https://images.unsplash.com/photo-1533827432537-70133748f5c8",
      title: "Hats",
    },
    {
      img: "https://images.unsplash.com/photo-1558642452-9d2a7deb7f62",
      title: "Honey",
    },
    {
      img: "https://images.unsplash.com/photo-1516802273409-68526ee1bdd6",
      title: "Basketball",
    },
    {
      img: "https://images.unsplash.com/photo-1518756131217-31eb79b20e8f",
      title: "Fern",
    },
    {
      img: "https://images.unsplash.com/photo-1597645587822-e99fa5d45d25",
      title: "Mushrooms",
    },
    {
      img: "https://images.unsplash.com/photo-1567306301408-9b74779a11af",
      title: "Tomato basil",
    },
    {
      img: "https://images.unsplash.com/photo-1471357674240-e1a485acb3e1",
      title: "Sea star",
    },
    {
      img: "https://images.unsplash.com/photo-1589118949245-7d38baf380d6",
      title: "Bike",
    },
  ];

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

  // inner table 
  const [imgInner, setImgInner] = useState();
  const [openImgInnerDialog, setOpenImgInnerDialog] = useState(false);
  const handleClickImgInner = () => {
    setOpenImgInnerDialog(true);
  };
  const handleCloseImgInner = () => {
    setOpenImgInnerDialog(false);
  };


  const [wishByUser,setWishByUser]=useState()
  // getWishListByUser
  const getWishListByUser = async (id) => {
    setLoaderCount(true);
    const res = await axios.get(`/api/v1/wishlistbyuser`,{
      params: { user_id:id },
    });
    console.log("review pair", res?.data?.wishlist);
    setWishByUser(res?.data?.wishlist);
    setLoaderCount(false);
    return res;
  };
  
  const [userName,setUserName]=useState()

  const columns = [
    {
      align: "center",
      sortable: false,
      field: "profile_image",
      headerName: "Product Image",
      minWidth: 150,
      width: 150,
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
    // {
    //   align: "left",
    //   sortable: false,
    //   // editable: true,
    //   field: "firstName",
    //   headerName: "User Name",
    //   width: 200,
    //   minWidth: 200,
    //   renderCell: (params) => {
    //     return (
    //       <Stack>
    //         <span>
    //           {params.row.firstName
    //             ? capitalizeFirst(params.row.firstName) +
    //               " " +
    //               capitalizeFirst(params.row.lastName)
    //             : "-"}
    //         </span>
    //       </Stack>
    //     );
    //   },
    // },
    {
      align: "left",
      sortable: false,
      // editable: true,
      field: "name",
      headerName: "Product Name",
      width: 50,
      minWidth: 50,
      flex: 1,
      renderCell: (params) => {
        return (
          <Stack>
            <span className="title-width-wishlist">
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
      headerName: "Event",
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
      // editable: true,
      field: "firstName",
      headerName: "User Name",
      width: 200,
      minWidth: 200,
      renderCell: (params) => {
        return (
          <Stack>
            <span>
              {params.row.firstName
                ? capitalizeFirst(params.row.firstName) +
                  " " +
                  capitalizeFirst(params.row.lastName)
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
      field: "typeOfUser",
      headerName: "Type of user",
      width: 50,
      minWidth: 50,
      flex: 1,
      renderCell: (params) => {
        return (
          <Stack>
            <span>
              {params.row.typeOfUser
                ? capitalizeFirst(params.row.typeOfUser)
                : "-"}
            </span>
          </Stack>
        );
      },
    },
    // {
    //   align: "left",
    //   sortable: false,
    //   field: "Status",
    //   headerName: "Status",
    //   width: 50,
    //   minWidth: 50,
    //   flex: 1,
    //   renderCell: (params) => {
    //     return (
    //       <Stack>
    //         <Switch
    //           checked={params.row.id == checkedId ? checked : params.row.status}
    //           onChange={async (e) => {
    //             // setCheckedId(params.row.id);
    //             // handleChange(e, params.row.id);
    //             // let data = {
    //             //   id: params.row.id,
    //             //   status: e.target.checked,
    //             // };
    //             // const response = await updateCategoryAPI(data);
    //           }}
    //         />
    //         {/* <span>{params.row.Status ? params.row.Status : "-"}</span> */}
    //       </Stack>
    //     );
    //   },
    // },
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
    // {
    //   align: "left",
    //   sortable: false,
    //   field: "updatedAt",
    //   headerName: "Updated At",
    //   width: 50,
    //   minWidth: 50,
    //   flex: 1,
    //   renderCell: (params) => {
    //     return (
    //       <Stack>
    //         {params.row.updatedAt.split(",")[0]}
    //         {" , "}
    //         <br /> {params.row.updatedAt.split(",")[1]}
    //       </Stack>
    //     );
    //   },
    // },
    // {
    //   align: "left",
    //   sortable: false,
    //   field: "count",
    //   headerName: "Product Images",
    //   width: 50,
    //   minWidth: 50,
    //   flex: 1,
    //   renderCell: (params) => {
    //     return (
    //       <Stack>
    //         <button
    //           style={{ marginBottom: "5px" }}
    //           onClick={async () => {
    //             // console.log("pppp",params.row.product_images)
    //             handleClickOpenCountDialog();
    //             setProfileImages(params.row.product_images);
    //           }}
    //         >
    //           <b>Images </b>
    //         </button>
    //       </Stack>
    //     );
    //   },
    // },
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
              onClick={ () => {
                getWishListByUser(params.row.user_id)
                handleClickOpenCountDialog()
                setUserName(capitalizeFirst(params.row.firstName) + " "+capitalizeFirst(params.row.lastName))
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
  getCategoryVal?.map((item) => {
    return rows.push({
      id: item?._id,
      user_id:item?.user?._id,
      content: item?.wish_list_category,
      createdAt: formatDate(item?.createdAt),
      updatedAt: formatDate(item?.updatedAt),
      name: item?.product?.name,
      product_images: item?.product?.product_image,
      firstName: item?.user?.first_name,
      lastName: item?.user?.last_name,
      typeOfUser: item?.user?.type_of_user,
      profile_image: item?.user?.profile_image,
    });
  });

  // wishlist by user table 
  const wishByUserIdCol = [
    {
      align: "center",
      sortable: false,
      field: "profile_image",
      headerName: "Product Image",
      minWidth: 150,
      width: 150,
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
                //   handleClickImgInner();
                //   setImgInner(params.row.product_images);
                //   // handleClickImg();
                // }}
              />
            </span>
          </Stack>
        );
      },
    },
    // {
    //   align: "left",
    //   sortable: false,
    //   // editable: true,
    //   field: "firstName",
    //   headerName: "User Name",
    //   width: 200,
    //   minWidth: 200,
    //   renderCell: (params) => {
    //     return (
    //       <Stack>
    //         <span>
    //           {params.row.firstName
    //             ? capitalizeFirst(params.row.firstName) +
    //               " " +
    //               capitalizeFirst(params.row.lastName)
    //             : "-"}
    //         </span>
    //       </Stack>
    //     );
    //   },
    // },
    {
      align: "left",
      sortable: false,
      // editable: true,
      field: "name",
      headerName: "Product Name",
      width: 50,
      minWidth: 50,
      flex: 1,
      renderCell: (params) => {
        return (
          <Stack>
            <span className="title-width-wishlist">
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
      headerName: "Event",
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
    //  {
    //   align: "left",
    //   sortable: false,
    //   // editable: true,
    //   field: "firstName",
    //   headerName: "User Name",
    //   width: 200,
    //   minWidth: 200,
    //   renderCell: (params) => {
    //     return (
    //       <Stack>
    //         <span>
    //           {params.row.firstName
    //             ? capitalizeFirst(params.row.firstName) +
    //               " " +
    //               capitalizeFirst(params.row.lastName)
    //             : "-"}
    //         </span>
    //       </Stack>
    //     );
    //   },
    // },
    {
      align: "left",
      sortable: false,
      // editable: true,
      field: "typeOfUser",
      headerName: "Type of user",
      width: 50,
      minWidth: 50,
      flex: 1,
      renderCell: (params) => {
        return (
          <Stack>
            <span>
              {params.row.typeOfUser
                ? capitalizeFirst(params.row.typeOfUser)
                : "-"}
            </span>
          </Stack>
        );
      },
    },
    // {
    //   align: "left",
    //   sortable: false,
    //   field: "Status",
    //   headerName: "Status",
    //   width: 50,
    //   minWidth: 50,
    //   flex: 1,
    //   renderCell: (params) => {
    //     return (
    //       <Stack>
    //         <Switch
    //           checked={params.row.id == checkedId ? checked : params.row.status}
    //           onChange={async (e) => {
    //             // setCheckedId(params.row.id);
    //             // handleChange(e, params.row.id);
    //             // let data = {
    //             //   id: params.row.id,
    //             //   status: e.target.checked,
    //             // };
    //             // const response = await updateCategoryAPI(data);
    //           }}
    //         />
    //         {/* <span>{params.row.Status ? params.row.Status : "-"}</span> */}
    //       </Stack>
    //     );
    //   },
    // },
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
    // {
    //   align: "left",
    //   sortable: false,
    //   field: "updatedAt",
    //   headerName: "Updated At",
    //   width: 50,
    //   minWidth: 50,
    //   flex: 1,
    //   renderCell: (params) => {
    //     return (
    //       <Stack>
    //         {params.row.updatedAt.split(",")[0]}
    //         {" , "}
    //         <br /> {params.row.updatedAt.split(",")[1]}
    //       </Stack>
    //     );
    //   },
    // },
    // {
    //   align: "left",
    //   sortable: false,
    //   field: "count",
    //   headerName: "Product Images",
    //   width: 50,
    //   minWidth: 50,
    //   flex: 1,
    //   renderCell: (params) => {
    //     return (
    //       <Stack>
    //         <button
    //           style={{ marginBottom: "5px" }}
    //           onClick={async () => {
    //             // console.log("pppp",params.row.product_images)
    //             handleClickOpenCountDialog();
    //             setProfileImages(params.row.product_images);
    //           }}
    //         >
    //           <b>Images </b>
    //         </button>
    //       </Stack>
    //     );
    //   },
    // },
   
  ];

  const wishByUserIdRow = [];
  wishByUser?.map((item) => {
    return wishByUserIdRow.push({
      id: item?._id,
      user_id:item?.user?._id,
      content: item?.wish_list_category,
      createdAt: formatDate(item?.createdAt),
      updatedAt: formatDate(item?.updatedAt),
      name: item?.product?.name,
      product_images: item?.product?.product_image,
      firstName: item?.user?.first_name,
      lastName: item?.user?.last_name,
      typeOfUser: item?.user?.type_of_user,
      profile_image: item?.user?.profile_image,
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
                }}
                rowHeight={60}
                rows={rows}
                columns={columns}
                pageSize={10}
                rowsPerPageOptions={[10]}
                experimentalFeatures={{ newEditingApi: true }}
                hideFooterSelectedRowCount={true}
                processRowUpdate={processRowUpdate}
                // disableColumnMenu={true}
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
                          getWishlistAPI();
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
              Product Images
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

          <BootstrapDialog
            onClose={handleCloseImgInner}
            aria-labelledby="customized-dialog-title"
            open={openImgInnerDialog}
            fullWidth={true}
            maxWidth={"sm"}
          >
            <BootstrapDialogTitle
              id="customized-dialog-title"
              onClose={handleCloseImgInner}
            >
              Product Images
            </BootstrapDialogTitle>
            <DialogContent dividers>
              <Typography>
                <>
                  <div>
                    {imgInner ? (
                      <ImageList cols={2}>
                        {imgInner?.map((item) => (
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
              {"Are you sure to delete span content ?"}
            </DialogTitle>

            <DialogActions>
              <Button
                onClick={() => {
                  handleCloseDialog();
                }}
              >
                Disagree
              </Button>
              <Button
                onClick={() => {
                  const res = deleteCategoryAPI(deleteId);
                  setDeleteRes(res);
                  handleCloseDialog();
                }}
                autoFocus
              >
                Agree
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
              User Details {`${"( "+userName+" )"}`}
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
                      {wishByUser ? (
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
                }}
                rowHeight={60}
                rows={wishByUserIdRow}
                columns={wishByUserIdCol}
                onCellClick={handleCellClick}
        onRowClick={handleRowClick}
                pageSize={10}
                rowsPerPageOptions={[10]}
                experimentalFeatures={{ newEditingApi: true }}
                hideFooterSelectedRowCount={true}
                processRowUpdate={processRowUpdate}
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
export default WishList;
