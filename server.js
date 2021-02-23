const express = require("express");
const fileupload = require("express-fileupload");
const cors = require("cors");

const translationRouter = require("./routes/translation");

const app = express();

const port = process.env.PORT || 4001;

app.use(express.json());
app.use(cors());
app.use(fileupload());

app.use("/", translationRouter);

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});
