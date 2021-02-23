let initialState = {
    disableButtons: null,
};

export default function disableButtonsReducer(state = initialState, action) {
    switch (action.type) {
        case "SET_DISABLE_BUTTONS":
            state = { disableButtons: action.payload };
    }

    return state;
}
