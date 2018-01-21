const router = require('express').Router()
const { CheersRequest, User } = require('../db/models')
module.exports = router

const axios = require('axios');


// get all the blocks from the blockchain server
router.get('/', (req, res, next) => {
  if (!req.user) {
    res.status(401).json({ error: "unauthorized" })
    return;
  }
    const user = req.user;
    axios.get('https://say-cheers-blockchain.herokuapp.com/blocks')
    .then(cheers => {
      res.json({cheers: cheers.data.filter(block => { // we do not want the first block and we only want the blocks that the user was involved with
          return block.index !== 0 && (block.data.party1.id === req.user.id || block.data.party2.id === req.user.id)
      }).map(block => {
          return { // make the response only include time and buddy info from the block
              time: block.data.time, 
              buddy: (block.data.party1.id === user.id ? block.data.party2 : block.data.party1)
            }
      })})
    })
    .catch(next)
  })
