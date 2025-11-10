// utils/validators.js
const { body } = require('express-validator');

const registerValidation = [
  body('name').isLength({ min: 2 }).withMessage('Name must have at least 2 characters'),
  body('email').isEmail().withMessage('Invalid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 chars'),
];

const loginValidation = [
  body('email').isEmail().withMessage('Invalid email'),
  body('password').exists().withMessage('Password required'),
];

const postCreateValidation = [
  body('title').isLength({ min: 2 }).withMessage('Title is required'),
  body('body').isLength({ min: 1 }).withMessage('Body is required'),
];

const commentValidation = [
  body('text').isLength({ min: 1 }).withMessage('Comment text is required'),
];

module.exports = {
  registerValidation,
  loginValidation,
  postCreateValidation,
  commentValidation
};
