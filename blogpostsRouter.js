const express = require('express');
// create a new express router instance
const router = express.Router();

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
// we want to parse the json data sent by clients

const {BlogPosts} = require('./models');

// we will add some blog posts so that there is data to look at 
BlogPosts.create('This is a blog post', 'Today is going to be interesting', 'J.K. Rowling');
BlogPosts.create('Fight with the girlfriend', 'She got mad again but its going to be okay because they ended up making up in the evening.', 'David Titus');

// add individual routes to this router
// when request is made to '/', app transforms to JSON the data returned by BlogPosts.get
router.get('/', function(req, res){
   res.json(BlogPosts.get());
})

// when a client makes a post request to '/' first validate the request body
// ensure that title, content, & author have been supplied
// if missing, log an error and send back status code of 400 with helpful error msg
// if client has sent valid data, call the BlogPosts.create method with data from the request body
// create() returns the newly created item &
// we respond with a 201 status code along with a JSON object representing the new item
router.post('/', jsonParser, function(req, res) {
    // ensure title, content, & author are in the request body
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

// delete blog posts by id
// we retrieve the id of the item to be deleted from the request params
// & then call BlogPosts.delete with that value
// we send back a blank response with 204 status code
router.delete('/:id', function(req, res) {
    BlogPosts.delete(req.params.id);
    console.log(`Deleted blog post \`${req.params.id}\``);
    res.status(204).end();
});

// when put request made, ensure required fields are there
// also ensure the id values in the request body and the request path URL match
// if there are problems, log error and return status 400
// if successful, call BlogPosts.update with updated data
// return 204 HTTP status code & no content
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