/* eslint-disable react-hooks/exhaustive-deps */
import React, {useEffect, useState} from "react"
import {Rnd} from "react-rnd"
import useNote from "../hooks/note.hook";
import {TypeMessage} from "../hooks/TypeMessage";
import ReactMarkdown from 'react-markdown'


const Note = ({focus, setFocus, note, color, noteIndex, notes, setNotes, connection}) => {

    const [changed, setChanged] = useState(false);
    const [zIndex, setZIndex] = useState(1);
    const [text, setText] = useState(note.text);
    const {updateNote, isEqual} = useNote();

    useEffect(function resetZIndex () {
        setZIndex(0)
        return () => {
            setZIndex(0)
        }
    }, [])

    useEffect(function liftingComponent (){
        if (focus){
            setZIndex(1)
        } else {
            setZIndex(0)
        }
    },[focus])

    const updateStateNotes = (updatedNote) => {
        setNotes(() => [...notes.filter(note => note.id !== updatedNote.id), updatedNote])
    }
    const sendNewPosition = (type, note) =>
        connection.send(JSON.stringify({...note, type}))

    const onDragStopHandler = (event, data) => {
        if (note.x !== data.x && data.y !== note.y) {
            const updatedNote = updateNote(note, {x: data.x, y: data.y});
            sendNewPosition(TypeMessage.UPDATE, updatedNote)
            updateStateNotes(updatedNote)
        }
    }

    const onResizeStopHandler = (e, direction, ref, delta, position) => {
        const updatedNote = updateNote(note, {
            width: ref.style.width,
            height: ref.style.height,
            x: position.x,
            y: position.y,
        });
        if (!isEqual(note, updatedNote)) {
            updateStateNotes(updatedNote)
            sendNewPosition(TypeMessage.UPDATE, updatedNote)
        }
    }

    const deleteNoteHandler = () => {
        sendNewPosition(TypeMessage.DELETE, note)
        setNotes((prev) => [...prev.filter(noteFromState => noteFromState.id !== note.id)])
    }

    const changeColorHandler = (e) => {
        const changeColor = e.target.value;
        if (changeColor !== color) {
            console.log("update color")
            const updatedNote = updateNote(note, {color: changeColor});
            updateStateNotes(updatedNote)
            sendNewPosition(TypeMessage.UPDATE, updatedNote)
        }
    }

    const changeTextHandler = (e) => {
        const text = e.target.value;
        setText(text)
    }

    useEffect(function saveChangeText() {
        if (!changed) {
            const updatedNote = updateNote(note, {text});
            updateStateNotes(updatedNote)
            sendNewPosition(TypeMessage.UPDATE, updatedNote)
        }
    }, [changed])


    return (
        <Rnd
            className="note"
            disableDragging={focus}
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
                 style={{backgroundColor: color || "gold"}}
                 onClick={() => setZIndex(1)}
                 onMouseLeave={() => setZIndex(0)}
            >
                <div className="color-buttons">
                    <button className="btn blue"
                            value="blue"
                            onClick={changeColorHandler}
                    />
                    <button className="btn pink"
                            value="pink"
                            onClick={changeColorHandler}
                    />
                    <button className="btn yellow"
                            value="yellow"
                            onClick={changeColorHandler}
                    />
                </div>
                <div className="cross"
                     onClick={deleteNoteHandler}
                >
                    &times;
                </div>
            </div>
            {
                changed
                    ? (
                        <textarea
                            className="note-text"
                            value={text}
                            onChange={changeTextHandler}
                            autoFocus
                            onBlur={() => {
                                setChanged(false)
                                setFocus(false)
                            }}
                        />

                    )
                    : (
                        <div id="preview"
                             className="note-body"
                             onClick={() => {
                                 setChanged(true)
                                 setFocus(true)
                             }}
                        >
                            <ReactMarkdown>
                                {text}
                            </ReactMarkdown>
                        </div>
                    )
            }
        </Rnd>
    )
}

export default Note