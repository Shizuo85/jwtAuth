require("dotenv").config()
const express = require("express")
const app = express()
const jwt = require("jsonwebtoken")

app.use(express.json())

let refreshTokens = []

app.post("/token", (req, res) => {
    let refreshToken = req.body.token
    if(!refreshToken){
        return res.sendStatus(401)
    }
    if(!refreshTokens.includes(refreshToken)){
        return res.sendStatus(401)
    }
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
        if (err){
            return res.sendStatus(403)
        }
        const accessToken = generateAccessToken({name : user.name})
        res.json({accessToken})
    })
})

app.post("/login", (req, res) => {
    //Authorize user
    const name = req.body.username
    const user = {name}

    const accessToken = generateAccessToken(user)
    const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET)
    refreshTokens.push(refreshToken)
    res.json({ accessToken, refreshToken })
})

app.delete("/delete", (req, res) => {
    refreshTokens = refreshTokens.filter( token => token!=req.body.token)
    res.sendStatus(200)
})

function generateAccessToken(user){
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn : "15s"})
}

app.listen(4000, () => {
    console.log("Server is listening on port 4000...")
})