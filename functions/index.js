'use strict';

// Import the Dialogflow module and response creation dependencies
// from the Actions on Google client library.
const {
  dialogflow,
  BasicCard,
  List,
  SignIn,
  Suggestions,
} = require('actions-on-google');

// Import the firebase-functions package for deployment.
const functions = require('firebase-functions');

// Instantiate the Dialogflow client.
const app = dialogflow({
  debug: true,
  clientId: '798501221800-a5hv2a4qc3qdp0lbkvalutmt7t1dvo85.apps.googleusercontent.com',
});

// Init firebase
const admin = require('firebase-admin');

//Uncomment to test DB on serve
// let serviceAccount = require('./ServiceAccountkey.json');
// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount),
//   databaseURL: 'https://voxe-e6a90.firebaseio.com'
// });

admin.initializeApp(functions.config().firebase);
const db = admin.firestore();
const auth = admin.auth();
const todosCollection = db.collection('todos');

// middleware to store uid on firebase
app.middleware(async (conv) => {
  const {email} = conv.user;
  try {
    conv.user.storage.uid = (await auth.getUserByEmail(email)).uid;
  } catch (e) {
      throw e;
  }
});

app.intent('Start Signin', (conv) => {
  conv.ask(new SignIn('To get your account details'));
});

app.intent('Get Signin', (conv, params, signin) => {
  if (signin.status === 'OK') {
    const payload = conv.user.profile.payload;
    conv.ask(`I got your account details, ${payload.name}. What do you want to do next?`);
    conv.ask(new Suggestions('Read list', 'Add item', 'Remove item'));
  } else {
    conv.ask(`I won't be able to save your data, but what do you want to do next?`);
  }
});

app.intent('Default Welcome Intent', (conv) => {
  const {payload} = conv.user.profile;
  const name = payload ? ` ${payload.given_name}` : '';
  conv.ask(`Hello ${name}! Welcome to your to-do list. I can read your list, add or remove items. What you want me to do?`);
  conv.ask(new Suggestions('Read list', 'Add item', 'Remove item'));
});

app.intent('read list', (conv) => {
  return todosCollection
    .where('userId', '==', conv.user.storage.uid)
    .get()
    .then((snapshot) => {
      if (!snapshot.empty) {
        let ssml = '<speak>This is your to-do list: <break time="1" />';
        snapshot.forEach((doc) => {
          ssml += `${doc.data().content}<break time="500ms" />, `;
        });
        ssml += '<break time="500ms" />Would you like me to do anything else?</speak>';
        conv.ask(ssml);
        conv.ask(new Suggestions('Add item', 'Remove item'));
      } else {
        conv.ask(`${conv.user.profile.payload.given_name}, your list is empty. Want to add a new item?`);
        conv.ask(new Suggestions('Yes', 'No'));
      }

      return Promise.resolve('Read complete');
    })
    .catch((err) => {
      conv.close('Error reading entry from the Firestore database.');
      console.log('Error getting documents', err);
    });
});

app.intent('read list - empty list - yes','add item request');

app.intent('what to add', (conv, {item}) => {
  return todosCollection
    .add({
      content: item,
      userId: conv.user.storage.uid,
      createdAt: Date.now()
    })
    .then(() => {
      conv.ask(`<speak> I have added ${item} to your to-do list.<break time='1' />Do you want to add another one?</speak>`);
      conv.ask(new Suggestions('Yes', 'No'));
      return Promise.resolve('Write complete');
    })
    .catch((err) => {
      conv.close('Error adding entry to the Firestore database.');
      console.log('Error getting documents', err);
    });
});

app.intent(['remove item request', 'remove another'], (conv) => {
  let items = [];
  return todosCollection
    .where('userId', '==', conv.user.storage.uid)
    .get()
    .then((snapshot) => {
      if (snapshot.empty) {
        conv.ask('Your list is empty. Is there anything else I can help you with?');
        conv.ask(new Suggestions('Add item'));
      } else {
        snapshot.forEach((doc) => {
          items.push({
            optionInfo: {
              key: doc.id,
            },
            title: doc.data().content,
           });
        });

        conv.ask('What item do you want me to remove?');

        // List must have at least 2 items
        // Doc says one but if you have only one error you get this in the log
        // expected_inputs[0].possible_intents[0].input_value_data.option_value_spec.list_select:
        // the number of 'items' must be between 2 and 30
        if (conv.screen) {
          if (snapshot.size === 1) {
            return conv.ask(new BasicCard({
              title: 'To-Do List',
              text: items[0].title
            }))
          } else {
            return conv.ask(new List({
              title: 'To-Do List',
              items: items
            }));
          }
        }
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
  let idRemoved = '';
  return todosCollection
    .where('userId', '==', conv.user.storage.uid)
    .get()
    .then((snapshot) => {
      snapshot.forEach((doc) => {
        if (doc.id === item || doc.data().content === item) {
          itemRemoved = doc.data().content;
          idRemoved = doc.id;
        }
      });

      if (itemRemoved !== '') {
        todosCollection.doc(idRemoved).delete();
        conv.ask(`<speak> I have removed ${itemRemoved} from the list.<break time='1' />Do you want to remove another one?</speak>`);
        conv.ask(new Suggestions('Yes', 'No'));
      } else {
        conv.ask(`<speak> The item provided is not on your list.<break time='1' />Do you want to remove another one?</speak>`);
        conv.ask(new Suggestions('Yes', 'No'));
      }
      return Promise.resolve('Read complete');
    })
    .catch((err) => {
      conv.close('Error removing entry from the Firestore database.');
      console.log('Error getting documents', err);
    });
});

app.intent(['anything else - add', 'anything else - remove', 'read list - empty list - no'], (conv) => {
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
