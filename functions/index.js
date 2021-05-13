const functions = require('firebase-functions')

// Exspress app
const app = require('./src/api')
exports.api = functions.region('europe-west3').https.onRequest(app)

// Admin-manage functions
const { CreateNewAdmin, RemoveAdmin } = require('./src/admins-manager')

exports.addAdmin = functions
    .region('europe-west3')
    .firestore.document('admin/{docId}')
    .onCreate(CreateNewAdmin)
exports.removeAdmin = functions
    .region('europe-west3')
    .firestore.document('admin/{docId}')
    .onDelete(RemoveAdmin)
