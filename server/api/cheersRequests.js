const router = require('express').Router()
const { CheersRequest, User } = require('../db/models')
module.exports = router

const axios = require('axios');


const requestLifeTime = 1000 * 60 * 30; // 30 mins

router.post('/', (req, res, next) => { // TODO add isLoggedIn logic in gatekeeper file
  if (!req.user) {
    res.status(401).json({ error: "unauthorized" })
    return
  }
  const sender = req.user;
  userFromEmail(req.body.receiverEmail)
    .then(receiver => {
      if (!receiver) { //receiver does not exist
        res.status(400).json({ error: "receiver does not exist" });
        return // because we already responded
      } else { // receiver exists
        CheersRequest.findAll({
          limit: 1,
          where: {
            receiverId: sender.id, // we have access to the whole user based on the id because of association
            senderId: receiver.id,
            fulfilledRequest: false
          },
          order: [['createdAt', 'DESC']]
        })
          .then(existingRequests => {
            const existingRequest = existingRequests[0]
            if (!existingRequest) {
              createNewRequestAndRespond(sender, receiver, res)
            } else {
              let currentTime = new Date();
              if (currentTime - existingRequest.createdAt < requestLifeTime) {
                CheersRequest.update({
                  fulfilledRequest: true
                }, {
                    where: { id: existingRequest.id }, // mark existing request as fulfilled
                    //returning: true // needed for affectedRows to be populated
                  })
                  .then(() => {
                    return CheersRequest.findOne({
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
                  .then(fulfilledRequest => {
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
const userFromEmail = userEmail => {
  return User.findOne({
    where: {
      email: userEmail
    }
  })
} // returns promise to get user

const createNewRequestAndRespond = (sender, receiver, res) => {
  CheersRequest.create({
    senderId: sender.id,
    receiverId: receiver.id
  })
    .then(newRequest => {
      return res.status(201).json({isCheers: false, model: newRequest, timeRemaining: requestLifeTime / 60000}) // model is the item in the table, lifetime is divided to make it into seconds
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








