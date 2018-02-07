const chai = require('chai');
const chaiHttp = require('chai-http');

const {app, runServer, closeServer} = require('../server');

const should = chai.should();

chai.use(chaiHttp);

describe ('Blog Posts', function() {

    // use before hook to run our server before the tests run
    before(function() {
        // starts the server and returns a promise
        // ensures server will be running before tests run
        return runServer();
    });

    // use after hook to close our server after the tests run
    after(function() {
        return closeServer();
    });

    it('should list items on GET', function() {
        // Usable through chai-http, giving us methods such as chai.request() that
        // we can use to make arbitrary requests to a server, and then 
        // assert about the results of our requests
        // Using return because were working with asynchronous operations in Mocha tests & so
        // we need to either return a Promise or call a done callback
        return chai.request(app)
            .get('/blog-posts')
            .then(function(res){
                res.should.have.status(200);
                res.should.be.json;
                res.body.should.be.a('array');
                res.body.should.have.length.of.at.least(1);

                res.body.forEach(function(item) {
                    item.should.be.a('object');
                    item.should.include.keys('id', 'title', 'content', 'author');
                });
            });
    });

    it('should add an item on POST', function() {
        const newBlogPost = {
            title: 'Tuesday',
            content: 'Hopefully today will be better than yesterday!',
            author: 'Positive Man'
        };
        return chai.request(app)
            .post('/blog-posts')
            .send(newBlogPost)
            .then(function(res) {
                res.should.have.status(201);
                res.should.be.json;
                res.body.should.be.a('object');
                res.body.should.include.keys('id', 'title', 'content', 'author');
                res.body.title.should.equal(newBlogPost.title);
                res.body.content.should.equal(newBlogPost.content);
                res.body.author.should.equal(newBlogPost.author);
            });
    });

    it('should update items on PUT', function() {
        const updateData = {
            title: 'The Weekend',
            content: 'I wish the weekend would come faster!',
            author: 'Weekend Guy'
        };

        return chai.request(app)
        .get('/blog-posts')
        .then(function(res) {
            updateData.id = res.body[0].id;

        return chai.request(app)
        .put(`/blog-posts/${updateData.id}`)
        .send(updateData);
        })
        .then(function(res) {
            res.should.have.status(204);
        });
    });

    it('should delete items on DELETE', function() {
        return chai.request(app)
        .get('/blog-posts')
        .then(function(res) {
            return chai.request(app)
            .delete(`/blog-posts/${res.body[0].id}`);
        })
        .then(function(res) {
            res.should.have.status(204);
        });
    });
});