const PRIORITY_CONFIG = {
  low: {
    label: 'Low',
    color: 'text-emerald-400',
    bg: 'bg-emerald-400/10',
    border: 'border-emerald-400/20',
    dot: 'bg-emerald-400',
  },
  medium: {
    label: 'Medium',
    color: 'text-amber-400',
    bg: 'bg-amber-400/10',
    border: 'border-amber-400/20',
    dot: 'bg-amber-400',
  },
  high: {
    label: 'High',
    color: 'text-red-400',
    bg: 'bg-red-400/10',
    border: 'border-red-400/20',
    dot: 'bg-red-400',
  },
};

const STATUS_CONFIG = {
  pending: {
    label: 'Pending',
    color: 'text-gray-400',
    bg: 'bg-gray-400/10',
    border: 'border-gray-400/20',
  },
  in_progress: {
    label: 'In Progress',
    color: 'text-blue-400',
    bg: 'bg-blue-400/10',
    border: 'border-blue-400/20',
  },
  completed: {
    label: 'Completed',
    color: 'text-green-400',
    bg: 'bg-green-400/10',
    border: 'border-green-400/20',
  },
};

const formatDate = (dateStr) => {
  if (!dateStr) return null;
  const date = new Date(dateStr + 'T00:00:00');
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

const isOverdue = (dateStr, status) => {
  if (!dateStr || status === 'completed') return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const due = new Date(dateStr + 'T00:00:00');
  return due < today;
};

const TaskCard = ({ task, onEdit, onDelete, onToggleStatus }) => {
  const priority = PRIORITY_CONFIG[task.priority] || PRIORITY_CONFIG.medium;
  const status = STATUS_CONFIG[task.status] || STATUS_CONFIG.pending;
  const overdue = isOverdue(task.dueDate, task.status);

  const getNextStatus = () => {
    if (task.status === 'pending') return 'in_progress';
    if (task.status === 'in_progress') return 'completed';
    return 'pending';
  };

  const getNextStatusLabel = () => {
    if (task.status === 'pending') return 'Start';
    if (task.status === 'in_progress') return 'Complete';
    return 'Reopen';
  };

  return (
    <div className={`glass glass-hover rounded-xl p-5 flex flex-col gap-3 slide-up transition-all duration-200 ${task.status === 'completed' ? 'opacity-75' : ''}`}>
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <h3 className={`font-semibold text-sm leading-snug flex-1 ${task.status === 'completed' ? 'line-through text-gray-500' : 'text-white'}`}>
          {task.title}
        </h3>
        <div className="flex items-center gap-1 shrink-0">
          {/* Edit */}
          <button
            id={`edit-task-${task.id}`}
            onClick={() => onEdit(task)}
            className="w-7 h-7 rounded-lg hover:bg-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-all"
            title="Edit task"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
              <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
          </button>
          {/* Delete */}
          <button
            id={`delete-task-${task.id}`}
            onClick={() => onDelete(task.id)}
            className="w-7 h-7 rounded-lg hover:bg-red-500/10 flex items-center justify-center text-gray-400 hover:text-red-400 transition-all"
            title="Delete task"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="3,6 5,6 21,6" />
              <path d="M19,6v14a2,2,0,01-2,2H7a2,2,0,01-2-2V6m3,0V4a1,1,0,011-1h4a1,1,0,011,1v2" />
            </svg>
          </button>
        </div>
      </div>

      {/* Description */}
      {task.description && (
        <p className="text-gray-400 text-xs leading-relaxed line-clamp-2">
          {task.description}
        </p>
      )}

      {/* Badges */}
      <div className="flex items-center flex-wrap gap-2">
        {/* Priority badge */}
        <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full border ${priority.color} ${priority.bg} ${priority.border}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${priority.dot}`} />
          {priority.label}
        </span>

        {/* Status badge */}
        <span className={`inline-flex items-center text-xs font-medium px-2 py-0.5 rounded-full border ${status.color} ${status.bg} ${status.border}`}>
          {status.label}
        </span>

        {/* Due date */}
        {task.dueDate && (
          <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full border ${overdue ? 'text-red-400 bg-red-400/10 border-red-400/20' : 'text-gray-400 bg-gray-400/10 border-gray-400/20'}`}>
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
            {overdue ? 'Overdue · ' : ''}{formatDate(task.dueDate)}
          </span>
        )}
      </div>

      {/* Footer — Status Toggle */}
      <div className="pt-2 border-t border-white/5">
        <button
          id={`toggle-status-${task.id}`}
          onClick={() => onToggleStatus(task.id, getNextStatus())}
          className={`w-full text-xs font-medium py-1.5 rounded-lg border transition-all duration-200 ${
            task.status === 'completed'
              ? 'border-gray-600/30 text-gray-500 hover:text-gray-300 hover:border-gray-500/50 hover:bg-white/5'
              : task.status === 'in_progress'
              ? 'border-indigo-500/30 text-indigo-400 hover:bg-indigo-500/10 hover:border-indigo-500/50'
              : 'border-blue-500/30 text-blue-400 hover:bg-blue-500/10 hover:border-blue-500/50'
          }`}
        >
          {getNextStatusLabel()} →
        </button>
      </div>
    </div>
  );
};

export default TaskCard;
