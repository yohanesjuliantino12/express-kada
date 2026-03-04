import dotenv from "dotenv";
dotenv.config();
import express from 'express'
import noteRouter from './routes/notes.js'
import mongoose from 'mongoose';
import postsRouter from './routes/posts.js';
import authRouter from "./routes/auth.js";
import cors from 'cors';

const app = express()
const api = process.env.API_URL;
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
app.use('/auth', authRouter);


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

console.log("EMAIL_USER:", process.env.EMAIL_USER);
console.log("EMAIL_PASS:", process.env.EMAIL_PASS);

app.listen(3000, () =>{
    console.log('Server jalan di localhost:3000')
});

