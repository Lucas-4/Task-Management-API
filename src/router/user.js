const express = require('express');
const User = require('../models/user.js');
const router = new express.Router();
const auth = require('../middleware/auth.js');

router.post('/users', async (req, res) => {
    const user = new User();
    user.create(req.body);
    try{
        await user.save();
        const token = user.generateAuthToken();
        res.status(201).send({user, token});
    } catch(e){
        res.status(400).send();
    }
})

router.post('/users/login', async (req, res) => {
    try{
        const user = new User();
        await user.login(req.body);
        const token = user.generateAuthToken();
        res.send({user, token});
    } catch(e){
        res.status(400).send();
    }
})

router.post('/users/logout', auth, (req, res) => {
    res.send();
})

router.get('/users/me', auth, async (req, res) => {
    res.send(req.user);
})

router.patch('/users/me', auth, async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['name', 'email'];
    let isValid = true;
    for(let update of updates){
        let i = 0;
        for(let allowed of allowedUpdates){
            if(update!=allowed){
                i++;
            }
        }
        if(i==2){
            isValid = false;
            break;
        }
    }

    if(!isValid){
        return res.status(400).send();
    }

    try{
        const result = await User.update(req.user.userId, req.body);
        if(result[0].affectedRows==0){
            throw new Error();
        }
        res.status(201).send();
    } catch(e){
        res.status(500).send();
    }
})

router.delete('/users/me', auth, async (req, res) => {
    try{
        await User.deleteById(req.user.userId);
        res.send(req.user);
    } catch(e){
        res.status(500).send(e);
    }
    
})

module.exports = router;