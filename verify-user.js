// verify-user.js
const admin = require("firebase-admin");
const serviceAccount = require("./firebase-service-key.json");

// Initialize Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

async function verifyUser() {
  try {
    const user = await admin.auth().getUserByEmail("josiesullivan10@gmail.com");
    await admin.auth().updateUser(user.uid, { emailVerified: true });

    console.log(`User ${user.uid} has been verified!`);
  } catch (error) {
    console.error("Error verifying user:", error);
  }
}

verifyUser();
