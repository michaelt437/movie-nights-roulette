require('dotenv').config();
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
var xhr = new XMLHttpRequest();
let msg = JSON.stringify({
  "text": `A new Roulette update has been published! :dancing_bob::niccage::dancing_granny:\n*Update notes*:\n>1. fixed bug - exclude checkbox sometimes doesnt reflect proper state\n2. Added in-between length options for picking\n3. security fixes`,
})

xhr.open("POST", process.env.DEPLOY_HOOK)
xhr.send(msg)
