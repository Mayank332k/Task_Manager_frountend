export default function Spinner({ fullscreen = false, label = 'Loading…' }) {
  return (
    <div className={fullscreen ? 'spinner-fullscreen' : 'spinner-inline'} role="status" aria-label={label}>
      <div className="spinner-ring" />
      {fullscreen && <span className="spinner-label">{label}</span>}
    </div>
  );
}
