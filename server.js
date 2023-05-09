const express = require("express");
const cors = require("cors");
const axios = require("axios");
const URL = require("./models/Urls");
const morgan = require("morgan")
const http = require("http")
const path = require("path")
require("dotenv").config();
const { connectDB } = require("./config/db")

connectDB()

const app = express();
const PORT = process.env.PORT || 3000
app.use(cors());
app.use(express.json());
app.use(morgan("dev"))
app.use(express.static('public'))


app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname+'/public/index.html'));
}); 

app.get("/urls", async (req, res, next) => {
    try {
        let urls = await URL.findOne({}).maxTimeMS(30000).exec()

        res.json(urls);
    } catch (error) {
        return res.status(400).json({ message: error.message || "server error" })
    }

})


app.post("/api/shorten", async (req, res, next) => {
    if (req.body.url) {

        try {
            let url = await URL.findOne({ originalUrl: req.body.url }).exec()

            if (url) {
                res.json({
                    short: `${process.env.URL}/${url.slug}`,
                    status: 200,
                })
            }
            else {

                const response = await axios.get(req.body.url.toString(), {
                    validateStatus: (status) => {
                        return status < 500
                    }
                })

                if (response.status != 404) {
                    let newUrl;
                    while (true) {
                        const { customAlphabet } = await import("nanoid");
                        let nanoid = customAlphabet("1234567890abcdef", 8);
                        let slug = nanoid();
                        let checkedSlug = await URL.findOne({ slug: slug }).exec()
                        if (!checkedSlug) {
                            newUrl = await URL.create({
                                originalUrl: req.body.url,
                                slug: slug,
                            });
                            break;
                        }

                    }
                    res.json({
                        short: `${process.env.URL}/${newUrl.slug}`,
                        status: response.status,
                    });
                } else {
                    res.json({
                        statusText: response.statusText,
                        status: response.status
                    })
                }
            }

        }
        catch (err) {
            console.log(err)
            next(err);
        }
    }
    else {
        res.status(400)
        const error = new Error("URL is required")
        next(error)
    }
});

app.get("/:slug", async (req, res, next) => {

    try {
        let url = await URL.findOne({ slug: req.params.slug }).exec()

        if (url) {
            res.status(301)
            res.redirect(url.originalUrl)
        }
        else {
            next()
        }
    }
    catch (err) {
        next(err);
    }
})

function notFound(req, res, next) {
    res.status(404)
    const error = new Error("Not Found ~ " + req.originalUrl)
    next(error)
}

function errorHandler(err, req, res, next) {
    res.status(res.statusCode || 500)
    res.json({
        message: err.message,
        error: {
            status: res.statusCode,
            stack: process.env.ENV === "development" ? err.stack : undefined
        }
    })
}

app.use(notFound);
app.use(errorHandler);

const server = http.createServer(app)

server.listen(
    PORT,
    console.log(
      `Server running on port ${PORT}`
    )
  )