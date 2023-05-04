import React, { useEffect, useState } from "react";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import PersistentDrawer from "../../components/persistentDrawer";
import {
  getAllDataApi,
  getCountApi,
  deleteUser,
  getUserDetailsAdmin,
  userStatusEdit,
  setLocationValue,
  getAllFollowersApi,
  getAllFollowingsApi,
  getLocationApi,
  getTokenCheck,
} from "../../API/api";
import Box from "@mui/material/Box";
import { DataGrid, gridClasses } from "@mui/x-data-grid";
import Button from "@mui/material/Button";
import Avatar from "@mui/material/Avatar";
import Dialog from "@mui/material/Dialog";
import CardMedia from "@mui/material/CardMedia";
import Stack from "@mui/material/Stack";
import { useNavigate } from "react-router-dom";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import FormControl from "@mui/material/FormControl";

import instagram from "../../assets/images/ic_instagram_logo_icon.png";

import facebook from "../../assets/images/ic_facebook_1.png";
import youtube from "../../assets/images/ic_youtube_icon.png";
import instagramBlur from "../../assets/images/ic_instagram_disable.png";
import facebookBlur from "../../assets/images/ic_facebook_disable.png";
import youtubeBlur from "../../assets/images/ic_youtube_disable.png";
import Delete from "@mui/icons-material/Delete";
import Chip from "@mui/material/Chip";
import {
  CircularProgress,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  styled,
  TextField,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import Typography from "@mui/material/Typography";
import "../../assets/css/profile.css";
import SpamReport from "./SpamReport";
import WishList from "./WishList";
import ReviewDisplay from "./Review/ReviewDisplay";
import ReviewPending from "./Review/ReviewPending";
import Rent from "./Rent";

const Admin = () => {
  const navigate = useNavigate();

  // edit aprove,pending,suspend user from critical admin
  const [userStatus, setUserStatus] = useState();
  // image dialog open
  const [open, setOpen] = useState(false);
  // dialog image url
  const [img, setImg] = useState("");
  // all arr manage by tab
  const [arr, setarr] = useState([]);
  const [arrLoader, setArrLoader] = useState(false);
  // pagination values
  const [pageState, setPageState] = useState({
    isLoading: false,
    total: 0,
    page: 1,
    pageSize: 5,
  });
  // brand tab value
  const [tabVal, setTabVal] = useState(0);
  // influencer tab value
  const [tabValIns, setTabValIns] = useState(0);
  // main 2 tab value
  const [mainTabVal, setMainTabVal] = useState(0);
  // customer tab value
  const [customerTabVal, setCustomerTabVal] = useState(0);
  // delete user flag
  const [flag, setFlag] = useState(false);
  // approve,pending,suspend total value count
  const [totalVal, setTotalVal] = useState({
    allBrand: 0,
    approvedBrand: 0,
    suspendBrand: 0,
    pendingBrand: 0,
    allInfluencer: 0,
    approvedInfluencer: 0,
    suspendInfluencer: 0,
    pendingInfluencer: 0,
    allCustomer: 0,
    totalRecordes: 0,
  });
  // delete dialog open close
  const [deleteDialog, setDeleteDialog] = useState(false);
  // delete dialog open close
  const [testDialog, setTestDialog] = useState(false);
  // pass selected user id to delete action
  const [deleteIdParams, setDeleteIdParams] = useState("");
  // status [approve,panding,suspend] refresh karavva mate
  const [statusRef, setStatusRef] = useState("");
  // id through data get kare [ edit button par ]
  const [editAllData, setEditData] = useState();
  // country set karavva dropdown field ma
  const [dropDownVal, setDropDownVal] = useState({
    state: "",
    country: "",
    city: "",
    pin_code: "",
    id: "",
    currency: "",
    test_user: false,
  });
  // edit dialog
  const [editopen, seteditOpen] = useState(false);

  //delete dialog open
  const handleClickOpenDialog = () => {
    setDeleteDialog(true);
  };

  // delete dialog close
  const handleCloseDialog = () => {
    setDeleteDialog(false);
  };

  //test user dialog open
  const handleClickOpenTestDialog = () => {
    setTestDialog(true);
  };

  // test user dialog close
  const handleCloseTestDialog = () => {
    setTestDialog(false);
  };

  // status update api call
  const userStatusUpdate = async (status) => {
    let data = {
      status: status,
      userId: userStatus,
    };
    let res = await userStatusEdit(data);
  };

  //image open dialog
  const handleClickOpen = () => {
    setOpen(true);
  };

  //image close dialog
  const handleClose = () => {
    setOpen(false);
  };

  // country details API
  const [location, setLocation] = useState();

  const getData = async () => {
    const res = await getLocationApi();
    setLocation(res?.data?.country);
  };
  useEffect(() => {
    getData();
  }, []);

  // dropdown height width setting
  const ITEM_HEIGHT = 48;
  const ITEM_PADDING_TOP = 8;
  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: 200,
      },
    },
  };

  // flag value from admin details
  const [adminFlagVal, setAdminFlag] = useState("");
  const [vv, setvv] = useState("");
  // get admin data api
  const userAdminData = async () => {
    const responce = await getUserDetailsAdmin();
    console.log("responce************", responce);
    setvv(responce);
    setAdminFlag(responce?.data?.users?.flag);
  };
  const [res, setRes] = useState("");
  useEffect(() => {
    userAdminData();
    if (!document.cookie) {
      navigate("/");
    }
  }, [document.cookie]);

  useEffect(() => {
    console.log("document.cookie", document.cookie);
    if (res) {
      navigate("/admin");
    } else if (res === null) {
      document.cookie = "token=; Max-Age=0;secure";
      navigate("/");
    }
  }, [res]);

  const [tokenCheck, setTokenCheck] = useState("");

  const tokenCheckAPI = async () => {
    const responce = await getTokenCheck();
    setRes(responce.data.users);
    // for token check
    setTokenCheck(responce.data.users.token);
  };

  useEffect(() => {
    userAdminData();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      userAdminData();
      tokenCheckAPI();
      if (!tokenCheck) {
        window.location.reload();
        setTokenCheck("");
      } else {
        setTokenCheck("");
      }
      setTokenCheck("");
    }, 10000);
    return () => clearInterval(interval);
  });

  useEffect(() => {
    tokenCheckAPI();
  }, []);

  const [locationValRes, setLocationValRes] = useState();
  useEffect(() => {
    countData();
    if (mainTabVal === 0) {
      tabVal === 0 && mainTabVal === 0
        ? getAllData("brand", "approved")
        : tabVal === 1
        ? getAllData("brand", "pending")
        : tabVal === 2
        ? getAllData("brand", "suspended")
        : tabVal === 3
        ? getAllData("brand")
        : getAllData("brand", "", true);
    } else if (mainTabVal === 1) {
      tabValIns === 0 && mainTabVal === 1
        ? getAllData("influencer", "approved")
        : tabValIns === 1
        ? getAllData("influencer", "pending")
        : tabValIns === 2
        ? getAllData("influencer", "suspended")
        : tabValIns === 3
        ? getAllData("influencer")
        : getAllData("influencer", "", true);
    } else if (mainTabVal === 2) {
      getAllData("customer");
      mainTabVal === 2 && customerTabVal === 0
        ? getAllData()
        : customerTabVal === 1
        ? getAllData("customer")
        : getAllData("customer", "", true);
    }
  }, [
    pageState.page,
    pageState.pageSize,
    flag,
    statusRef,
    locationValRes,
    // dropDownVal,
    // editopen,
  ]);
  const [loder, setLoader] = useState();

  const getFollowers = async (id) => {
    setLoader(true);
    const res = await getAllFollowersApi(id);
    setAllFollower(res?.data?.user[0]?.followers);
    setLoader(false);
  };

  const getFollowing = async (id) => {
    setLoader(true);
    const res = await getAllFollowingsApi(id);
    setAllFollowing(res?.data?.user[0]?.following);
    setLoader(false);
  };

  // each field wise count data api
  const countData = async () => {
    const res = await getCountApi();
    setTotalVal({
      allBrand: res.data.brandCount,
      approvedBrand: res.data.brandApprovedCount,
      suspendBrand: res.data.brandSuspendCount,
      pendingBrand: res.data.brandPendingCount,
      allInfluencer: res.data.infuencerCount,
      approvedInfluencer: res.data.infuencerApprovedCount,
      suspendInfluencer: res.data.infuencerSuspendCount,
      pendingInfluencer: res.data.infuencerPendingCount,
      allCustomer: res.data.customerCount,
      totalRecordes: res.data.total_records,
    });
  };

  // get all user data api call
  const getAllData = async (brand, status, test_user) => {
    setArrLoader(true);
    countData();
    console.log("test_user", test_user);
    setPageState((old) => ({ ...old, isLoading: true }));
    const response = await getAllDataApi(
      pageState.pageSize,
      pageState.page,
      brand,
      status,
      test_user
    );
    console.log("response response", response);

    setarr(response.data.user);
    setArrLoader(false);
    setPageState((old) => ({
      ...old,
      total: response.data.total_records,
      isLoading: false,
    }));
  };

  // delete data api call
  const deleteData = async (id) => {
    const val = await deleteUser(id);
    setFlag(true);
    return val.data;
  };

  // followe list usestate
  const [allFollower, setAllFollower] = useState();

  //following
  const [allFollowing, setAllFollowing] = useState();
  const useStyles = styled({
    red: {
      backgroundColor: "red",
    },
  });
  const capitalizeFirst = (s) => {
    if (typeof s !== "string") return "";
    return s.charAt(0).toUpperCase() + s.slice(1);
  };
  const columns = [
    {
      align: "center",
      sortable: false,
      field: "image",
      headerName: "Image",
      minWidth: 80,
      width: 80,
      flex: 1,
      renderCell: (params) => {
        return (
          <Stack>
            <span>
              <Avatar
                sx={{
                  height: "50px",
                  width: "50px",
                }}
                alt="Kristagram"
                src={params.row.values.image}
                onClick={() => {
                  setImg(params.row.values.image);
                  handleClickOpen();
                }}
              />
            </span>
          </Stack>
        );
      },
    },
    mainTabVal == 0
      ? {
          align: "center",
          sortable: false,
          field: "coverImage",
          headerName: "Banner",
          minWidth: 80,
          width: 80,
          flex: 1,
          renderCell: (params) => {
            return (
              <Stack>
                <span>
                  <Avatar
                    sx={{
                      height: "50px",
                      width: "50px",
                    }}
                    alt="Kristagram"
                    src={params.row.values.coverImage}
                    onClick={() => {
                      setImg(params.row.values.coverImage);
                      handleClickOpen();
                    }}
                  />
                </span>
              </Stack>
            );
          },
        }
      : {
          hide: true,
        },
    {
      align: "center",
      sortable: false,
      field: "api_version",
      headerName: "API",
      width: 50,
      minWidth: 50,
      flex: 1,
      renderCell: (params) => {
        return (
          <Stack>
            <span>
              {params.row.values.api_version
                ? params.row.values.api_version
                : "-"}
            </span>
          </Stack>
        );
      },
    },
    mainTabVal === 2 && customerTabVal === 0
      ? {
          align: "center",
          sortable: false,
          field: "type_of_user",
          headerName: "Type",
          width: 100,
          minWidth: 100,
          flex: 1,
          renderCell: (params) => {
            return (
              <Stack>
                <span>
                  {params.row.values.type_of_user
                    ? params.row.values.type_of_user
                    : "-"}
                </span>
              </Stack>
            );
          },
        }
      : {
          hide: true,
        },
    {
      sortable: false,
      field: "phone",
      headerName: "User Information",
      minWidth: 200,
      width: 200,
      flex: 1,
      renderCell: (params) => {
        return (
          <Stack>
            <span>
              <b>Name : </b>
              {params.row.values.brand_type_of_brand === "offline"
                ? params.row.values.business_name
                  ? capitalizeFirst(params.row.values.business_name)
                  : "Kristagram User"
                : params.row.values.brand_type_of_brand === "online"
                ? `${
                    params.row.values.first_name
                      ? capitalizeFirst(params.row.values.first_name)
                      : "Kristagram User"
                  }${" "}${
                    params.row.values.last_name
                      ? capitalizeFirst(params.row.values.last_name)
                      : " "
                  }`
                : `${
                    params.row.values.first_name
                      ? capitalizeFirst(params.row.values.first_name)
                      : "Kristagram User"
                  }${" "}${
                    params.row.values.last_name
                      ? capitalizeFirst(params.row.values.last_name)
                      : " "
                  }`}
            </span>
            <span>
              <b>Phone :</b> {params.row.values.phone}
            </span>
            {mainTabVal == 2 ? (
              ""
            ) : (
              <span>
                <b>Type : </b>
                {params.row.values.type_of_user === "brand"
                  ? params.row.values.brand_type_of_brand
                    ? params.row.values.brand_type_of_brand
                    : " - "
                  : params.row.values.inf_type === "price"
                  ? params.row.values.cost
                  : params.row.values.inf_type === "barter"
                  ? params.row.values.inf_type
                  : " - "}
              </span>
            )}
          </Stack>
        );
      },
    },

    {
      align: "center",
      sortable: false,
      field: "currency",
      headerName: "Currency",
      width: 80,
      flex: 1,
      minWidth: 80,
      renderCell: (params) => {
        return (
          <Stack>
            <span>
              {params.row.values.currency ? params.row.values.currency : "-"}
            </span>
          </Stack>
        );
      },
    },
    {
      sortable: false,
      field: "createdAt",
      headerName: "CreatedAt",
      width: 120,
      flex: 1,
      minWidth: 120,
      renderCell: (params) => {
        return (
          <Stack>
            <span>
              {params.row.values.createdAt.split(",")[0]}
              {" , "}
              <br /> {params.row.values.createdAt.split(",")[1]}
            </span>
          </Stack>
        );
      },
    },
    {
      sortable: false,
      field: "updatedAt",
      headerName: "UpdatedAt",
      minWidth: 120,
      width: 120,
      flex: 1,
      renderCell: (params) => {
        return (
          <Stack>
            <span>
              {params.row.values.updatedAt.split(",")[0]}
              {" , "}
              <br /> {params.row.values.updatedAt.split(",")[1]}
            </span>
          </Stack>
        );
      },
    },
    mainTabVal == 2
      ? { hide: true }
      : {
          sortable: false,
          field: "following_count",
          headerName: "Network",
          width: 130,
          flex: 1,
          minWidth: 130,
          renderCell: (params) => {
            return (
              <Stack>
                <span>
                  <button
                    style={{ marginBottom: "5px" }}
                    onClick={async () => {
                      await getFollowing(params.row.values.id);

                      handleClickOpenFollowingDialog();
                    }}
                  >
                    <b>Following : </b>
                    {params.row.values.following_count
                      ? params.row.values.following_count
                      : " 0 "}
                  </button>

                  <br />
                  <button
                    onClick={async () => {
                      await getFollowers(params.row.values.id);
                      handleClickOpenFollowerDialog();
                    }}
                  >
                    <b>Followers : </b>
                    {params.row.values.followers_count
                      ? params.row.values.followers_count
                      : " 0 "}
                  </button>
                </span>
              </Stack>
            );
          },
        },
    {
      sortable: false,
      field: "location",
      headerName: "Location",
      width: 180,
      flex: 1,
      minWidth: 180,
      renderCell: (params) => {
        return (
          <Stack>
            <span>
              {params.row.values.city ? params.row.values.city : "-"}
              {params.row.values.city ? " , " : ""}
              {params.row.values.state ? params.row.values.state : "-"}
              {params.row.values.state ? " , " : ""}
              <br />
              {params.row.values.country ? params.row.values.country : "-"}
              {params.row.values.country ? " , " : ""}
              {params.row.values.pin_code ? params.row.values.pin_code : "-"}
            </span>
          </Stack>
        );
      },
    },
    {
      sortable: false,
      field: "tags",
      headerName: "Tags",
      width: 100,
      flex: 1,
      minWidth: 100,
      renderCell: (params) => {
        return params.row.values.tags ? (
          <Stack>
            <span>
              {params.row.values.tags.map((e) => {
                return (
                  <div style={{ marginBottom: "5px" }}>
                    <Chip
                      label={`${e.name}`}
                      variant="outlined"
                      size="small"
                      style={{ borderRadius: "3px" }}
                    />
                  </div>
                );
              })}
            </span>
          </Stack>
        ) : (
          " - "
        );
      },
    },

    mainTabVal == 0
      ? {
          align: "center",
          sortable: false,
          field: "products",
          headerName: "Products",
          width: 100,
          flex: 1,
          minWidth: 100,
          renderCell: (params) => {
            return (
              <p style={{ justifyContent: "center" }}>
                {params.row.values.productcount
                  ? params.row.values.productcount
                  : " 0 "}
              </p>
            );
          },
        }
      : { hide: true },

    mainTabVal == 0
      ? {
          align: "center",
          sortable: false,
          field: "campaign",
          headerName: "Campaign",
          width: 100,
          flex: 1,
          minWidth: 100,
          renderCell: (params) => {
            return (
              <p>
                {params.row.values.campaigncount
                  ? params.row.values.campaigncount
                  : " 0 "}
              </p>
            );
          },
        }
      : { hide: true },

    adminFlagVal == "true" && (mainTabVal == 0 || mainTabVal == 1)
      ? {
          sortable: false,
          field: "Social_Media",
          headerName: "Social Media",
          width: 190,
          flex: 1,
          minWidth: 190,
          renderCell: (params) => {
            return (
              <Stack>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: "5px",
                  }}
                >
                  {params.row.values.instagram_username ? (
                    <img
                      src={instagram}
                      alt="logo"
                      style={{
                        height: "20px",
                        width: "20px",
                        marginRight: "4px",
                      }}
                    />
                  ) : (
                    <img
                      src={instagramBlur}
                      alt="logo"
                      style={{
                        height: "20px",
                        width: "20px",
                        marginRight: "4px",
                      }}
                    />
                  )}

                  <a
                    href={`https://www.instagram.com/${params.row.values.instagram_username}`}
                    target="_blank"
                    style={{ textDecoration: "none", color: "blue" }}
                  >
                    {" "}
                    {params.row.values.instagram_username
                      ? params.row.values.instagram_username
                      : "-"}
                  </a>
                  {params.row.values.instagram_username ? " , " : ""}
                  {params.row.values.instagram_followers
                    ? params.row.values.instagram_followers
                    : "-"}
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: "5px",
                  }}
                >
                  {params.row.values.facebook_username ? (
                    <img
                      src={facebook}
                      alt="logo"
                      style={{
                        height: "20px",
                        width: "20px",
                        marginRight: "4px",
                      }}
                    />
                  ) : (
                    <img
                      src={facebookBlur}
                      alt="logo"
                      style={{
                        height: "20px",
                        width: "20px",
                        marginRight: "4px",
                      }}
                    />
                  )}
                  <a
                    href={`https://www.facebook.com/${params.row.values.facebook_username}`}
                    target="_blank"
                    style={{ textDecoration: "none", color: "blue" }}
                  >
                    {" "}
                    {params.row.values.facebook_username
                      ? params.row.values.facebook_username
                      : "-"}
                  </a>

                  {params.row.values.facebook_username ? " , " : ""}
                  {params.row.values.facebook_followers
                    ? params.row.values.facebook_followers
                    : "-"}
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: "5px",
                  }}
                >
                  {params.row.values.youtube_username ? (
                    <img
                      src={youtube}
                      alt="logo"
                      style={{
                        height: "20px",
                        width: "20px",
                        marginRight: "4px",
                      }}
                    />
                  ) : (
                    <img
                      src={youtubeBlur}
                      alt="logo"
                      style={{
                        height: "20px",
                        width: "20px",
                        marginRight: "4px",
                      }}
                    />
                  )}
                  <a
                    href={`https://www.youtube.com/@${params.row.values.youtube_username}`}
                    target="_blank"
                    style={{ textDecoration: "none", color: "blue" }}
                  >
                    {" "}
                    {params.row.values.youtube_username
                      ? params.row.values.youtube_username
                      : "-"}
                  </a>
                  {params.row.values.youtube_username ? " , " : ""}
                  {params.row.values.youtube_followers
                    ? params.row.values.youtube_followers
                    : "-"}
                </div>
              </Stack>
            );
          },
        }
      : { hide: true },
    adminFlagVal == "true" &&
    (mainTabVal == 0 || mainTabVal == 1 || mainTabVal == 2)
      ? {
          align: "center",
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
                    setDropDownVal({
                      city: params.row.values.city,
                      country: params.row.values.country,
                      state: params.row.values.state,
                      pin_code: params.row.values.pin_code,
                      id: params.row.values.id,
                      currency: params.row.values.currency,
                      test_user: params?.row?.values?.test_user,
                    });

                    setEditData(params.row.values);
                    handleClickOpenEdit();
                  }}
                ></Button>
              </div>
            );
          },
        }
      : {
          hide: true,
        },
  ];

  const rows = [];
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
  arr.map((item, i) => {
    return rows.push({
      id: i + 1,
      values: {
        image: item?.profile_image,
        coverImage: item?.cover_image,
        id: item?._id,
        phone: item?.phone,
        createdAt: formatDate(item?.createdAt),
        updatedAt: formatDate(item?.updatedAt),
        brand_type_of_brand: item?.brands?.type_of_brand,
        inf_type: item?.costs?.transaction_type,
        business_name: item?.brands?.business_name,
        cost: item?.costs?.cost,
        type_of_user: item?.type_of_user,
        first_name: item?.first_name,
        last_name: item?.last_name,
        status: item?.profile_status,
        tags: item?.tags,
        instagram_username: item?.instagram_username,
        instagram_followers: item?.instagram_followers,
        facebook_username: item?.facebook_username,
        facebook_followers: item?.facebook_followers,
        youtube_username: item?.youtube_username,
        youtube_followers: item?.youtube_followers,
        following_count: item?.followingcount,
        followers_count: item?.followerscount,
        pin_code: item?.pin_code,
        city: item?.city,
        state: item?.state,
        country: item?.country,
        api_version: item?.api_version,
        followers: item?.followers,
        following: item?.following,
        campaigncount: item?.campaigncount,
        productcount: item?.productcount,
        currency: item?.currency,
        test_user: item?.test_user,
      },
    });
  });

  const data = arrLoader ? (
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
  ) : arr?.length == 0 ? (
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
    <Box sx={{ height: 630, width: "100%" }}>
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
        getRowClassName={(params) => {
          return params.row.values.test_user === true ? "Mui-even" : "";
        }}
        rowHeight={100}
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
        onPageSizeChange={(newPageSize) =>
          setPageState((old) => ({ ...old, pageSize: newPageSize }))
        }
        disableColumnMenu={true}
        hideFooterSelectedRowCount={true}
        // disableSelectionOnClick={true}
      />
    </Box>
  );

  const [age, setAge] = React.useState("");

  const handleChange = (event) => {
    setAge(event.target.value);
  };
  // open edit dialog
  const handleClickOpenEdit = () => {
    seteditOpen(true);
  };

  // close edit dialog
  const handleCloseEdit = (value) => {
    seteditOpen(false);
  };

  // follower follwing list show dialog

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
            <CloseIcon onClick={handleCloseFollowerDialog} />
          </IconButton>
        ) : null}
      </DialogTitle>
    );
  }

  const [openFollowerDialog, setOpenFollowerDialog] = React.useState(false);
  const [openFollowingDialog, setOpenFollowingDialog] = React.useState(false);
  const handleClickOpenFollowerDialog = () => {
    setOpenFollowerDialog(true);
  };
  const handleCloseFollowerDialog = () => {
    setOpenFollowerDialog(false);
  };

  const handleClickOpenFollowingDialog = () => {
    setOpenFollowingDialog(true);
  };
  const handleCloseFollowingDialog = () => {
    setOpenFollowingDialog(false);
  };

  return (
    <div style={{ padding: "10px", paddingLeft: "250px" }}>
      <PersistentDrawer />
      <Tabs>
        <TabList>
          <Tab
            onClick={async () => {
              pageState.page = 1;
              countData();
              await getAllData("brand", "approved");
              setMainTabVal(0);
              tabVal === 0
                ? getAllData("brand", "approved")
                : tabVal === 1
                ? getAllData("brand", "pending")
                : tabVal === 2
                ? getAllData("brand", "suspended")
                : getAllData("brand");
            }}
          >
            Brand
          </Tab>
          <Tab
            onClick={() => {
              pageState.page = 1;
              countData();
              getAllData("influencer", "approved");
              setMainTabVal(1);
              tabValIns === 0
                ? getAllData("influencer", "approved")
                : tabValIns === 1
                ? getAllData("influencer", "pending")
                : tabValIns === 2
                ? getAllData("influencer", "suspended")
                : getAllData("influencer");
            }}
          >
            Influencer
          </Tab>
          <Tab
            onClick={async () => {
              pageState.page = 1;
              countData();
              getAllData();
              setMainTabVal(2);
              customerTabVal === 0
                ? getAllData()
                : customerTabVal === 1
                ? getAllData("customer")
                : getAllData("customer", "", true);
            }}
          >
            Customer
          </Tab>
          <Tab>Spam Report</Tab>
          <Tab>Review</Tab>
          <Tab>Wishlist</Tab>
          <Tab>Rent</Tab>
        </TabList>
        <TabPanel>
          <Tabs>
            <TabList>
              <Tab
                onClick={() => {
                  pageState.page = 1;
                  countData();
                  setTabVal(0);
                  getAllData("brand", "approved");
                }}
              >
                Approve ({totalVal.approvedBrand})
              </Tab>
              <Tab
                onClick={() => {
                  pageState.page = 1;
                  countData();
                  setTabVal(1);
                  getAllData("brand", "pending");
                }}
              >
                Pending ({totalVal.pendingBrand})
              </Tab>
              <Tab
                onClick={() => {
                  pageState.page = 1;
                  countData();
                  setTabVal(2);
                  getAllData("brand", "suspended");
                }}
              >
                Suspend ({totalVal.suspendBrand})
              </Tab>
              <Tab
                onClick={() => {
                  pageState.page = 1;
                  countData();
                  setTabVal(3);
                  getAllData("brand");
                }}
              >
                All ({totalVal.allBrand})
              </Tab>
              <Tab
                onClick={() => {
                  pageState.page = 1;
                  setTabVal(4);
                  getAllData("brand", "", true);
                }}
              >
                Test User
              </Tab>
            </TabList>
            <TabPanel>{data}</TabPanel>
            <TabPanel>{data}</TabPanel>
            <TabPanel>{data}</TabPanel>
            <TabPanel>{data}</TabPanel>
            <TabPanel>{data}</TabPanel>
          </Tabs>
        </TabPanel>
        <TabPanel>
          <Tabs>
            <TabList>
              <Tab
                onClick={() => {
                  pageState.page = 1;
                  countData();
                  setTabValIns(0);
                  getAllData("influencer", "approved");
                }}
              >
                Approve ({totalVal.approvedInfluencer})
              </Tab>
              <Tab
                onClick={() => {
                  pageState.page = 1;
                  countData();
                  setTabValIns(1);
                  getAllData("influencer", "pending");
                }}
              >
                Pending ({totalVal.pendingInfluencer})
              </Tab>
              <Tab
                onClick={() => {
                  pageState.page = 1;
                  countData();
                  setTabValIns(2);
                  getAllData("influencer", "suspended");
                }}
              >
                Suspend ({totalVal.suspendInfluencer})
              </Tab>
              <Tab
                onClick={() => {
                  pageState.page = 1;
                  countData();
                  setTabValIns(3);
                  getAllData("influencer");
                }}
              >
                All ({totalVal.allInfluencer})
              </Tab>
              <Tab
                onClick={() => {
                  pageState.page = 1;
                  setTabValIns(4);
                  getAllData("influencer", "", true);
                }}
              >
                Test User
              </Tab>
            </TabList>
            <TabPanel>{data}</TabPanel>
            <TabPanel>{data}</TabPanel>
            <TabPanel>{data}</TabPanel>
            <TabPanel>{data}</TabPanel>
            <TabPanel>{data}</TabPanel>
          </Tabs>
        </TabPanel>
        <TabPanel>
          <Tabs>
            <TabList>
              <Tab
                onClick={async () => {
                  pageState.page = 1;
                  countData();
                  setCustomerTabVal(0);
                  getAllData();
                }}
              >
                All ({totalVal.totalRecordes})
              </Tab>
              <Tab
                onClick={async () => {
                  pageState.page = 1;
                  countData();
                  setCustomerTabVal(1);
                  getAllData("customer");
                }}
              >
                Only User({totalVal.allCustomer})
              </Tab>
              <Tab
                onClick={() => {
                  pageState.page = 1;
                  setCustomerTabVal(2);
                  getAllData("customer", "", true);
                }}
              >
                Test User
              </Tab>
            </TabList>
            <TabPanel>{data}</TabPanel>
            <TabPanel>{data}</TabPanel>
            <TabPanel>{data}</TabPanel>
          </Tabs>
        </TabPanel>
        <TabPanel>
          <SpamReport />
        </TabPanel>
        <TabPanel>
          <Tabs>
            <TabList>
              <Tab>Completed</Tab>
              <Tab>Pending</Tab>
            </TabList>
            <TabPanel>
              <ReviewDisplay status={true} />
            </TabPanel>
            <TabPanel>
              <ReviewPending status={false} />
            </TabPanel>
          </Tabs>
        </TabPanel>
        <TabPanel>
          <WishList />
        </TabPanel>
        <TabPanel>
          <Rent />
        </TabPanel>
      </Tabs>
      {/* image dialog */}
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <CardMedia component="img" image={img} alt="Kristagram" />
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
              deleteData(deleteIdParams);
              handleCloseDialog();
              handleCloseEdit();
            }}
            autoFocus
          >
            Agree
          </Button>
        </DialogActions>
      </Dialog>
      {/* test dialog */}
      <Dialog
        open={testDialog}
        onClose={handleCloseTestDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Are you sure to make this user a test user? ?"}
        </DialogTitle>

        <DialogActions>
          <Button
            onClick={() => {
              handleCloseTestDialog();
              handleCloseEdit();
            }}
          >
            Disagree
          </Button>
          <Button
            onClick={async () => {
              setDropDownVal((prev) => ({
                ...prev,
                test_user: true,
              }));

              const data = {
                userId: editAllData.id,
                test_user: true,
              };
              console.log("....", data);

              const res = await setLocationValue(data);
              if (res.data.success) {
                handleCloseEdit();
                handleCloseTestDialog();
              }
            }}
            autoFocus
          >
            Agree
          </Button>
        </DialogActions>
      </Dialog>
      {/* user details dialog */}
      <Dialog
        open={editopen}
        onClose={handleCloseEdit}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        height="400px"
      >
        <div style={{ display: "flex", placeContent: "space-between" }}>
          <DialogTitle id="alert-dialog-title">{"User Details"}</DialogTitle>
          <Button
            startIcon={<Delete style={{ color: "red", fontSize: 30 }} />}
            onClick={async () => {
              handleClickOpenDialog();
              setDeleteIdParams(editAllData.id);
            }}
          ></Button>
        </div>
        <DialogContent>
          <div>
            {" "}
            <Stack spacing={2} direction="row">
              <FormControl size="small" sx={{ minWidth: 150 }}>
                <InputLabel id="country">Country</InputLabel>
                <Select
                  MenuProps={MenuProps}
                  labelId="country"
                  id="country"
                  value={dropDownVal.country}
                  label="country"
                  name="country"
                  onChange={(e) => {
                    setDropDownVal((prev) => ({
                      ...prev,
                      country: e.target.value,
                    }));
                  }}
                >
                  {location?.map((option) => {
                    return (
                      <MenuItem key={option._id} value={option.Country_Name}>
                        {option.Country_Name}
                      </MenuItem>
                    );
                  })}
                </Select>
              </FormControl>
              <FormControl
                size="small"
                sx={{
                  minWidth: 150,
                  paddingRight: "10px",
                  paddingLeft: "10px",
                }}
              >
                <InputLabel id="state">State</InputLabel>
                <Select
                  MenuProps={MenuProps}
                  labelId="state"
                  id="state"
                  value={dropDownVal.state}
                  label="state"
                  name="state"
                  onChange={(e) => {
                    setDropDownVal((prev) => ({
                      ...prev,
                      state: e.target.value,
                    }));
                  }}
                >
                  {location?.map((option) => {
                    if (option.Country_Name === dropDownVal.country) {
                      return option.States.map((e) => {
                        return (
                          <MenuItem key={e} value={e}>
                            {e}
                          </MenuItem>
                        );
                      });
                    }
                  })}
                </Select>
              </FormControl>
              <FormControl size="small" sx={{ minWidth: 150 }}>
                <InputLabel id="currency">Currency</InputLabel>
                <Select
                  MenuProps={MenuProps}
                  labelId="currency"
                  id="currency"
                  value={dropDownVal.currency}
                  label="currency"
                  name="currency"
                  onChange={(e) => {
                    setDropDownVal((prev) => ({
                      ...prev,
                      currency: e.target.value,
                    }));
                  }}
                >
                  {location?.map((option) => {
                    return (
                      <MenuItem key={option._id} value={option.Currency_Symbol}>
                        {option.Currency_Symbol}
                      </MenuItem>
                    );
                  })}
                </Select>
              </FormControl>
            </Stack>
            <br />
            <Stack spacing={2} direction="row">
              <TextField
                inputProps={{ style: { fontSize: 15 } }}
                id="outlined-basic"
                size="small"
                variant="outlined"
                label="City"
                value={dropDownVal.city}
                onChange={(e) => {
                  setDropDownVal((prev) => ({ ...prev, city: e.target.value }));
                }}
                name={"city"}
              />

              {/* <CustomTextField
                hintText="City"
                labelText={dropDownVal.city}
                onChange={(e) => {
                  setDropDownVal((prev) => ({ ...prev, city: e.target.value }));
                }}
                name={"city"}
              /> */}

              <TextField
                inputProps={{ style: { fontSize: 15 } }} // font size of input text
                id="outlined-basic"
                size="small"
                variant="outlined"
                label="Pincode"
                value={dropDownVal.pin_code}
                onChange={(e) => {
                  setDropDownVal((prev) => ({
                    ...prev,
                    pin_code: e.target.value,
                  }));
                }}
                name={"pin_code"}
              />

              {/* <CustomTextField
                hintText="Pincode"
                labelText={dropDownVal.pin_code}
                onChange={(e) => {
                  setDropDownVal((prev) => ({
                    ...prev,
                    pin_code: e.target.value,
                  }));
                }}
                name={"pin_code"}
              /> */}
            </Stack>
            <FormControl style={{ width: "100%" }}>
              {mainTabVal == 2 ? (
                <div>
                  <br />
                  <Button
                    variant="contained"
                    color="primary"
                    sx={{
                      backgroundColor: "brown",
                      width: "100%",
                      "&:hover": {
                        backgroundColor: "brown",
                        boxShadow: "none",
                      },
                    }}
                    onClick={async () => {
                      handleClickOpenTestDialog();
                    }}
                  >
                    <b>Test</b>
                  </Button>
                </div>
              ) : (
                <div>
                  <br />
                  <div style={{ width: "100%" }}>
                    <Stack
                      spacing={2}
                      direction="row"
                      style={{ width: "100%" }}
                    >
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
                          await userStatusUpdate("approved");
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
                          backgroundColor: "red",
                          width: "32%",
                          "&:hover": {
                            backgroundColor: "red",
                            boxShadow: "none",
                          },
                        }}
                        onClick={async () => {
                          await userStatusUpdate("pending");
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
                          backgroundColor: "#ffcc00",
                          width: "32%",
                          "&:hover": {
                            backgroundColor: "#ffcc00",
                            boxShadow: "none",
                          },
                        }}
                        onClick={async () => {
                          await userStatusUpdate("suspended");
                          setStatusRef("suspended");
                          handleCloseEdit();
                        }}
                      >
                        <b>Suspended</b>
                      </Button>
                      <Button
                        variant="contained"
                        color="primary"
                        sx={{
                          backgroundColor: "brown",
                          width: "32%",
                          "&:hover": {
                            backgroundColor: "brown",
                            boxShadow: "none",
                          },
                        }}
                        onClick={async () => {
                          handleClickOpenTestDialog();
                          //       setDropDownVal((prev) => ({
                          //         ...prev,
                          //         test_user: true,
                          //       }));

                          //       const data={
                          //         userId: editAllData.id,
                          //         test_user:true
                          //       }
                          //       console.log("....",data)

                          //       const res = await setLocationValue(data);
                          // if (res.data.success) {
                          //   handleCloseEdit();
                          // }

                          // handleCloseEdit();
                        }}
                      >
                        <b>Test</b>
                      </Button>
                    </Stack>
                  </div>
                </div>
              )}
              <br />
              <div style={{ width: "100%" }}>
                <Stack spacing={2} direction="row" style={{ width: "100%" }}>
                  <Button
                    variant="contained"
                    color="primary"
                    sx={{
                      width: "100%",
                      backgroundColor: "#273746",
                      "&:hover": {
                        backgroundColor: "#273746",
                        boxShadow: "none",
                      },
                    }}
                    onClick={async () => {
                      const data = {
                        userId: editAllData.id,
                        country: dropDownVal.country,
                        city: dropDownVal.city,
                        state: dropDownVal.state,
                        pin_code: dropDownVal.pin_code,
                        currency: dropDownVal.currency,
                        test_user: dropDownVal.test_user,
                      };
                      const res = await setLocationValue(data);
                      setLocationValRes(res.data);
                      if (res.data.success) {
                        handleCloseEdit();
                      }
                    }}
                  >
                    <b> Save</b>
                  </Button>
                </Stack>
              </div>
            </FormControl>
          </div>
        </DialogContent>
      </Dialog>

      <BootstrapDialog
        onClose={handleCloseFollowerDialog}
        aria-labelledby="customized-dialog-title"
        open={openFollowerDialog}
        fullWidth={true}
        maxWidth={"xs"}
      >
        <BootstrapDialogTitle
          id="customized-dialog-title"
          onClose={handleCloseFollowerDialog}
        >
          Follower List
        </BootstrapDialogTitle>
        <DialogContent dividers>
          <Typography>
            {loder ? (
              <Box sx={{ textAlign: "center" }}>
                <CircularProgress />
              </Box>
            ) : (
              allFollower &&
              allFollower?.map((e) => {
                return (
                  <div style={{ display: "flex", marginBottom: "10px" }}>
                    <div style={{ marginRight: "10px" }}>
                      <Avatar
                        alt="Kristagram"
                        src={e?.profile_image}
                        onClick={() => {}}
                      />
                    </div>
                    <div style={{ alignSelf: "center" }}>
                      {e?.first_name + " " + e?.last_name}
                    </div>
                  </div>
                );
              })
            )}
          </Typography>
        </DialogContent>
      </BootstrapDialog>

      <BootstrapDialog
        onClose={handleCloseFollowingDialog}
        aria-labelledby="customized-dialog-title"
        open={openFollowingDialog}
        fullWidth={true}
        maxWidth={"xs"}
      >
        <BootstrapDialogTitle
          id="customized-dialog-title"
          onClose={handleCloseFollowingDialog}
        >
          Following List
        </BootstrapDialogTitle>
        <DialogContent dividers>
          <Typography>
            {loder ? (
              <Box sx={{ textAlign: "center" }}>
                <CircularProgress />
              </Box>
            ) : (
              allFollowing?.map((e) => {
                return (
                  <div style={{ display: "flex", marginBottom: "10px" }}>
                    <div style={{ marginRight: "10px" }}>
                      <Avatar
                        alt="Kristagram"
                        src={e?.profile_image}
                        onClick={() => {}}
                      />
                    </div>
                    <div style={{ alignSelf: "center" }}>
                      {e?.first_name + " " + e?.last_name}
                    </div>
                  </div>
                );
              })
            )}
          </Typography>
        </DialogContent>
      </BootstrapDialog>
    </div>
  );
};

export default Admin;
