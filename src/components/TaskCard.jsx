import { useState } from 'react';
import ConfirmModal from './ConfirmModal';

const STATUS_STYLES = {
  pending:      'badge badge-pending',
  'in-progress':'badge badge-inprogress',  // keep for backward compat
  completed:    'badge badge-completed',
};
const STATUS_LABELS = {
  pending:      'Pending',
  'in-progress':'In Progress',
  completed:    'Completed',
};

export default function TaskCard({ task, onEdit, onDelete }) {
  const [confirmOpen, setConfirmOpen] = useState(false);

  const badgeClass  = STATUS_STYLES[task.status] ?? 'badge';
  const statusLabel = STATUS_LABELS[task.status] ?? task.status;
  const createdDate = task.createdAt
    ? new Date(task.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
    : '—';

  return (
    <>
      <article className="task-card" aria-label={`Task: ${task.title}`}>
        <div className="task-card-badge-row">
          <span className={badgeClass}>{statusLabel}</span>
        </div>
        <h3 className="task-card-title">{task.title}</h3>
        {task.description && (
          <p className="task-card-description">{task.description}</p>
        )}
        <div className="task-card-footer">
          <span className="task-card-date">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" width="13" height="13">
              <rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
            </svg>
            {createdDate}
          </span>
          <div className="task-card-actions">
            <button className="btn btn-outline btn-sm" onClick={() => onEdit(task)}
              aria-label={`Edit ${task.title}`}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" width="13" height="13">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
              </svg>
              Edit
            </button>
            <button
              className="btn btn-sm"
              style={{ background: 'var(--danger-bg)', color: 'var(--danger-text)', border: '1.5px solid #fca5a5', borderRadius: '999px' }}
              onClick={() => setConfirmOpen(true)}
              aria-label={`Delete ${task.title}`}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" width="13" height="13">
                <polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                <path d="M10 11v6" /><path d="M14 11v6" /><path d="M9 6V4h6v2" />
              </svg>
              Delete
            </button>
          </div>
        </div>
      </article>

      {confirmOpen && (
        <ConfirmModal
          title="Delete Task"
          message={`Are you sure you want to delete "${task.title}"? This action cannot be undone.`}
          onConfirm={() => { setConfirmOpen(false); onDelete(task._id ?? task.id); }}
          onCancel={() => setConfirmOpen(false)}
        />
      )}
    </>
  );
}
