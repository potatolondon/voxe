# VOXE: VOice X-platform Experience

VOXE is a simple proof-of-concept to-do list app for Android, iOS, web and the Google Assistant built with [NativeScript](https://www.nativescript.org/), [Firebase](https://firebase.google.com/) and [Actions on Google](https://developers.google.com/assistant).

<div align="center">
  <img width="800" src="docs/voxe-devices.jpg" />
</div>

This repository contains:

 - A NativeScript (Angular) app that compiles to Android, iOS and web
 - A Dialogflow agent
 - A Cloud Function for the Google Action fulfillment

<div align="center">
  <img width="800" src="docs/voxe-architecture.png" />
</div>

## Nativescript app

### Install

Follow the instructions on [this link](https://docs.nativescript.org/start/quick-setup) to install the dependencies you will need to compile the apps locally. Then, run:

    $ npm install

You will also need to add your Firebase project configuration files:

 - [Web](https://firebase.google.com/docs/web/setup): In `src/environments`, copy `firebase.config.example.ts` to `firebase.example.ts` and replace your config object.
 - [Android](https://firebase.google.com/docs/android/setup): Download your `google-services.json` config file to `App_Resources/Android`.
 - [iOS](https://firebase.google.com/docs/ios/setup): Download your `GoogleService-Info.plist` config file to `App_Resources/iOS`.

### Develop

To start the development web server, run:

    $ npm start

Visit [http://localhost:4200](http://localhost:4200).

Use `npm run android` and `npm run ios` to run the Android and iOS apps, respectively.

### Build

    $ npm build

## Dialogflow Agent

An export of the Dialogflow Agent is available in [dialogflow](dialogflow).

## Action Fulfillment

The implementation of the fulfillment for the Google Action lives in [functions](functions).
