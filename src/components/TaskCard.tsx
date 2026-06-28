import { Pencil, Trash2, Calendar, Clock, Check } from 'lucide-react';
import { Task } from '../types';

interface TaskCardProps {
  key?: any;
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onToggleStatus: (id: string) => void;
}

export default function TaskCard({ task, onEdit, onDelete, onToggleStatus }: TaskCardProps) {
  const isCompleted = task.status === 'completed';

  // Left border styling based on status and priority
  let borderLeftClass = 'border-l-4 ';
  if (isCompleted) {
    borderLeftClass += 'border-l-secondary';
  } else {
    if (task.priority === 'high') {
      borderLeftClass += 'border-l-primary';
    } else if (task.priority === 'medium') {
      borderLeftClass += 'border-l-tertiary';
    } else {
      borderLeftClass += 'border-l-outline';
    }
  }

  // Formatting date/time relative to now
  const getRelativeTime = (isoString: string) => {
    try {
      const date = new Date(isoString);
      const now = new Date('2026-06-28T02:19:33-07:00'); // Consistent reference date from additional metadata
      const diffMs = now.getTime() - date.getTime();
      const diffMins = Math.floor(diffMs / (1000 * 60));
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

      if (diffMins < 60) {
        return `Created ${diffMins <= 0 ? 'just now' : `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`}`;
      } else if (diffHours < 24) {
        return `Created ${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
      } else {
        return `Created ${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
      }
    } catch (e) {
      return 'Created recently';
    }
  };

  return (
    <div 
      id={`task-card-${task.id}`}
      className={`
        bg-surface-container-lowest border border-outline-variant rounded-xl p-5 task-card-shadow task-card-hover 
        transition-all duration-300 animate-fade-in flex flex-col justify-between min-h-[190px]
        ${borderLeftClass}
      `}
    >
      <div>
        {/* Top Header */}
        <div className="flex justify-between items-start mb-3">
          <div className={`
            px-2.5 py-1 rounded text-xs font-semibold uppercase tracking-wider
            ${isCompleted 
              ? 'bg-secondary/10 text-secondary' 
              : task.priority === 'high' 
                ? 'bg-error/10 text-error' 
                : 'bg-tertiary/10 text-tertiary'
            }
          `}>
            {isCompleted ? 'Completed' : `${task.priority} Priority`}
          </div>

          <div className="flex gap-2">
            <button
              id={`btn-edit-${task.id}`}
              onClick={() => onEdit(task)}
              className="p-1 text-on-surface-variant hover:text-primary transition-colors cursor-pointer"
              title="Edit Task"
            >
              <Pencil className="w-4.5 h-4.5" />
            </button>
            <button
              id={`btn-delete-${task.id}`}
              onClick={() => onDelete(task.id)}
              className="p-1 text-on-surface-variant hover:text-error transition-colors cursor-pointer"
              title="Delete Task"
            >
              <Trash2 className="w-4.5 h-4.5" />
            </button>
          </div>
        </div>

        {/* Title */}
        <h3 className="text-sm font-bold text-on-surface mb-2 leading-tight">
          {task.title}
        </h3>

        {/* Description */}
        <p className="text-xs text-on-surface-variant line-clamp-2 mb-4 leading-relaxed">
          {task.description || 'No description provided.'}
        </p>
      </div>

      {/* Footer Controls */}
      <div className="flex items-center justify-between mt-auto pt-2 border-t border-slate-100">
        <div className="flex items-center gap-1.5 text-on-surface-variant">
          <Clock className="w-4 h-4 text-outline" />
          <span className="text-xs text-on-surface-variant font-medium">
            {getRelativeTime(task.createdAt)}
          </span>
        </div>

        <button
          id={`btn-toggle-${task.id}`}
          onClick={() => onToggleStatus(task.id)}
          className={`
            w-8 h-8 rounded-full border flex items-center justify-center transition-all cursor-pointer
            ${isCompleted 
              ? 'bg-secondary border-secondary text-white' 
              : 'border-outline-variant hover:bg-secondary-container hover:text-on-secondary-container hover:border-secondary-container'
            }
          `}
          title={isCompleted ? 'Mark Pending' : 'Mark Completed'}
        >
          <Check className="w-4.5 h-4.5 stroke-[3]" />
        </button>
      </div>
    </div>
  );
}
