const useNote = () => {

    const defaultNote = {
        id: null,
        text: '',
        width: 200,
        height: 200,
        x: 0,
        y: 0,
        type: '',
        color: '',
    }

    const updateNote = (oldNote,{id,width, height, x, y, color, text,type}) => {
        return {
            id: id || oldNote.id,
            width: width || oldNote.width,
            height: height || oldNote.height,
            x: ~x ? x : oldNote.x,
            y: ~y ? y : oldNote.y,
            color: color || oldNote.color,
            text: text || oldNote.text,
            type: type || null
        }
    }

    return {updateNote,defaultNote}
}

export default useNote