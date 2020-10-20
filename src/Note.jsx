import React, {useState} from "react"
import {useDrop} from "react-dnd";
import {ItemTypes} from "./components/types";
import update from 'immutability-helper';
import {Box} from "./components/Box";

const styles = {
    width: "100vw",
    height: "100vh",
    border: '1px solid black',
    position: 'relative',
};

const Note = () => {

    const [box, setBoxes] = useState({
        a: {top: 20, left: 80, title: 'Drag me around'},
        b: {top: 180, left: 20, title: 'Drag me too'},
    });

    const [, drop] = useDrop({
        accept: ItemTypes.NOTE,
        drop(item, monitor) {
            const delta = monitor.getDifferenceFromInitialOffset();
            console.log(delta)
            const left = Math.round(item.left + delta.x);
            const top = Math.round(item.top + delta.y);
            moveBox(item.id, left, top);
            return undefined;
        },
    });

    const moveBox = (id, left, top) => {
        console.log("nove",left,top)
        setBoxes(update(box, {
            [id]: {
                $merge: {left, top},
            },
        }));
    };


    return (<div ref={drop} style={styles}>
        {Object.keys(box).map((key) => {
            const {left, top, title} = box[key];
            return (
                <Box key={key} id={key} left={left} top={top}>
                    {title}
                </Box>
            )
        })}
    </div>);
}

export default Note