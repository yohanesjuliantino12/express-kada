import mongoose from 'mongoose';
import PostSchema from './board.js';
import userSchema from './user.js';

export const User = mongoose.model('User', userSchema)
export const Post = mongoose.model('Post', PostSchema);

