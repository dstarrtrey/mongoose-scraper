import { Schema, model } from 'mongoose';

const ArticleSchema = new Schema({
  title: {
    type: String,
    trim: true,
    required: true,
  },
  description: {
    type: String,
    trim: true,
    required: true,
  },
  link: {
    type: String,
    unique: true,
    required: true,
  },
  img: String,
  comments: [{
    type: Schema.Types.ObjectId,
    ref: 'Comment',
  }],
});

export default model('Article', ArticleSchema);
// This creates our model from the above schema & exports it.
// eslint-disable-next-line import/prefer-default-export
