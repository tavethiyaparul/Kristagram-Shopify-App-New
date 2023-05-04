import React, { useEffect, useState } from "react";
import { getTokenCheck, getUserDetailsAdmin } from "../../API/api";
import PersistentDrawer from "../../components/persistentDrawer";
import { useNavigate } from "react-router-dom";
export default function Marketing() {
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
      navigate("/marketing");
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

  // const tokenCheckAPI = async () => {
  //   const responce = await getTokenCheck();
  //   console.log("token check res", responce);
  //   setRes(responce.data.users);
  // };
  return (
    <div style={{ padding: "10px", paddingLeft: "250px" }}>
      <PersistentDrawer />
      <p>Marketing</p>
      <p>
        ज़िन्दगी के सफ़र में गुज़र जाते हैं जो मकाम वो फिर नहीं आते वो फिर नहीं
        आते ज़िन्दगी के सफ़र में गुज़र जाते हैं जो मकाम वो फिर नहीं आते वो फिर
        नहीं आते फूल खिलते हैं लोग मिलते हैं फूल खिलते हैं लोग मिलते हैं मगर
        पतझड़ में जो फूल मुरझा जाते हैं वो बहारों के आने से खिलते नहीं कुछ लोग एक
        रोज़ जो बिछड़ जाते हैं वो हजारों के आने से मिलते नहीं उम्र भर चाहे कोई
        पुकारा करे उनका नाम वो फिर नहीं आते वो फिर नहीं आते आँख धोखा है क्या
        भरोसा है आँख धोखा है क्या भरोसा है सुनो दोस्तों शक दोस्ती का दुश्मन है
        अपने दिल में इसे घर बनाने न दो कल तड़पना पड़े याद में जिनकी रोक लो रूठ कर
        उनको जाने न दो बाद में प्यार के चाहे भेजो हजारों सलाम वो फिर नहीं आते वो
        फिर नहीं आते सुबहो आती है रात जाती है सुबहो आती है रात जाती है यूँ ही
        वक़्त चलता ही रहता है रुकता नहीं एक पल में ये आगे निकल जाता है आदमी ठीक
        से देख पाता नहीं और परदे पे मंज़र बदल जाता है एक बार चले जाते हैं जो दिन
        रात सुबहो शाम वो वो फिर नहीं आते वो फिर नहीं आते ज़िन्दगी के सफ़र में
        गुज़र जाते हैं जो मकाम वो फिर नहीं आते वो फिर नहीं आते ||
      </p>
    </div>
  );
}
