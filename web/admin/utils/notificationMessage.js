// import FCM from "node-fcm";
// var fcm = new FCM(process.env.FIREBASE_SERVER_KEY);

// export const notificationMessage = (fcm_token, notification) => {
//   console.log("--------------------------", fcm_token, notification);
//   try {
//     var message = {
//       to: fcm_token,
//       notification: notification,
//     };
//     fcm.send(message, function (err, response) {
//       if (err) {
//         console.log("Something has gone wrong!" + err);
//         console.log("Response:! " + response);
//       } else {
//         console.log("Successfully sent with response: ", response);
//       }
//     });
//   } catch (error) {
//     console.log("error", error);
//   }
// };
// import firebase from "firebase-admin"

// export const notificationMessage =(fcm_token,notification)=>{
// const serviceAccount = process.env.FIREBASE_SERVER_KEY

// // The Firebase token of the device which will get the notification
// // It can be a string or an array of strings
// const firebaseToken = fcm_token

// firebase.initializeApp({
//   credential: firebase.credential.cert(serviceAccount),
// });

// firebase.messaging().sendToDevice(firebaseToken, notification);
// }
