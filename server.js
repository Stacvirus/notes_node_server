const express = require("express")
const app = express()
const cors = require("cors")

app.use(express.json())
app.use(cors())
app.use(express.static('dist'))

let notes = [
    {
        "id": 1,
        "content": "HTML is easy",
        "important": true
    },
    {
        "id": 2,
        "content": "Browser can execute only JavaScript",
        "important": false
    },
    {
        "id": 3,
        "content": "GET and POST are the most important methods of HTTP protocol",
        "important": true
    },
    {
        "id": 4,
        "content": "I'm a big fucker!",
        "important": true
    }
]

app.get("/", (req, res) =>{
    res.send("<h1>hello world!</h1>")
})

//fetching all notes
app.get("/api/notes", (req, res) =>{
    res.json(notes)
})

//fetching single notes
app.get("/api/notes/:id", (req, res) =>{
    const id = Number(req.params.id)
    const note = notes.find(note => note.id === id)
    if(note) res.json(note)
    else res.status(200).end()
})

//delete a note
app.delete("/api/notes/:id", (req, res) =>{
    const id = Number(req.params.id)
    notes = notes.filter(note => note.id !== id)
    console.log(notes)
    res.status(204).end()
    console.log('deletion complete:', id)
})

//post new note
function generateId(){
    const maxId = Math.max(...notes.map(note => note.id))
    return maxId + 1
}
app.post("/api/notes", (req, res) =>{
    const {content, important} = req.body
    console.log("in the post function")
    const newNote = {
        id: generateId(),
        content: content,
        important: Boolean(important) || false
    }
    notes = notes.concat(newNote)
    res.json(newNote)
})

// update a note with the put function handler
// app.put("/api/notes/:id", (req, res) =>{
//     const id = req.params.id
//     notes = notes.find(note => note.id == id)
// })

const port = process.env.PORT || 3005
app.listen(port, () =>{
    console.log("server running on port",port)
})
