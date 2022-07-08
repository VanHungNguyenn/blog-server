const express = require('express')
const mongoose = require('mongoose')
const createError = require('http-errors')
require('dotenv').config()
const cors = require('cors')
const cookieParser = require('cookie-parser')

const authRoute = require('./routes/authRoute')
const usersRoute = require('./routes/usersRoute')
const postsRoute = require('./routes/postsRoute')
const categoriesRoute = require('./routes/categoriesRoute')

const multer = require('multer')
const path = require('path')

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(cors())

const db = process.env.MONGO_URI

app.use('/images', express.static(path.join(__dirname, '/images')))

const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, 'images')
	},
	filename: (req, file, cb) => {
		cb(null, req.body.name)
	},
})

const upload = multer({ storage: storage })
app.post('/api/upload', upload.single('file'), (req, res) => {
	res.status(200).json('File has been uploaded')
})

mongoose.connect(db, (err) => {
	if (err) throw err
	console.log('Connected to mongodb')
})

app.use('/api/auth', authRoute)
app.use('/api/users', usersRoute)
app.use('/api/posts', postsRoute)
app.use('/api/categories', categoriesRoute)

app.use((req, res, next) => {
	next(createError(404))
})
app.use((err, req, res, next) => {
	res.status(err.status || 500)
	res.json({
		message: err.message,
	})
})

const PORT = 5678

app.listen(PORT, () => {
	console.log(`Server started at http://localhost:${PORT}`)
})
