const initialState = {
    outputAudio: undefined,
};

export default function audioOutputReducer(state = initialState, action) {
    switch (action.type) {
        case "SET_AUDIO_OUTPUT":
            state = { outputAudio: action.payload };
            break;
    }

    return state;
}
