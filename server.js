const express = require('express');
const app = express();

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

const {BlogPosts} = require('./models');


BlogPosts.create('This is a blog post', 'Today is going to be interesting', 'J.K. Rowling');
BlogPosts.create('Fight with the girlfriend', 'She got mad again but its going to be okay because they ended up making up in the evening.', 'David Titus');

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

app.delete('/blog-posts/:id', function(req, res) {
    BlogPosts.delete(req.params.id);
    console.log(`Deleted blog post \`${req.params.id}\``);
    res.status(204).end();
});

app.listen(8080, () => {
    console.log('Your app is listening on port 8080');
});