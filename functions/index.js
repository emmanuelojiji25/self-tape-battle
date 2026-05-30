const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();

exports.health = functions.https.onRequest((req, res) => {
  res.status(200).send("OK");
});
