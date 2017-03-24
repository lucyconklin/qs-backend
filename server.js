const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const environment = process.env.NODE_ENV || 'development';
const configuration = require('./knexfile')[environment];
const database = require('knex')(configuration);
const path = require('path')
const cors = require('cors')

app.set('port', process.env.PORT || 3000)
app.locals.title = 'Quantified Self'
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
var corsOptions = {
  origin: '*',
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}
app.use(cors(corsOptions))
app.options('*', cors(corsOptions))

// GET root path
app.get('/', (request, response) => {
  response.sendFile(path.join(__dirname, '/public', 'index.html'));
})

// Read
app.get('/api/all-foods/:id', (request, response) => {
  const id = request.params.id
  database.raw(
    'SELECT * FROM foods WHERE id=?', [id]
  ).then((data) => {
    if (!data.rowCount) {
      return response.sendStatus(404)
    }
    response.json(data.rows)
  })
})

app.get('/api/all-foods', (request, response) => {
  database.raw('SELECT * FROM foods').then((data) => {
    if (!data.rowCount) {
      return response.status(422).send({
        error: 'no foods saved'
      })
    }
    response.json(data.rows)
  })

})
// Create
app.post('/api/all-foods/', (request, response) => {
  const created_at = new Date
  const name = request.body.name
  const calories = request.body.calories
  if (!name || !calories) {
    return response.status(422).send({
      error: 'No name or calories provided'
    })
  }
  database.raw(
    'INSERT INTO foods (name, calories, created_at) VALUES (?,?,?)',
    [name, calories, created_at]
  ).then((data) => {
    if (!data.rowCount) {
      return response.sendStatus(404)
    }
    response.status(201).json(data.rows)
  })
})
// Update
app.put('/api/all-foods/:id', (request, response) => {
  const id = request.params.id
  const name = request.body.name
  const calories = request.body.calories
  if (!name || !calories) {
    return response.status(422).send({
      error: 'No name or calories provided'
    })
  }
  database.raw(
    'UPDATE foods SET name=?, calories=? WHERE id=?', [name, calories, id]
  ).then((data) => {
    if (!data.rowCount) {
      return response.sendStatus(404)
    }
    return response.json(data.rows)
  })
})
// Delete
app.delete('/api/all-foods/:id', (request, response) => {
  const id = request.params.id
  database.raw('DELETE FROM foods WHERE id=?', [id])
  .then((data) => {
    if (!data.rowCount) {
      return response.sendStatus(404)
    }
    const message = 'You have sucessfully deleted a food'
    response.status(201).send({
      message: 'You have successfully deleted a food'
    })
  })
})
//
// if (!module.parent) {
//   app.listen(app.get('port'), () => {
//     console.log(`${app.locals.title} is running on ${app.get('port')}.`)
//   })
// }

module.exports = app
