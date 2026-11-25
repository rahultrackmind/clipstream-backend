const express = require('express');
const app = express();
app.use(express.json({limit: '1mb'}))

app.get('/health', (req,res) => res.json({ok: true}));

app.post('/videos', (req,res) => {
    res.status(201).json({id: Date.now(), title: req.body.title});
})

app.get('/crash', async () => {
    throw new Error('Something broke');
});

app.use((err, req,res, next) => {
    res.status(err.status || 500).json({error:err.message})
})

app.listen(3000)