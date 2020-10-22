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

    const updateNote = (oldNote, {id, width, height, x, y, color, text, type}) => {
        if (typeof width === "string") width = width.replace(/px$/, '')
        if (typeof height === "string") height = height.replace(/px$/, '')
        return {
            id: id || oldNote.id,
            width: width || oldNote.width,
            height: height || oldNote.height,
            x: ~x ? x : oldNote.x,
            y: ~y ? y : oldNote.y,
            color: color || oldNote.color,
            text: text || oldNote.text || ' ',
            type: type || null
        }
    }

    const isEqual = (oldNote, updatedNote) => {
        return (oldNote.width === updatedNote.width)
            && (oldNote.height === updatedNote.height)
            && (oldNote.x === updatedNote.x)
            && (oldNote.y === updatedNote.y)
            && (oldNote.color === updatedNote.color)
            && (oldNote.text === updatedNote.text)
    }

    return {updateNote, defaultNote,isEqual}
}

export default useNote