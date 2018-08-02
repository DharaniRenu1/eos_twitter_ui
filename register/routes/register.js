var express = require('express');
var token_router = express.Router();
var bodyparser = require('body-parser')
var app = express()
Eos = require('eosjs')
fs = require('fs')
//var prettyjson = require('prettyjson')

app.use(bodyparser.json())
app.use(express.urlencoded({ extended: true }));


config = {
    chainId: 'cf057bbfb72640471fd910bcb67639c22df9f92470936cddc1ade0e2f2e7dc4f', // Jungle Testnet  http://dev.cryptolions.io:38888/v1/chain/get_info
    keyProvider: ['5KQwrPbwdL6PhXujxW37FSSQZ1JiwsST4cqQzDeyXtP79zkvFD3'], // <----- existing account (active) private key that has ram cpu and bandwidth already purchased
    httpEndpoint: 'http://18.191.181.219:8888', // jungle testnet
    expireInSeconds: 60,
    broadcast: true,
    debug: true,
    sign: true
}

wif = '5KQwrPbwdL6PhXujxW37FSSQZ1JiwsST4cqQzDeyXtP79zkvFD3'
pubkey = 'EOS6MRyAjQq8ud7hVNYcfnVPJqcVpscN5So8BhtHuGYqET5GDW5CV'


config.binaryen = require("binaryen")
eos = Eos.Testnet(config)

token_router.post('/create',(req,res,next) =>{
eos.transaction(tr => {
  tr.newaccount({
    creator: 'eosio',
    name: 'dharanisul',
    owner: pubkey,
    active: pubkey
  })

  tr.buyrambytes({
    payer: 'eosio',
    receiver: 'dharanisul',
    bytes:8192
  })

  tr.delegatebw({
    from: 'eosio',
    receiver:'dharanisul',
    stake_net_quantity: '100.0000 EOS',
    stake_cpu_quantity: '100.0000 EOS',
    transfer: 0
  })
}).then((da) =>{
        res.contentType('application/json');
        res.json(da);
})


})

//Deploying the Contract For account

wasm = fs.readFileSync(`./contracts/register/register.wasm`)
abi = fs.readFileSync(`./contracts/register/register.abi`)


token_router.post('/wasm',(req,res) =>{

      eos.setcode('dharanisul', 0, 0, wasm,function(err,data){

if(err){
        res.contentType('application/json');
        res.send("Already the Contract is deployed" + err)

}
else{

        res.contentType('application/json');
        res.send(data)
}


})



})

token_router.post('/abi',(req,res) => {
eos.setabi('dharanisul', JSON.parse(abi),(err,data) =>{

if(err){
        res.contentType('application/json');
        res.send("Already the Contract is deployed" + err)

}
else{

        res.contentType('application/json');
        res.send(data)
}


})

})


token_router.post('/register', function(req, res, next) {

        eos.transaction('dharanisul', myaccount => {


          myaccount.tregister(req.body.aname,req.body.pass,req.body.skey, { authorization: ['dharanisul']})
        }).then((data) => {

                res.contentType('application/json');
                res.json(data);

        })


});


token_router.post('/change', function(req, res, next) {

        eos.transaction('dharanisul', myaccount => {


          myaccount.modifyreg(req.body.aname1,req.body.pass1,req.body.skey1, { authorization: ['dharanisul']})
        }).then((data) => {

                res.contentType('application/json');
                res.json(data);

        })


});

token_router.post('/chating', function(req, res, next) {

        eos.transaction('dharanisul', myaccount => {


          myaccount.chat(req.body.name1,req.body.chat, { authorization: ['dharanisul']})

        }).then((data) => {

                res.contentType('application/json');
                res.json(data);

        })


});

token_router.post('/private', function(req, res, next) {

        eos.transaction('dharanisul', myaccount => {


          myaccount.personal(req.body.fname,req.body.tname,req.body.person, { authorization: ['dharanisul']})

        }).then((data) => {

                res.contentType('application/json');
                res.json(data);

        })


});


token_router.post('/de_register', function(req, res, next) {

       eos.transaction('dharanisul', myaccount => {


         myaccount.del(req.body.dac, { authorization: ['dharanisul']})
       }).then((data) => {

               res.contentType('application/json');
               res.json(data);

       })


});

token_router.post('/follow', function(req, res, next) {

        eos.transaction('dharanisul', myaccount => {


          myaccount.follower(req.body.name,req.body.namef, { authorization: ['dharanisul']})
        }).then((data) => {

                res.contentType('application/json');
                res.json(data);

        })


});



token_router.post('/following', function(req, res, next) {

        eos.transaction('dharanisul', myaccount => {


          myaccount.followings(req.body.myname,req.body.followname, { authorization: ['dharanisul']})
        }).then((data) => {

                res.contentType('application/json');
                res.json(data);

        })


});



token_router.post('/unfollow', function(req, res, next) {

        eos.transaction('dharanisul', myaccount => {

            myaccount.unfollower(req.body.uname,req.body.unamef, { authorization: ['dharanisul']})

        }).then((data) => {

                res.contentType('application/json');
                res.json(data);

        })


});


token_router.post('/unfollowing', function(req, res, next) {

        eos.transaction('dharanisul', myaccount => {

                  myaccount.unfollowing(req.body.my_name,req.body.unfollowname,i, { authorization: ['dharanisul']})

        }).then((data) => {

                res.contentType('application/json');
                res.json(data);

        })


});





token_router.post('/Like', function(req, res, next) {

        eos.transaction( 'dharanisul', myaccount => {

                  myaccount.liking(req.body.lname,req.body.liken_name,req.body.ltime, { authorization: [ 'dharanisul']})
        }).then((data) => {

                res.contentType('application/json');
                res.json(data);

        })


});



token_router.post('/Dislike', function(req, res, next) {

        

     eos.getTableRows({ json:true, scope:'dharanisul', code:'dharanisul', table:'twitmsg'}).then(data=>{


    
    for(var i=0;i<data.rows.length;i++)
    {
      if(req.body.dtime== data.rows.time[i])
      {
        
        eos.getTableRows({ json:true, scope:'dharanisul', code:'dharanisul', table:'dislike'}).then(dat=>{

          for(let j =0;j<dat.rows.length;j++)
          {
            if(req.body.disliken_name == dat.rows.dislike_c[j])
            {

                          myaccount.disliking(req.body.dname,req.body.disliken_name,req.body.dtime, { authorization: ['dharanisul']})
            }
          }
        });

        
        console.log("successfully");
      }
    }



  //console.log(data) 
  });
  


});




token_router.post('/share', function(req, res, next) {

        eos.transaction( 'dharanisul', myaccount => {


          myaccount.sharing(req.body.poster,req.body.po_name,req.body.sh_name,req.body.post, { authorization: [ 'dharanisul']})
        }).then((data) => {

                res.contentType('application/json');
                res.json(data);

        })


});



token_router.post('/doc', function(req, res, next) {

               eos.getTableRows({ json:true, scope: req.body.scope, code: req.body.code, table: req.body.table}).then(data=>{res.send(data);});


});


module.exports = token_router;

