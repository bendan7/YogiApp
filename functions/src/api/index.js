const functions = require('firebase-functions')
const admin = require('../../firebase-admin')
const db = admin.firestore()

const express = require('express')
const cookieParser = require('cookie-parser')()
const cors = require('cors')({ origin: true })
const app = express()

const validateFirebaseIdToken = async (req, res, next) => {
    functions.logger.log(
        'Check if request is authorized with Firebase ID token'
    )

    if (
        (!req.headers.authorization ||
            !req.headers.authorization.startsWith('Bearer ')) &&
        !(req.cookies && req.cookies.__session)
    ) {
        functions.logger.error(
            'No Firebase ID token was passed as a Bearer token in the Authorization header.',
            'Make sure you authorize your request by providing the following HTTP header:',
            'Authorization: Bearer <Firebase ID Token>',
            'or by passing a "__session" cookie.'
        )
        res.status(403).send('Unauthorized')
        return
    }

    let idToken
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer ')
    ) {
        functions.logger.log('Found "Authorization" header')
        // Read the ID Token from the Authorization header.
        idToken = req.headers.authorization.split('Bearer ')[1]
    } else if (req.cookies) {
        functions.logger.log('Found "__session" cookie')
        // Read the ID Token from cookie.
        idToken = req.cookies.__session
    } else {
        // No cookie
        res.status(403).send('Unauthorized')
        return
    }

    try {
        const decodedIdToken = await admin.auth().verifyIdToken(idToken)
        functions.logger.log('ID Token correctly decoded', decodedIdToken)
        req.user = decodedIdToken
        next()
        return
    } catch (error) {
        functions.logger.error(
            'Error while verifying Firebase ID token:',
            error
        )
        res.status(403).send('Unauthorized')
        return
    }
}

app.use(cors)
app.use(cookieParser)
app.use(express.json())
app.use(validateFirebaseIdToken)

// --------- Common Api ---------
app.get('/userinfo/:uid?', async (req, res) => {
    let uid = req.user.uid
    let user = req.user

    // Admin can access to all users info
    if (req.params.uid && req.user.isAdmin) {
        uid = req.params.uid
        user = await admin.auth().getUser(uid)
    }

    const userMeetings = await db
        .collection('meetings')
        .where('participants', 'array-contains', uid)
        .get()
        .then((querySnapshot) => {
            return querySnapshot.docs.map((doc) => {
                const data = doc.data()
                data.docId = doc.id
                return data
            })
        })
        .catch((err) => {
            res.status(500).send(err)
        })

    const userTickts = await db
        .collection('tickts')
        .where('uid', '==', uid)
        .get()
        .then((querySnapshot) => {
            return querySnapshot.docs.map((doc) => {
                const data = doc.data()
                data.docId = doc.id
                return data
            })
        })
        .catch((err) => {
            res.status(500).send(err)
        })

    userMeetings.forEach((meeting) => {
        meeting.type = 'meeting'
    })

    userTickts.forEach((tickt) => {
        tickt.type = 'tickt'
    })

    const history = userMeetings.concat(userTickts)
    history.sort((a, b) => b.date - a.date)

    // Calc remains entries for user
    let totalPurchasedEntries = 0
    userTickts.forEach((tickt) => {
        totalPurchasedEntries += tickt.num_of_entries
    })
    const remainsEntries = totalPurchasedEntries - userMeetings.length

    const userHistory = {
        user: user,
        history: history,
        remainsEntries: remainsEntries,
    }

    res.status(200).json(userHistory)
})

// --------- Users Api ---------
app.put('/meetings/register/:meetingId', async (req, res) => {
    const meetingId = req.params.meetingId
    const uid = req.user.uid

    if (uid == null) {
        return res.status(403).send('Unauthorized')
    }

    const meetingRef = await db.collection('upcoming').doc(meetingId)
    meetingRef
        .get()
        .then(async (doc) => {
            const meeting = doc.data()
            if (
                meeting.participates.includes(uid) == false &&
                meeting.participates.length < meeting.max_parti
            ) {
                await meetingRef.update({
                    participates: [
                        ...meeting.participates,
                        { uid: uid, name: req.user.name },
                    ],
                })
                return res.status(200).send()
            } else {
                return res.status(400).send()
            }
        })
        .catch((err) => {
            res.status(404).send('Meeting ID Not Found')
        })
})
app.put('/meetings/deregister/:meetingId/', async (req, res) => {
    const meetingId = req.params.meetingId

    const uid = req.user.uid
    if (uid == null) {
        return res.status(403).send('Unauthorized')
    }

    const meetingRef = await db.collection('upcoming').doc(meetingId)
    meetingRef
        .get()
        .then(async (doc) => {
            const meeting = doc.data()

            await meetingRef.update({
                participates: meeting.participates.filter(
                    (par) => par.uid != uid
                ),
            })

            res.status(200).send()
        })
        .catch((err) => {
            res.status(404).send('Meeting ID Not Found')
        })
})

// --------- Admin apis ---------
// Get list of all users
app.get('/users', async (req, res) => {
    if (req.user.isAdmin != true) {
        res.status(403).send('Unauthorized')
        return
    }

    const getAllUsers = (nextPageToken) => {
        // List batch of users, 1000 at a time.
        const allUsers = []

        admin
            .auth()
            .listUsers(1000, nextPageToken)
            .then((listUsersResult) => {
                listUsersResult.users.forEach((userRecord) => {
                    allUsers.push(userRecord.toJSON())
                })
                if (listUsersResult.pageToken) {
                    // List next batch of users.
                    getAllUsers(listUsersResult.pageToken)
                }
            })
            .then(() => {
                const withoutAdmins = allUsers.filter(
                    (user) => !(user.customClaims && user.customClaims.isAdmin)
                )

                res.status(200).send(withoutAdmins)
            })
            .catch((error) => {
                console.log('Error listing users:', error)
            })
    }

    // Start listing users from the beginning, 1000 at a time.
    getAllUsers()
})

module.exports = app
