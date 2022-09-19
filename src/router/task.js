const express = require('express');
const Task = require('../models/task.js');
const auth = require('../middleware/auth.js');
const router = new express.Router();

router.post('/tasks', auth, async (req, res) => {
    try{
        req.body.userId = req.user.userId;
        const task = new Task(req.body);
        await task.save();
        res.status(201).send(task);
    } catch(e){
        res.status(400).send(e);
    }
})

router.get('/tasks', auth, async (req, res) => {
    try{
        const result = await Task.getAll(req.user.userId);
        const tasks = result[0];
        res.send(tasks);
    } catch(e){
        res.status(500).send(err);
    }
})

router.get('/tasks/:id', auth, async (req, res) => {
    try{
        console.log(req.user);
        const result = await Task.getById(req.params.id, req.user.userId);
        const task = result[0][0];
        if(task===undefined){
            res.status(404).send();
        }
        res.send(task);
    } catch(e){
        res.status(500).send();
    }

})

router.patch('/tasks/:id', auth, async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['title', 'description', 'status'];
    let isValid = true;
    for(let update of updates){
        let i = 0;
        for(let allowed of allowedUpdates){
            if(update!=allowed){
                i++;
            }
        }
        if(i==3){
            isValid = false;
            break;
        }
    }

    if(!isValid){
        return res.status(400).send();
    }

    try{
        const result = await Task.update(req.params.id, req.user.userId, req.body);
        if(result[0].affectedRows==0){
            throw new Error();
        }
        res.status(201).send();
    } catch(e){
        res.status(400).send();
    }
})

router.delete('/tasks/:id', auth, async (req, res) => {
    try{
        const result = await Task.getById(req.params.id, req.user.userId);
        const task = result[0][0];
        if(task===undefined){
            res.status(404).send();
        }
        await Task.deleteById(req.params.id, req.user.userId);
        res.send(task);
    } catch(e){
        res.status(500).send();
    }
})

module.exports = router;