const express = require('express')
const app = express()
const port = 3000

app.get('/', (req, res) => {
  res.send('Hello World!')
})
app.get('/tintuc', (req, res) => {
  res.send('tin tuc')
})

app.listen(port, () => {
  console.log(`Noloce listening on port ${port}`)
})