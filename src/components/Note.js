import React, {useEffect, useState} from "react"
import {Rnd} from "react-rnd"
import useNote from "../hooks/note.hook";
import {TypeMessage} from "../hooks/TypeMessage";

const Note = ({note, noteIndex, notes, setNotes, connection}) => {

    const [isDragging, setIsDragging] = useState(false);
    const [zIndex, setZIndex] = useState(1);
    const {updateNote} = useNote();

    useEffect(()=>{
        return () => {
            setZIndex(1)
        }
    })

    const updateStateNotes = (updatedNote) => {
        setNotes((prev) => [...prev.filter(note => note.id !== updatedNote.id), updatedNote])
    }
    const sendNewPosition = (type, note) => connection.send(JSON.stringify({...note, type}))

    const onDragStopHandler = (event, data) => {
        const updatedNote = updateNote(note, {x: data.x, y: data.y});
        updateStateNotes(updatedNote)
        sendNewPosition(TypeMessage.UPDATE, updatedNote)
    }

    const onResizeStopHandler = (e, direction, ref, delta, position) => {
        const updatedNote = updateNote(note, {
            width: ref.style.width,
            height: ref.style.height,
            x: position.x,
            y: position.y,
        });
        console.log(updatedNote);
        updateStateNotes(updatedNote)
        sendNewPosition(TypeMessage.UPDATE, updatedNote)
    }

    const deleteNoteHandler = () => {
        sendNewPosition(TypeMessage.DELETE, note)
        setNotes((prev) => [...prev.filter(noteFromState => noteFromState.id !== note.id)])
    }

    const changeColorHandler = (e) => {
        const color = e.target.className.trim().replace(/^btn\s*/, '');
        const updatedNote = updateNote(note, {color});
        sendNewPosition(TypeMessage.UPDATE, updatedNote)
    }

    const changeTextHandler = (e) => {
        const text = e.target.value;
        const updatedNote = updateNote(note, {text});
        sendNewPosition(TypeMessage.UPDATE, updatedNote)
    }

    return (
        <Rnd
            className="note"
            disableDragging={isDragging}
            style={{zIndex: zIndex}}
            size={{width: notes[noteIndex].width, height: notes[noteIndex].height}}
            minWidth={250}
            minHeight={250}
            position={{x: notes[noteIndex].x, y: notes[noteIndex].y}}
            onDragStop={onDragStopHandler}
            onResizeStop={onResizeStopHandler}
            bounds={"window"}
        >
                <div className="note-header"
                     style={{backgroundColor: notes[noteIndex].color || "gold"}}
                     onClick={() => setZIndex(2)}
                >
                    <div className="color-buttons">
                        <button className="btn blue"
                                onClick={changeColorHandler}
                        />
                        <button className="btn pink"
                                onClick={changeColorHandler}
                        />
                        <button className="btn yellow"
                                onClick={changeColorHandler}
                        />
                    </div>
                    <div className="cross"
                         onClick={deleteNoteHandler}
                    >
                        &times;
                    </div>
                </div>
                <textarea
                    className="note-text"
                    value={note.text}
                    onChange={changeTextHandler}
                    onFocus={() => setIsDragging(true)}
                    onBlur={() => setIsDragging(false)}
                />
        </Rnd>
    )
}

export default Note