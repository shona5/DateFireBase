// moment.js
const moment = require('moment-timezone');
// The Cloud Functions for Firebase SDK to create Cloud Functions and set up triggers.
const functions = require('firebase-functions');

// The Firebase Admin SDK to access Firestore.
const admin = require('firebase-admin');
// moment.tz.setDefault("Asia/kolkata");
moment.tz.add("Asia/Calcutta|HMT BURT IST IST|-5R.k -6u -5u -6u|01232|-18LFR.k 1unn.k HB0 7zX0");
moment.tz.link("Asia/Calcutta|Asia/Kolkata");

admin.initializeApp();

exports.date_convesion = functions.https.onRequest(async (request, response) => {
  
    const original_date = request.query.date;
    let philli_time;
    if(original_date)
    {
      const date1 = moment(original_date).tz('Asia/Kolkata', true);
      philli_time = moment(date1).tz('Asia/Manila').format("YYYY-MM-DD hh:mm:ss a");
    }

    // Push the new message into Firestore using the Firebase Admin SDK.
    const writeResult = await admin.firestore().collection('date').add({original_date: philli_time});

    response.json({result: `Date and Time in YYYY-MM-DD hh:mm:ss format: ${writeResult.id} ` +philli_time});
});


exports.makeUppercase = functions.firestore.document('/messages/{documentId}')
    .onCreate((snap, context) => {
      // Grab the current value of what was written to Firestore.
      const original_date = snap.data().original_date;

      // Access the parameter `{documentId}` with `context.params`
    //   functions.logger.log('Uppercasing', context.params.documentId, original);
      functions.logger.log('Date', context.params.documentId, original_date);
      
      // You must return a Promise when performing asynchronous tasks inside a Functions such as
      // writing to Firestore.
      // Setting an 'uppercase' field in Firestore document returns a Promise.
      return snap.ref.set({original_date}, {merge: true});
    });
