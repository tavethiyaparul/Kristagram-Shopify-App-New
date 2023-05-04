import { BrowserRouter, Route, Routes } from "react-router-dom";
import { React, useEffect } from "react";
import Login from "./components/Login";
import Admin from "./Pages/Admin/Admin";
import { getUserDetailsAdmin } from "./API/api";
import { useState } from "react";
import CriticalTask from "./Pages/CriticalTask/CriticakTask";
import StakeHolder from "./Pages/StakeHolder/StakeHolder";
import Marketing from "./Pages/Marketing/Marketing";

const Router = () => {
  // console.log("document.cookie", document.cookie);
  const [res, setRes] = useState("false");
  useEffect(() => {
    getCriticalAdminFlag();
  }, []);

  const getCriticalAdminFlag = async () => {
    const responce = await getUserDetailsAdmin();
    console.log("8888888888888",responce);
    setRes(responce.data.users.flag);
  };

  return (
    <>
      <BrowserRouter basename="/admin">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/marketing" element={<Marketing />} />

          <Route path="/stakeholder" element={<StakeHolder />} />

          {res === "true" ? (
            <Route
              path="/criticaltask"
              element={<CriticalTask status={res} />}
            />
          ) : (
            ""
          )}
          <Route exact path="*" element={<Login />} />
        </Routes>
      </BrowserRouter>
    </>
  );
};

export default Router;
