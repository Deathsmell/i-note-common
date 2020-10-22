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


    function setArrayNotes(serverNote) {
        serverNote.forEach(note => {
            saveInLocal(note.id, JSON.stringify(note))
        })
        setNotes(serverNote)
    }

    function update(serverNote, data) {
        saveInLocal(serverNote.id, data)
        const index = notes.findIndex(note => note.id === serverNote.id);
        const fromLocal = getFromLocal(serverNote.id);
        const parse = JSON.parse(fromLocal);
        if (!compare(parse, serverNote)) {
            notes[index] = serverNote
            setNotes([...notes])
        }
    }

    const updatePosition = ({data}) => {
        if (data) {
            const respNote = JSON.parse(data);
            //todo: rewrite on reduce method
            if (!respNote.type && Array.isArray(respNote)) {
                setArrayNotes(respNote);
                return;
            }
            if (respNote.type === TypeMessage.UPDATE) {
                update(respNote, data);
            } else if (respNote.type === TypeMessage.CREATE) {
                setNotes([...notes, respNote])
            } else if (respNote.type === TypeMessage.DELETE) {
                removeInLocal(respNote.id)
                setNotes(notes.filter(note => note.id !== respNote.id))
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
            const url = window.location.href
                .replace(/^http/, 'ws')
                .replace(/3000\/$/, '5000/');
            console.log(url)
            const webSocket = new WebSocket(url)
            webSocket.onmessage = updatePosition
            webSocket.onopen = test
            setConnection(webSocket)
        }
    }, [connection])

    return {connection}
}

export default useWS