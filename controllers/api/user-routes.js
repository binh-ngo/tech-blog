const express = require('express');
const router = express.Router();
const { User, Post, Comment } = require('../../models');

router.get('/', (req, res) => {
    User.findAll().then(userData => res.json(userData))
    .catch(err => {
        console.log(err);
        res.status(500).json(err)
    })
})

router.get('/logout', (req, res) => {
    req.session.destroy();
    res.send("Logged out successfully.")
})

router.get('/:id', (req, res) => {
    User.findOne({
        where: {
            id: req.params.id
        },
        include: [{
            model: Post,
            attributes: ['id', 'title', 'content', 'created_at']
        },
        {
            model: Comment,
            attributes: ['id', 'comment_text', 'created_at'],
            include: {
                model: Post,
                attributes: ['title']
            }
        },
        {
            model: Post,
            attributes: ['title'],
        }]
    })
    .then(userData => {
        if(!userData) {
            res.status(404).json({msg: "User with this ID not found."})
            return;
        }
        res.json(userData);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

router.post('/', (req, res) => {
    User.create({
        username: req.body.username,
        password: req.body.password
    })
    .then (userData => {
        req.session.user_id = userData.id;
        req.session.username = userData.username;
        req.session.loggedIn = true;
        res.json(userData);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err)
    })
})

router.post('/login', (req, res) => {
    User.findOne({
        where: {
            username: req.body.username
        }
    }).then(userData => {
            if(!userData) {
                res.status(401).json({msg:"Incorrect username or password."}); 
            } else {
                if (bcrypt.compareSync(req.body.password, userData.password)){
                    req.session.user_id = userData.id;
                    req.session.username = userData.username;
                    return res.json(userData)
            } else {
                return res.status(401).json({msg: "Incorrect email or password."})
            }
        }
    }).catch(err => {
        console.log(err);
        res.status(500).json(err)
    })
})

