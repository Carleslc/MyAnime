const express = require('express')
const httpRequest = require("request")
const cors = require('cors')
const app = express()
const port = 8082

const basicAuth = require('basic-auth')

const popura = require('popura')

var bodyParser = require('body-parser')
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cors())

function auth(request, response, next) {
    function unauthorized(msg) {
      return response.status(401).send(msg || 'Invalid credentials');
    }
 
    user = basicAuth(request);
 
    if (!user || !user.name || !user.pass) {
        return unauthorized();
    }

    httpRequest({
        url: 'https://myanimelist.net/api/account/verify_credentials.xml',
    }, function (error, res, body) {
        if (!error && res.statusCode === 200) {
            console.log(body)
            next(popura(user.name, user.pass))
        } else {
          unauthorized(body || error)
        }
    })
}

app.get('/', (request, response) => {
  response.send('MyAnime API')
})

app.post('/update', (request, response) => {
  auth(request, response, (mal) => {
    if (!req.body.id) {
      response.send(400)
    } else {
      mal.updateAnime(req.body.id, {
        episode: req.body.episode,
        status: req.body.status,
        date_start: req.body.date_start,
        date_finish: req.body.date_finish
      }).then(res => response.send(res))
        .catch(err => response.send(err))
    }
  })
})

app.listen(port, (err) => {
  if (err) {
    return console.log('Error', err)
  }
  console.log(`Server is listening on ${port}`)
})