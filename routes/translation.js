const express = require("express");
const https = require("https");
const path = require("path");
const fs = require("fs");
const AWS = require("aws-sdk");

const router = express.Router();

const languageCodes = {
    Hindi: "hi",
    German: "de",
};

const voices = {
    Hindi: "Aditi",
    German: "Hans",
};

router.post("/transcribe", (req, res) => {
    try {
        let inputToMachineTranslation;

        const file = req.files.audio;

        //Logic to upload file to S3 bucket
        const s3 = new AWS.S3();
        const params = {
            Bucket: "audio-to-audio",
            Key: "sampleForTranscribe.mp3",
            Body: file.data,
        };
        s3.putObject(params, err => {
            if (err) console.log("Error in s3 upload is", err);
        });

        //Logic to get transcription of given audio
        const Transcribe = new AWS.TranscribeService({ region: "ap-south-1" });

        const transcribeParams = {
            LanguageCode: "en-US",
            Media: {
                MediaFileUri: "s3://audio-to-audio/sampleForTranscribe.mp3",
            },
            TranscriptionJobName: "sampletranscription",
        };

        Transcribe.startTranscriptionJob(transcribeParams, err => {
            if (err) console.log("Error in transcribe is", err);
        });

        //This interval is set to check if transcription job is completed
        let completeFlag = false;
        const handle = setInterval(() => {
            Transcribe.getTranscriptionJob(
                { TranscriptionJobName: "sampletranscription" },
                (err, data) => {
                    if (err)
                        console.log("Error in getTranscriptionJob is", err);
                    else {
                        //following is the actual condition
                        if (
                            data.TranscriptionJob.TranscriptionJobStatus ==
                                "COMPLETED" &&
                            completeFlag == false
                        ) {
                            completeFlag = true;

                            clearInterval(handle);

                            //a function is executed after 500 milliseconds of completion of job to get transcription, to delete transcription job and to send response back
                            setTimeout(() => {
                                https.get(
                                    data.TranscriptionJob.Transcript
                                        .TranscriptFileUri,
                                    async response => {
                                        try {
                                            const data = await streamToString(
                                                response
                                            );
                                            const dataObject = JSON.parse(data);

                                            inputToMachineTranslation =
                                                dataObject.results
                                                    .transcripts[0].transcript;

                                            Transcribe.deleteTranscriptionJob(
                                                {
                                                    TranscriptionJobName:
                                                        "sampletranscription",
                                                },
                                                err => {
                                                    if (err)
                                                        console.log(
                                                            "Error while deleting transcription job is",
                                                            err
                                                        );
                                                    else
                                                        res.json({
                                                            text: inputToMachineTranslation,
                                                        });
                                                }
                                            );
                                        } catch (err) {
                                            console.log(
                                                "Error while getting data from ReadStream of transcription is",
                                                err
                                            );
                                        }
                                    }
                                );
                            }, 500);
                        } else if (
                            data.TranscriptionJob.TranscriptionJobStatus ==
                            "FAILED"
                        )
                            console.log(
                                "Transcription Job failed, reason is",
                                data.TranscriptionJob.FailureReason
                            );
                    }
                }
            );
        }, 2000);
    } catch (err) {
        console.log("Error in transcribe (route handler) is", err);
    }
});

router.post("/translate_text", (req, res) => {
    const text = req.body.text;
    let targetLanguage = req.body.targetLanguage;

    for (let property in languageCodes) {
        if (property == targetLanguage) {
            targetLanguage = languageCodes[property];
            break;
        }
    }

    //Logic to translate text to target language
    const Translate = new AWS.Translate({ region: "ap-south-1" });

    const translateParams = {
        Text: text,
        SourceLanguageCode: "en",
        TargetLanguageCode: targetLanguage,
    };

    let translatedText;

    Translate.translateText(translateParams, (err, data) => {
        if (err) console.log("Error in translate is", err);
        else {
            translatedText = data.TranslatedText;
            res.json({ translatedText: translatedText });
        }
    });
});

router.post("/synthesize_speech", (req, res) => {
    const text = req.body.text;
    let targetLanguage = req.body.targetLanguage;

    let voice;

    for (let property in voices) {
        if (property == targetLanguage) {
            voice = voices[property];
            break;
        }
    }

    //Logic to convert text to speech using speech synthesis
    const Polly = new AWS.Polly({ region: "ap-south-1" });
    const input = {
        Text: text,
        OutputFormat: "mp3",
        VoiceId: voice,
    };

    Polly.synthesizeSpeech(input, (err, data) => {
        try {
            if (err) {
                console.log("Error in speech synthesis is", err);
            }
            // if (data.AudioStream instanceof Buffer) {
            //Audio received from speech synthesis process is first saved on server
            fs.writeFileSync("sampleFileTwo.mp3", data.AudioStream);

            //Audio file saved on server is sent with response
            let path1 = __dirname;
            path1 = path1.split("\\");
            path1.pop();

            const filename = "sampleFileTwo.mp3";
            path1 = path.join(...path1);

            const options = {
                root: path1,
            };
            res.sendFile(filename, options, function (err) {
                if (err)
                    console.log("Error while sending file to frontend is", err);
            });
            // }
        } catch (err) {
            console.log("Error during speech synthesis is", err);
        }
    });
});

function streamToString(stream) {
    const chunks = [];
    return new Promise((resolve, reject) => {
        stream.on("data", chunk => chunks.push(chunk));
        stream.on("error", reject);
        stream.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
    });
}

module.exports = router;
