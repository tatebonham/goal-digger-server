const jwt = require('jsonwebtoken')

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
jwtTest()