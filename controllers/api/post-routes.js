const express = require('express');
const router = express.Router();
const { User, Post, Comment } = require('../../models');
const sequelize = require('../../config/connection');

router.get('/', (req, res) => {
    Post.findAll().then(postData => {
        res.json(postData)
    }).catch(err => {
        console.log(err);
        res.status(500).json(err);
    })
})

router.get('/:id', (req, res) => {
    Post.findByPk(req.params.id, {
        include: [{
            model: User,
            attributes: ['username']
        },
        {
            model: Comment,
            attributes: ['id', 'comment_text', 'post_id', 'user_id', 'created_at'],
            include: {
                model: User,
                attributes: ['username']
            }
        }]
    }).then(postData => { res.json(postData)
    }).catch(err => {
        console.log(err);
        res.status(500).json(err);
    })
})