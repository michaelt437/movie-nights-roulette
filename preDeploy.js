require('dotenv').config();
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

let xhr = new XMLHttpRequest();
let msg = JSON.stringify({
  "text": `Starting to publish a new update...:cool-doge:`,
})

xhr.open("POST", process.env.DEPLOY_HOOK)
xhr.send(msg)
