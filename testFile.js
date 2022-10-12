
const axios = require('axios')
require('dotenv').config()

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