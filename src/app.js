const express = require("express")
const cors = require("cors")
const { uuid, isUuid } = require("uuidv4")

const app = express()

app.use(express.json())
app.use(cors())
app.use('/repositories/:id', validateId)

function validateId(req, res, next) {
  const { id } = req.params

  if(!isUuid(id)) 
    return res.status(400).json({ error: 'Invalid repository ID'})
  
  return next()
}

const repositories = []

app.get("/repositories", (req, res) => {
  res.json(repositories)
})

app.post("/repositories", (req, res) => {
  const { title, url, techs } = req.body 

  const repository = { id: uuid(), title, url, techs, likes: 0 }
  repositories.push(repository)

  return res.json(repository)
})

app.put("/repositories/:id", (req, res) => {
  const { id } = req.params

  const repIndex = repositories.findIndex(rep => rep.id === id)

  if(repIndex < 0)
    return res.status(400).json({error: "Repository not found"})

  const { title, url, techs } = req.body

  repositories[repIndex].title = title
  repositories[repIndex].url   = url
  repositories[repIndex].techs = techs
  
  return res.json(repositories[repIndex])
})

app.delete("/repositories/:id", (req, res) => {
  const { id } = req.params
  const repIndex = repositories.findIndex(rep => rep.id === id)

  if(repIndex < 0)
    return res.status(400).json({error: "Repository not found"})
  
  repositories.splice(repIndex, 1)

  return res.status(204).json()
})

app.post("/repositories/:id/like", (req, res) => {
  const { id } = req.params

  const repository = repositories.find(rep => rep.id === id)

  if(!repository)
    return res.status(400).json({error: "Repository not found"})

  repository.likes++

  return res.status(200).json(repository)
})

module.exports = app
