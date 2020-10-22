import {useCallback, useEffect, useState} from "react";
import {TypeMessage} from "./TypeMessage";


const useWS = (notes, setNotes) => {

    const [connection, setConnection] = useState(null);

    const update = useCallback((serverNote) => {
        setNotes((prev) => [...prev.filter(note => note.id !== serverNote.id), serverNote])
    },[setNotes])

    const updatePosition = useCallback(({data}) => {
        if (data) {
            const respNote = JSON.parse(data);
            if (!respNote.type && Array.isArray(respNote)) {
                setNotes(() => respNote)
            } else if (respNote.type === TypeMessage.UPDATE || respNote.type === TypeMessage.CREATE) {
                update(respNote);
            } else if (respNote.type === TypeMessage.DELETE) {
                setNotes(notes.filter(note => note.id !== respNote.id))
            } else if (respNote.type) {
                console.error('Incorrect data message', data)
            }
        }
    },[notes,setNotes,update])

    const connected = () => {
        console.log("connected")
    }

    useEffect(() => {
        if (connection === null) {
            const url = window.location.href
                .replace(/^http/, 'ws')
                .replace(/3000\/$/, '5000/');
            console.log(url)
            const webSocket = new WebSocket(url)
            webSocket.onmessage = updatePosition
            webSocket.onopen = connected
            setConnection(webSocket)
        }
    }, [connection,updatePosition])

    return {connection}
}

export default useWS