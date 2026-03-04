const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();
const db = admin.firestore();

exports.updateUserEmailHardcoded = functions.https.onRequest(async (req, res) => {
  const uid = "CmlSJRgKegXhs4hDryjOzWlDRrQ2";
  const newEmail = "michellecharvez@gmail.com";

  try {
    // Update Auth
    await admin.auth().updateUser(uid, {
      email: newEmail,
    });

    // Update Firestore
    await db.collection("users").doc(uid).set(
      { email: newEmail },
      { merge: true }
    );

    res.send("User email updated successfully.");
  } catch (error) {
    res.status(500).send(error.message);
  }
});