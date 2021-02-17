export const transcribe = audio => {
    const formData = new FormData();
    formData.append("audio", audio);
    return fetch("http://localhost:4001/transcribe", {
        method: "POST",
        body: formData,
    }).then(res => res.json());
};

export const translateText = (text, targetLanguage) =>
    fetch("http://localhost:4001/translate_text", {
        method: "POST",
        headers: {
            Accept: "application/json",
            "content-type": "application/json",
        },
        body: JSON.stringify({ text, targetLanguage }),
    })
        .then(res => {
            return res.json();
        })
        .catch(err => {
            console.log("Error in api.js", err);
        });

export const synthesizeSpeech = (text, targetLanguage) =>
    fetch("http://localhost:4001/synthesize_speech", {
        method: "POST",
        headers: {
            Accept: "application/json",
            "content-type": "application/json",
        },
        body: JSON.stringify({ text, targetLanguage }),
    })
        .then(res => res.blob())
        .catch(err => {
            console.log("Error in synthesize", err);
        });
