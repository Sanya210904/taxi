const express = require("express");
const cors = require("cors");

const PORT = 4000;

const app = express();

const apiRoute = require("./routes/api");

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors())
app.use("/api", apiRoute);


app.all("*", (req, res) => {
    return res.status(404).json({
        error: {
            code: 404,
            message: 'Page not found'
        }
    })
})


app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}/`);
})