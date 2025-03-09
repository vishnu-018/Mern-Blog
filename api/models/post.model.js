import mongoose from 'mongoose';

const postSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
      unique: true,
    },
    image: {
      type: String,
      default:
        'https://www.hostinger.com/tutorials/wp-content/uploads/sites/2/2021/09/how-to-write-a-blog-post.png',
    },
    video: {
      type: String,
      default: '',
    },
    category: {
      type: [String],
      required:true, // Changed from String to an array of strings
      default: ['uncategorized'], // Default value as an array
    },
    year: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
    },
    isAdmin: { type: Boolean, default: false },
    approved: {
      type: Boolean,
      default: false, // Default to false for user-created posts
    },
    visibleTo: {
      type: String,
      enum: ['admin', 'owner', 'all'], // Define who can see the post
      default: 'owner', // Default to 'owner' for user-created posts
    },
  },
  { timestamps: true }
);

const Post = mongoose.model('Post', postSchema);

export default Post;
