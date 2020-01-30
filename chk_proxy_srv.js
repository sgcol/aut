const express=require('express')
, app=express()

app.all('/', (req, res)=>{
    res.send(req.headers).end();
})

app.listen(7006);
console.log('server started at 7006');