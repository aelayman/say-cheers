const router = require('express').Router()
const { CheersRequest, User } = require('../db/models')
module.exports = router


const requestLifeTime = 30000; //1000 * 60 * 30;

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
                    where: { id: existingRequest.id } // mark existing request as fulfilled
                  })
                  .then(fulfilledRequest => {
                    // TODO create new block in blockchain
                    res.status(201).json({ isCheers: true, model: {} })
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
        let remainingTime = Math.ceil((requestLifeTime - age) / 1000);
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
      return res.status(201).json({isCheers: false, model: newRequest, timeRemaining: requestLifeTime / 1000}) // modle is the item in the table, lifetime is divided to make it into seconds
    })
}

// send to blockchain server








