
// The Cloud Functions for Firebase SDK to create Cloud Functions and set up triggers.
const functions = require('firebase-functions');

// The Firebase Admin SDK to access Firestore.
const admin = require('firebase-admin');
admin.initializeApp();

exports.date_convesion = functions.https.onRequest(async (request, response) => {

    // const original_date = data.date;
  
    let philli_time = new Date().toLocaleString("en-US", { timeZone: 'Asia/Manila' });

    let date_nz = new Date(philli_time);
    let year = date_nz.getFullYear();
    let month = ("0" + (date_nz.getMonth() + 1)).slice(-2);
    let date = ("0" + date_nz.getDate()).slice(-2);
    let hours = ("0" + date_nz.getHours()).slice(-2);
    let minutes = ("0" + date_nz.getMinutes()).slice(-2);
    let seconds = ("0" + date_nz.getSeconds()).slice(-2);

    // date as YYYY-MM-DD format
    let date_yyyy_mm_dd = year + "-" + month + "-" + date;

    // time as hh:mm:ss format
    let time_hh_mm_ss = hours + ":" + minutes + ":" + seconds;

    // date and time as YYYY-MM-DD hh:mm:ss format
    let date_time = year + "-" + month + "-" + date + " " + hours + ":" + minutes + ":" + seconds;

    
    const writeResult = admin.firestore().collection('date').add({original_date: date_time});

    response.json({result: `Date and Time in YYYY-MM-DD hh:mm:ss format: ${writeResult.id} `});
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
