import AdminUser from "../models/adminUserModel.js";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import WebAdminUserAccess from "../models/webAdminUserAccessModel.js";

function InitializingPassport(passport) {
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    AdminUser.findById(id).then((user) => {
      done(null, user);
    });
  });

  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_LOGIN_CLIENT_ID,
        clientSecret: process.env.GOOGLE_LOGIN_CLIENT_SECRET,
        callbackURL: process.env.HOST + "/api/auth/callback",
      },

      async function (accessToken, refreshToken, profile, done) {
        const vv = await AdminUser.find({
          [`user_access.${0}`]: "admin_user",
        })
          .then((docs) => {
            const emails = docs.map((doc) => doc.email);
            console.log("All emails:", emails);
            return emails;
          })
          .catch((error) => {
            console.error(error);
          });
        console.log("vv", vv);
        const sentence = vv;
        const word = profile._json.email;
        const regex = new RegExp(`\\b${word}\\b`);
      
        if (sentence.includes(profile._json.email)) {
          console.log(`The word "${word}" exists in the paragraph.`);
          // console.log(
          //   "WEB_ADMIN_EMAILS",
          //   process.env.WEB_ADMIN_EMAILS,
          //   profile._json.email
          // );

          console.log("sentence", sentence);
          if (sentence.includes(profile._json.email)) {
            // console.log("**", profile._json);
            AdminUser.findOne({ googleId: profile.id }).then(
              async (existingUser) => {
                if (existingUser) {
                  done(null, existingUser);
                } else {
                  AdminUser.findOneAndUpdate(
                    { email: profile._json.email },
                    {
                      googleId: profile.id,
                      name: profile.displayName,
                      email: profile._json.email,
                    },
                    { upsert: true }
                  ).then((user) => {
                    console.log("user", user);
                    done(null, user);
                  });
                }
              }
            );
          }
        } else if (!sentence.includes(profile._json.email)) {
          const sentence1 = process.env.CRITICAL_ADMIN;
          const word1 = profile._json.email;
          const regex1 = new RegExp(`\\b${word1}\\b`);

          if (regex1.test(sentence1)) {
            console.log(`The word1 "${word1}" exists in the paragraph.`);
          } else {
            console.log(
              `The word1 "${word1}" does not exist in the paragraph.`
            );
          }

          if (regex1.test(sentence1)) {
            console.log("heelo234");
            AdminUser.updateOne(
              { email: profile._json.email },
              {
                googleId: profile.id,
                name: profile.displayName,
                flag: "true",
                [`user_access.${0}`]: "admin_user",
              },
              { upsert: true }
            ).then(async (user) => {
              let userData = await AdminUser.findOne({
                email: profile._json.email,
              });
              console.log("user", userData);
              done(null, userData);
            });
          } else {
            console.log("Only specific Admin can login...");
            done(null, null);
          }
        } else {
          console.log("Only specific Admin can login...");
          done(null, null);
        }
      }
    )
  );
}
export default InitializingPassport;
