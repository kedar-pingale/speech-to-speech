const express = require("express");
const fileupload = require("express-fileupload");
const cors = require("cors");

const translationRouter = require("./routes/translation");
const app = express();

//code to check if credentials are there
// AWS.config.getCredentials((err, credentials) => {
//     if (err) console.log(err.stack);

//     else {
//         console.log("credentials are", credentials);
//     }
// });

const port = process.env.PORT || 4001;

//temporary Polly logic to create sample audio input files
// const Polly = new AWS.Polly({ region: "ap-south-1" });

// const input = {
//     Text:
//         "Today Rohan is going to tell you few things about some concepts of life",
//     OutputFormat: "mp3",
//     VoiceId: "Joanna",
// };

// Polly.synthesizeSpeech(input, (err, data) => {
//     if (err) {
//         console.log("err is", err);
//         return;
//     }

//     if (data.AudioStream instanceof Buffer) {
//         console.log("Buffer...!!!");
//         fs.writeFile("SampleFile.mp3", data.AudioStream, fsErr => {
//             if (fsErr) console.log("fs err is", fsErr);
//             else console.log("success");
//         });
//     }
// });

app.use(express.json());
app.use(cors());
app.use(fileupload());

app.use("/", translationRouter);

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});
