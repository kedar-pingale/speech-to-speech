const initialState = {
    file: null,
};

export default function fileReducer(state = initialState, action) {
    switch (action.type) {
        case "UPDATE_FILE":
            state = { file: action.payload };
            break;
    }
    return state;
}
