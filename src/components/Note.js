import React, {useEffect, useRef, useState} from "react"
import {Rnd} from "react-rnd"

const style = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    border: "solid 1px #ddd",
    background: "#f0f0f0",
};

const Note = ({getFromLocal, saveInLocal, index, state, setState}) => {


    const [transformNote, setTransformNote] = useState(false);
    const [text, setText] = useState('');
    const rnd = useRef();

    const updateState = (width,height,x,y) => {
        let newState = [...state]
        newState[index] = {
            width: width || state[index].width,
            height: height || state[index].height,
            x: ~x ? x : state[index].x,
            y: ~y ? y : state[index].y,
        }
        return newState
    }

    const savePositionWhenTransformation = () => {
        if (transformNote && (state[index].x !== 0 || state[index].y !== 0)) {
            saveInLocal(index, {...state[index], x: state[index].x, y: state[index].y});
            const updateState1 = updateState(null,null,0,0);
            setState(updateState1)
        } else if (state[index].x === 0 && state[index].y === 0) {
            const stringPosition = getFromLocal(index)
            if (stringPosition) {
                const parse = JSON.parse(stringPosition);
                setState(updateState(parse.width,parse.height,parse.x,parse.y))
            }
        }
    };

    useEffect(savePositionWhenTransformation, [transformNote])


    const onDragStopHandler = (event, data) => {
        const newState = updateState(null,null,data.x,data.y);
        console.log(newState);
        saveInLocal(index, newState[index])
        setState(newState)
    }

    const onResizeStopHandler = (e, direction, ref, delta, position) => {
        setState(updateState(ref.style.width, ref.style.height,position.x, position.y));
    }

    return (
        <Rnd
            ref={rnd}
            className={`note${transformNote ? '-activate' : ''}`}
            disableDragging={transformNote}
            style={{...style}}
            size={{width: state[index].width, height: state[index].height}}
            minWidth={250}
            minHeight={250}
            position={{x: state[index].x, y: state[index].y}}
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
                <div className="cross">
                    &times;
                </div>
            </div>
            {
                transformNote
                    ?
                    (
                        <textarea
                            className="note-text"
                            style={{resize: 'none', backgroundColor: "grey", width: '100%', height: "100%"}}
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            onDoubleClick={() => setTransformNote(false)}
                        >

                            </textarea>
                    )
                    : (
                        <div className="note-body"
                             style={{backgroundColor: 'grey'}}
                             onDoubleClick={() => setTransformNote(true)}
                        >
                            {text}
                        </div>
                    )
            }
        </Rnd>
    )
}

export default Note