import { Schema, model } from 'mongoose';

const CommentSchema = new Schema({
  coment: {
    type: String,
    trim: true,
    required: true,
  },
  dateAdded: {
    type: Date,
    default: Date.now(),
  },
  article: {
    type: Schema.Types.ObjectId,
    ref: 'Article',
  },
});

export default model('Comment', CommentSchema);
// This creates our model from the above schema & exports it.
// eslint-disable-next-line import/prefer-default-export
