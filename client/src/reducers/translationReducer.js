const initialState = {
    mtInput: "",
    ttsInput: "",
};

export default function translationReducer(state = initialState, action) {
    switch (action.type) {
        case "SET_MT_INPUT":
            state = { ...state, mtInput: action.payload };
            break;
        case "SET_TTS_INPUT":
            state = { ...state, ttsInput: action.payload };
            break;
    }
    return state;
}
