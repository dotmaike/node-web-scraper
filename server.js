var express = require('express');
var fs = require('fs');
var async = require("async");
var request = require("request");
var rp = require('request-promise');
var cheerio = require('cheerio');
var app = express();

app.get('/scrape', function(req, res) {
    /*var requests = [];
    for (var page = 1; page < 11; page++) {
        var options = {
            uri: 'https://www.promodescuentos.com/?page=' + page,
            transform: function(body) {
                return cheerio.load(body);
            }
        };
        requests.push(options);
    }*/

    var requests = [];
    for (var page = 1; page < 11; page++) {
        requests.push({
            url: 'https://www.promodescuentos.com/?page=' + page,
        });
    }

    async.map(requests, function(obj) {
        /*rp(obj)
            .then(function($) {
                var title, category, link;
                var json = {};

                $('.thread-content').filter(function(i, el) {
                    var data = $(this);
                    category = data.children().children('.mute--text').text();
                    title = data.children().children().text();
                    link = data.children().children().find($('.vwo-deal-button')).attr('href');

                    if (json.hasOwnProperty(category)) {
                        json[category].push({
                            title: title,
                            link: link
                        });
                    } else {
                        json[category] = [];
                        json[category].push({
                            title: title,
                            link: link
                        });
                    }
                });

                fs.writeFile('output.json', JSON.stringify(json, null, 4), function(err) {
                    console.log('File successfully written! - Check your project directory for the output.json file');
                });

                res.send(json);
            })
            .catch(function(err) {
                console.log(err);
            });*/
        request(obj.url, function(error, response, html) {
            if (!error) {
                var $ = cheerio.load(html);

                var title, category, link;
                var json = {};

                $('.thread-content').filter(function(i, el) {
                    var data = $(this);
                    category = data.children().children('.mute--text').text();
                    title = data.children().children().text();
                    link = data.children().children().find($('.vwo-deal-button')).attr('href');

                    if (json.hasOwnProperty(category)) {
                        json[category].push({
                            title: title,
                            link: link
                        });
                    } else {
                        json[category] = [];
                        json[category].push({
                            title: title,
                            link: link
                        });
                    }
                });
            }

            fs.writeFile('output.json', JSON.stringify(json, null, 4), function(err) {
                console.log('File successfully written! - Check your project directory for the output.json file');
            });

            res.send(json);
        })
    }, function(err, results) {
        // all requests have been made
        if (err) {
            console.log(err);
        } else {
            console.log(results);
        }
    });
})

app.listen('6969')
console.log('Magic happens on port 6969');
exports = module.exports = app;