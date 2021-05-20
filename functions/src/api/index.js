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

// --------- Users Api ---------
app.get('/userhistory', async (req, res) => {
    const userMeetings = await db
        .collection('meetings')
        .where('participants', 'array-contains', req.user.uid)
        .get()
        .then((querySnapshot) => {
            return querySnapshot.docs.map((doc) => doc.data())
        })
        .catch((err) => {
            res.status(500).send(err)
        })

    const userTickts = await db
        .collection('tickts')
        .where('uid', '==', req.user.uid)
        .get()
        .then((querySnapshot) => {
            return querySnapshot.docs.map((doc) => doc.data())
        })
        .catch((err) => {
            res.status(500).send(err)
        })

    const userHistory = {
        meetings: userMeetings,
        tickts: userTickts,
    }

    res.json(userHistory)
})

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
    res.send('true')
    console.log('/userssss')
})

module.exports = app
