import React, {useState} from 'react';
import {useDrag} from 'react-dnd';
import {ItemTypes} from './types';

const styleDiv = {
    overflow: 'hidden',
    border: '1px dashed gray',
    backgroundColor: 'white',
    padding: '0.5rem 1rem',
    cursor: 'move',
    resize: 'both',
    position: 'absolute',
};
const styleText = {}
export const Box = ({id, left, top, children,}) => {

    const [transform, setTransform] = useState(false);
    const [size, setSize] = useState({width: '300px', height: '300px'});

    const [, drag] = useDrag({
        item: {id, left, top, type: ItemTypes.NOTE},
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
    });

    const handler = (e) => {
        console.log(e.type)
        setTransform(!transform)
    }

    return (
        <div ref={drag}
             className={transform ? "note" : ""}

             style={{...styleDiv, left, top, ...size,}}
        >
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Autem cum error impedit labore, qui quos
            repudiandae sit voluptatum! Animi aspernatur atque fuga inventore molestiae nam quae reprehenderit, saepe
            vel! Inventore!
        </div>
    );
};
