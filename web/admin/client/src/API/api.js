import axios from "axios";

export const getAllDataApi = async (
  itemperpage,
  currentpageno,
  brand,
  status,
  test_user
) => {
  console.log("test_user11", test_user, status);
  try {
    let st = `&profile_status=${status}`;
    let url;
    if (status) {
      url = `/api/v1/all?itemperpage=${itemperpage}${st}&type_of_user=${brand}&currentpageno=${currentpageno}`;
    } else if (test_user) {
      url = `/api/v1/all?itemperpage=${itemperpage}&type_of_user=${brand}&currentpageno=${currentpageno}&test_user=${test_user}`;
    } else {
      url = `/api/v1/all?itemperpage=${itemperpage}&type_of_user=${brand}&currentpageno=${currentpageno}`;
    }
    console.log("url", url);
    const res = await axios.get(url);
    console.log("getAllDataApi - res", res.data);
    return res;
  } catch (error) {
    console.log("error while calling get all data api", error);
  }
};

export const getCountApi = async () => {
  try {
    const res = await axios.get(`/api/v1/all?itemperpage=10`);
    console.log("getCountApi : res", res.data);
    return res;
  } catch (error) {
    console.log("error while calling get count api", error);
  }
};

export const getLocationApi = async () => {
  try {
    const res = await axios.get(`/api/v1/allcountry`);
    console.log("getLocationApi : res", res.data);
    return res;
  } catch (error) {
    console.log("error while calling get count api", error);
  }
};

export const deleteUser = async (id) => {
  try {
    const res = await axios.delete(`/api/v1/deleteme/${id}`, {
      headers: { Authorization: `Bearer ${document.cookie.split("=")[1]}` },
    });
    console.log("deleteUser - res", res, res.data.message);
    return res;
  } catch (error) {
    console.log("error while calling delete user api", error);
  }
};

export const logOutAdmin = async () => {
  try {
    console.log("....", document.cookie.split("=")[1]);
    const res = await axios.get(`/api/v1/logout`, {
      headers: { Authorization: `Bearer ${document.cookie.split("=")[1]}` },
    });
    console.log("logOutAdmin - res", res);
    return res;
  } catch (error) {
    console.log("error while calling logout admin api", error);
  }
};

export const getUserDetailsAdmin = async () => {
  try {
    const res = await axios.get(`/api/v1/admindetails`, {
      headers: { Authorization: `Bearer ${document.cookie.split("=")[1]}` },
    });
    console.log("getUserDetailsAdmin - res", res);
    return res;
  } catch (error) {
    console.log("error while calling get admin details api", error);
  }
};

export const getTokenCheck = async () => {
  let token=document.cookie.split("=")[1];
  console.log("getTokenCheck" , token)
  try {
    const res = await axios.post(`/api/v1/checktoken`,{token},{
      headers: {
        headers: "Content-Type: application/json",
      },
    });
    console.log("getTokenCheck - res", res);
    return res;
  } catch (error) {
    console.log("error while calling get get TokenCheck api", error);
  }
};

export const createAppStatus = async (data) => {
  try {
    const res = await axios.post(`/api/v1/createappstatus`, data, {
      headers: {
        Authorization: `Bearer ${document.cookie.split("=")[1]}`,
        headers: "Content-Type: application/json",
      },
    });
    console.log("createAppStatus - res", res);
    return res;
  } catch (error) {
    console.log("error while calling create app status api", error);
  }
};

export const getAppStatus = async () => {
  try {
    const res = await axios.get(`/api/v1/getappstatus`);
    console.log("getAppStatus - res", res);
    return res;
  } catch (error) {
    console.log("error while calling create app status api", error);
  }
};

export const userStatusEdit = async (data) => {
  try {
    const res = await axios.put(`/api/v1/verifyuser`, data, {
      headers: {
        Authorization: `Bearer ${document.cookie.split("=")[1]}`,
        headers: "Content-Type: application/json",
      },
    });
    console.log("userStatusEdit - res", res);
    return res;
  } catch (error) {
    console.log("error while calling status edit api", error);
  }
};

export const setLocationValue = async (data) => {
  console.log("data", data);
  try {
    const res = await axios.put(`/api/v1/location`, data, {
      headers: {
        Authorization: `Bearer ${document.cookie.split("=")[1]}`,
        headers: "Content-Type: application/json",
      },
    });
    console.log("setLocationValue - res", res);
    return res;
  } catch (error) {
    console.log("error while calling setlocation api", error);
  }
};

// get all tag
export const getAllTagApi = async (itemperpage, currentpageno) => {
  console.log("first", itemperpage, currentpageno);
  try {
    const res = await axios.get(
      `/api/v1/alltags?itemperpage=${itemperpage}&currentpageno=${currentpageno}`
    );
    console.log("getAllTagApi - res", res);
    return res;
  } catch (error) {
    console.log("error while calling create app status api", error);
  }
};

