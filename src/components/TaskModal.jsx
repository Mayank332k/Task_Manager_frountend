import { useState, useEffect } from 'react';
import CustomSelect from './CustomSelect';

const INITIAL_FORM = { title: '', description: '', status: 'pending' };

const STATUS_OPTIONS = [
  { value: 'pending',   label: 'Pending' },
  { value: 'completed', label: 'Completed' },
];

export default function TaskModal({ mode, task, onSave, onClose, loading }) {
  const [form, setForm]     = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (mode === 'edit' && task) {
      setForm({ title: task.title ?? '', description: task.description ?? '', status: task.status ?? 'pending' });
    } else {
      setForm(INITIAL_FORM);
    }
    setErrors({});
  }, [mode, task]);

  const validate = () => {
    const errs = {};
    if (!form.title.trim()) errs.title = 'Title is required.';
    if (form.title.trim().length > 100) errs.title = 'Title must be 100 characters or fewer.';
    return errs;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
    if (errors[name]) setErrors((p) => ({ ...p, [name]: undefined }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    onSave(form);
  };

  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  return (
    <div className="modal-overlay frosted-overlay"
      role="dialog" aria-modal="true" aria-labelledby="modal-title"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal frosted">
        <div className="modal-header">
          <h2 id="modal-title" className="modal-title">
            {mode === 'edit' ? '✏️ Edit Task' : '＋ New Task'}
          </h2>
          <button className="modal-close" onClick={onClose} aria-label="Close modal">×</button>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <div className="modal-body">
            <div className="form-group">
              <label htmlFor="task-title" className="form-label">
                Title <span className="required">*</span>
              </label>
              <input id="task-title" name="title" type="text"
                className={`input ${errors.title ? 'input-error' : ''}`}
                placeholder="Enter task title"
                value={form.title} onChange={handleChange}
                autoFocus aria-invalid={!!errors.title} />
              {errors.title && <span className="form-error" role="alert">{errors.title}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="task-description" className="form-label">Description</label>
              <textarea id="task-description" name="description"
                className="input textarea"
                placeholder="Add a description (optional)"
                value={form.description} onChange={handleChange} rows={4} />
            </div>

            <div className="form-group">
              <label className="form-label">Status</label>
              <CustomSelect
                id="task-status"
                options={STATUS_OPTIONS}
                value={form.status}
                onChange={(val) => setForm((p) => ({ ...p, status: val }))}
                placeholder="Select status"
              />
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-ghost" onClick={onClose} disabled={loading}>Cancel</button>
            <button id="modal-save-btn" type="submit"
              className="btn btn-primary btn-sm"
              style={{ borderRadius: '999px' }} disabled={loading}>
              {loading
                ? <><span className="btn-spinner" />Saving…</>
                : mode === 'edit' ? 'Save Changes' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
