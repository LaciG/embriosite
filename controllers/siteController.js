let express = require('express');
const { sequelize } = require('../models/index');
let bodyParser = require('body-parser');
let router = express.Router();
let Models = require('../models/index');
const moment = require('moment');
const multer = require('multer')();
var sha256 = require('sha256');
let jwt = require('jsonwebtoken');

require('dotenv').config();

exports.index = (req, res) => {
    res.render('index', {layout: 'indexLayout.hbs', title: 'MCC QRCode Site'})
}

exports.home = (req, res) => { //Ide már a belogolt user kell, megírni majd a login processt, most csak visual miatt simán rendereli
    getAllEventList(5)
    .then(limitedEventList => {
            res.render('home', {layout: 'layout.hbs', limitedEventList: limitedEventList, title: 'Dashboard'})
    })
}

exports.login = (multer.array(), (req, res) => {
    Models.user.findOne({where: {email: req.body.email}})
    .then(user => {
        if(user == null) {
            res.redirect('/');
        } else {
            if(user.password == sha256(req.body.password)) {
                var token = jwt.sign({ id: user.id }, "embriosite");
                res.cookie('access_token', token);
                res.redirect('/home');
            } else {
                res.redirect('/');
            }
        }
    })
})

exports.logout = (req, res) => {
    res.clearCookie('access_token');
    res.redirect('/');
  };