import React, {useState} from "react"
import Note from "./components/Note";
import useWS from "./hooks/ws.hook";
import useNote from "./hooks/note.hook";
import {TypeMessage} from "./hooks/TypeMessage";


const App = () => {


    const {defaultNote, updateNote} = useNote();
    const [notes, setNotes] = useState([]);

    const {connection} = useWS(notes, setNotes);

    const createHandler = (e) => {
        const newNote = updateNote(defaultNote, {x: e.clientX, y: e.clientY, type: TypeMessage.CREATE});
        connection.send(JSON.stringify(newNote))
    }

    return (
        <div style={{backgroundColor: "aqua", width: "100vw", height: '100vh', cursor: 'pointer'}}
             onDoubleClick={createHandler}
        >
            {
                notes &&
                notes.map((note, index) => {
                        return (
                            <Note key={index}
                                  noteIndex={index}
                                  note={note}
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