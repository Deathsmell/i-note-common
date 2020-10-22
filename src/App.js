import React, {useState} from "react"
import Note from "./components/Note";
import useWS from "./hooks/ws.hook";
import useNote from "./hooks/note.hook";
import {TypeMessage} from "./hooks/TypeMessage";


const App = () => {

    const {defaultNote, updateNote} = useNote();
    const notesState = useState([]);
    const [notes, setNotes] = notesState;
    const {connection} = useWS(notesState);

    // useEffect(() => {
    //     console.log(notes.length);
    // }, [notes])

    const createHandler = (e) => {
        const newNote = updateNote(defaultNote, {x: e.clientX, y: e.clientY, type: TypeMessage.CREATE});
        connection.send(JSON.stringify(newNote))
    }

    return (
        <div style={{backgroundColor: "aqua", width: "100vw", height: '100vh', cursor:'pointer'}}
             onDoubleClick={createHandler}
        >
            {notes.length !== 0 &&
            notes.map((note, index) => {
                    return (
                        <Note key={index}
                              noteIndex={index}
                              note={note}
                              noteId={note.id}
                              notes={notes}
                              setNotes={setNotes}
                              serverText={note.text}
                              connection={connection}
                        />
                    )
                }
            )
            }
        </div>
    )
}


export default App