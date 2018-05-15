// console.log(process.env.MODE)
console.log(process.env.MODE)
module.exports = {
  mongo: {
    host: process.env.MODE === 'production' ? 'mongo' : 'localhost',
    port: '27017',
    database: process.env.MODE === 'production' ? 'plearn' : 'plearn_test'
  }
}