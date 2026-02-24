import express from 'express'

const app = express()


app.use((req,res,next) =>{
    if(false){
        next(new Error('Not Authorized'))
        return;
    }
    next();
})

app.use((req, res, next) => {
    console.log(`Request lewatt jalan ini ${req.path}`);
    next();
})

app.get('/say/:greeting', (req,res) => {
    const { greeting } = req.params;
    res.send(greeting);
})

app.get('/', (req, res, next) => {
    res.send('Hello, Yohanes!!')
    next();
})

app.use((err, req, res, next) => {
    res.send('Error Handling');
    next();
});

app.get('/kada', (req, res, next) => {
    res.send('KADA BATCH 3')
    next();
})

app.get('/unauthorized', (req, res) => {
    res.status(401).send("Unauthorized")
})


app.listen(3000);

