require("dotenv").config()
const express = require("express")
const app = express()
const jwt = require("jsonwebtoken")

app.use(express.json())

const posts = [
    {
        username : "Shizuo",
        title : "Sure boy"
    },
    {
        username : "Ekene",
        title : "Sure boy 2"
    }]

app.get("/posts", authenticateToken,  (req, res) => {
    res.json(posts.filter(post => post.username === req.user.name))
})


function authenticateToken(req, res, next){
    const [Bearer, Token] = req.headers["auth"].split(" ")
    console.log(Bearer, Token)
    if(!Token){
        return res.sendStatus(401)
    }
    jwt.verify(Token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err){
            return res.sendStatus(403)
        }
        req.user = user
        next()
    })
}

app.listen(3000, () => {
    console.log("Server is listening on port 3000...")
})