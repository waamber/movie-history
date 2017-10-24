'use strict';
const events = require('./events');
const apiKeys = require('./apiKeys');

apiKeys.retrieveKeys();
events.myLinks();
events.googleAuth();
events.pressEnter();

