const express = require('express')
const app = express()
const http = require("http")
const WebSocket = require('ws')
const {sequelize, syncSequelize, Note} = require('./model')

const PORT = process.env.PORT || 5000;

const dbHandler = async (data) => {
    const note = JSON.parse(data);
    console.log(note)
    const oldNote = await Note.findOne({where: {id: note.id}});
    if (oldNote) {
        if (note.type === 'delete') {
            await oldNote.destroy()
        } else if (note.type === 'update') {
            return await oldNote.update({...note})
        }
    } else {
        const newNote = await Note.create(note);
        if (newNote.type) {
            return newNote;
        } else {
            console.error(newNote)
        }
    }
}

const controller = (wss) => {
    wss.on('connection', async function connection(ws) {
        console.log('Connected user')
        ws.on('message', async function incoming(data) {
            console.log('receive message',data)
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
        });
        const notes = await Note.findAll();
        console.log('send initial', notes)
        ws.send(JSON.stringify(notes))
    });
}

(async () => {
    try {
        if (process.env.DATABASE_URL === undefined) {
            await syncSequelize(true)
            await sequelize.authenticate()
                .then(() => console.log("Db connected ..."))
                .catch(err => console.log("Error", err))
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