const useLocal = () => {

    const localKey = (id) => `position-note-${id}`;

    const saveInLocal = (id, note) => localStorage.setItem(localKey(id), JSON.stringify(note))

    const getFromLocal = (id) => JSON.parse(localStorage.getItem(localKey(id)))

    const removeInLocal = (index) => localStorage.removeItem(localKey(index))

    return {saveInLocal, getFromLocal, removeInLocal}
}

export default useLocal