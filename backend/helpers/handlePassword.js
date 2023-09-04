const bcrypt = require('bcryptjs')

const cryptPassword = async (password) => {
    try {
        const salt = await bcrypt
            .genSalt(10);
        const hash = await bcrypt.hash(password, salt);
        return hash;
    } catch (err) {
        return console.log(err.message);
    }
}

const comparePassword = (plainPass, hashword) => {
    return bcrypt.compare(plainPass, hashword);
}

// const main =  async () => {
//    const res = await comparePassword('undeadcat123', '$2b$10$SwgED6Awa.MTzqWEf867Ze0vv.KayLspDd1JUK6Mo9bJwUgzt0jSa')
//    console.log(res);
// }

// main()


module.exports = { cryptPassword, comparePassword}