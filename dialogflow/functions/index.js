'use strict';

// Import the Dialogflow module and response creation dependencies
// from the Actions on Google client library.
const {
  dialogflow,
} = require('actions-on-google');

// Import the firebase-functions package for deployment.
const functions = require('firebase-functions');

// Instantiate the Dialogflow client.
const app = dialogflow({debug: true});

// Init firebase
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);
let db = admin.firestore();
let todosCollection = db.collection('todos');

app.intent('read list', (conv) => {
  let ssml = '<speak>This is your to-do list: <break time="1" />';
  return todosCollection.get()
  .then((snapshot) => {
    snapshot.forEach((doc) => {
      ssml += doc.data().content + '<break time="500ms" />, ';
    });
    ssml += 'Would you like me to do anything else?</speak>';
    conv.ask(ssml);
    return Promise.resolve('Read complete');
  })
  .catch((err) => {
    console.log('Error getting documents', err);
  });
});

app.intent('what to add', (conv, {item}) => {
  return todosCollection.add({
    content: item,
  }).then(() => {
    conv.ask(`<speak> I have added ${item} to your to-do list.<break time='1' />Do you want to add another one?</speak>`);
    return Promise.resolve('Write complete');
  });

});

// Set the DialogflowApp object to handle the HTTPS POST request.
exports.dialogflowFirebaseFulfillment = functions.https.onRequest(app);
