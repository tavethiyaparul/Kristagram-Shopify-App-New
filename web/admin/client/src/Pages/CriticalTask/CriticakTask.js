import { React, useEffect, useState } from "react";
import PersistentDrawer from "../../components/persistentDrawer";
import { Tab, TabList, TabPanel, Tabs } from "react-tabs";
import Tag from "./Tag";
import AppStatus from "./AppStatus";
import LocationPage from "./Location";
import SpamCategory from "./Spam/SpamCategory";
import SpamReport from "../CriticalTask/Spam/SpamReport";
import ReviewDisplay from "./Review/ReviewDisplay";
import ReviewPending from "./Review/ReviewPending";
import WishListCategory from "./WishList/WishListCategory";
import WishList from "./WishList/WishList";
import Rent from "./Rent";
import User from "./AdminUser/User";
import UserAccess from "./AdminUser/UserAccess";
import OtherSetting from "./OtherSetting";
import { getTokenCheck, getUserDetailsAdmin } from "../../API/api";
import { useNavigate } from "react-router-dom";

const CriticalTask = () => {
  const navigate = useNavigate();
    const [vv, setvv] = useState("");
    // get admin data api
    const userAdminData = async () => {
      const responce = await getUserDetailsAdmin();
      console.log("responce************", responce);
      setvv(responce);
     
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
        navigate("/criticaltask");
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

  return (
    <div style={{ padding: "10px", paddingLeft: "250px" }}>
      <PersistentDrawer />
      <Tabs>
        <TabList>
          <Tab>Tag</Tab>
          <Tab>App Status</Tab>
          <Tab>Location</Tab>
          <Tab>Spam</Tab>
          <Tab>Review</Tab>
          <Tab>Wishlist</Tab>
          <Tab>Rent</Tab>
          <Tab>Admin User</Tab>
          <Tab>Other Setting</Tab>
        </TabList>
        <TabPanel>
          <Tag />
        </TabPanel>
        <TabPanel>
          <AppStatus />
        </TabPanel>
        <TabPanel>
          <LocationPage />
        </TabPanel>
        <TabPanel>
          <Tabs>
            <TabList>
              <Tab>Spam Category</Tab>
              <Tab>Spam Report</Tab>
            </TabList>
            <TabPanel>
              <SpamCategory />
            </TabPanel>
            <TabPanel>
              <SpamReport />
            </TabPanel>
          </Tabs>
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
        {/* <TabPanel>
          <WishListCategory />
        </TabPanel> */}
        <TabPanel>
          <Tabs>
            <TabList>
              <Tab>Wishlist Category</Tab>
              <Tab>Wishlist</Tab>
            </TabList>
            <TabPanel>
              <WishListCategory />
            </TabPanel>
            <TabPanel>
              <WishList />
            </TabPanel>
          </Tabs>
        </TabPanel>
        <TabPanel>
          <Rent />
        </TabPanel>
        <TabPanel>
          <Tabs>
            <TabList>
              <Tab>User</Tab>
              <Tab>User Access</Tab>
            </TabList>
            <TabPanel>
              <User/>
            </TabPanel>
            <TabPanel>
              <UserAccess/>
            </TabPanel>
          </Tabs>
        </TabPanel>
        <TabPanel>
          <OtherSetting />
        </TabPanel>
      </Tabs>
    </div>
  );
};

export default CriticalTask;
