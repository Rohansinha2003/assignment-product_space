import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import TaskCard from '../components/TaskCard';
import TaskModal from '../components/TaskModal';

const STATS_CONFIG = [
  { key: 'total', label: 'Total', icon: '📋', color: 'from-indigo-500/20 to-indigo-600/10 border-indigo-500/20' },
  { key: 'pending', label: 'Pending', icon: '⏳', color: 'from-gray-500/20 to-gray-600/10 border-gray-500/20' },
  { key: 'in_progress', label: 'In Progress', icon: '🔄', color: 'from-blue-500/20 to-blue-600/10 border-blue-500/20' },
  { key: 'completed', label: 'Completed', icon: '✅', color: 'from-emerald-500/20 to-emerald-600/10 border-emerald-500/20' },
];

const DashboardPage = () => {
  const { user } = useAuth();

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Filters
  const [filters, setFilters] = useState({ status: '', priority: '', search: '' });
  const [searchInput, setSearchInput] = useState('');

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      setFilters((prev) => ({ ...prev, search: searchInput }));
    }, 400);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const showSuccess = (msg) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const params = {};
      if (filters.status) params.status = filters.status;
      if (filters.priority) params.priority = filters.priority;
      if (filters.search) params.search = filters.search;

      const { data } = await api.get('/tasks', { params });
      setTasks(data.tasks);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch tasks.');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  // Compute stats (from full list when no filters, else from filtered)
  const stats = {
    total: tasks.length,
    pending: tasks.filter((t) => t.status === 'pending').length,
    in_progress: tasks.filter((t) => t.status === 'in_progress').length,
    completed: tasks.filter((t) => t.status === 'completed').length,
  };

  const handleOpenCreate = () => {
    setEditingTask(null);
    setModalOpen(true);
  };

  const handleOpenEdit = (task) => {
    setEditingTask(task);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setEditingTask(null);
  };

  const handleCreateTask = async (formData) => {
    setModalLoading(true);
    try {
      const { data } = await api.post('/tasks', formData);
      setTasks((prev) => [data.task, ...prev]);
      handleCloseModal();
      showSuccess('Task created successfully!');
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to create task.';
      setError(msg);
    } finally {
      setModalLoading(false);
    }
  };

  const handleUpdateTask = async (formData) => {
    setModalLoading(true);
    try {
      const { data } = await api.put(`/tasks/${editingTask.id}`, formData);
      setTasks((prev) => prev.map((t) => (t.id === editingTask.id ? data.task : t)));
      handleCloseModal();
      showSuccess('Task updated successfully!');
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to update task.';
      setError(msg);
    } finally {
      setModalLoading(false);
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;
    try {
      await api.delete(`/tasks/${taskId}`);
      setTasks((prev) => prev.filter((t) => t.id !== taskId));
      showSuccess('Task deleted.');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete task.');
    }
  };

  const handleToggleStatus = async (taskId, newStatus) => {
    // Optimistic update
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t))
    );
    try {
      const { data } = await api.put(`/tasks/${taskId}`, { status: newStatus });
      setTasks((prev) => prev.map((t) => (t.id === taskId ? data.task : t)));
    } catch (err) {
      // Rollback on failure
      fetchTasks();
      setError(err.response?.data?.message || 'Failed to update task status.');
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: prev[key] === value ? '' : value,
    }));
  };

  const clearFilters = () => {
    setFilters({ status: '', priority: '', search: '' });
    setSearchInput('');
  };

  const hasActiveFilters = filters.status || filters.priority || filters.search;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">
          Good {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 17 ? 'afternoon' : 'evening'},{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
            {user?.name?.split(' ')[0]}
          </span>{' '}
          👋
        </h1>
        <p className="text-gray-400 text-sm mt-1">Track and manage your tasks</p>
      </div>

      {/* Success / Error Messages */}
      {successMsg && (
        <div className="flex items-center gap-2 mb-4 p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-lg fade-in">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#34d399" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 11l3 3L22 4" /><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
          </svg>
          <p className="text-emerald-400 text-sm">{successMsg}</p>
        </div>
      )}
      {error && (
        <div className="flex items-center justify-between gap-2 mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg fade-in">
          <div className="flex items-center gap-2">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#f87171" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" />
            </svg>
            <p className="text-red-400 text-sm">{error}</p>
          </div>
          <button onClick={() => setError('')} className="text-red-400 hover:text-red-300 text-xs">Dismiss</button>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
        {STATS_CONFIG.map(({ key, label, icon, color }) => (
          <div
            key={key}
            className={`glass rounded-xl p-4 bg-gradient-to-br border ${color} cursor-pointer transition-all duration-200 hover:scale-[1.02]`}
            onClick={() => key !== 'total' && handleFilterChange('status', key)}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-lg">{icon}</span>
              {key !== 'total' && (
                <div className={`w-2 h-2 rounded-full ${filters.status === key ? 'bg-indigo-400' : 'bg-transparent'}`} />
              )}
            </div>
            <div className="text-2xl font-bold text-white">{stats[key]}</div>
            <div className="text-xs text-gray-400 mt-0.5">{label}</div>
          </div>
        ))}
      </div>

      {/* Controls Row */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-6">
        {/* Search */}
        <div className="relative flex-1">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            id="task-search"
            type="text"
            placeholder="Search tasks..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="input-field pl-9"
          />
          {searchInput && (
            <button
              onClick={() => { setSearchInput(''); setFilters((p) => ({ ...p, search: '' })); }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          )}
        </div>

        {/* Priority filter */}
        <div className="flex items-center gap-2">
          {['low', 'medium', 'high'].map((p) => (
            <button
              key={p}
              id={`filter-priority-${p}`}
              onClick={() => handleFilterChange('priority', p)}
              className={`text-xs px-3 py-1.5 rounded-lg border transition-all capitalize ${
                filters.priority === p
                  ? 'bg-indigo-500/20 border-indigo-500/40 text-indigo-400'
                  : 'border-white/10 text-gray-400 hover:border-white/20 hover:text-gray-300'
              }`}
            >
              {p}
            </button>
          ))}
        </div>

        {/* Clear filters */}
        {hasActiveFilters && (
          <button
            id="clear-filters-btn"
            onClick={clearFilters}
            className="btn-ghost text-xs px-3 py-1.5 whitespace-nowrap"
          >
            Clear filters
          </button>
        )}

        {/* Add Task */}
        <button
          id="create-task-btn"
          onClick={handleOpenCreate}
          className="btn-primary whitespace-nowrap"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          New Task
        </button>
      </div>

      {/* Task Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full spinner" />
            <p className="text-gray-400 text-sm">Loading tasks...</p>
          </div>
        </div>
      ) : tasks.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-4">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 11l3 3L22 4" />
              <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
            </svg>
          </div>
          <h3 className="text-white font-semibold mb-1">
            {hasActiveFilters ? 'No tasks match your filters' : 'No tasks yet'}
          </h3>
          <p className="text-gray-500 text-sm mb-4">
            {hasActiveFilters ? 'Try adjusting your search or filters.' : 'Create your first task to get started.'}
          </p>
          {!hasActiveFilters && (
            <button id="empty-create-task-btn" onClick={handleOpenCreate} className="btn-primary">
              Create your first task
            </button>
          )}
          {hasActiveFilters && (
            <button id="empty-clear-filters-btn" onClick={clearFilters} className="btn-ghost">
              Clear filters
            </button>
          )}
        </div>
      ) : (
        <>
          <p className="text-gray-500 text-xs mb-3">{tasks.length} task{tasks.length !== 1 ? 's' : ''}</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {tasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onEdit={handleOpenEdit}
                onDelete={handleDeleteTask}
                onToggleStatus={handleToggleStatus}
              />
            ))}
          </div>
        </>
      )}

      {/* Task Modal */}
      <TaskModal
        isOpen={modalOpen}
        onClose={handleCloseModal}
        onSubmit={editingTask ? handleUpdateTask : handleCreateTask}
        task={editingTask}
        loading={modalLoading}
      />
    </div>
  );
};

export default DashboardPage;
