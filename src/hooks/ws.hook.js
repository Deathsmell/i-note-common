import {useCallback, useEffect, useState} from "react";
import {TypeMessage} from "./TypeMessage";


const useWS = (notes, setNotes) => {

    const [connection, setConnection] = useState(null);

    const update = useCallback((serverNote) => {
        setNotes((prev) => [...prev.filter(note => note.id !== serverNote.id), serverNote])
    }, [ setNotes])

    const reducer = useCallback((note, action) => {
        switch (action) {
            case TypeMessage.CREATE:
                return update(note)
            case TypeMessage.UPDATE:
                return update(note)
            case TypeMessage.DELETE:
                return setNotes((prev) => [...prev.filter(noteFromState => noteFromState.id !== note.id)])
            default:
                if (Array.isArray(note)) {
                    setNotes(() => note)
                } else {
                    console.error('Incorrect data message', action, note)
                }
        }
    }, [setNotes, update])

    const updatePosition = useCallback(({data}) => {
        if (data) {
            const respNote = JSON.parse(data);
            reducer(respNote, respNote.type)
        }
    }, [reducer])

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
    }, [connection, updatePosition])

    return {connection}
}

export default useWS