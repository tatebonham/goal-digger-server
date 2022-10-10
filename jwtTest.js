const jwt = require('jsonwebtoken')
const db = require('./models')

const jwtTest = ()=>{
    try{
        const payload = {
            name: 'weston',
            id: 1234,
            email:'w@b.com'
        }
        const secret = 'my super big secret'
        const token = jwt.sign(payload, secret)
        console.log(token)

        const decode = jwt.verify(token, secret)
        console.log(decode)
    }catch(err){
        console.log(err)
    }
}
// jwtTest()

const findUser = async () => {
    try {
        const oneUser = await db.User.findOne({
            _id: '63432f7daf50cc10c710cf6f'
        })

        const newGoal = {
            content: 'Hike Mount Everest'
        }

        oneUser.goals.push(newGoal)
        console.log(newGoal)

        await oneUser.save()

    } catch(err) {
        console.log(err)
    }
}
findUser()