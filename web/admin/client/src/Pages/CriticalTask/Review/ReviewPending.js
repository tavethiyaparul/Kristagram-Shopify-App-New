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
  Rating,
} from "@mui/material";
import axios from "axios";
import CloseIcon from "@mui/icons-material/Close";
import Delete from "@mui/icons-material/Delete";

export default function ReviewPending(props) {
  console.log("props", props);
  const [loader, setLoader] = useState(false);
  const [reviewVal, setReviewVal] = useState();

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
  const capitalizeFirst = (s) => {
    if (typeof s !== "string") return "";
    return s.charAt(0).toUpperCase() + s.slice(1);
  };
  //   const getReviewCompletedAPI = async () => {
  //     setLoader(true);
  //     const res = await axios.get(`/api/v1/reviewComplited`);
  //     console.log("&&&reviewComplited", res?.data?.review);
  //     setReviewVal(res?.data?.review);
  //     setLoader(false);
  //     return res;
  //   };

  useEffect(() => {
    // reviewComplited

    // getReviewCompletedAPI();
    getReviewAPI();
  }, []);
  // count dialog
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
  // delete

  const deleteSpamAPI = async (id1) => {
    console.log("dddid", id1);
    // let review_id = [id1, id2];
    let review_by = id1;
    const res = await axios.delete(
      `/api/v1/reviewdelete?review_by=${review_by}`
    );
    console.log("&&&...", res);
    return res;
  };
  const [deleteRes, setDeleteRes] = useState();
  useEffect(() => {
    // reviewComplited

    getReviewAPI();
  }, [deleteRes]);

  const [deleteId, setDeleteId] = useState("");

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
      field: "reviewByFirstName,reviewByLastName",
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
                ? "Kristagram User"
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
                ? "Kristagram User"
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
      width: 120,
      flex: 1,
      minWidth: 120,
      renderCell: (params) => {
        return (
          <Stack>
            <Rating
              name="half-rating-read"
              defaultValue={params.row.review_rating}
              precision={0.5}
              readOnly
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
                console.log("params.row.review_by.id", params.row.id);
                // setDeleteId(params.row.id);
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
  reviewVal?.map((item) => {
    return rows.push({
      id: item?._id,
      createdAt: formatDate(item?.createdAt),
      // updatedAt: formatDate(item?.complited_pair?.review_to?.updatedAt),
      reviewByFirstName: item?.review_by?.first_name,
      reviewById: item?.review_by?._id,
      reviewByLastName: item?.review_by?.last_name,
      reviewToFirstName: item?.review_to?.first_name,
      reviewToLastName: item?.review_to?.last_name,
      review_comment: item?.review_comment,
      review_rating: item?.review_rating,
    });
  });

  //count API call
  const [loderCount, setLoaderCount] = useState();
  const [innerTableData, setInnerTableData] = useState();

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
            maxWidth={"sm"}
          >
            <BootstrapDialogTitle
              id="customized-dialog-title"
              onClose={handleCloseCountDialog}
            >
              Review to user Detail
            </BootstrapDialogTitle>
            <DialogContent dividers>
              <Typography>
                {loderCount ? (
                  <Box sx={{ textAlign: "center" }}>
                    <CircularProgress />
                  </Box>
                ) : (
                  <>
                    <p>
                      <b>Name : </b>
                      {innerTableData?.first_name +
                        " " +
                        innerTableData?.last_name}
                    </p>
                    <p>
                      <b>Review Rating : </b>
                      {innerTableData?.review_rating}
                    </p>

                    <p style={{ display: "flex", alignItems: "baseline" }}>
                      <b>Review Comment : </b>
                      <p className="title-width">
                        {" " + innerTableData?.review_comment}
                      </p>
                    </p>
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
              {"Are you sure you went to delete review ?"}
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
                onClick={async () => {
                  console.log("....", deleteId);
                  const res = await deleteSpamAPI(deleteId);
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
