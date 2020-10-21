import React, {useCallback, useEffect, useState} from "react"
import Note from "./components/Note";

const App = () => {

    const [state, setState] = useState([
        {
            width: 200,
            height: 200,
            x: 0,
            y: 0
        },
        {
            width: 200,
            height: 200,
            x: 0,
            y: 0
        }
    ]);

    const localKey = (index) => `position-note-${index}`;
    const saveInLocal = (index, note) =>
        localStorage.setItem(localKey(index), JSON.stringify(note))

    const getFromLocal = useCallback((index) => localStorage.getItem(localKey(index)), [])

    // const removeInLocal = (index) =>
    //     localStorage.removeItem(localKey(index))


    useEffect(() => {
        setState(state.map((note, index) => {
            const fromLocal = getFromLocal(index);
            if (fromLocal)
                return {...JSON.parse(fromLocal)}
            else
                return note
        }))
    }, [state,getFromLocal])

    return (
        <div style={{backgroundColor: "aqua", width: "100vw", height: '100vh'}}>
            {
                state.map((note, index) => {
                        return (
                            <Note key={index}
                                  index={index}
                                  state={state}
                                  setState={setState}
                                  saveInLocal={saveInLocal}
                                  getFromLocal={getFromLocal}
                            />
                        )
                    }
                )
            }
        </div>
    )
}


export default App