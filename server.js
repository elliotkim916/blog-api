const express = require('express');
const app = express();

const blogpostsRouter = require('./blogpostsRouter');

app.use('/blog-posts', blogpostsRouter);

app.listen(8080, () => {
    console.log('Your app is listening on port 8080');
});