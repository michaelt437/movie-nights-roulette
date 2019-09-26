require('dotenv').config();
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
var xhr = new XMLHttpRequest();
let msg = JSON.stringify({
  "text": `A new Roulette update has been published! :dancing_bob::niccage::dancing_granny:\n*Update notes*:\n>1. fixed rolls that are undefined because of improper RNGeneration still counting unchecked picks`,
})

xhr.open("POST", process.env.DEPLOY_HOOK)
xhr.send(msg)
