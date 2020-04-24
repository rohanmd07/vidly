const mongoose = require('mongoose');
const Joi = require('joi');
const config = require('config');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
    name:{
        type: String,
        minlength: 5,
        maxlength: 55,
        required: true
    },
    email:{
        type: String,
        minlength: 5,
        maxlength: 55,
        unique: true,
        required: true
    },
    password:{
        type: String,
        minlength: 5,
        maxlength: 110,
        required: true
    }
});

userSchema.methods.generateAuthToken = function() {
    const token = jwt.sign({_id:this._id}, config.get('jwtPrivateKey'));
    return token;
}

const User = mongoose.model('User', userSchema);

function validateUser(user){
  const schema = {
      name: Joi.string().min(5).max(55).required(),
      email: Joi.string().min(5).max(55).required().email(),
      password: Joi.string().min(5).max(110).required()  // include minimum password eligibilty criteria
   }
  return Joi.validate(user,schema);
}

exports.User = User;
exports.validate = validateUser;