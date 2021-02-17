import { useState, useEffect, useRef } from "react";
import React from "react";
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import { transcribe, translateText, synthesizeSpeech } from "./api";

function App() {
    const [file, setFile] = useState();
    const [inputToMT, setinputToMT] = useState("");
    const [inputToTTS, setinputToTTS] = useState("");
    const [targetLanguage, setTargetLanguage] = useState("Hindi");
    const [audioObj, setAudioObj] = useState();

    let targetLanguageRef = useRef();

    //this useEffect initially disables all buttons
    useEffect(() => {
        document.getElementById("runASR").disabled = true;
        document.getElementById("runMT").disabled = true;
        document.getElementById("runTTS").disabled = true;
        document.getElementById("playAudio").disabled = true;
    }, []);

    //to show transcribed text
    useEffect(() => {
        document.getElementById("transcriptedTextArea").innerText = inputToMT;
    }, [inputToMT]);

    //to show translated text
    useEffect(() => {
        document.getElementById("translatedTextArea").innerText = inputToTTS;
    }, [inputToTTS]);

    async function handleRunASR(e) {
        document.getElementById("runASR").disabled = true;
        document.getElementById("runMT").disabled = true;
        document.getElementById("runTTS").disabled = true;
        document.getElementById("playAudio").disabled = true;
        setinputToMT("");
        setinputToMT("");

        let result;
        result = await transcribe(file);

        setinputToMT(result.text);
        document.getElementById("runASR").disabled = false;
        document.getElementById("runMT").disabled = false;
    }

    async function handleRunMT() {
        document.getElementById("runMT").disabled = true;
        document.getElementById("runTTS").disabled = true;
        document.getElementById("playAudio").disabled = true;
        setinputToTTS("");

        const result = await translateText(inputToMT, targetLanguage);

        setinputToTTS(result.translatedText);
        document.getElementById("runMT").disabled = false;
        document.getElementById("runTTS").disabled = false;
    }

    async function handleRunTTS() {
        try {
            document.getElementById("runTTS").disabled = true;
            document.getElementById("playAudio").disabled = true;
            let result;
            result = await synthesizeSpeech(inputToTTS, targetLanguage);

            let url = URL.createObjectURL(result);
            let audio1 = new Audio(url);
            audio1.load();

            setAudioObj(audio1);

            alert("Now you can play output audio!");
            document.getElementById("runTTS").disabled = false;
            document.getElementById("playAudio").disabled = false;
        } catch (err) {
            console.log("Error in app.js is", err);
        }
    }

    async function handlePlayAudio(e) {
        await audioObj.play();
    }

    //sets the file to state variable after selection
    function setTheFile(e) {
        setFile(e.target.files[0]);
        document.getElementById("runASR").disabled = false;
    }

    //sets the language option to state variable after selection
    function setTargetLang(e) {
        setTargetLanguage(targetLanguageRef.current.value);
    }

    return (
        <div
            className="App d-inline-block h-70 w-90 mt-5"
            style={{ margin: "0 10%" }}
        >
            <div className="row mt-5">
                <div className="mt-2 mr-4 ml-5" style={{ width: "50%" }}>
                    <input
                        type="file"
                        // ref={inputFileRef}
                        name="inputFile"
                        className="form-control-file mr-2"
                        onChange={e => setTheFile(e)}
                    />
                </div>

                <select
                    name="targetLanguage"
                    className="form-select d-inline-block mt-2 mx-auto"
                    id="targetLanguage"
                    ref={targetLanguageRef}
                    onChange={e => setTargetLang(e)}
                >
                    <option value="Hindi">Hindi</option>
                    <option value="German">German</option>
                </select>
            </div>

            <div className="row">
                <div
                    className="card mt-5 mx-2 border border-dark"
                    style={{ width: "30%" }}
                >
                    <h5 className="mx-auto">ASR</h5>
                    <input
                        type="button"
                        id="runASR"
                        className="btn btn-primary border border-white w-50 mx-auto"
                        value="Run ASR"
                        onClick={e => handleRunASR(e)}
                    />
                    <textarea
                        id="transcriptedTextArea"
                        className="form-control"
                        rows="5"
                        cols="60"
                        style={{ resize: "none" }}
                        readOnly
                    ></textarea>
                </div>

                <div
                    className="card mt-5 mx-2 border border-dark"
                    style={{ width: "30%" }}
                >
                    <h5 className="mx-auto">MT</h5>
                    <input
                        type="button"
                        id="runMT"
                        className="btn btn-primary border border-white w-50 mx-auto"
                        value="Run MT"
                        onClick={e => handleRunMT(e)}
                    />
                    <textarea
                        id="translatedTextArea"
                        className="form-control"
                        rows="5"
                        cols="60"
                        style={{ resize: "none" }}
                        readOnly
                    ></textarea>
                </div>

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
                        onClick={e => handleRunTTS(e)}
                    />
                    <input
                        type="button"
                        id="playAudio"
                        value="play Output Audio"
                        className="btn btn-primary border border-white w-50 mt-5 mx-auto"
                        onClick={e => handlePlayAudio(e)}
                    />
                </div>
            </div>
        </div>
    );
}

export default App;
