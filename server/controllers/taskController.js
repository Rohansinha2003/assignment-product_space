const { Task } = require('../models');
const { Op } = require('sequelize');

/**
 * @desc    Get all tasks for authenticated user
 * @route   GET /api/tasks
 * @access  Protected
 */
const getTasks = async (req, res, next) => {
  try {
    const { status, priority, search, sortBy = 'createdAt', order = 'DESC' } = req.query;

    const whereClause = { userId: req.user.id };

    if (status && ['pending', 'in_progress', 'completed'].includes(status)) {
      whereClause.status = status;
    }

    if (priority && ['low', 'medium', 'high'].includes(priority)) {
      whereClause.priority = priority;
    }

    if (search && search.trim()) {
      whereClause[Op.or] = [
        { title: { [Op.like]: `%${search.trim()}%` } },
        { description: { [Op.like]: `%${search.trim()}%` } },
      ];
    }

    const validSortFields = ['createdAt', 'updatedAt', 'dueDate', 'priority', 'title', 'status'];
    const sortField = validSortFields.includes(sortBy) ? sortBy : 'createdAt';
    const sortOrder = order.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

    const tasks = await Task.findAll({
      where: whereClause,
      order: [[sortField, sortOrder]],
    });

    res.status(200).json({
      success: true,
      count: tasks.length,
      tasks,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get a single task by ID (owner only)
 * @route   GET /api/tasks/:id
 * @access  Protected
 */
const getTask = async (req, res, next) => {
  try {
    const task = await Task.findOne({
      where: { id: req.params.id, userId: req.user.id },
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found.',
      });
    }

    res.status(200).json({ success: true, task });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create a new task
 * @route   POST /api/tasks
 * @access  Protected
 */
const createTask = async (req, res, next) => {
  try {
    const { title, description, status, priority, dueDate } = req.body;

    const task = await Task.create({
      title: title.trim(),
      description: description ? description.trim() : null,
      status: status || 'pending',
      priority: priority || 'medium',
      dueDate: dueDate || null,
      userId: req.user.id,
    });

    res.status(201).json({
      success: true,
      message: 'Task created successfully.',
      task,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update a task (owner only)
 * @route   PUT /api/tasks/:id
 * @access  Protected
 */
const updateTask = async (req, res, next) => {
  try {
    const task = await Task.findOne({
      where: { id: req.params.id, userId: req.user.id },
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found.',
      });
    }

    const { title, description, status, priority, dueDate } = req.body;

    await task.update({
      title: title !== undefined ? title.trim() : task.title,
      description: description !== undefined ? (description ? description.trim() : null) : task.description,
      status: status !== undefined ? status : task.status,
      priority: priority !== undefined ? priority : task.priority,
      dueDate: dueDate !== undefined ? dueDate : task.dueDate,
    });

    res.status(200).json({
      success: true,
      message: 'Task updated successfully.',
      task,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete a task (owner only)
 * @route   DELETE /api/tasks/:id
 * @access  Protected
 */
const deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findOne({
      where: { id: req.params.id, userId: req.user.id },
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found.',
      });
    }

    await task.destroy();

    res.status(200).json({
      success: true,
      message: 'Task deleted successfully.',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getTasks, getTask, createTask, updateTask, deleteTask };
