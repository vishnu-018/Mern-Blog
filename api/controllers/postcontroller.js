import Post from '../models/post.model.js';
import { errorHandler } from '../utils/error.js';


export const create = async (req, res, next) => {
  if (!req.body.title || !req.body.content || !req.body.year) {
    return next(errorHandler(400, 'Please provide all required fields'));
  }

  const slug = req.body.title
    .split(' ')
    .join('-')
    .toLowerCase()
    .replace(/[^a-zA-Z0-9-]/g, '');

    const newPost = new Post({
      ...req.body,
      slug,
      userId: req.user.id,
      year: req.body.year,
      category: Array.isArray(req.body.categories) && req.body.categories.length > 0 
        ? req.body.categories 
        : ['uncategorized'], // Default category
    });

  try {
    const savedPost = await newPost.save();
    res.status(201).json(savedPost);
  } catch (error) {
    next(error);
  }
};

export const getposts = async (req, res, next) => {
  try {
    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 9;
    const sortDirection = req.query.order === 'asc' ? 1 : -1;

    const filter = {
      ...(req.query.userId && { userId: req.query.userId }),
      ...(req.query.slug && { slug: req.query.slug }),
      ...(req.query.postId && { _id: req.query.postId }),
      ...(req.query.year && { year: req.query.year }),
      ...(req.query.category && {
        category: Array.isArray(req.query.category) && req.query.category.length > 0 
          ? { $in: req.query.category.filter(cat => cat) } // Remove null values
          : { $in: ['uncategorized'] }, // Default category
      }),
      ...(req.query.searchTerm && {
        $or: [
          { title: { $regex: req.query.searchTerm, $options: 'i' } },
          { content: { $regex: req.query.searchTerm, $options: 'i' } },
        ],
      }),
    };

    const posts = await Post.find(filter)
      .sort({ updatedAt: sortDirection })
      .skip(startIndex)
      .limit(limit);

    const totalPosts = await Post.countDocuments(filter);

    const now = new Date();
    const oneMonthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());

    const lastMonthPosts = await Post.countDocuments({
      createdAt: { $gte: oneMonthAgo },
    });

    res.status(200).json({
      posts,
      totalPosts,
      lastMonthPosts,
    });
  } catch (error) {
    next(error);
  }
};


export const deletepost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.postId);
    if (!post) {
      return next(errorHandler(404, 'Post not found'));
    }

    // Fix: Allow admin OR post owner to delete
    if (!req.user.isAdmin && req.user.id !== post.userId.toString()) {
      return next(errorHandler(403, 'You are not allowed to delete this post'));
    }

    await Post.findByIdAndDelete(req.params.postId);
    res.status(200).json('The post has been deleted');
  } catch (error) {
    next(error);
  }
};

export const updatepost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.postId);

    if (!post) {
      return next(errorHandler(404, 'Post not found'));
    }

    if (!req.user.isAdmin && post.userId.toString() !== req.user.id) {
      return next(errorHandler(403, 'You are not allowed to update this post'));
    }

    const updatedPost = await Post.findByIdAndUpdate(
      req.params.postId,
      {
        $set: {
          title: req.body.title,
          content: req.body.content,
          category: Array.isArray(req.body.categories) && req.body.categories.length > 0 
            ? req.body.categories.filter(cat => cat)  // Remove null values
            : post.category, // Retain old category if empty
          image: req.body.image,
          year: req.body.year,
        },
      },
      { new: true }
    );

    res.status(200).json(updatedPost);
  } catch (error) {
    next(error);
  }
};

export const create1 = async (req, res, next) => {
  try {
    const { content, title, image, category, userId } = req.body;

    if (req.user.id !== userId && !req.user.isAdmin) {
      return next(errorHandler(403, 'You are not allowed to create this post'));
    }

    const slug = title
      .split(' ')
      .join('-')
      .toLowerCase()
      .replace(/[^a-zA-Z0-9-]/g, '');

    const newPost = new Post({
      userId,
      content,
      title,
      image,
      slug,
      category: Array.isArray(category) && category.length > 0 
      ? category 
      : ['uncategorized'],
    
    });

    await newPost.save();
    res.status(201).json(newPost);
  } catch (error) {
    next(error);
  }
};

export const updatepost1 = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.postId);

    if (!post) {
      return next(errorHandler(404, 'Post not found'));
    }

    if (post.userId.toString() !== req.user.id && !req.user.isAdmin) {
      return next(errorHandler(403, 'You are not allowed to update this post'));
    }

    const updatedPost = await Post.findByIdAndUpdate(
      req.params.postId,
      {
        ...req.body,
        category: Array.isArray(req.body.category) && req.body.category.length > 0 
          ? req.body.category.filter(cat => cat)  // Remove null values
          : post.category, // Keep previous category if empty
      },
      { new: true }
    );

    res.status(200).json(updatedPost);
  } catch (error) {
    next(error);
  }
};
