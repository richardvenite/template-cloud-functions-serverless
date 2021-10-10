const functions = require("firebase-functions");
const admin = require('firebase-admin');
const express = require('express');
const { PubSub } = require('@google-cloud/pubsub');
const { helloHttp } = require('./functions/helloHttp');
const { helloStorage } = require('./functions/helloStorage');
const { helloPubSub } = require('./functions/helloPubSub');
admin.initializeApp();

const app = express();
app.post('/helloHttp', helloHttp);

const main = express();
main.use('/express', app);

//http trigger with express
exports.emulator = functions.https.onRequest(main);

//http trigger without express
//exports.emulator = functions.https.onRequest(helloHttp);

//storage trigger
exports.helloStorage = functions.storage.object().onFinalize(helloStorage);

//pub-sub trigger
exports.helloPubSub = functions.pubsub.topic('default').onPublish(helloPubSub);

exports.triggerPubSub = functions.https.onRequest(async (req, res) => {
  let pubsub = new PubSub(); 
  let msg = await pubsub.topic('default').publishJSON({
    message: req.body.message,
    date: new Date()
  }, { attr1: 'value' });

  res.json({
    published: msg
  });
});