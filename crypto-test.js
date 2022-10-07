const bcrypt = require('bcryptjs')
const {createHash} = require('crypto')

const hash = createHash('sha256')
hash.update('hello')
const digest = hash.digest('hex')
console.log('sha256: ',digest)

const testCrypto = async()=>{
    try{
        const password = 'hello'
        const saltRounds = 12
        const hashedPassword = await bcrypt.hash(password, saltRounds)
        console.log(hashedPassword)

        const matchedPasswords = await bcrypt.compare('1234', hashedPassword)
        console.log(matchedPasswords)

    }catch(err){
        console.log(err)
    }
}
testCrypto()