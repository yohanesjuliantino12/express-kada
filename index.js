import express from 'express'
import noteRouter from './routes/notes.js'
import mongoose from 'mongoose';
import postsRouter from './routes/posts.js';
import cors from 'cors';

const app = express()
// const api = "mongodb+srv://yohanesjuliantino12_db_user:Larangan123@pyrothics.kkvc1w9.mongodb.net/"
const api ="mongodb://yohanesjuliantino12_db_user:Larangan123@ac-fp1tfn6-shard-00-01.kkvc1w9.mongodb.net:27017,ac-fp1tfn6-shard-00-00.kkvc1w9.mongodb.net:27017,ac-fp1tfn6-shard-00-02.kkvc1w9.mongodb.net:27017/myProjectDB?ssl=true&replicaSet=atlas-1018lb-shard-0&authSource=admin";
// const api = "mongodb+srv://yohanesjuliantino12_db_user:Larangan123@pyrothics.kkvc1w9.mongodb.net/?appName=PyroThics";
mongoose.connect(api)
  .then(() => {
    console.log('Berhasil terhubung ke MongoDB! 🚀');
  })
  .catch((err) => {
    console.error('Gagal koneksi ke database:', err.message);
  });

app.use(express.json())
app.use(cors({
  origin:"*",
}));
app.use('/notes', noteRouter);
app.use('/posts',postsRouter);

// app.use((req,res,next) =>{
//     if(false){
//         next(new Error('Not Authorized'))
//         return;
//     }
//     next();
// })

// app.use((req, res, next) => {
//     console.log(`Request lewatt jalan ini ${req.path}`);
//     next();
// })

// app.get('/say/:greeting', (req,res) => {
//     const { greeting } = req.params;
//     res.send(greeting);
// })

// app.get('/', (req, res, next) => {
//     res.send('Hello, Yohanes!!')
//     next();
// })

// app.use((err, req, res, next) => {
//     res.send('Error Handling');
//     next();
// });

// app.get('/kada', (req, res, next) => {
//     res.send('KADA BATCH 3')
//     next();
// })

// app.get('/unauthorized', (req, res) => {
//     res.status(401).send("Unauthorized")
// })


app.use((err, req, res, next) => {
    // res.status(500);
    res.status(500).json({
        result: 'fail',
        error: err.message,
    });
})

app.use((req, res, next) => {
    // res.status(404);
    res.status(404).json({
        result:'fail',
        error:`Page not found ${req.path}`
    });
});



app.listen(3000, () =>{
    console.log('Server jalan di localhost:3000')
});

