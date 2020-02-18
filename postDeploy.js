require('dotenv').config();
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
var xhr = new XMLHttpRequest();
let msg = JSON.stringify({
  "text": `A new Roulette update has been published! :dancing_bob::niccage::dancing_granny:\n*Update notes*:\n>1. hotfix - change from < 135 to > 135...`,
})

xhr.open("POST", process.env.DEPLOY_HOOK)
xhr.send(msg)
