import { translateText } from "../api";

export default function setTtsInput(text, targetLanguage) {
    return async dispatch => {
        const result = await translateText(text, targetLanguage);
        dispatch({
            type: "SET_TTS_INPUT",
            payload: result.translatedText,
        });
    };
}
