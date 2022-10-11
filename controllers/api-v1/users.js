const router = require('express').Router()
const db = require('../../models')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const authLockedRoute = require('./authLockedRoute')

  

// GET /users - test endpoint
router.get('/', authLockedRoute, async (req, res) => {
  try {
    // console.log(res.locals.user)
          const oneUser = await db.User.findOne({
              _id: res.locals.user._id
          })
  
          res.json(oneUser)
  
      } catch(err) {
      console.log(err)
      return res.status(500).json({error: "Server Error"})        
  }
})

// PUT /users/edit - udpate user profile
router.put('/edit', authLockedRoute, async (req, res) => {
  try {
    console.log(req.body.name)
          const oneUser = await db.User.findByIdAndUpdate({
              _id: res.locals.user._id
          }, {
            name: req.body.name,
            email: req.body.email
          }, {
            new: true
          })
          return res.status(200).json({oneUser})
  
      } catch(err) {
      console.log(err)
      return res.status(500).json({error: "Server Error"})        
  }
})

// POST /users/register - CREATE new user
router.post('/', async (req, res) => {
  try {
    // check if user exists already
    const findUser = await db.User.findOne({
      email: req.body.email
    })

    // don't allow emails to register twice
    if(findUser) return res.status(400).json({ msg: 'email exists already' })
  
    // hash password
    const password = req.body.password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds)
  
    // create new user
    const newUser = new db.User({
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword
    })
  
    await newUser.save()

    // create jwt payload
    const payload = {
      name: newUser.name,
      email: newUser.email, 
      id: newUser.id
    }

    // sign jwt and send back
    const token = await jwt.sign(payload, process.env.JWT_SECRET)
    res.json({ token })
  } catch (error) {
    console.log(error)
    res.status(500).json({ msg: 'server error'  })
  }
})

// POST /users/login -- validate login credentials
router.post('/login', async (req, res) => {
  try {
    // try to find user in the db
    const foundUser = await db.User.findOne({
      email: req.body.email
    })

    const noLoginMessage = 'Incorrect username or password'

    // if the user is not found in the db, return and sent a status of 400 with a message
    if(!foundUser) return res.status(400).json({ msg: noLoginMessage })
    
    // check the password from the req body against the password in the database
    const matchPasswords = await bcrypt.compare(req.body.password, foundUser.password)
    
    // if provided password does not match, return an send a status of 400 with a message
    if(!matchPasswords) return res.status(400).json({ msg: noLoginMessage })

    // create jwt payload
    const payload = {
      name: foundUser.name,
      email: foundUser.email, 
      id: foundUser.id
    }

    // sign jwt and send back
    const token = await jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: 3600 })

    res.json({ token })
  } catch(error) {
    console.log(error)
    res.status(500).json({ msg: 'server error'  })
  }
})

// GET /users/goals --  display all user goals
router.get("/goals", authLockedRoute, async (req, res) => {
  try {
    // res.json('hi')
    const oneUser = await db.User.findOne({
      _id: res.locals.user._id
  })
  // return oneUser
    res.json(oneUser)

  }  catch(err) {
      console.log(err)
      return res.status(500).json({error: "Server Error"})        
  }
})

// POST /users/goals -- create a new goal
router.post("/goals", authLockedRoute, async(req,res) => {
  try {
    // console.log(res.locals.user)
          const oneUser = await db.User.findOne({
              _id: res.locals.user._id
          })
  
          const newGoal = {
              content: req.body.content,
              img_url: req.body.imageUrl,
              completed: false
          }
  
          oneUser.goals.push(newGoal)
          res.json(oneUser)
  
          await oneUser.save()
  
      } catch(err) {
      console.log(err)
      return res.status(500).json({error: "Server Error"})        
  }
})

// GET /users/goals/:goalId -- display a goal
router.get("/goals/:goalId", authLockedRoute, async(req,res) => {
  try {
    const oneGoal = await db.User.findOne({
          _id: res.locals.user._id, "goals._id": req.params.goalId
      })
  
          res.json(oneGoal)
  
      } catch(err) {
      console.log(err)
      return res.status(500).json({error: "Server Error"})        
  }
})

// PUT /users/goals/:goalId -- update a goal
router.put("/goals/:goalId", authLockedRoute, async(req,res) => {
  try {
    const oneGoal = await db.User.findOneAndUpdate({
          _id: res.locals.user._id, "goals._id": req.params.goalId
      }, { $set: {
        "goals.$.content": req.body.content,
        "goals.$.img_url": req.body.imageUrl
      }
      }, {
        new: true
      })
  
          res.json(oneGoal)
  
      } catch(err) {
      console.log(err)
      return res.status(500).json({error: "Server Error"})        
  }
})

// PUT /users/goals/:goalId/status -- update a goal status
router.put("/goals/:goalId/status", authLockedRoute, async(req,res) => {
  try {
    const oneGoal = await db.User.findOneAndUpdate({
          _id: res.locals.user._id, "goals._id": req.params.goalId
      }, { $set: {
        "goals.$.completed": req.body.completed
      }
      }, {
        new: true
      })
  
          res.json(oneGoal)
  
      } catch(err) {
      console.log(err)
      return res.status(500).json({error: "Server Error"})        
  }
})


router.delete("/goals/:goalId", authLockedRoute, async(req,res) => {
  try {
    // console.log(res.locals.user)
          const oneUser = await db.User.findOne({
              _id: res.locals.user._id
            }, {
              new: true
            })
            res.locals.user.goals.remove(req.params.goalId)
            await res.locals.user.save()

          res.json(oneUser)
      } catch(err) {
      console.log(err)
      return res.status(500).json({error: "Server Error"})        
  }
})

// GET /auth-locked - will redirect if bad jwt token is found
router.get('/auth-locked', authLockedRoute, (req, res) => {
  console.log(res.locals)
  res.json( { msg: 'welcome to the private route!' })
})




module.exports = router