const mongoose = require('mongoose')

const connectDB = async function () {
  try {
    await mongoose.connect(process.env.MONGO_URI)
    console.log(`MongoDB Connected`)
  } catch (err) {
    console.error(`Error: ${err.message}`)
    process.exit(1)
  }
}

module.exports.connectDB = connectDB