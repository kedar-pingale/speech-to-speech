import React from "react";
import { useSelector, useDispatch } from "react-redux";

import setMtInput from "./actions/setMtInput";
import setTtsInput from "./actions/setTtsInput";

export default function CardWithTextarea(props) {
    const dispatch = useDispatch();

    const id = props.id;

    let audio = useSelector(state => state.fileReducer.file);
    let targetLanguage = useSelector(
        state => state.targetLanguageReducer.targetLanguage
    );
    let Input = useSelector(state => state.translationReducer);

    let disableButtons = useSelector(
        state => state.disableButtonsReducer.disableButtons
    );

    if (id == "ASR" && document.getElementById(`${id}Textarea`))
        document.getElementById(`${id}Textarea`).value = Input.mtInput;
    else if (document.getElementById(`${id}Textarea`))
        document.getElementById(`${id}Textarea`).value = Input.ttsInput;

    return (
        <div
            className="card mt-5 mx-2 border border-dark"
            style={{ width: "30%" }}
        >
            <h5 className="mx-auto">{id}</h5>
            <input
                type="button"
                id={`run${id}`}
                className="btn btn-primary border border-white w-50 mx-auto"
                value={`Run ${id}`}
                onClick={() => {
                    disableButtons();
                    dispatch(
                        id == "ASR"
                            ? setMtInput(audio)
                            : setTtsInput(Input.mtInput, targetLanguage)
                    );
                }}
            />
            <textarea
                id={`${id}Textarea`}
                className="form-control"
                rows="5"
                cols="60"
                style={{ resize: "none" }}
                readOnly
            ></textarea>
        </div>
    );
}
