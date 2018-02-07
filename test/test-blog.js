const chai = require('chai');
const chaiHttp = require('chai-http');

const {app, runServer, closeServer} = require('../server');

const should = chai.should();

chai.use(chaiHttp);

describe ('Blog Posts', function() {

    before(function() {
        return runServer();
    });

    after(function() {
        return closeServer();
    });

    it('should list items on GET', function() {
        return chai.request(app)
            .get('/blog-posts')
            .then(function(res){
                res.should.have.status(200);
                res.should.be.json;
                res.body.should.be.a('array');
                res.body.should.have.length.of.at.least(1);

                res.body.forEach(function(item) {
                    item.should.be.a('object');
                    item.should.include.keys('title', 'content', 'author');
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