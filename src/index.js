const express = require('express');
const app = express();

app.get('/courses', (req, res)=>{
    res.json(['curso 1','curso 2','curso 3']);
})

app.post('/courses', (req, res)=>{
    res.json(['curso 1','curso 2','curso 3', 'curso 4']);
})

app.put('/courses', (req, res)=>{
    res.json(['curso 6','curso 2','curso 3', 'curso 4']);
})

app.patch('/courses', (req, res)=>{
    res.json(['curso 1','curso 7','curso 3', 'curso 4']);
})

app.delete('/courses/:id', (req, res)=>{
    res.json(['curso 1','curso 2', 'curso 4']);
})

app.listen(3333, ()=>{
    console.log('App runing');
})