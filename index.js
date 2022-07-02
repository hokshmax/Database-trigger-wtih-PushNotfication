const functions = require("firebase-functions");
const admin =require("firebase-admin");

var querystring = require("querystring");

var http = require("https");

admin.initializeApp() ;

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
 exports.notification = functions.database.ref("421107036964-chat/{chat}/{messageId}").onCreate (async (snap,context)  => {







if(snap.val()["eUserType"]=="Driver")
{
  admin.database().ref("state/"+snap.val()["passengerId"]).once("value",(snapshot,b)=>{

if(snapshot.val()["state"]!="inchat")
{
  admin.database().ref("tokens/"+snap.val()["passengerId"]).once("value",(snapshot1,b)=>{
    console.log('max: ' + snapshot1.val()['token']);

    const payload = {
      notification: {
        title: snap.val()["vName"],
        body: snap.val()["Text"],
        "sound" : "default"
      }
    };

    admin.messaging().sendToDevice([snapshot1.val()['token']],payload).then(rs=>{
      console.log(rs.results);
    });
    tokenHawaui("104291349","c0f9cdf727cee5a9395a432d27d6f752bbd8771ae740c022e635378180b8e639",snapshot1.val()['token'],"104291349",snap.val()["Text"],snap.val()["vName"]);



});
}
  });

}
else{
  admin.database().ref("state/"+snap.val()["driverId"]).once("value",(snapshot,b)=>{

    if(snapshot.val()["state"]!="inchat")
    {
      admin.database().ref("tokens/"+snap.val()["driverId"]).once("value",(snapshot1,b)=>{
        console.log('max: ' + snapshot1.val()['token']);

        const payload = {
          notification: {
            title: snap.val()["vName"],
            body: snap.val()["Text"],
            "sound" : "default"
          }
        };
    
    admin.messaging().sendToDevice([snapshot1.val()['token']],payload).then(rs=>{
      console.log(rs.results);
    });
        tokenHawaui("104310315","6a3f577ddb370002e345adb936ec4b00c8c7ef511f33894d3d8bc9cdca767532",snapshot1.val()['token'],"104310315",snap.val()["Text"],snap.val()["vName"]);
    
    
    
    });
    }
      });


}

 });
 

 async function  tokenHawaui (client_id,client_secret,snapshot,appid,message,senderName) 
{

  var post_data=querystring.stringify({
    "grant_type":"client_credentials",
    "client_id":client_id,
    "client_secret":client_secret

  });
  var post_options = {
    host: 'login.cloud.huawei.com',
    path:"/oauth2/v2/token",
    method: 'POST',
    port: 443,

    headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': Buffer.byteLength(post_data),

    }

    
};

var post_req = await  http.request(post_options, async function  (res)  {
  res.setEncoding('utf8'); 
  res.on('data', async function  (chunk) {

    var tok=JSON.parse(chunk);

      console.log('Responsevcx: ' + tok["access_token"]);

sendHawaui(appid,tok["access_token"],snapshot,message,senderName);



  });


});

// post the data
await post_req.write(post_data);
post_req.end();



}


function sendHawaui(appid,token,devicetoken,text,senderName)
{

  var post_data= JSON.stringify({
    "validate_only": false,
    "message": {
        "notification": {
            "title": "title",
            "body": "body",
            "default_sound":true
        },
        "android": {
            "notification": {
                "title": senderName,
                "body": text,
                "click_action": {
                    "type": 1,
                    "intent": "intent://com.huawei.codelabpush/deeplink?#Intent;scheme=pushscheme;launchFlags=0x04000000;i.age=180;S.name=abc;end"
                }
            }
        },
        "token": [
            devicetoken
        ]
    }
});
  var post_options = {
    host: 'push-api.cloud.huawei.com',
    path:"/v1/"+appid+"/messages:send",
    method: 'POST',
    port: 443,

        json:true,

    headers: {
        'Content-Type': 'application/json; charset=UTF-8',
        'Authorization':"Bearer "+token,
        'Content-Length':  Buffer.byteLength(post_data, 'utf8')

    }

    
};
var post_req = http.request(post_options, function(res) {
  res.setEncoding('utf8');
  res.on('data', function (chunk) {
      console.log('Response: ' + chunk);



  });
});

// post the data
post_req.write(post_data);
post_req.end();

}