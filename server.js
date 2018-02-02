const express = require('express');
const app = express();

app.get('/blog-posts', function(req, res){
    res.send('hello');
})


app.listen(8080, () => {
    console.log('Your app is listening on port 8080');
});