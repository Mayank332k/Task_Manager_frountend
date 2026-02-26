import { useState, useEffect, useCallback, useRef } from 'react';
import Navbar from '../components/Navbar';
import Toolbar from '../components/Toolbar';
import TaskCard from '../components/TaskCard';
import TaskModal from '../components/TaskModal';
import Pagination from '../components/Pagination';
import Spinner from '../components/Spinner';
import Toast from '../components/Toast';
import { getTasks, createTask, updateTask, deleteTask } from '../api/tasks';

const TASKS_PER_PAGE = 6;

export default function DashboardPage() {
  const [tasks, setTasks] = useState([]);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [modalSaving, setModalSaving] = useState(false);

  // Modal state
  const [modal, setModal] = useState({ open: false, mode: 'create', task: null });

  // Toast state
  const [toast, setToast] = useState({ message: '', type: 'success' });

  const searchDebounce = useRef(null);

  const fetchTasks = useCallback(async (params) => {
    setLoading(true);
    try {
      const res = await getTasks(params);
      // Real API response: { success, tasks: [...], pagination: { total, page, limit, totalPages } }
      const body = res.data;
      setTasks(body.tasks ?? []);
      setTotalPages(body.pagination?.totalPages ?? 1);
    } catch {
      showToast('Failed to load tasks.', 'error');
    } finally {
      setLoading(false);
    }
  }, []);


  // Fetch whenever page / status changes immediately
  useEffect(() => {
    fetchTasks({ page, limit: TASKS_PER_PAGE, status: status || undefined, search: search || undefined });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, status]);

  // Debounce search input
  useEffect(() => {
    if (searchDebounce.current) clearTimeout(searchDebounce.current);
    searchDebounce.current = setTimeout(() => {
      setPage(1);
      fetchTasks({ page: 1, limit: TASKS_PER_PAGE, status: status || undefined, search: search || undefined });
    }, 400);
    return () => clearTimeout(searchDebounce.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  const showToast = (message, type = 'success') => setToast({ message, type });
  const clearToast = () => setToast({ message: '', type: 'success' });

  /* ---- MODAL HANDLERS ---- */
  const openCreate = () => setModal({ open: true, mode: 'create', task: null });
  const openEdit = (task) => setModal({ open: true, mode: 'edit', task });
  const closeModal = () => setModal({ open: false, mode: 'create', task: null });

  const handleSave = async (formData) => {
    setModalSaving(true);
    try {
      if (modal.mode === 'edit') {
        await updateTask(modal.task._id ?? modal.task.id, formData);
        showToast('Task updated successfully!');
      } else {
        await createTask(formData);
        showToast('Task created successfully!');
      }
      closeModal();
      fetchTasks({ page, limit: TASKS_PER_PAGE, status: status || undefined, search: search || undefined });
    } catch (err) {
      showToast(err?.response?.data?.message ?? 'Failed to save task.', 'error');
    } finally {
      setModalSaving(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteTask(id);
      showToast('Task deleted.');
      // If last task on page > 1, go back one page
      if (tasks.length === 1 && page > 1) {
        setPage((p) => p - 1);
      } else {
        fetchTasks({ page, limit: TASKS_PER_PAGE, status: status || undefined, search: search || undefined });
      }
    } catch {
      showToast('Failed to delete task.', 'error');
    }
  };

  return (
    <div className="dashboard">
      <Navbar />

      <main className="dashboard-main" id="main-content">
        <div className="dashboard-header">
          <h2 className="dashboard-title">My Tasks</h2>
          <span className="dashboard-count">
            {loading ? '…' : `${tasks.length} task${tasks.length !== 1 ? 's' : ''}`}
          </span>
        </div>

        <Toolbar
          search={search}
          status={status}
          onSearchChange={(val) => { setSearch(val); }}
          onStatusChange={(val) => { setStatus(val); setPage(1); }}
          onAddTask={openCreate}
        />

        {/* Task List */}
        {loading ? (
          <Spinner />
        ) : tasks.length === 0 ? (
          <div className="empty-state">
            <span className="empty-icon" aria-hidden="true">📋</span>
            <p className="empty-title">No tasks yet</p>
            <p className="empty-subtitle">Click &ldquo;Add Task&rdquo; to create your first task.</p>
          </div>
        ) : (
          <div className="task-grid" role="list" aria-label="Task list">
            {tasks.map((task) => (
              <TaskCard
                key={task._id ?? task.id}
                task={task}
                onEdit={openEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}

        {/* Pagination */}
        {!loading && totalPages > 1 && (
          <Pagination
            page={page}
            totalPages={totalPages}
            onPrev={() => setPage((p) => p - 1)}
            onNext={() => setPage((p) => p + 1)}
            onGoTo={(p) => setPage(p)}
          />
        )}

      </main>

      {/* Modal */}
      {modal.open && (
        <TaskModal
          mode={modal.mode}
          task={modal.task}
          onSave={handleSave}
          onClose={closeModal}
          loading={modalSaving}
        />
      )}

      {/* Toast */}
      <Toast message={toast.message} type={toast.type} onClose={clearToast} />
    </div>
  );
}
