const jwt = require('jsonwebtoken');
const User = require('../models/user.js');

const auth = async (req, res, next) => {
    try{
        const token = req.header('Authorization').replace('Bearer ', '');
        const decoded = jwt.verify(token, 'thisismycourse');
        const user = await User.getById(decoded.id);
        if(user==undefined){
            throw new Error();
        }
        req.user = user;
        next();
    } catch(e){
        res.status(401).send({error: 'please authenticate'})
    }
}

module.exports = auth;