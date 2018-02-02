const express = require('express');
const app = express();

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

const {BlogPosts} = require('./models');


BlogPosts.create('this is a blog post', 'today is going to be interesting', 'jk rowling');

app.get('/blog-posts', function(req, res){
   res.json(BlogPosts.get());
})

app.post('/blog-posts', jsonParser, function(req, res) {
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

app.listen(8080, () => {
    console.log('Your app is listening on port 8080');
});