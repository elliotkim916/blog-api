const express = require('express');
const app = express();

// importing blogpostsRouter
const blogpostsRouter = require('./blogpostsRouter');

// any requests to /blog-posts should be routed to blogpostsRouter
app.use('/blog-posts', blogpostsRouter);

app.listen(8080, () => {
    console.log('Your app is listening on port 8080');
});