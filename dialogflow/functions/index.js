'use strict';

// Import the Dialogflow module and response creation dependencies
// from the Actions on Google client library.
const {
  Carousel,
  dialogflow,
  Suggestions,
} = require('actions-on-google');

// Import the firebase-functions package for deployment.
const functions = require('firebase-functions');

// Instantiate the Dialogflow client.
const app = dialogflow({debug: true});

// Init firebase
const admin = require('firebase-admin');

// Uncomment to test DB on serve
// let serviceAccount = require('./ServiceAccountkey.json');
// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount),
//   databaseURL: 'https://voxe-e6a90.firebaseio.com'
// });

admin.initializeApp(functions.config().firebase);
let db = admin.firestore();
let todosCollection = db.collection('todos');

app.intent('read list', (conv) => {
  let ssml = '<speak>This is your to-do list: <break time="1" />';
  return todosCollection
    .get()
    .then((snapshot) => {
      snapshot.forEach((doc) => {
        ssml += doc.data().content + '<break time="500ms" />, ';
      });
      ssml += 'Would you like me to do anything else?</speak>';
      conv.ask(ssml);
      conv.ask(new Suggestions('Add item', 'Remove item'));
      return Promise.resolve('Read complete');
    })
    .catch((err) => {
      conv.close('Error reading entry from the Firestore database.');
      console.log('Error getting documents', err);
    });
});

app.intent('what to add', (conv, {item}) => {
  return todosCollection
    .add({
      content: item,
    })
    .then(() => {
      conv.ask(`<speak> I have added ${item} to your to-do list.<break time='1' />Do you want to add another one?</speak>`);
      conv.ask(new Suggestions('Yes', 'No'));
      return Promise.resolve('Write complete');
    });
});

app.intent(['remove item request', 'remove another'], (conv) => {
  let items = [];
  return todosCollection
    .get()
    .then((snapshot) => {
      let i = 1;
      snapshot.forEach((doc) => {
        items.push({
          optionInfo: {
            key: doc.id,
          },
          title: doc.data().content,
          description: 'Activity number ' + i,
         })
         i++;
      });

      conv.ask('What item do you want me to remove?');
      
      if (conv.screen) {
        return conv.ask(new Carousel({
          title: 'To-Do List',
          items: items
        }));
      }

      return Promise.resolve('Read complete');
    })
    .catch((err) => {
      conv.close('Error reading entry from the Firestore database.');
      console.log('Error getting documents', err);
    });
});

app.intent('what to remove', (conv, {item}) => {
  item = conv.arguments.get('OPTION') || item;
  let itemRemoved = '';
  return todosCollection
    .get()
    .then((snapshot) => {
      snapshot.forEach((doc) => {
        if (doc.id === item) {
          itemRemoved = doc.data().content;
        }
      });

      if (itemRemoved !== '') {
        todosCollection.doc(item).delete();
        conv.ask(`<speak> I have removed ${itemRemoved} from the list.<break time='1' />Do you want to remove another one?</speak>`);
        conv.ask(new Suggestions('Yes', 'No'));
      } else {
        conv.ask(`<speak> The item provided is not on your list.<break time='1' />Do you want to remove another one?</speak>`);
        conv.ask(new Suggestions('Yes', 'No'));
      }
      return Promise.resolve('Read complete');
    })
    .catch((err) => {
      conv.close('Error reading entry from the Firestore database.');
      console.log('Error getting documents', err);
    });
});

app.intent(['anything else - add', 'anything else - remove'], (conv) => {
  conv.ask('Is there anything else I can do?');
  conv.ask(new Suggestions('Read list', 'Add item', 'Remove item'));
});

app.intent('actions_intent_NO_INPUT', (conv) => {
  const repromptCount = parseInt(conv.arguments.get('REPROMPT_COUNT'));
  if (repromptCount === 0) {
    conv.ask('Is there anything I can help you width?');
    conv.ask(new Suggestions('Read list', 'Add item', 'Remove item'));
  } else if (repromptCount === 1) {
    conv.ask(`Please allow me to help you interact with you to-do list. I can read it, add a new item or remove an existing one.`);
    conv.ask(new Suggestions('Read list', 'Add item', 'Remove item'));
  } else if (conv.arguments.get('IS_FINAL_REPROMPT')) {
    conv.close(`Sorry we're having trouble. Let's try this another time. Goodbye.`);
  }
});

// Set the DialogflowApp object to handle the HTTPS POST request.
exports.dialogflowFirebaseFulfillment = functions.https.onRequest(app);
