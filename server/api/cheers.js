const router = require('express').Router()
const { CheersRequest, User } = require('../db/models')
module.exports = router

const axios = require('axios');


router.get('/', (req, res, next) => {
    const user = req.user;
    axios.get('http://localhost:3001/blocks')
    .then(cheers => {
      res.json({cheers: cheers.data.filter(block => {
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
