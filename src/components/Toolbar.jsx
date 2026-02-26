import CustomSelect from './CustomSelect';

const STATUS_OPTIONS = [
  { value: '',          label: 'All Status' },
  { value: 'pending',   label: 'Pending' },
  { value: 'completed', label: 'Completed' },
];

export default function Toolbar({ search, status, onSearchChange, onStatusChange, onAddTask }) {
  return (
    <div className="toolbar" role="search" aria-label="Task Filters">
      {/* Search */}
      <div className="toolbar-search-wrapper">
        <span className="toolbar-search-icon" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" width="16" height="16">
            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </span>
        <input
          id="task-search" type="text"
          className="toolbar-search"
          placeholder="Search tasks..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          aria-label="Search tasks by title"
        />
      </div>

      {/* Custom status filter */}
      <CustomSelect
        id="status-filter"
        options={STATUS_OPTIONS}
        value={status}
        onChange={(val) => onStatusChange(val)}
        placeholder="All Status"
        className="toolbar-custom-select"
      />

      {/* Add task */}
      <button id="add-task-btn" className="btn btn-primary btn-sm"
        onClick={onAddTask} style={{ borderRadius: '999px', padding: '11px 22px', flexShrink: 0 }}>
        + Add Task
      </button>
    </div>
  );
}
