const functions = require("firebase-functions");
const admin = require("firebase-admin");
const app = require("../app.js")

admin.initializeApp();


// require("dotenv").config({ path: "../.env" });
// app.use((req, res, next) => {
//   console.log(`Received request: ${req.method} ${req.originalUrl}`);
//   next();
// });

// Export app as an HTTP function
exports.api = functions.https.onRequest(app);
