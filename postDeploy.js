require('dotenv').config();
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
var xhr = new XMLHttpRequest();
let msg = JSON.stringify({
  "text": `:niccage::dancing_granny: A new Roulette update has been published! :dancing_bob::niccage:`,
})

xhr.open("POST", process.env.DEPLOY_HOOK)
xhr.send(msg)
