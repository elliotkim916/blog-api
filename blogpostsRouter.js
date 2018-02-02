const express = require('express');
const router = express.Router();

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

const {BlogPosts} = require('./models');

BlogPosts.create('This is a blog post', 'Today is going to be interesting', 'J.K. Rowling');
BlogPosts.create('Fight with the girlfriend', 'She got mad again but its going to be okay because they ended up making up in the evening.', 'David Titus');

router.get('/', function(req, res){
   res.json(BlogPosts.get());
})

router.post('/', jsonParser, function(req, res) {
    const requiredFields = ['title', 'content', 'author'];
    for (let i=0; i<requiredFields.length; i++) {
        const field = requiredFields[i];
        if (!(field in req.body)) {
            const message = `Missing \`${field}\` in request body`
            console.error(message);
            return res.status(400).send(message);
        }
    }
    const newBlogPost = BlogPosts.create(req.body.title, req.body.content, req.body.author);
    res.status(201).json(newBlogPost); 
});

router.delete('/:id', function(req, res) {
    BlogPosts.delete(req.params.id);
    console.log(`Deleted blog post \`${req.params.id}\``);
    res.status(204).end();
});

router.put('/:id', jsonParser, function(req, res) {
    const requiredFields = ['title', 'content', 'author'];
    for (let i=0; i<requiredFields.length; i++) {
        const field = requiredFields[i];
        if (!(field in req.body)) {
            const message = `Missing \`${field}\` in request body`
            console.error(message);
            return res.status(400).send(message);
        }
    }
    if (req.params.id !== req.body.id) {
        const message = `Request path id (${req.params.id}) and request body id (${req.body.id}) must match.`;
        console.error(message);
        return res.status(400).send(message);
    }
    console.log(`Updating blog post \`${req.params.id}\``);
    const updatedBlogPost = BlogPosts.update({
        id: req.params.id,
        title: req.body.title,
        content: req.body.content,
        author: req.body.author
    });
    res.status(204).end();
});

module.exports = router;