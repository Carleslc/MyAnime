const express = require('express')
const httpRequest = require("request")
const cors = require('cors')
const app = express()
const port = 8080

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

    const mal = popura(user.name, user.pass);

    httpRequest({ url: `https://${user.name}:${user.pass}@myanimelist.net/api/account/verify_credentials.xml` },
      function (error, res, body) {
        if (!error && res.statusCode === 200) {
          next(popura(user.name, user.pass), user.name)
        } else {
          unauthorized(body || error)
        }
      })
}

app.get('/', (request, response) => {
  response.send('MyAnime API')
})

app.post('/update', (request, response) => {
  auth(request, response, (mal, user) => {
    if (!request.body.id) {
      response.sendStatus(400)
    } else {
      console.log(`/update ${request.body.id} User ${user}`);
      mal.updateAnime(request.body.id, {
        episode: request.body.episode,
        status: request.body.status,
        date_start: request.body.date_start,
        date_finish: request.body.date_finish
      }).then(res => response.send(res))
        .catch(err => response.status(err.statusCode).send(err.statusMessage))
    }
  })
})

app.listen(port, (err) => {
  if (err) {
    return console.log('Error', err)
  }
  console.log(`Server is listening on ${port}`)
})