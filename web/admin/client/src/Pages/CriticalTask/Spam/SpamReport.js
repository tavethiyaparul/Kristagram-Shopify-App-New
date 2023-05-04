import { React, useCallback, useEffect, useState } from "react";
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
  CardContent,
  Card,
} from "@mui/material";
import axios from "axios";
import CloseIcon from "@mui/icons-material/Close";

const SpamReport = () => {
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
  const [getSpamVal, setGetSpamVal] = useState();

  const getSpamAPI = async () => {
    setLoader(true);
    const res = await axios.get(`/api/v1/getspamreportcount`);
    console.log("&&&neww bar", res?.data?.spam);
    setGetSpamVal(res?.data?.spam);
    setLoader(false);
    return res;
  };

  const updateSpamAPI = async (user) => {
    const res = await axios.put(`/api/v1/updatespam`, user);
    // console.log("&&&update", res);
    return res;
  };
  const deleteSpamAPI = async (id) => {
    const res = await axios.delete(`/api/v1/deletespam/${id}`);
    // console.log("&&&", res);
    return res;
  };
  const [deleteId, setDeleteId] = useState("");
  const [deleteRes, setDeleteRes] = useState();
  useEffect(() => {
    getSpamAPI();
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
  const capitalizeFirst = (s) => {
    if (typeof s !== "string") return "";
    return s.charAt(0).toUpperCase() + s.slice(1);
  };
  //count API call
  const [loderCount, setLoaderCount] = useState();
  const [innerTableData, setInnerTableData] = useState();
  const [nameAndPhone, setNameAndPhone] = useState({
    code: "",
    name: "",
    phone: "",
  });

  console.log("innerrr", innerTableData);
  const columns = [
    // {
    //   align: "left",
    //   sortable: false,
    //   // editable: true,
    //   field: "phone",
    //   headerName: "Phone",
    //   width: 50,
    //   minWidth: 50,
    //   flex: 1,
    //   renderCell: (params) => {
    //     return (
    //       <Stack>
    //         <span>
    //           { params.row.phone
    //             ? params.row.country_code?params.row.country_code+ params.row.phone:params.row.phone
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
      field: "fromFirstName",
      headerName: "Reported By",
      width: 200,
      minWidth: 200,
      // flex: 1,
      renderCell: (params) => {
        return (
          <Stack>
            <span>
              <b>Name : </b>
              {params.row.fromFirstName
                ? capitalizeFirst(params.row.fromFirstName) +
                  " " +
                  capitalizeFirst(params.row.fromLastName)
                : "-"}
            </span>
            <span>
              <b>Phone : </b>
              {params.row.phone
                ? params.row.country_code
                  ? params.row.country_code + params.row.phone
                  : params.row.phone
                : "-"}
            </span>
          </Stack>
        );
      },
    },
    {
      align: "left",
      // editable: true,

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
      field: "category",
      headerName: "Category",
      width: 50,
      minWidth: 50,
      flex: 1,
      renderCell: (params) => {
        return (
          <div className="title-width">
            {params.row.category ? capitalizeFirst(params.row.category) : "-"}
          </div>
        );
      },
    },
    {
      align: "left",
      sortable: false,
      field: "content",
      headerName: "Content",
      width: 400,
      minWidth: 400,
      // flex: 1,
      renderCell: (params) => {
        return (
          <div>
            {params.row.content ? capitalizeFirst(params.row.content) : "-"}
          </div>
        );
      },
    },

    // {
    //   align: "left",
    //   sortable: false,
    //   field: "count",
    //   headerName: "Details",
    //   width: 50,
    //   minWidth: 50,
    //   flex: 1,
    //   renderCell: (params) => {
    //     return (
    //       <Stack>
    //         <button
    //           style={{ marginBottom: "5px" }}
    //           onClick={async () => {
    //             const res = await axios.get(
    //               `/api/v1/getspamreportcount`
    //             );
    //             console.log("&&&getttt", res?.data?.spam);
    //             setInnerTableData(res?.data?.spam);
    //             handleClickOpenCountDialog();
    //           }}
    //         >
    //           <b>View Details </b>
    //         </button>
    //       </Stack>
    //     );
    //   },
    // },
    // {
    //   align: "center",
    //   sortable: false,
    //   field: "action",
    //   headerName: "Action",
    //   minWidth: 100,
    //   width: 100,
    //   flex: 1,
    //   renderCell: (params) => {
    //     return (
    //       <div>
    //         <Button
    //           className="edithover"
    //           startIcon={<Delete style={{ color: "red", fontSize: 30 }} />}
    //           onClick={async () => {
    //             console.log("params.row.id", params.row.id);
    //             setDeleteId(params.row.id);
    //             handleClickOpenDialog();

    //             // getSpamAPI()
    //           }}
    //         ></Button>
    //       </div>
    //     );
    //   },
    // },
  ];

  const columns2 = [
    // {
    //   align: "left",
    //   sortable: false,
    //   // editable: true,
    //   field: "phone",
    //   headerName: "Phone",
    //   width: 50,
    //   minWidth: 50,
    //   flex: 1,
    //   renderCell: (params) => {
    //     return (
    //       <Stack>
    //         <span>
    //           {params.row.phone
    //             ? params.row.country_code?params.row.country_code+ params.row.phone:params.row.phone
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
      field: "toFirstName",
      headerName: "Reported To",
      width: 200,
      minWidth: 200,
      // flex: 1,
      renderCell: (params) => {
        return (
          <Stack>
            <span>
              <b>Name : </b>
              {params.row.toFirstName
                ? capitalizeFirst(params.row.toFirstName) +
                  " " +
                  capitalizeFirst(params.row.toLastName)
                : "-"}
            </span>
            <span>
              <b>Phone : </b>
              {params.row.phone
                ? params.row.country_code
                  ? params.row.country_code + params.row.phone
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
      field: "spamCategory",
      headerName: "Category",
      width: 50,
      minWidth: 50,
      flex: 1,
      renderCell: (params) => {
        return (
          <Stack>
            <span>
              {params.row.spamCategory
                ? capitalizeFirst(params.row.spamCategory)
                : "-"}
            </span>
          </Stack>
        );
      },
    },
    {
      align: "left",
      sortable: false,
      field: "content",
      headerName: "Content",
      width: 400,
      minWidth: 400,
      flex: 1,
      renderCell: (params) => {
        return (
          <div>
            {params.row.content ? capitalizeFirst(params.row.content) : "-"}
          </div>
        );
      },
    },

    {
      align: "left",
      // editable: true,

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
      field: "count",
      headerName: "Details",
      width: 50,
      minWidth: 50,
      flex: 1,
      renderCell: (params) => {
        return (
          <Stack>
            <button
              style={{ marginBottom: "5px" }}
              onClick={async () => {
                // console.log(
                //   "params.row.spam_user_id",
                //   params.row.spam_user_id._id
                // );
                const res = await axios.get(
                  `/api/v1/getspamreportcount2/${params.row.spam_user_id._id}`
                );
                console.log("&&&getttt inner", res?.data);
                setInnerTableData(res?.data?.spam);
                handleClickOpenCountDialog();
                setNameAndPhone({
                  code: params.row.country_code,
                  name: params.row.toFirstName + params.row.toLastName,
                  phone: params.row.phone,
                });
              }}
            >
              <b>
                {params.row.count
                  ? "Count : " + params.row.count
                  : "Count : " + 0}{" "}
              </b>
            </button>
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
    //   headerName: "Count",
    //   width: 50,
    //   minWidth: 50,
    //   flex: 1,
    //   renderCell: (params) => {
    //     return (
    //       <Stack>
    //         <button
    //           style={{ marginBottom: "5px" }}
    //           onClick={async () => {
    //             // call API
    //            console.log("iddd",params.row.spam_user_id._id)
    //            //params.row.id
    //            const res = await axios.get(`/api/v1/getspamreportcount/${params.row.spam_user_id._id}`);
    //            console.log("&&&getttt", res?.data?.spam);
    //            setInnerTableData(res?.data?.spam)

    //             handleClickOpenCountDialog();
    //           }}
    //         >
    //           <b>View Details </b>

    //         </button>
    //       </Stack>
    //     );
    //   },
    // },
    // {
    //   align: "center",
    //   sortable: false,
    //   field: "action",
    //   headerName: "Action",
    //   minWidth: 100,
    //   width: 100,
    //   flex: 1,
    //   renderCell: (params) => {
    //     return (
    //       <div>
    //         <Button
    //           className="edithover"
    //           startIcon={<Delete style={{ color: "red", fontSize: 30 }} />}
    //           onClick={async () => {
    //             console.log("params.row.id", params.row.id);
    //             setDeleteId(params.row.id);
    //             handleClickOpenDialog();

    //             // getSpamAPI()
    //           }}
    //         ></Button>
    //       </div>
    //     );
    //   },
    // },
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
  innerTableData?.map((item) => {
    return rows.push({
      id: item?._id,

      createdAt: formatDate(item?.createdAt),
      updatedAt: formatDate(item?.updatedAt),
      fromFirstName: item?.user_id?.first_name,
      phone: item?.user_id?.phone,
      country_code: item?.user_id?.country_code,
      fromLastName: item?.user_id?.last_name,
      content: item?.content,
      category: item?.spam_type_id?.content,
    });
  });

  const rows2 = [];
  getSpamVal?.map((item) => {
    return rows2.push({
      id: item?._id,
      count: item?.count,
      spam_user_id: item?.spam_user_id,
      status: item?.status,
      spamCategory: item?.spam_type_id?.content,
      content: item?.content,
      createdAt: formatDate(item?.createdAt),
      updatedAt: formatDate(item?.updatedAt),
      country_code: item?.spam_user_id?.country_code,
      phone: item?.spam_user_id?.phone,
      toFirstName: item?.spam_user_id?.first_name,
      toLastName: item?.spam_user_id?.last_name,
      fraudContent: item?.spam_type_id?.content,
    });
  });

  const useFakeMutation = () => {
    return useCallback(
      (user) =>
        new Promise((resolve, reject) =>
          setTimeout(async () => {
            // console.log("....user", user);
            const response = await updateSpamAPI(user);
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
                rowHeight={80}
                rows={rows2}
                columns={columns2}
                pageSize={10}
                rowsPerPageOptions={[10]}
                // experimentalFeatures={{ newEditingApi: true }}
                hideFooterSelectedRowCount={true}
                processRowUpdate={processRowUpdate}
                // disableColumnMenu={true}
              />
            </Box>
          </div>

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
                  const res = deleteSpamAPI(deleteId);
                  setDeleteRes(res);
                  handleCloseDialog();
                }}
                autoFocus
              >
                Agree
              </Button>
            </DialogActions>
          </Dialog>

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
              {"User Details " +
                " ( " +
                nameAndPhone.name +
                " , " +
                nameAndPhone.code +
                nameAndPhone.phone +
                " )"}
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
                          rowHeight={80}
                          rows={rows}
                          columns={columns}
                          pageSize={10}
                          rowsPerPageOptions={[10]}
                          // experimentalFeatures={{ newEditingApi: true }}
                          hideFooterSelectedRowCount={true}
                          processRowUpdate={processRowUpdate}
                          // disableColumnMenu={true}
                        />
                      </Box>
                      {/* <Card>
                        <CardContent>
                          <div>
                            <div
                              style={{
                                justifyContent: "space-between",
                                display: "flex",
                                alignItems: "center",
                              }}
                            ></div>
                            <p>
                              <b>Name : </b>
                              {innerTableData
                                ? "- "+capitalizeFirst(
                                    innerTableData[0]?.spam_user_id?.first_name
                                  ) +
                                  " " +
                                  capitalizeFirst(
                                    innerTableData[0]?.spam_user_id?.last_name
                                  )
                                : "-"}
                            </p>

                            <div style={{ display: "flex" }}>
                              <b>Phone : </b>
                              {innerTableData
                                ? "- "+innerTableData[0]?.spam_user_id?.phone
                                : "-"}
                            </div>
                          </div>
                        </CardContent>
                      </Card> */}
                    </div>
                  </>
                )}
              </Typography>
            </DialogContent>
          </BootstrapDialog>
        </div>
      )}
    </div>
  );
};

export default SpamReport;
