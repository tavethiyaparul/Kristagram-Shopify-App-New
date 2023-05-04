import React, { useEffect, useState } from "react";
import { getTokenCheck, getUserDetailsAdmin } from "../../API/api";
import PersistentDrawer from "../../components/persistentDrawer";
import { useNavigate } from "react-router-dom";
export default function StakeHolder() {
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
      navigate("/stakeholder");
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
      <p>StakeHolder</p>
      <p>
        मेरा जूता है जापानी, ये पतलून इंगलिस्तानी सर पे लाल टोपी रूसी, फिर भी
        दिल है हिंदुस्तानी मेरा जूता... निकल पड़े हैं खुली सड़क पर अपना सीना ताने
        - (२) मंज़िल कहाँ कहाँ रुकना है ऊपर वाला जाने - (२) बढ़ते जायें हम सैलानी,
        जैसे एक दरिया तूफ़ानी सर पे लाल... ऊपर नीचे नीचे ऊपर लहर चले जीवन की -
        (२) नादाँ हैं जो बैठ किनारे पूछें राह वतन की - (२) चलना जीवन की कहानी,
        रुकना मौत की निशानी सर पे लाल... होंगे राजे राजकुँवर हम बिगड़े दिल शहज़ादे
        - (२) हम सिंहासन पर जा बैठे जब जब करें इरादे - (२) सूरत है जानी पहचानी,
        दुनिया वालों को हैरानी सर पे लाल...
      </p>
    </div>
  );
}
