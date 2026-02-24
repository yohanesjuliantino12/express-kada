import express from 'express'

const app = express()


app.use((req,res,next) =>{
    if(false){
        next(new Error('Not Authorized'))
        return;
    }
    next();
})

app.get('/', (req, res, next) => {
    res.send('Hello, Yohanes!!')
})

app.use((err, req, res, next) => {
    res.send('Error Handling');
});

app.use((req, res, next) => {
    console.log(`Request lewatt jalan ini ${req.path}`);
    next();
})

app.get('/say/:greeting', (req,res) => {
    const { greeting } = req.params;
    res.send(greeting);
})

app.listen(3000);

