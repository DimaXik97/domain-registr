'use strict';
const Sequelize = require('sequelize');
const assert = require("assert");
const sinon = require('sinon');
var should = require('should');
const config = require('../../config');
const dbcontext = require('../../context/db')(Sequelize, config);
const errors = require('../../utils/errors');
const jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
const Promise = require("bluebird");

var userRepository = dbcontext.user;

var authService = require('../../services/auth')(userRepository, errors);

var sandbox;
beforeEach(function () {
    sandbox = sinon.sandbox.create();
});

afterEach(function () {
    sandbox.restore();
});

var userObj = {
    id: 1,
    login: "dimaXik010",
    password: "$2a$10$mUEos7XyLco39aGSbblEG.F0SH7rNqHapSPTiGooREq6sGKDE2Ac.",
    money: 20
};
var user={
    "login": "dimaXik010",
    "password":"12345Qaz" 
};
var user1={
    "login": "dimaXik",
    "password":"12345Qaz" 
}
var user2={
    "login": "",
    "password":"12345Qaz" 
}
var user3={
    "login": "dimaXik",
    "password":"" 
}

 describe('При регистрации должно ', () => {
     it('выбивать ошибку,если пользователь уже существует', () => {
         sandbox.stub(userRepository, 'findOne').returns(Promise.resolve(userObj));
         var promise = authService.register(user);
         return promise.catch(err=> err.should.be.eql(errors.wrongCredentials));
     });
     it('регистрировать пользователя', () => {
         sandbox.stub(userRepository, 'findOne').returns(Promise.resolve(null));
         var promise = authService.register(user1);
         return promise.then(data=> data.should.be.eql({success: true}));
     });
     it('выбивать ошибку,если введен не правильный логин', () => {
         sandbox.stub(userRepository, 'findOne').returns(Promise.resolve(null));
         var promise = authService.register(user2);
         return promise.catch(err=> err.should.be.eql(errors.errorData));
     });
     it('выбивать ошибку,если введен не правильный пароль', () => {
         sandbox.stub(userRepository, 'findOne').returns(Promise.resolve(null));
         var promise = authService.register(user3);
         return promise.catch(err=> err.should.be.eql(errors.errorData));
     });
 });