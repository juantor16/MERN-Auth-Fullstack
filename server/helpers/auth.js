const bcrypt = require('bcrypt');

const hashPassword = (password) => {
    return new Promise((resolve, reject) => {
        bcrypt.genSalt(12, (err, salt) => {
            if (err) {
                reject(err)
            }
            bcrypt.hash(password, salt, (err, hash) => {
                if (err) {
                    reject(err)
                }
                resolve(hash)
            })
        })
    })
}

const comparePassword = (password, hashedPassword) => {
    return bcrypt.compare(password, hashedPassword)
}

module.exports = {
    hashPassword,
    comparePassword
}
//  The above code snippet is a helper function that will hash the password before saving it to the database. 
//  The  hashPassword  function takes the password as an argument and returns a promise. It generates a salt using the  genSalt  method and then hashes the password using the  hash  method. 
//  The  comparePassword  function takes two arguments, the password and the hashed password, and returns a boolean value. It compares the password with the hashed password using the  compare  method. 
//  Now, let's use these helper functions in the  /register  route. 
// Path: server/routes/auth.js