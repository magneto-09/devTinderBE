const express = require('express'); 

const app=express();


app.listen(7777, () => {
    console.log("Server listens at Port 7777....")
})

app.get("/", (req, res) => {
    res.send("Hello World from dashboard!!!");
})



