const express = require('express');
const router = express.Router();
const request = require('request');
const WX = require("../config.js")
const util = require("./util.js")
const CLOUD_FUNCTION_NAME = "clockrecord"



/* GET home page. */
router.get('/', function(req, res, next) {
  
  res.render('index', { username: req.session.user.username});
});
router.get('/welcome', function(req, res, next) {
  
  res.render('welcome', { username: req.session.user.username});
});

router.get('/clock', function(req, res, next) {
  
  res.render('queryclock', {username: req.session.user.username });
});
router.post('/getrecord', function(req, res, next) {


  util.getToken().then(access_token=>{
    let cloudurl= WX.CLOUDFUNCTION + access_token + "&env=" + WX.CLOUD_ENV + "&name=" + CLOUD_FUNCTION_NAME;
    var requestData={
        "action":"queryrecordbyname",
        "real_name":req.query.real_name,
        "startTime":req.query.startTime,
        "endTime":req.query.endTime
      };
      console.log(requestData)
    request({
        url: cloudurl,
        method: "POST",
        json: true,
        headers: {
            "content-type": "application/json",
        },
        body: requestData
    }, function(error, response, body) {
        if (!error && response.statusCode == 200) {
          res.send(body);
        }
    });
    console.log(access_token)
})
  
});


module.exports = router;
