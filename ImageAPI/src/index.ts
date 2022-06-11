import express from 'express'
import api from './routes/api/index'

const app = express()
const port = 3000

app.use('/api', api.image)

app.get('*', function (req, res) {
    res.send('Your request URL is not correct !')
})
// start the Express server
app.listen(port, () => {
    console.log(`server started at http://localhost:${port}`)
})

export default app
