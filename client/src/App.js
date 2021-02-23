import { useEffect } from "react";
import React from "react";
import { useSelector, useDispatch } from "react-redux";

import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import CardWithTextarea from "./components/CardWithTextarea";
import setFile from "./actions/setFile";
import setTargetLanguage from "./actions/setTargetLanguage";
import setAudioOutput from "./actions/setAudioOutput";
import setDisableButtons from "./actions/setDisableButtons";

export default function App() {
    let reduxTargetLanguage = useSelector(
        state => state.targetLanguageReducer.targetLanguage
    );
    let Input = useSelector(state => state.translationReducer);
    let audio = useSelector(state => state.fileReducer.file);
    let outputAudio = useSelector(
        state => state.audioOutputReducer.outputAudio
    );

    const dispatch = useDispatch();

    function disableButtons() {
        document.getElementById("runASR").disabled = true;
        document.getElementById("runMT").disabled = true;
        document.getElementById("runTTS").disabled = true;
        document.getElementById("playAudio").disabled = true;
    }

    dispatch(setDisableButtons(disableButtons));

    //this useEffect initially disables all buttons
    useEffect(() => {
        disableButtons();
    }, []);

    if (audio && document.getElementById("runASR"))
        document.getElementById("runASR").disabled = false;

    if (Input.mtInput != "" && document.getElementById("runMT"))
        document.getElementById("runMT").disabled = false;

    if (Input.ttsInput != "" && document.getElementById("runTTS"))
        document.getElementById("runTTS").disabled = false;

    function handleRunTTS() {
        disableButtons();
        dispatch(setAudioOutput(Input.ttsInput, reduxTargetLanguage));
        alert("Now you can play output audio!");
        document.getElementById("runTTS").disabled = false;
        document.getElementById("playAudio").disabled = false;
    }

    function handlePlayAudio(e) {
        outputAudio.play();
    }

    return (
        <div
            className="App d-inline-block h-70 w-90 mt-5"
            style={{ margin: "0 10%" }}
        >
            <div className="row mt-5">
                <div className="mt-2 mr-4 ml-5">
                    <input
                        type="file"
                        name="inputFile"
                        className="form-control-file mr-2"
                        onChange={e => dispatch(setFile(e.target.files[0]))}
                    />
                </div>

                <select
                    name="targetLanguage"
                    className="form-select d-inline-block mt-2 mx-auto"
                    id="targetLanguage"
                    onChange={e => dispatch(setTargetLanguage(e.target.value))}
                >
                    <option value="Hindi">Hindi</option>
                    <option value="German">German</option>
                </select>
            </div>

            <div className="row">
                <CardWithTextarea id="ASR" />

                <CardWithTextarea id="MT" />

                <div
                    className="card mt-5 mx-2 border border-dark"
                    style={{ width: "30%" }}
                >
                    <h5 className="mx-auto">TTS</h5>
                    <input
                        type="button"
                        id="runTTS"
                        value="Run TTS"
                        className="btn btn-primary border border-white w-50 mx-auto"
                        onClick={() => handleRunTTS()}
                    />
                    <input
                        type="button"
                        id="playAudio"
                        value="Play Output Audio"
                        className="btn btn-primary border border-white w-50 mt-5 mx-auto"
                        onClick={e => handlePlayAudio(e)}
                    />
                </div>
            </div>
        </div>
    );
}
