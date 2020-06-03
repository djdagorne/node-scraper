const request = require('request');
const cheerio = require('cheerio');

let articles = [];
let count = 0;

function getBlurbs(arts) {
  arts.map((article) => {
    request(`${article.link}`, (err, res, html) => {
      if(!err && res.statusCode === 200){
        const $ = cheerio.load(html);
        const first = $('header > p').first().text() || 'Intro blurb not found';
        article.blurb = first;
        console.log(article);
      } else {
         article.blurb = 'err';
        console.log(article); 
      }
    })
  });
}

function getArticles() {
  request('https://www.nytimes.com/', (error, response, html) => {
    if(!error && response.statusCode === 200) {
      const $ = cheerio.load(html);
      $('h2').each((index, element) => {
        const heading = $(element).text();
        const link = $(element).parent().parent().attr('href');
        if(count < 10 && link && heading) {
          count++;
          articles.push({ heading: `${heading}`, link: `https://www.nytimes.com${link}`});
        } 
      })
    }
    getBlurbs(articles);
  });
}

getArticles();