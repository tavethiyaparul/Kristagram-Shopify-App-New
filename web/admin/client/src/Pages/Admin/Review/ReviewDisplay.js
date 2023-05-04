import { React, useEffect, useState } from "react";
import Box from "@mui/material/Box";
import { DataGrid, gridClasses } from "@mui/x-data-grid";
import { Stack } from "@mui/system";
import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  styled,
  Snackbar,
  Typography,
  Card,
  CardContent,
  Rating,
} from "@mui/material";
import axios from "axios";
import CloseIcon from "@mui/icons-material/Close";
import Delete from "@mui/icons-material/Delete";

export default function ReviewDisplay(props) {
  const [loader, setLoader] = useState(false);
  const [pairLoader, setPairLoader] = useState(false);
  const [reviewVal, setReviewVal] = useState();

  const [reviewPair,setReviewPair]=useState()

  // API function

  const getReviewAPI = async () => {
    setLoader(true);
    const res = await axios.get(
      `/api/v1/reviewpending?is_review_done=${props.status}`
    );
    console.log("&&&neww", res?.data?.review);
    setReviewVal(res?.data?.review);
    setLoader(false);
    return res;
  };

  const [pairId, setPairId] = useState({
    review_by: "",
    review_to: "",
  });

  // reviewpair
  const getReviewPairAPI = async (review_by, review_to) => {
    setLoader(true);
    const data = { review_by, review_to };
    console.log("data...",data)
    const res = await axios.post(`/api/v1/reviewpair`, data);
    console.log("review pair", res?.data?.review);
    setReviewPair(res?.data?.review);
    setLoader(false);
    return res;
  };

  const capitalizeFirst = (s) => {
    if (typeof s !== "string") return "";
    return s.charAt(0).toUpperCase() + s.slice(1);
  };
  // const getReviewCompletedAPI = async () => {
  //   setLoader(true);
  //   const res = await axios.get(`/api/v1/reviewcomplited`);
  //   console.log("&&&reviewComplited", res?.data?.review);
  //   setReviewVal(res?.data?.review);
  //   setLoader(false);
  //   return res;
  // };
  const [deleteRes, setDeleteRes] = useState();
  useEffect(() => {

    // getReviewCompletedAPI();
    getReviewAPI();
  }, [deleteRes]);
  // count dialog
  const [openCountDialog, setCountDialog] = useState(false);

  const handleClickOpenCountDialog = () => {
    console.log("ho,e c")
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

  const columns = [
    {
      align: "left",
      sortable: false,
      field: "reviewByFirstName",
      headerName: "Review By",
      width: 140,
      flex: 1,
      minWidth: 140,
      renderCell: (params) => {
        return (
          <Stack>
            <span>
              {params.row.reviewByFirstName === undefined &&
              params.row.reviewByLastName === undefined
                ? "Flagged User"
                : capitalizeFirst(params.row.reviewByFirstName) +
                  " " +
                  capitalizeFirst(params.row.reviewByLastName)}
            </span>
          </Stack>
        );
      },
    },
    {
      align: "left",
      sortable: false,
      field: "reviewToFirstName",
      headerName: "Review To",
      width: 150,
      flex: 1,
      minWidth: 150,

      renderCell: (params) => {
        return (
          <Stack>
            <span>
              {params.row.reviewToFirstName === undefined &&
              params.row.reviewToLastName === undefined
                ? "Flagged User"
                : capitalizeFirst(params.row.reviewToFirstName) +
                  " " +
                  capitalizeFirst(params.row.reviewToLastName)}
            </span>
          </Stack>
        );
      },
    },
    {
      align: "left",
      sortable: false,
      field: "review_comment",
      headerName: "Review Comment",
      width: 300,
      flex: 1,
      minWidth: 300,
      renderCell: (params) => {
        return (
          <Stack>
            <span className="title-width">{params.row.review_comment}</span>
          </Stack>
        );
      },
    },
    {
      align: "left",
      sortable: false,
      field: "review_rating",
      headerName: "Review Rating",
      width: 140,
      flex: 1,
      minWidth: 140,
      renderCell: (params) => {
        return (
          <Stack>
            <Rating
              readOnly
              name="read-only"
              value={params.row.review_rating}
              precision={0.5}
            />
          </Stack>
        );
      },
    },
    {
      align: "left",
      sortable: false,
      field: "createdAt",
      headerName: "Created At",
      width: 140,
      flex: 1,
      minWidth: 140,
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
                // console.log("byy", params.row.review_by);
                setInnerTableToData(params.row.item);
                // setInnerTableByData(params.row.review_to);
                // setDeleteId(params.row.review_by._id);
                setDeleteId2(params.row.id);
                // handleClickOpenCountDialog();
                console.log("how ")
              
                const temp = { ...pairId };
                temp.review_by = params.row.reviewById;
                temp.review_to = params.row.reviewToId;
                setPairId(temp);
                getReviewPairAPI(params.row.reviewById,params.row.reviewToId)
                handleClickOpenCountDialog()
                console.log("temoppp", temp);
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
  reviewVal?.map((item) => {
    return rows.push({
      item:item,
      id: item?._id,
      createdAt: formatDate(item?.createdAt),
      reviewByFirstName: item?.review_by?.first_name,
      reviewById: item?.review_by?._id,
      reviewBy: item?.review_by,
      reviewByLastName: item?.review_by?.last_name,
      reviewToFirstName: item?.review_to?.first_name,
      reviewToLastName: item?.review_to?.last_name,
      reviewToId: item?.review_to?._id,
      review_comment: item?.review_comment,
      review_rating: item?.review_rating,
    });
  });

  //count API call
  const [loderCount, setLoaderCount] = useState();
  const [innerTableToData, setInnerTableToData] = useState();
  const [innerTableByData, setInnerTableByData] = useState();

  // delete

  const deleteSpamAPI = async (id1, id2) => {
    console.log("dddid", id1, id2);
    // let review_id = [id1, id2];
    let review_by = id1;
    let review_to = id2;
    const res = await axios.delete(
      `/api/v1/reviewdelete?review_by=${review_by}&review_to=${review_to}`
    );
    console.log("&&&...", res);
    return res;
  };

  const [deleteId, setDeleteId] = useState("");
  const [deleteId2, setDeleteId2] = useState("");

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
      ) : reviewVal?.length == 0 ? (
        <div
          style={{
            height: "75vh",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <p>No Data Found</p>
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
                rowHeight={80}
                rows={rows}
                columns={columns}
                pageSize={10}
                rowsPerPageOptions={[10]}
                hideFooterSelectedRowCount={true}
              />
            </Box>
          </div>
          {/* count dialog */}
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
              Review Details
            </BootstrapDialogTitle>
            <DialogContent dividers>
              <Typography>
                {pairLoader ? (
                  <Box sx={{ textAlign: "center" }}>
                    <CircularProgress />
                  </Box>
                ) : (
                  <>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "baseline",
                        justifyContent: "space-between",
                      }}
                    >
                      <div>
                        <Card>
                          <CardContent>
                            <div>
                              <div
                                style={{
                                  justifyContent: "space-between",
                                  display: "flex",
                                  alignItems: "center",
                                }}
                              >
                                <b>Review By User Detail :-</b>
                                {/* <Button
                                  className="edithover"
                                  startIcon={
                                    <Delete
                                      style={{ color: "red", fontSize: 30 }}
                                    />
                                  }
                                  onClick={async () => {
                                    console.log(
                                      "......id",
                                      innerTableByData?._id
                                    );
                                    // setDeleteId(innerTableByData?._id); // id for delete
                                    handleClickOpenDialog();
                                  }}
                                ></Button> */}
                              </div>
                              <p>
                                <b>Name : </b>
                                {console.log("innerTableToData",innerTableToData)}
                                {capitalizeFirst(innerTableToData?.review_by?.first_name?innerTableToData?.review_by?.first_name:"Flagged") +
                                  " " +
                                  capitalizeFirst(innerTableToData?.review_by?.last_name?innerTableToData?.review_by?.last_name:"User")}
                              </p>

                              <div style={{ display: "flex" }}>
                                <b>Review Rating : </b>
                                <div>
                                  <Rating
                                    readOnly
                                    name="read-only"
                                    value={innerTableToData?.review_rating}
                                    precision={0.5}
                                  />
                                </div>
                              </div>

                              <p style={{ display: "flex" }}>
                                <b>Review Comment : </b>
                                <p className="title-width">
                                  {" " + innerTableToData?.review_comment}
                                </p>
                              </p>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                      <div>
                        <Card>
                          <CardContent>
                            <div>
                              <div
                                style={{
                                  justifyContent: "space-between",
                                  display: "flex",
                                  alignItems: "center",
                                }}
                              >
                                <b>Review To User Detail :-</b>
                                {/* <Button
                                  className="edithover"
                                  startIcon={
                                    <Delete
                                      style={{ color: "red", fontSize: 30 }}
                                    />
                                  }
                                  onClick={async () => {
                                    console.log(
                                      "......id",
                                      innerTableToData?._id
                                    );
                                    // setDeleteId(innerTableToData?._id); // id for delete
                                    handleClickOpenDialog();
                                  }}
                                ></Button> */}
                              </div>
                              <p>
                                <b>Name : </b>
                                {capitalizeFirst(reviewPair?.review_by?.first_name?reviewPair?.review_by?.first_name:"Flagged") +
                                  " " +
                                  capitalizeFirst(reviewPair?.review_by?.last_name?reviewPair?.review_by?.last_name:"User")}
                              </p>
                              <div style={{ display: "flex" }}>
                                <b>Review Rating : </b>
                                <div>
                                  <Rating
                                    readOnly
                                    name="read-only"
                                    value={reviewPair?.review_rating}
                                    precision={0.5}
                                  />
                                </div>
                              </div>

                              <p style={{ display: "flex" }}>
                                <b>Review Comment : </b>
                                <p className="title-width">
                                  {" " + reviewPair?.review_comment}
                                </p>
                              </p>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
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
                    {/* <div style={{ display: "flex", justifyContent: "end" }}>
                      <Button
                        variant="outlined"
                        startIcon={
                          <Delete style={{ color: "white", fontSize: 30 }} />
                        }
                        style={{
                          background: "red",
                          color: "white",
                          borderColor: "white",
                        }}
                        onClick={async () => {
                          console.log("......id", innerTableToData?.id);
                          setDeleteId(innerTableToData?.id); // id for delete
                          handleClickOpenDialog();
                        }}
                      >
                        <b>Delete</b>
                      </Button>
                    </div> */}
                  </>
                )}
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
              {"Are you sure you went to remove review ?"}
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
                  handleCloseCountDialog();
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
                onClick={async () => {
                  console.log("....", deleteId,deleteId2);
                  const res = await deleteSpamAPI(deleteId, deleteId2);
                  console.log("&&&&", res);
                  setDeleteRes(res);
                  handleCloseDialog();
                  handleCloseCountDialog();
                }}
                autoFocus
              >
                Remove
              </Button>
            </DialogActions>
          </Dialog>
        </div>
      )}
    </div>
  );
}
