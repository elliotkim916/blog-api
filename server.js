const express = require('express');
const app = express();
const {BlogPosts} = require('./models');

BlogPosts.create('this is a blog post', 'today is going to be interesting', 'jk rowling');

app.get('/blog-posts', function(req, res){
   res.json(BlogPosts.get());
})


app.listen(8080, () => {
    console.log('Your app is listening on port 8080');
});