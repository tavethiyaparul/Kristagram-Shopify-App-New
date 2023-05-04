dotenv.config();
import express from "express";
import path from "path";
import connectDB from "./database/db.js";
import dotenv from "dotenv";
import cors from "cors";
import passport from "passport";
import expressSession from "express-session";
import initializingPassport from "./authorization/passportConfig.js";
import { fileURLToPath } from "url";
import { dirname } from "path";
import cookieParser from "cookie-parser";
import router from "./routers/userRouter.js";
import appStatus from "./routers/appStatusRouter.js";
import campaign from "./routers/campaignRouter.js";
import country from "./routers/countryRouter.js";

import AdminUser from "./models/adminUserModel.js";
import tag from "./routers/tagRouter.js";
import spam from "./routers/fraudContentRouter.js";
import notification from "./routers/notificationRouter.js";
import spamReport from "./routers/spamReportRouter.js";
import reviewReport from "./routers/reviewRouter.js";
import wishListCategory from "./routers/wishListRouter.js";
import rentProduct from "./routers/rentProductRouter.js";
import webAdminUserAccess from "./routers/webAdminUserAccessRouter.js";
import bodyParser from "body-parser";
import fileUpload from "express-fileupload";
import WebAdminUserAccess from "./models/webAdminUserAccessModel.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// database connection
connectDB();

const app = express();

const route =express.Router();

route.use(fileUpload());
route.use(cors( ));
route.use(cookieParser());
route.use(bodyParser.json({ limit: "10mb" }));
route.use(bodyParser.urlencoded({ limit: "10mb", extended: true }));

// app.use(cors());

// app.use(express.json({limit:"10mb"}));
// app.use(express.urlencoded({ extended: false }));
// app.use(bodyParser.urlencoded({ limit: "10mb", extended: true }));
// app.use(bodyParser.json({ limit: "10mb" }));
// app.use(cookieParser());
// app.use(cors({ origin: "*" }));
// app.use(fileUpload());

const PORT = process.env.PORT;

// passport initialize
initializingPassport(passport);

route.use("/api/v1", router);
route.use("/api/v1", tag);
route.use("/api/v1", appStatus);
route.use("/api/v1", campaign);
route.use("/api/v1", country);
route.use("/api/v1", spam);
route.use("/api/v1", spamReport);
route.use("/api/v1", reviewReport);
route.use("/api/v1", wishListCategory);
route.use("/api/v1", rentProduct);
route.use("/api/v1", webAdminUserAccess);
route.use("/api/v1", notification);
route.get(
  "/auth/google",
  passport.authenticate(
    "google",
    { scope: ["profile", "email"] },
    { failureRedirect: "/auth/google/failure" }
  ),
  (req, res) => {
    console.log("res", res);
    return res.redirect("/fail");
  }
);

route.get("/api/auth/callback", (req, res) => {
  passport.authenticate("google", async function (err, user, info) {
    console.log("hi2", user);
    console.log("hi3", info);
    if (err) {
      console.log("hi1", err);
    }
    if (!user) {
      return res.redirect("/fail");
    }
    let data = {};
    console.log("*45", user.email);

    const sentence = process.env.CRITICAL_ADMIN;
    const word = user.email;
    const regex = new RegExp(`\\b${word}\\b`);

    if (regex.test(sentence)) {
      console.log(`The word "${word}" exists in the paragraph.`);
    } else {
      console.log(`The word "${word}" does not exist in the paragraph.`);
    }

    if (regex.test(sentence)) {
      const token = await user.getJWTToken();
      console.log("token", token);
      console.log("heelo234");
      data = await AdminUser.findOneAndUpdate(
        { email: user.email },
        { $set: { flag: "true", [`user_access.${0}`]: "admin_user" } },
        { new: true }
      );

      console.log("data data", data);
      if (user?.token) {
        res.cookie("token", token, {
          expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
          secure: false,
          httpOnly: false,
        });

        res.redirect("/admin");
        return res;
      }
      if (!user.token) {
        console.log("1234567890");
        // res.cookie("userData", user.flag);
        // res.cookie("googleId",user.googleId);
        // const token = sendToken(user)

        const token = await user.getJWTToken();
        console.log("token", token);
        // localStorage.setItem("token","token")
        res.cookie("token", token, {
          expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 2),
          secure: false,
          httpOnly: false,
        });

        res.redirect("/admin");
        return res;
      }
    }
    if (user) {
      console.log("1234567890");
      // res.cookie("userData", user.flag);
      // res.cookie("googleId",user.googleId);
      // const token = sendToken(user)

      const token = await user.getJWTToken();
      console.log("token", token);
      // localStorage.setItem("token","token")
      res.cookie("token", token, {
        expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 2),
        secure: false,
        httpOnly: false,
      });

      res.redirect("/admin");
      return res;
    }
  })(req, res);
  (req, res) => {
    console.log("res", res);
    res.redirect("/fail");
  };
});

route.get("/api/logout", (req, res) => {
  // req.logout(() => {});
  res.send(req.user);
});

route.get("/auth/google/failure", (req, res) => {
  res.send("Only specific Admin can login1");
});

route.get("/fail", (req, res) => {
  console.log("first");
  res.send({ message: "Only specific Admin can login" });
});

route.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  next();
})
route.get("/xyz",(req,res)=>{
  res.send("hello")
})

// route.use(express.static(path.resolve(__dirname, "client/build")));
route.use(express.static(path.join(__dirname, "client/build")));

route.get("/*", (req, res) => {
  console.log("log")
  console.log("//////////////",path.join(__dirname,"client","build","index.html"))
  // console.log("//////////////",path.resolve(__dirname, "client/build", "index.html"))
  // path.join(process.cwd(), "web", "admin", "client", "build", "index.html")
  // res.sendFile(path.join(__dirname, "client/build", "/index.html"));
  res.sendFile(path.join(__dirname,"client/build","index.html"));
});

// route.get("/*", (req, res) => {
//   res.sendFile(path.resolve(__dirname, "client/build", "index.html"));
// });

// route.listen(PORT, () =>
//   console.log(`server is running successfully on port http://localhost:${PORT}`)
// );

export default route