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

admin.initializeApp(functions.config().firebase);
const db = admin.firestore();
const auth = admin.auth();
const todosCollection = db.collection('todos');

// Middleware to store user uid
app.middleware(async (conv) => {
  const { email } = conv.user;
  const user = await auth.getUserByEmail(email);
  conv.user.storage.uid = user.uid;
});

app.intent('Start Signin', (conv) => {
  conv.ask(new SignIn('To get your account details'));
});

app.intent('Get Signin', (conv, params, signin) => {
  if (signin.status === 'OK') {
    const payload = conv.user.profile.payload;
    conv.ask(`I got your account details, ${payload.name}. What do you want to do next?`);
    conv.ask(new Suggestions('Read list', 'Add to list', 'Remove from list'));
  } else {
    conv.ask(`I won't be able to save your data, but what do you want to do next?`);
  }
});

app.intent('Default Welcome Intent', (conv) => {
  const {payload} = conv.user.profile;
  const name = payload ? ` ${payload.given_name}` : '';
  conv.ask(`Hello ${name}! Welcome to your to-do list. I can read your list, add or remove items. What do you want me to do?`);
  conv.ask(new Suggestions('Read list', 'Add to list', 'Remove from list'));
});

app.intent('read list', async (conv) => {
  const snapshot = await todosCollection
    .where('userId', '==', conv.user.storage.uid)
    .get()
    .catch((err) => {
      conv.close('Sorry. It seems we are having some technical difficulties.');
      console.error('Error reading Firestore', err);
    });

  if (!snapshot.empty) {
    let ssml = '<speak>This is your to-do list: <break time="1" />';
    snapshot.forEach((doc) => {
      ssml += `${doc.data().content}<break time="500ms" />, `;
    });
    ssml += '<break time="500ms" />Would you like me to do anything else?</speak>';
    conv.ask(ssml);
    conv.ask(new Suggestions('Yes', 'No'));
    conv.contexts.set('restart-input', 2);
  } else {
    conv.ask(`${conv.user.profile.payload.given_name}, your list is empty. Do you want to add a new item?`);
    conv.ask(new Suggestions('Yes', 'No'));
    conv.contexts.set('read-empty-list-followup', 2);
  }
});

app.intent('what to add', async (conv, { item }) => {
  await todosCollection
    .add({
      content: item,
      userId: conv.user.storage.uid,
      createdAt: Date.now()
    })
    .catch((err) => {
      conv.close('Sorry. It seems we are having some technical difficulties.');
      console.error('Error writing to Firestore', err);
    });

    conv.ask(`<speak> I have added ${item} to your to-do list.<break time='1' />Do you want to add another item?</speak>`);
    conv.ask(new Suggestions('Yes', 'No'));
});


app.intent(['remove item request', 'remove another item - yes'], async (conv) => {
  let items = [];
  const snapshot = await todosCollection
    .where('userId', '==', conv.user.storage.uid)
    .get()
    .catch((err) => {
      conv.close('Sorry. It seems we are having some technical difficulties.');
      console.error('Error writing to Firestore', err);
    });

  if (snapshot.empty) {
    conv.ask(`Sorry ${conv.user.profile.payload.given_name}, your list is empty.`);
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
        conv.ask(new BasicCard({
          title: 'To-Do List',
          text: items[0].title
        }))
      } else {
        conv.ask(new List({
          title: 'To-Do List',
          items: items
        }));
      }
    }
  }
});

app.intent('what to remove', async (conv, {item}) => {
  item = conv.arguments.get('OPTION') || item;
  let itemRemoved = '';
  let idRemoved = '';
  const snapshot = await todosCollection
    .where('userId', '==', conv.user.storage.uid)
    .get()
    .catch((err) => {
      conv.close('Sorry. It seems we are having some technical difficulties.');
      console.error('Error writing to Firestore', err);
    });

  snapshot.forEach((doc) => {
    if (doc.id === item || doc.data().content === item) {
      itemRemoved = doc.data().content;
      idRemoved = doc.id;
    }
  });

  if (itemRemoved !== '') {
    todosCollection.doc(idRemoved).delete();
    conv.ask(`<speak> I have removed ${itemRemoved} from the list.<break time='1' />Do you want to remove another item?</speak>`);
    conv.ask(new Suggestions('Yes', 'No'));
  } else {
    conv.ask(`<speak> I can't find this item on your list.<break time='1' />Do you want to remove another item?</speak>`);
    conv.ask(new Suggestions('Yes', 'No'));
  }
});

app.intent('actions_intent_NO_INPUT', (conv) => {
  const repromptCount = parseInt(conv.arguments.get('REPROMPT_COUNT'));
  if (repromptCount === 0) {
    conv.ask('Is there anything I can help you with?');
    conv.ask(new Suggestions('Read list', 'Add to list', 'Remove from list'));
  } else if (repromptCount === 1) {
    conv.ask(`Please allow me to help you interact with you to-do list. I can read it, add a new item or remove an existing one.`);
    conv.ask(new Suggestions('Read list', 'Add to list', 'Remove from list'));
  } else if (conv.arguments.get('IS_FINAL_REPROMPT')) {
    conv.close(`Sorry we're having trouble. Let's try this another time. Goodbye.`);
  }
});

app.intent([
  'add another - no',
  'remove another item - no',
  'read list - empty list - no'
], (conv) => {
  conv.ask('Is there anything else I can do for you?');
  conv.contexts.set('restart-input', 2);
  conv.ask(new Suggestions('Read list', 'Add to list', 'Remove from list'));
});

app.intent([
  'add another - yes',
  'read list - empty list - yes'
], (conv) => {
  conv.ask('Ok! What item should I add?');
  conv.contexts.set('additemrequest-followup', 2);
});

// Set the DialogflowApp object to handle the HTTPS POST request.
exports.dialogflowFirebaseFulfillment = functions.https.onRequest(app);
