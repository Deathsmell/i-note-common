import React from "react"
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import Note from "./Note";

const App = () => {

    return (
        <DndProvider backend={HTML5Backend}>
            <Note/>
        </DndProvider>
    )
}

export default App