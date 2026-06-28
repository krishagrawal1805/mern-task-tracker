import { useEffect, useState, FormEvent } from 'react';
import { X } from 'lucide-react';
import { Task, TaskPriority, TaskStatus } from '../types';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (taskData: {
    title: string;
    description: string;
    priority: TaskPriority;
    dueDate: string;
  }) => void;
  taskToEdit?: Task | null;
}

export default function TaskModal({ isOpen, onClose, onSave, taskToEdit }: TaskModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<TaskPriority>('medium');
  const [dueDate, setDueDate] = useState('');

  // Synchronize when editing a task or creating new
  useEffect(() => {
    if (taskToEdit) {
      setTitle(taskToEdit.title);
      setDescription(taskToEdit.description);
      setPriority(taskToEdit.priority);
      setDueDate(taskToEdit.dueDate);
    } else {
      setTitle('');
      setDescription('');
      setPriority('medium');
      // Set today as default due date
      const today = new Date('2026-06-28T02:19:33-07:00').toISOString().split('T')[0];
      setDueDate(today);
    }
  }, [taskToEdit, isOpen]);

  // Handle ESC key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onSave({
      title: title.trim(),
      description: description.trim(),
      priority,
      dueDate,
    });
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm transition-opacity animate-fade-in">
      <div 
        className="fixed inset-0" 
        onClick={onClose}
      />
      
      <div className="relative bg-surface-container-lowest w-full max-w-lg rounded-xl border border-outline-variant shadow-2xl overflow-hidden z-10">
        {/* Header */}
        <div className="p-6 border-b border-outline-variant flex justify-between items-center">
          <h2 className="text-xl font-bold text-on-surface">
            {taskToEdit ? 'Edit Task' : 'Create New Task'}
          </h2>
          <button 
            id="btn-close-modal"
            className="p-1 text-on-surface-variant hover:bg-surface-variant rounded transition-colors cursor-pointer"
            onClick={onClose}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-on-surface-variant block">Task Title</label>
              <input
                id="modal-task-title"
                type="text"
                className="w-full bg-white border border-outline-variant rounded-lg p-3 text-on-surface focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm"
                placeholder="e.g. Design System Audit"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                autoFocus
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-on-surface-variant block">Description</label>
              <textarea
                id="modal-task-desc"
                className="w-full bg-white border border-outline-variant rounded-lg p-3 text-on-surface focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm"
                placeholder="Briefly describe the task scope..."
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-on-surface-variant block">Priority</label>
                <select
                  id="modal-task-priority"
                  className="w-full bg-white border border-outline-variant rounded-lg p-3 text-on-surface outline-none text-sm cursor-pointer focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as TaskPriority)}
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-on-surface-variant block">Due Date</label>
                <input
                  id="modal-task-duedate"
                  type="date"
                  className="w-full bg-white border border-outline-variant rounded-lg p-3 text-on-surface outline-none text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="p-6 bg-surface-container-low flex justify-end gap-3 border-t border-outline-variant">
            <button
              id="btn-cancel-modal"
              type="button"
              className="px-5 py-2.5 text-on-surface font-semibold text-sm hover:bg-surface-variant/70 rounded-lg transition-colors cursor-pointer"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              id="btn-submit-modal"
              type="submit"
              className="px-5 py-2.5 bg-primary text-white font-semibold text-sm rounded-lg shadow-md hover:bg-primary/95 active:scale-[0.98] transition-all cursor-pointer"
            >
              {taskToEdit ? 'Save Changes' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
