const express = require('express');
const bodyParser = require('body-parser');
const logger = require('morgan');
const request = require('request');
const cheerio = require('cheerio');
const path = require("path");
 
const PORT = process.env.PORT || 3000;
const app = express();
app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.text());
app.use(bodyParser.json({ type: "application/vnd.api+json" }));
app.use(express.static("public"));

// --------- html routes ---------
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, "./public/index.html"));
});


// --------- api routes ----------

let Plink = '';

app.get('/celeb_name/:name', (req,res) => {
  const person = req.params.name;
  const url = 'https://www.celebritynetworth.com/dl/' + person;
  request(url , (error, response, body) => {
    if (!error && response.statusCode == 200){
      const $ = cheerio.load(body);
      const P = $('.post_item.anchored.search_result.lead').html();
      const imgURL = $(P).find('img').attr('src');
      Plink = $(P).attr("href");
      const Ptitle = $(P).attr("title");
      const Pobj = {
        name: Ptitle,
        link: Plink,
        imgURL: imgURL
      }
      console.log("PObj: " + Pobj);
      res.json(Pobj);
    }
    else{
      console.log("There are no results for " + person + ", please choose another person.")
      res.send("There are no results for " + person + ", please choose another person.")
    }
  })
})

app.get('/celeb_net_worth/', (req,res) => {
  request(Plink , (error, response, body) => {
    if (!error && response.statusCode == 200){
      const $ = cheerio.load(body);
      const V = $('.value').html();
      const Vobj = {
        netWorth: V
      }
      console.log("value: " + Vobj);
      res.json(Vobj);
    }
    else{
      console.log("There are no results for this person, please choose another person.")
      res.send("There are no results for this person, please choose another person.")
    }
  })
})

app.listen(PORT, () => {
  console.log("App running on port " + PORT + "!");
})