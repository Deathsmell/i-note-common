import React, {useEffect, useState} from "react"
import Note from "./components/Note";
import useWS from "./hooks/ws.hook";


const App = () => {

    const notesState = useState([{
        id: 0,
        text: '',
        width: 200,
        height: 200,
        x: 10,
        y: 10,
        type: '',
        color: '',
    }]);
    const [notes,setNotes] = notesState;
    const {connection} = useWS(notesState);

    useEffect(()=>{
        console.log(notes);
    },[notes])

    return (
        <div style={{backgroundColor: "aqua", width: "100vw", height: '100vh'}}>
            { notes.length &&
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