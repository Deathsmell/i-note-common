import React, {useEffect, useRef, useState} from "react"
import {Rnd} from "react-rnd"
import useNote from "../hooks/note.hook";
import useLocal from "../hooks/local.hook";
import {TypeMessage} from "../hooks/TypeMessage";

const style = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    border: "solid 1px #ddd",
    background: "#f0f0f0",
};

const Note = ({note,noteIndex, noteId, serverText, notes, setNotes, connection}) => {


    const rnd = useRef();
    const [transformNote, setTransformNote] = useState(false);
    const [text, setText] = useState(serverText);
    const {removeInLocal, saveInLocal, getFromLocal} = useLocal();
    const {updateNote} = useNote();

    const getNote = () => notes.find(note => note.id === noteId)
    const getNoteIndex = () => notes.findIndex(note => note.id === noteId)
    const updateStateNotes = (index,updatedNote) => {
        notes[index] = updatedNote
        setNotes([...notes])
    }
    const sendNewPosition = (type, note) => connection.send(JSON.stringify({...note, type}))


    useEffect(function watchMounting() {
        console.log("mounted")
        return () => {
            console.log("unmounted")
        }
    }, [])


    useEffect(function savePositionWhenTransformation() {
        const note = getNote();
        if (transformNote && (notes[noteIndex].x !== 0 || notes[noteIndex].y !== 0)) {
            const updatedNote = updateNote(note, {x:notes[noteIndex].x, y:notes[noteIndex].y});
            saveInLocal(noteId, updatedNote)
            updateStateNotes(getNoteIndex(),{...note, x: 0, y: 0});
        } else if (notes[noteIndex].x === 0 && notes[noteIndex].y === 0) {
            const stringPosition = getFromLocal(noteId)
            if (stringPosition) {
                const updatedNote = updateNote(note, {
                    width: stringPosition.width,
                    height: stringPosition.height,
                    x: stringPosition.x,
                    y: stringPosition.y
                });
                setNotes(updatedNote)
            }
        }
    }, [transformNote])


    const onDragStopHandler = (event, data) => {
        const updatedNote = updateNote(note, {x: data.x, y: data.y});
        saveInLocal(noteId, updatedNote)
        updateStateNotes(noteIndex,updatedNote)
        sendNewPosition(TypeMessage.UPDATE, updatedNote)
    }

    const onResizeStopHandler = (e, direction, ref, delta, position) => {
        const note = getNote();
        const updatedNote = updateNote(note, {
            width: ref.style.width,
            height: ref.style.height,
            x: position.x,
            y: position.y
        });
        saveInLocal(noteId, updatedNote)
        updateStateNotes(noteId,updatedNote)
        sendNewPosition(TypeMessage.UPDATE, updatedNote)
    }

    const deleteNoteHandler = () => {
        // todo: create delete function on cross icon
        console.log("Nothing to do")
    }

    return (
        <Rnd
            ref={rnd}
            className={`note${transformNote ? '-activate' : ''}`}
            disableDragging={transformNote}
            style={{...style}}
            size={{width: notes[noteIndex].width, height: notes[noteIndex].height}}
            minWidth={250}
            minHeight={250}
            position={{x: notes[noteIndex].x, y: notes[noteIndex].y}}
            onDragStop={onDragStopHandler}
            onResizeStop={onResizeStopHandler}
            bounds={"window"}
        >
            <div className="note-header">
                <div className="color-buttons">
                    <button className="btn btn-success"/>
                    <button className="btn btn-danger"/>
                    <button className="btn btn-secondary"/>
                </div>
                <div className="cross"
                     onClick={deleteNoteHandler}
                >
                    &times;
                </div>
            </div>
            {
                transformNote
                    ?
                    (
                        <textarea
                            className="note-text"
                            style={{backgroundColor: notes[noteIndex].color || "grey"}}
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            onDoubleClick={() => setTransformNote(false)}
                        >

                            </textarea>
                    )
                    : (
                        <div className="note-body"
                             style={{backgroundColor: notes[noteIndex].color || "grey"}}
                        >
                            {text}
                        </div>
                    )
            }
        </Rnd>
    )
}

export default Note