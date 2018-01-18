const router = require('express').Router()
const { CheersRequest, User } = require('../db/models')
module.exports = router

// req.body is receiver
// req.user is sender


router.post('/', (req, res, next) => {
  console.log("!!!!!", req.body)
  CheersRequest.create
       ({sender: req.user.email,

       receiver: req.body.receiver})
  .then(newRequest => res.status(201).json(newRequest))
  .catch(next)
})

// router.post('/', (req, res, next) => {
//   if (isIdUnique(req.body.userId)) {
//       CheersRequest.findAll({
//         limit: 1,
//         where: {
//           receiver: req.user.email, 
//           sender: req.body,
//           fulfilledRequest: false
//         },
//         order: [ [ 'createdAt', 'DESC' ]]
//       })
//       .then(entry => {
//         if (!entry) {
//           CheersRequest.create({
//             sender: req.user,
//             receiver: req.body
//           })
//           .then(newRequest => res.status(201).json(newRequest))
//           .catch(next)
//         } else if (currentTime - request.createdAt < 30) {
//           // mark entry as fulfilled 
//           CheersRequest.update({
//             fulfilledRequest: true
//           }, {
//             where: {id: entry.id}
//           })
//           .then() //create cheers record between me and Alex by adding block to blockchain
//           //respond with .json(newly created cheers record)
//         } else {
//           CheersRequest.create({
//             sender: req.user,
//             receiver: req.body
//           })
//           .then(newRequest => res.status(201).json(newRequest))
//         }
//       })
//   }
// })

  // aux functions
const isIdUnique = id =>
User.findOne({ where: { id } })
  .then(user => user !== null)
  .then(isUnique => isUnique);

let currentTime = new Date();






