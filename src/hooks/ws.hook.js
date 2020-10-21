import {useEffect, useState} from "react";
import useLocal from "./local.hook";
import {TypeMessage} from "./TypeMessage";


const useWS = ([notes, setNotes]) => {

    const [connection, setConnection] = useState(null);
    const {saveInLocal, getFromLocal, removeInLocal} = useLocal();

    const compare = (localNote, serverNote) => localNote.x === serverNote.x
        && localNote.y === serverNote.y
        && localNote.width === serverNote.width
        && localNote.height === serverNote.height


    const updatePosition = ({data}) => {
        if (data) {
            const serverNote = JSON.parse(data);
            if (!serverNote.type && serverNote) {
                serverNote.forEach(note => {
                    saveInLocal(note.id, JSON.stringify(note))
                })
                setNotes(serverNote)
                return;
            }
            saveInLocal(serverNote.id, data)
            const index = notes.findIndex(note => note.id === serverNote.id);
            if (serverNote.type === TypeMessage.UPDATE) {
                const fromLocal = getFromLocal(serverNote.id);
                const parse = JSON.parse(fromLocal);
                if (!compare(parse, serverNote)) {
                    notes[index] = serverNote
                    setNotes([...notes])
                }
            } else if (serverNote.type === TypeMessage.CREATE) {
                setNotes([...notes, serverNote])
            } else if (serverNote.type === TypeMessage.DELETE) {
                removeInLocal(serverNote.id)
                setNotes(notes.filter(note => note.id !== serverNote.id))
            } else {
                console.error('Incorrect data message', data)
            }
        }
    }

    // const getPositions = ({data}) => {
    //     console.log("get positions", data)
    //     if (data) {
    //         const serverNotes = JSON.parse(data);
    //         setNotes(serverNotes)
    //         serverNotes.forEach(note => {
    //             saveInLocal(note.id, note)
    //         })
    //     }
    // }

    const test = (data) => {
        console.log(data)
    }

    useEffect(() => {
        if (connection === null) {
            const webSocket = new WebSocket('ws://localhost:8080');
            webSocket.onmessage = updatePosition
            webSocket.onopen = test
            setConnection(webSocket)
        }
    }, [connection])

    return {connection}
}

export default useWS