const express = require('express')
const app = express()
const path = require('path')
const http = require("http")
const WebSocket = require('ws')
const {sequelize, syncSequelize, Note, TypeMessage} = require('./model')

const PORT = process.env.PORT || 5000;

const reducer = {
    [TypeMessage.CREATE]: async (note) => {
        const newNote = await Note.create(note);
        return newNote.type ? newNote : console.error(newNote)
    },
    [TypeMessage.UPDATE]: async (note) =>{
        const oldNote = await Note.findOne({where: {id: note.id}});
        return await oldNote.update({...note})
    },
    [TypeMessage.DELETE]: async (note) =>{
        await Note.destroy({where:{id: note.id}})
    },
    [null]: async (note) =>{
        console.log("Error. Type equal null", note)
    }
}

const dbHandler = async (data) => {
    const note = JSON.parse(data);
    return await reducer[note.type](note)
}

if (process.env.NODE_ENV === "production") {
    console.log("production")
    app.use('/', express.static(path.join(__dirname, 'build')))
    app.get('*', ((req, res) => {
        res.sendFile(path.join(__dirname, 'build', 'index.html'))
    }))
}

const controller = (wss) => {
    wss.on('connection', async function connection(ws) {
        ws.on('message', async function incoming(data) {
            const update = await dbHandler(data);
            wss.clients.forEach(function each(client) {
                    if (client.readyState === WebSocket.OPEN) {
                        if (update) {
                            client.send(JSON.stringify(update));
                        } else {
                            client.send(data)
                        }
                    }
                }
            )
        })
        const notes = await Note.findAll();
        ws.send(JSON.stringify(notes))
    })
}

(async () => {
    try {
        if (process.env.DATABASE_URL) {
            await syncSequelize(true)
            await sequelize.authenticate()
                .then(() => console.log("Db connected ..."))
                .catch(err => console.log("Error", err))
        } else {
            console.error("Doesnt find db url. Check env!!!")
        }

        const server = http.createServer(app)
        server.listen(PORT)
        console.log("http server listening on %d", PORT)

        const wss = new WebSocket.Server({server})
        console.log("websocket server created")

        controller(wss)
    } catch (e) {
        console.log('Server error:', e.message)
        process.exit(1)
    }
})()

app.get('/getNotes', (req, res) => {
    Note.findAll().then(notes => {
        res.send(JSON.stringify(notes))
    })
})
//
// app.listen(PORT, () => {
//     console.log(`Example app listening at http://localhost:${PORT}`)
// })