const initialState = { targetLanguage: "Hindi" };

export default function targetLanguageReducer(state = initialState, action) {
    switch (action.type) {
        case "SET_TARGET_LANGUAGE":
            state = {
                targetLanguage: action.payload,
            };
    }
    return state;
}
