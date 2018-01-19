const User = require('./user');
const Address = require('./address');
const CheersRequest = require('./cheersRequest');

Address.belongsTo(User);
User.hasOne(Address);

//User.hasMany(User, {as: 'Friends'})

CheersRequest.belongsTo(User, {as: 'receiver'});
CheersRequest.belongsTo(User, {as: 'sender'});


/**
 * We'll export all of our models here, so that any time a module needs a model,
 * we can just require it from 'db/models'
 * for example, we can say: const {User} = require('../db/models')
 * instead of: const User = require('../db/models/user')
 */
module.exports = {
  User,
  Address,
  CheersRequest
}
