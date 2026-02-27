import { Router } from 'express';
// Mengimpor Post dari file models
import { Post } from '../models/schemas/index.js';

const router = Router();

// 1. GET ALL POSTS (Read)
router.get('/', async (req, res, next) => {
  try {
    const listPost = await Post.find({}); // Mengambil semua data
    res.json(listPost);
  } catch (e) {
    next(e);
  }
});

// 2. GET POST BY ID (Read)
router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const postById = await Post.findById(id);
    
    if (!postById) return res.status(404).json({ message: 'Post tidak ditemukan' });
    
    res.json(postById);
  } catch (e) {
    next(e);
  }
});

// 3. CREATE POST (Create)
router.post('/', async (req, res, next) => {
  try {
    const { author, title, content } = req.body;
    const newPost = await Post.create({ author, title, content });
    
    res.status(201).json(newPost);
  } catch (e) {
    next(e);
  }
});

// 4. UPDATE POST (Update)
router.put('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const { author, title, content } = req.body;
    
    // Mengasumsikan model Post memiliki metode findByIdAndUpdate atau update
    const updatedPost = await Post.findByIdAndUpdate(id, { author, title, content }, { new: true });
    
    res.json(updatedPost);
  } catch (e) {
    next(e);
  }
});

// 5. DELETE POST (Delete)
router.delete('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    await Post.findByIdAndDelete(id);
    
    res.json({ message: 'Post berhasil dihapus' });
  } catch (e) {
    next(e);
  }
});

export default router;