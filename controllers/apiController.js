let express = require('express');
const { sequelize } = require('../models/index');
let router = express.Router();
let Models = require('../models/index');
const moment = require('moment');
var sha256 = require('sha256');

require('dotenv').config();

exports.initSite = (req, res) => {
    res.status(200).json(
        {
            "message": "EZAZZZ",   
        }
    );
}

exports.register = (req, res) => {
    countUsersForEmail(req.body.email)
    .then(count => {
        if(count == 0) {
            Models.user.create({
                first_name: req.body.first_name,
                last_name: req.body.last_name,
                email: req.body.email,
                password: sha256(req.body.password)
            })
            .then(result => {
                res.status(201).send();
            })
            .catch(error => { res.status(500).send(); })
        } else {
            res.status(409).send();
        }
    })
    /*res.status(200).json({
        "message": "Event called",
        "email": req.body.email,
        "password": req.body.password
    })*/
}