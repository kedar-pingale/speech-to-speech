import { synthesizeSpeech } from "../api";

export default function setAudioOutput(text, targetLanguage) {
    return async dispatch => {
        const result = await synthesizeSpeech(text, targetLanguage);

        const url = URL.createObjectURL(result);
        const audio1 = new Audio(url);
        audio1.load();
        dispatch({
            type: "SET_AUDIO_OUTPUT",
            payload: audio1,
        });
    };
}
