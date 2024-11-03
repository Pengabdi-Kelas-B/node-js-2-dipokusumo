const express = require('express')
const routes = require('./routes')
const connectDB = require('./config/mongodb')
const cors_option = require('./config/cors_option')
const cron = require('./utils/borrowcron')
const app = express()

require('dotenv').config()

const port = process.env.PORT

connectDB()

app.use(cors_option);

app.use(express.json());

app.use("/api/v1", routes);

app.listen(port, () => {
  console.log(`Server running on port ${port}`)
})