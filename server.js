// require packages
require('dotenv').config()
const axios = require('axios')
const express = require('express')
const cors = require('cors')
const rowdy = require('rowdy-logger')
const authLockedRoute = require('./controllers/api-v1/authLockedRoute')

// config express app
const app = express()
const PORT = process.env.PORT || 3001 
// for debug logging 
const rowdyResults = rowdy.begin(app)
// cross origin resource sharing 
app.use(cors())
// request body parsing
app.use(express.urlencoded({ extended: false })) // optional 
app.use(express.json())

// API -- bucketlist api

const apiTest = async () =>{
  try {
      const options = {
          headers: {
              'X-Api-Key': process.env.X_API_KEY
          }
      }
      const response = await axios.get('https://api.api-ninjas.com/v1/bucketlist', options)
      console.log(response.data)
  }catch(err){
      console.log(err)
  }
}

apiTest()

// GET / -- test index route
app.get('/', authLockedRoute, (req, res) => {
  console.log(res.locals)
  res.json({ msg: 'hello backend 🤖' })
})

// controllers
app.use('/api-v1/users', require('./controllers/api-v1/users.js'))

// hey listen
app.listen(PORT, () => {
  rowdyResults.print()
  console.log(`is that port ${PORT} I hear? 🙉`)
})

