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
        if (note.type === 'destroy') {
            console.log('destroy',note)
            await oldNote.destroy()
        } else if (note.type === 'update') {
            console.log('update',note)
            await oldNote.update({...note})
        }
    } else {
        console.log('create',note)
        await Note.create(note)
    }
}

const controller = (wss) => {
    wss.on('connection', async function connection(ws) {
        console.log('Connected user')
        ws.on('message', function incoming(data) {
            console.log('receive message')
            dbHandler(data)
            wss.clients.forEach(function each(client) {
                if (client.readyState === WebSocket.OPEN) {
                    client.send(data);
                }
            });
        });
        const notes = await Note.findAll();
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

// app.get('/', (req, res) => {
//     res.send('Hello World!')
// })
//
// app.listen(PORT, () => {
//     console.log(`Example app listening at http://localhost:${PORT}`)
// })