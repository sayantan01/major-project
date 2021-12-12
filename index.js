const express = require("express");
const dotenv = require("dotenv");
const path = require("path");

const app = express();
dotenv.config();

app.use(express.static(path.join(__dirname + "/client/build")));

app.get("*", (req, res, next) => {
res.sendFile(path.join(__dirname + "/client/build/index.html"));
});

// setup the server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server up on http://localhost:${PORT}`));
