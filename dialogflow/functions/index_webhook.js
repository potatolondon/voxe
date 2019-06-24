'use strict';

const functions = require('firebase-functions');
const admin = require('firebase-admin');
const {WebhookClient} = require('dialogflow-fulfillment');

process.env.DEBUG = 'dialogflow:*'; // enables lib debugging statements
admin.initializeApp(functions.config().firebase);
const db = admin.firestore();

exports.dialogflowFirebaseFulfillment = functions.https.onRequest((request, response) => {
  const agent = new WebhookClient({ request, response });

  function readList(agent) {
    const todoCollection = db.collection('todos');
    let ssml = '<speak>This is your to-do list: <break time="1" />';

    return todoCollection.get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          ssml += doc.data().content + '<break time="500ms" />, ';
        });

        ssml += 'Would you like me to do anything else?</speak>';

        agent.add(ssml);
        return Promise.resolve('Read complete');
      }).catch(() => {
        agent.add('Error reading entry from the Firestore database.');
      });
  }

  // Map from Dialogflow intent names to functions to be run when the intent is matched
  let intentMap = new Map();
  intentMap.set('read list', readList);
  agent.handleRequest(intentMap);
});
