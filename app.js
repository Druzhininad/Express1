var express = require('express');
var logger = require('morgan');
const nanoid = require('nanoid');
const mongoose = require('mongoose');
const ShortenModel = require('./models');

var app = express();
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));

app.post('/shorten', (req, res) => {
    const urlToShorten = req.body.urlToShorten;
    console.log(urlToShorten);
    const id = nanoid.nanoid(8);
    const link = new ShortenModel({
        redirect: urlToShorten,
        short: id,
        count: 0,
    })
    link.save().then(() => {
        res.status(200);
        res.json({
            status: 'Created',
            shortenedUrl: `http://localhost:1234/${id}`
        })
    });
});

app.get('/:url', function(req, res) {
    const shortenUrl = req.params.url;
    console.log(shortenUrl);
    ShortenModel.findOne({short: shortenUrl}, (err, data) => {
        if (err) {
            res.status(500);
            res.json({message: "Unknown Error"});
        }
        else if (!data) {
            res.status(404);
            res.json({message: "Not Found"});
        }
        else{
            res.header("Location", data.redirect);
            res.status(200);
            res.json({redirectTo: data.redirect});
            data.count += 1;
            data.save();
        }
    });
});

app.get('/:url/views', function(req, res) {
    const shortenUrl = req.params.url;
    ShortenModel.findOne({short: shortenUrl}, function (err, data) {
        if (err) {
            res.status(500);
            res.json({message: "Unknown Error"});
        }
        else if (!data) {
            res.status(404);
            res.json({message: "Not Found"});
        }
        else{
            res.status(200);
            res.json({viewCount: data.count});
        }
    });
});

mongoose.connect('mongodb+srv://Dasha:EXb-sf9-4yr-EJr@cluster0.ihzxl.mongodb.net/PROJECT 0?retryWrites=true&w=majority');
app.listen(1234);
