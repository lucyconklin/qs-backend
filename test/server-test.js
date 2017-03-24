const assert = require('chai').assert
const app = require('../server')
const request = require('request')
const environment = process.env.NODE_ENV || 'development';
const configuration = require('../knexfile')[environment];
const database = require('knex')(configuration);

describe('Server', () => {
  before((done) => {
    this.port = 9876;
    this.server = app.listen(this.port, (error, result) => {
      if (error) { done(error) }
      done()
    })
    this.request = request.defaults({
      baseUrl: 'http://localhost:9876'
    })
  })

  after(() => {
    this.server.close()
  })

  it('should exist', () => {
    assert(app)
  })

  describe('GET /', () => {
    it('returns 200 status', (done) => {
      this.request.get('/', (error, response) => {
        assert.equal(response.statusCode, 200)
        done()
      })
    })

    it('root path should return name of app', (done) => {
      this.request.get('/', (error, response) => {
        assert.include(response.body, 'Quantified Self Backend')
        done()
      })
    })
  })

  describe('GET /api/all-foods/', () => {
    beforeEach((done) => {
      database.raw(
        'INSERT INTO foods (name, calories, created_at) VALUES (?,?,?)',
        ['candy beans', 200, new Date]
      ).then(() => done());
    })

    afterEach((done) => {
      database.raw('TRUNCATE foods RESTART IDENTITY')
      .then(() => done());
    })

    it('should return the correct number of foods', (done) => {
      this.request.get('/api/all-foods', (error, response) => {
        if (error) { done(error) }
        const foods = JSON.parse(response.body)
        const foodsCount = foods.length
        assert.equal(foodsCount, 1)
        done()
      })
    })

    it('should return a list of foods with names and calories', (done) => {
      this.request.get('/api/all-foods', (error, response) => {
        if (error) { done(error) }
        const foods = JSON.parse(response.body)
        const food = foods[0]
        assert.equal(food.name, 'candy beans')
        assert.equal(food.calories, 200)
        done()
      })
    })
  })

  describe('GET /api/all-foods/:id', () => {
    beforeEach((done) => {
      database.raw(
        'INSERT INTO foods (name, calories, created_at) VALUES (?,?,?)',
        ['unlimited juice', 250, new Date]
      ).then(() => done());
    })

    afterEach((done) => {
      database.raw('TRUNCATE foods RESTART IDENTITY')
      .then(() => done());
    })

    it('returns 404 for non-existant food id', (done) => {
      this.request.get('/api/all-foods/2', (error, response) => {
        if (error) { done(error) }
        assert.equal(response.statusCode, 404)
        done()
      })
    })

    it('should return name and calories for food with existing id', (done) => {
      this.request.get('/api/all-foods/1', (error, response) => {
        if (error) { done(error) }
        const food = JSON.parse(response.body)[0]
        assert.equal(food.name, 'unlimited juice')
        assert.equal(food.calories, 250)
        done()
      })
    })
  })

  describe('POST to /api/all-foods', () => {
    beforeEach((done) => {
      database.raw(
        'INSERT INTO foods (name, calories, created_at) VALUES (?,?,?)',
        ['candy beans', 200, new Date]
      ).then(() => done());
    })

    afterEach((done) => {
      database.raw('TRUNCATE foods RESTART IDENTITY')
      .then(() => done());
    })

    it('should not return 404', (done) => {
      this.request.post('/api/all-foods', (error, response) => {
        if (error) { done(error) }
        assert.notEqual(response.statusCode, 404)
        done()
      })
    })

    it('should receive and store foods', (done) => {
      const cantelope = { name: 'cantelope', calories: 100 }
      this.request.post('/api/all-foods', { form: cantelope }, (error, response) => {
        if (error) { done(error) }
        database.raw('SELECT * FROM foods WHERE name=?', ['cantelope']).then((data) => {
          assert.equal(data.rowCount, 1)
          done()
        })
      })
    })
  })

  describe('PUT to /api/all-foods/:id', () => {
    beforeEach((done) => {
      database.raw(
        'INSERT INTO foods (name, calories, created_at) VALUES (?,?,?)',
        ['candy beans', 200, new Date]
      ).then(() => done());
    })

    afterEach((done) => {
      database.raw('TRUNCATE foods RESTART IDENTITY')
      .then(() => done());
    })

    it('should not return 404', (done) => {
      this.request.put('/api/all-foods/1', (error, response) => {
        if (error) { done(error) }
        assert.notEqual(response.statusCode, 404)
        done()
      })
    })

    it('should edit name', (done) => {
      const food = { name: 'candy hearts', calories: 200 }
      this.request.put('/api/all-foods/1', { form: food }, (error, response) => {
        if (error) { done(error) }
        database.raw('SELECT * FROM foods WHERE name=?', ['candy hearts']).then((data) => {
          const food = data.rows[0]
          assert.equal(food.calories, 200)
          assert.equal(data.rowCount, 1)
          assert.include(food.name, 'candy hearts')
        })
        done()
      })
    })

    it('should edit calories', (done) => {
      const food = { name: 'candy beans', calories: 175 }
      this.request.put('/api/all-foods/1', { form: food }, (error, response) => {
        if (error) { done(error) }
        database.raw('SELECT * FROM foods WHERE name=?', ['candy beans']).then((data) => {
          const food = data.rows[0]
          assert.equal(food.calories, 175)
        })
        done()
      })
    })

    it('should not change number of foods', (done) => {
      const food = { name: 'candy beans', calories: 175 }
      this.request.put('/api/all-foods/1', { form: food }, (error, response) => {
        if (error) { done(error) }
        const foods = database.raw('SELECT * FROM foods').then((data) => {
          const foodCount = data.rowCount
          assert.equal(foodCount, 1)
          done()
        })
      })
    })
  })

  describe('DELETE to /api/all-foods', () => {
    beforeEach((done) => {
      database.raw(
        'INSERT INTO foods (name, calories, created_at) VALUES (?,?,?)',
        ['candy beans', 200, new Date]
      ).then(() => done());
    })

    afterEach((done) => {
      database.raw('TRUNCATE foods RESTART IDENTITY')
      .then(() => done());
    })

    it('should not return 404', (done) => {
      this.request.delete('/api/all-foods/1', (error, response) => {
        if (error) { done(error) }
        assert.notEqual(response.statusCode, 404)
        done()
      })
    })

    it('can delete a food', (done) => {
      this.request.delete('/api/all-foods/1', (error, response) => {
        if (error) { done(error) }
        const message = JSON.parse(response.body).message
        assert.equal(message, 'You have successfully deleted a food')
        done()
      })
    })
  })
})
