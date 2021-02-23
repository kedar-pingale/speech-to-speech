import { transcribe } from "../api";

export default function setMtInput(file) {
    return async dispatch => {
        const result = await transcribe(file);
        dispatch({
            type: "SET_MT_INPUT",
            payload: result.text,
        });
    };
}