export const createTagAPI = async (name, status) => {
  console.log("data", name, status);
  const data = {
    name: name,
    status: status,
  };
  console.log("object", data);
  try {
    const res = await axios.post(`/api/v1/newtag`, data, {
      headers: {
        Authorization: `Bearer ${document.cookie.split("=")[1]}`,
        headers: "Content-Type: application/json",
      },
    });
    console.log("createAppStatus - res", res);
    return res;
  } catch (error) {
    console.log("error while calling create app status api", error);
  }
};

export const tagStatusEditAPI = async (data) => {
  console.log("tag status edit", data);
  try {
    const res = await axios.put(`/api/v1/verifytag`, data, {
      headers: {
        Authorization: `Bearer ${document.cookie.split("=")[1]}`,
        headers: "Content-Type: application/json",
      },
    });
    console.log("tagStatusEdit - res", res);
    return res;
  } catch (error) {
    console.log("error while calling status edit api", error);
  }
};

export const deleteTag = async (tagId) => {
  try {
    console.log("id", typeof tagId);
    const res = await axios.delete(
      `/api/v1/deleteadmintag/${tagId}`
      // , {
      //   headers: "Content-Type: application/json",
      // },
      // {"tagId":tagId},
    );
    console.log("deleteTag - res", res, res.data.message);
    return res;
  } catch (error) {
    console.log("error while calling delete user api", error);
  }
};

export const getAllFollowersApi = async (id) => {
  console.log("getAllFollowersApi", id);
  try {
    const res = await axios.get(`/api/v1/getfollowers`, {
      params: { id },
    });
    console.log("getAllFollowersApi - res", res);
    return res;
  } catch (error) {
    console.log("error while calling getAllFollowersApi api", error);
  }
};

export const getAllFollowingsApi = async (id) => {
  console.log("getAllFollowingsApi", id);
  try {
    const res = await axios.get(`/api/v1/getfollowing`, {
      params: { id },
    });
    console.log("getAllFollowingsApi - res", res);
    return res;
  } catch (error) {
    console.log("error while calling getAllFollowingsApi api", error);
  }
};

export const getAppLocation = async () => {
  try {
    const res = await axios.get(`/api/v1/allcountry`);
    console.log("getAppLocation - res", res);
    return res;
  } catch (error) {
    console.log("error while calling get location api", error);
  }
};

export const updateLocation = async (data) => {
  try {
    console.log("data ***", data);
    const res = await axios.put(`/api/v1/updatecountry`, data, {
      headers: {
        headers: "Content-Type: application/json",
      },
    });
    console.log("updateLocation - res", res);
    return res;
  } catch (error) {
    console.log("error while calling update location api", error);
  }
};

// export const notifyMsg = async (id) => {
//   try {
//     console.log("id++++++", id);

//     const res = await axios.post(
//       `api/v1/notification`,
//       { id },
//       {
//         headers: {
//           headers: "Content-Type: application/json",
//         },
//       }
//     );
//     console.log("notifyMsg - res", res);
//     return res;
//   } catch (error) {
//     console.log("error while calling notifyMsg api", error);
//   }
// };

// export const notifyMsgOpenAPI = async (fcm_token) => {
//   try {
//     // let data = {
//     //   fcm_token:fcm_token,
//     //   title: "Approve",
//     //   description: "Congratulations, Your profile has been approved",
//     //   image:
//     //     "https://milanbhikadiya-developer-test.s3.eu-west-1.amazonaws.com/secure/kristagram/630f2398ae302cb89380b617/rent_product_1681214366826.jpg",
//     // };
//     // let data = JSON.stringify({
//     //   description: "Congratulations, Your profile has been approved",
//     //   fcm_token:
//     //   fcm_token,
//     //   image:
//     //     "https://milanbhikadiya-developer-test.s3.eu-west-1.amazonaws.com/secure/kristagram/630f2398ae302cb89380b617/rent_product_1681214366826.jpg",
//     //   title: "Approve",
//     // });

//    await axios.post(
//       `https://staging-aidhid-api.kristagram.com/api/1.4.5/notification`,
//       {
//         fcm_token:fcm_token,
//         title: "Approve",
//         description: "Congratulations, Your profile has been approved",
//         image:
//           "https://milanbhikadiya-developer-test.s3.eu-west-1.amazonaws.com/secure/kristagram/630f2398ae302cb89380b617/rent_product_1681214366826.jpg",
//      },
//       {
//         headers: {
//           "Content-Type": "application/json",
//           'Accept': 'application/json'
//         },
//       }
//     ).then((res)=>{
//       console.log("res",res)
//       return res
//     }).catch((error)=>{
//       console.log("error",error)
//     });
//   } catch (error) {
//     console.log("error while calling notifyMsg api", error);
//   }
// };
