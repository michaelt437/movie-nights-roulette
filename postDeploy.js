require('dotenv').config();
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
var xhr = new XMLHttpRequest();
let msg = JSON.stringify({
  "text": `A new Roulette update has been published! :dancing_bob::niccage::dancing_granny:\n*Update notes*:\n>1. added a _real long_ length option to picks\n>2. real long picks are films over 2hr 15min or 135 min`,
})

xhr.open("POST", process.env.DEPLOY_HOOK)
xhr.send(msg)
