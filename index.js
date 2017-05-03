// -----------------------------------
var minRating = 4;
var minYear = 2016;
var maxPages = 15;
// -----------------------------------


var tress = require('tress');
var needle = require('needle');
var cheerio = require('cheerio');
var resolve = require('url').resolve;
var fs = require('fs');

var URL = 'http://kinogo.club/komedii/';
var results = [];
var page = 1;

var q = tress(function(url, callback){
    needle.get(url, function(err, res){
        if (err) throw err;

        var $ = cheerio.load(res.body);

        /*if( new RegExp(/^Apple.+/).test($('h1').text()) ){
            results.push({
                title: $('h1').text(),
                date: $('.topic-about__date').text(),
                href: url,
                size: $('.topic-body').text().length
            });
        }*/

        $('.shortstory').each(function(i, elem) {
            if( 
                $(this).find('h2 a').text().indexOf('сезон') === -1 && 
                +$(this).find('.current-rating').text() >= minRating &&
                +$(this).find('> div').eq(1).find('a').eq(1).text() >= minYear
                ) {
                results.push({
                    title: $(this).find('h2 a').text(),
                    href: $(this).find('h2 a').attr('href'),
                    rate: $(this).find('.current-rating').text()
                });
            }
            // q.push($(this).attr('href'));
        });


        
        $('.bot-navigation>a').last().each(function() {
            if (page < maxPages) {
                q.push(resolve(URL, $(this).attr('href')));
            }
            page++;
        });

        callback();
    });
}, 15);

q.drain = function(){
    fs.writeFileSync('./data.json', JSON.stringify(results, null, 4));
}

q.push(URL);