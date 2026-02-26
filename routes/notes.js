import { Router } from 'express';
// Di ES Modules, jangan lupa sertakan ekstensi file (.js) pada path lokal
import * as Note from '../models/note.js';

const router = Router();

router.get('/', (req, res, next) => {
  const notes = Note.list();
  res.json(notes);
});

router.get('/:id', (req, res, next) => {
    const id = Number(req.params.id)

    try{
        const note = Note.get(id);
        res.json(note);
    }   catch (e) {
        next(e);
    }
})

router.post('/', (req, res, next) => {
  const { title, content } = req.body;
  // Memanggil fungsi create dari model Note
  const note = Note.create(title, content);
  
  res.json(note);
});

router.put('/:id', (req, res, next) => {
  const id = Number(req.params.id);
  const { title, content } = req.body;

  try {
    const note = Note.update(id, title, content);
    res.json(note);
  } catch (e) {
    // Menangani error jika ID tidak ditemukan
    next(e);
  }
});

router.delete('/:id', (req, res, next) => {
  const id = Number(req.params.id);

  try {
    // Memanggil fungsi remove yang tadi kita buat
    Note.remove(id);
    res.json({ result: 'success' });
  } catch (e) {
    // Error 'Note not found for delete' akan ditangkap di sini
    next(e);
  }
});

// Jangan lupa mengekspor router agar bisa digunakan di file utama (app.js/index.js)
export default router;