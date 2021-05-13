
const admin = require("../firebase-admin");

module.exports.CreateNewAdmin  = function(change, context) {
  const userId = change.data().uid;
  if (userId) {
    return admin
      .auth()
      .setCustomUserClaims(userId, {
        isAdmin: true,
      })
      .then(() => {
        console.log(`New admin created with UID: ${userId}`);
      })
      .catch((error) => {
        console.error("Error creating admin token:", error);
      });
  }
}

module.exports.RemoveAdmin = function(change, context) {
  const userId = change.data().uid;
  if (userId) {
    return admin
      .auth()
      .setCustomUserClaims(userId, {
        isAdmin: false,
      })
      .then(() => {
        console.log(`remove admin with UID: ${userId}`);
      })
      .catch((error) => {
        console.error("Error removing admin token:", error);
      });
  }
}
