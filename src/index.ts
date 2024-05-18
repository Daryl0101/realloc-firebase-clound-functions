/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import * as v2 from "firebase-functions/v2";
import * as admin from "firebase-admin";
// import * as logger from "firebase-functions/logger";

// Start writing functions
// https://firebase.google.com/docs/functions/typescript

// export const helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

type Notification = {
  id: string;
  user_id: string;
  title: string;
  body: string;
  link: string | null;
  status: string;
};

admin.initializeApp();
const messaging = admin.messaging();
const db = admin.firestore();

export const sendnotification = v2.firestore.onDocumentCreated(
  "/notifications/{notificationId}",
  async (event) => {
    const snapshot = event.data;
    if (!snapshot) {
      console.log("No incoming data");
      return;
    }
    const newNotification = snapshot.data() as Notification;
    console.log("Incoming new notification: ", newNotification);
    const userDoc = db.collection("users").doc(newNotification.user_id);
    const userDocSnapshot = await userDoc.get();
    console.log("User doc snapshot: ", userDocSnapshot);
    if (!userDocSnapshot.exists) {
      console.log(
        `${newNotification.user_id} does not exist in "users" collection, 
        could not send FCM notification`
      );
      return;
    }
    if ((userDocSnapshot.get("tokens") as string[]).length <= 0) {
      console.log(
        `${newNotification.user_id} has no FCM tokens, 
        could not send FCM notification`
      );
      return;
    }
    return messaging.sendEachForMulticast({
      tokens: userDocSnapshot.get("tokens"),
      notification: {
        title: newNotification.title,
        body: newNotification.body,
      },
    });
  }
);
