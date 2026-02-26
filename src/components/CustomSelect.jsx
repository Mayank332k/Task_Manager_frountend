import { useState, useEffect, useRef } from 'react';

/**
 * CustomSelect — fully in-app dropdown, no native browser <select>
 *
 * Props:
 *   options: [{ value, label }]
 *   value: string
 *   onChange: (value) => void
 *   placeholder: string
 *   id: string
 */
export default function CustomSelect({ options, value, onChange, placeholder = 'Select…', id, className = '' }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  const selected = options.find((o) => o.value === value);

  // Close on outside click
  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Close on ESC
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') setOpen(false); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  return (
    <div className={`custom-select-wrapper ${className}`} ref={ref} id={id}>
      <button
        type="button"
        className={`custom-select-trigger ${open ? 'open' : ''}`}
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span className="custom-select-value">
          {selected ? selected.label : <span className="custom-select-placeholder">{placeholder}</span>}
        </span>
        <span className="custom-select-chevron" aria-hidden="true">
          <svg viewBox="0 0 10 6" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
            <path d="M1 1l4 4 4-4" />
          </svg>
        </span>
      </button>

      {open && (
        <ul className="custom-select-menu" role="listbox" aria-label={placeholder}>
          {options.map((opt) => (
            <li
              key={opt.value}
              role="option"
              aria-selected={opt.value === value}
              className={`custom-select-option ${opt.value === value ? 'selected' : ''}`}
              onClick={() => { onChange(opt.value); setOpen(false); }}
            >
              {opt.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
