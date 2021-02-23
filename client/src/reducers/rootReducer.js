import { combineReducers } from "redux";

import audioOutputReducer from "./audioOutputReducer";
import disableButtonsReducer from "./disableButtonsReducer";
import fileReducer from "./fileReducer";
import targetLanguageReducer from "./targetLanguageReducer";
import translationReducer from "./translationReducer";

const rootReducer = combineReducers({
    audioOutputReducer,
    disableButtonsReducer,
    fileReducer,
    targetLanguageReducer,
    translationReducer,
});

export default rootReducer;
