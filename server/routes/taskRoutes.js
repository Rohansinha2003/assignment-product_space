const express = require('express');
const router = express.Router();
const { body, param } = require('express-validator');

const { getTasks, getTask, createTask, updateTask, deleteTask } = require('../controllers/taskController');
const { protect } = require('../middleware/authMiddleware');
const { validate } = require('../middleware/validateMiddleware');

// All task routes require authentication
router.use(protect);

// Validation rules for creating a task
const createTaskRules = [
  body('title')
    .trim()
    .notEmpty().withMessage('Task title is required.')
    .isLength({ max: 255 }).withMessage('Title must not exceed 255 characters.'),
  body('description')
    .optional({ nullable: true })
    .isString().withMessage('Description must be a string.'),
  body('status')
    .optional()
    .isIn(['pending', 'in_progress', 'completed']).withMessage('Status must be pending, in_progress, or completed.'),
  body('priority')
    .optional()
    .isIn(['low', 'medium', 'high']).withMessage('Priority must be low, medium, or high.'),
  body('dueDate')
    .optional({ nullable: true })
    .isISO8601().withMessage('Due date must be a valid date (YYYY-MM-DD).'),
];

// Validation rules for updating a task
const updateTaskRules = [
  param('id').isUUID().withMessage('Task ID must be a valid UUID.'),
  body('title')
    .optional()
    .trim()
    .notEmpty().withMessage('Title cannot be empty.')
    .isLength({ max: 255 }).withMessage('Title must not exceed 255 characters.'),
  body('description')
    .optional({ nullable: true })
    .isString().withMessage('Description must be a string.'),
  body('status')
    .optional()
    .isIn(['pending', 'in_progress', 'completed']).withMessage('Status must be pending, in_progress, or completed.'),
  body('priority')
    .optional()
    .isIn(['low', 'medium', 'high']).withMessage('Priority must be low, medium, or high.'),
  body('dueDate')
    .optional({ nullable: true })
    .isISO8601().withMessage('Due date must be a valid date (YYYY-MM-DD).'),
];

router.get('/', getTasks);
router.get('/:id', [param('id').isUUID().withMessage('Invalid task ID.')], validate, getTask);
router.post('/', createTaskRules, validate, createTask);
router.put('/:id', updateTaskRules, validate, updateTask);
router.delete('/:id', [param('id').isUUID().withMessage('Invalid task ID.')], validate, deleteTask);

module.exports = router;
