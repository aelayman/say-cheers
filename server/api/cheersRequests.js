const router = require('express').Router()
const { CheersRequest, User } = require('../db/models')
module.exports = router

const axios = require('axios');


const requestLifeTime = 1000 * 60 * 30; // 30 mins

router.post('/', (req, res, next) => { // TODO add isLoggedIn logic in gatekeeper file
  if (!req.user) { //checking if user is loggedin
    res.status(401).json({ error: "unauthorized" })
    return
  }
  const sender = req.user;
  userFromEmail(req.body.receiverEmail) //using aux function below
    .then(receiver => { //
      if (!receiver) { //receiver does not exist (no id of that user found in db)
        res.status(400).json({ error: "receiver does not exist" });
        return // because we already responded, move on
      } else { // receiver exists
        CheersRequest.findAll({ //find all cheersrequests in db based on receiver id that was returned
          limit: 1,
          where: {
            receiverId: sender.id, // we have access to the whole user based on the id because of association
            senderId: receiver.id,
            fulfilledRequest: false // we only care if it is still pending
          },
          order: [['createdAt', 'DESC']] //order desc to get the most recent cheersrequest
        })
          .then(existingRequests => { //array of requests bc findAll always returns array
            const existingRequest = existingRequests[0] //grab the first request
            if (!existingRequest) {
              createNewRequestAndRespond(sender, receiver, res) //using aux function below to create request
            } else {
              let currentTime = new Date(); // if there is a request we must check the time to see if it is within the time frame (30 mins) to make a cheers
              if (currentTime - existingRequest.createdAt < requestLifeTime) {
                CheersRequest.update({ // if within the timeframe, change the status to fulfilled
                  fulfilledRequest: true
                }, {
                    where: { id: existingRequest.id }, // mark existing request as fulfilled
                  })
                  .then(() => {
                    return CheersRequest.findOne({ //once request is updated, find that request in the db and include User model in order to also include info about the sender and receiver to store in the block chain
                      where: {
                        id: existingRequest.id
                      },
                      include: [{
                        model: User,
                        as: "sender",
                      }, {
                        model: User,
                        as: "receiver"
                      }]
                    })
                  })
                  .then(fulfilledRequest => { //create new block in blockchain with newly found request and using aux function below
                    createCheersBlock({time: new Date(), party1: fulfilledRequest.sender, party2: fulfilledRequest.receiver})
                    .then(createdCheers => {
                      // need to send who the loggedin user cheersed with
                      let buddy = createdCheers.data.party1.id === req.user.id ? createdCheers.data.party2 : createdCheers.data.party1

                      res.status(201).json({isCheers: true, model: createdCheers.data, buddy }) // see what createdCheers looks like by checking what the response is from the blockchain post
                    })
                  })
                  .catch(next)
              } else {
                createNewRequestAndRespond(sender, receiver, res)
              }
            }
          })
          .catch(next)
      }
    })
    .catch(next)
})

router.get('/', (req, res, next) => {
  if (!req.user) {
    res.status(401).send('');
    return;
  }
  CheersRequest.findAll({
    limit: 1,
    where: {
      senderId: req.user.id,
      fulfilledRequest: false
    },
    order: [['createdAt', 'DESC']]
  })
  .then(existingRequests => {
    const existingRequest = existingRequests[0];
    if (!existingRequest) {
      res.json({exists: false, request: null})
    } else {
      let currentTime = new Date();
      if (currentTime - existingRequest.createdAt < requestLifeTime) {
        let age = currentTime - existingRequest.createdAt;
        let remainingTime = Math.ceil((requestLifeTime - age) / 60000);
        res.json({exists: true, request: existingRequest, timeRemaining: remainingTime})
      } else {
        res.json({exists: false, request: null, timeRemaining: 0})
      }
    }
  })
})


// aux functions
const userFromEmail = userEmail => { //looking up the user by their email in the database
  return User.findOne({
    where: {
      email: userEmail
    }
  })
} // returns promise to get user

const createNewRequestAndRespond = (sender, receiver, res) => {
  CheersRequest.create({ //create new request based on user ids
    senderId: sender.id,
    receiverId: receiver.id
  })
    .then(newRequest => {
      return res.status(201).json({isCheers: false, model: newRequest, timeRemaining: requestLifeTime / 60000}) // model is the item in the table, lifetime is divided to make it into seconds, this is what is passed back to front end, easy way to grab the data we want
    })
}

const createCheersBlock = (cheers) => {
  //method is a post
  // maybe need header?
  // url: https://say-cheers-blockchain.herokuapp.com/mineBlock

  //body: {"data" : cheers}
  return axios.post('https://say-cheers-blockchain.herokuapp.com/mineBlock', {data: cheers})
    .then(res => res.data)
    .catch(error => console.log(error));

}

// send to blockchain server








