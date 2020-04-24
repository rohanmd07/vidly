const _ = require('lodash');
const config = require('config');
const jwt = require('jsonwebtoken');
const Joi = require('joi');
const bcrypt = require('bcrypt');
const {User} = require('../models/user');
const express = require('express'); 
const mongoose = require('mongoose');
const router = express.Router();

if(!config.get('jwtPrivateKey'))
{
    console.error('FATAL ERROR: jwtPrivateKey is not defined');
    process.exit(1);
}

router.post('/', async (req,res) => {
    const { error } = validate(req.body); 
    if (error) return res.status(400).send(error.details[0].message);
 
    let user = await User.findOne({email: req.body.email});
    if(!user) return res.status(400).send('EmailID or password is incorrect');
    
    const validPassword = await bcrypt.compare(req.body.password,user.password);
    if(!validPassword ) return res.status(400).send('EmailID or password is incorrect');

    const token = user.generateAuthToken();
    
    res.send(token);
});


function validate(req){
    const schema = {
        email: Joi.string().min(5).max(55).required().email(),
        password: Joi.string().min(5).max(110).required()  // include minimum password eligibilty criteria
     }
    return Joi.validate(req,schema);
  }
  


module.exports = router;

