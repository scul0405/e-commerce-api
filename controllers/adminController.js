const Admin = require('../models/admin');
const { loginOne, createOneAccount } = require('./refactorController');

exports.createAnAdminUser = createOneAccount(Admin);

exports.loginAdminUser = loginOne(Admin);
