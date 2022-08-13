const Admin = require('../models/admin');
const { loginOne, createOne } = require('./refactorController');

exports.createAnAdminUser = createOne(Admin);

exports.loginAdminUser = loginOne(Admin);
