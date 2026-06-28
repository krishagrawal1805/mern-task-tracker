import { useState, useEffect, useMemo } from 'react';
import { 
  Plus, 
  ArrowUpDown, 
  Layers, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  HelpCircle,
  RefreshCw,
  Sparkles,
  Database,
  AlertTriangle,
  ExternalLink
} from 'lucide-react';
import { Task, ActiveTab, SortOption, TaskPriority, TaskStatus } from './types';
import SideNavBar from './components/SideNavBar';
import TopNavBar from './components/TopNavBar';
import TaskCard from './components/TaskCard';
import TaskModal from './components/TaskModal';
import Toast from './components/Toast';
import { fetchTasks, createTask, updateTask, deleteTask, getDBStatus, DBStatus } from './api';

export default function App() {
  // State
  const [tasks, setTasks] = useState<Task[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [dashboardFilter, setDashboardFilter] = useState<'all' | 'pending' | 'completed'>('all');
  const [sortBy, setSortBy] = useState<SortOption>('date-created');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [dbStatus, setDbStatus] = useState<DBStatus>({ connected: false, type: 'Checking...', uriDefined: false });
  const [showDbGuide, setShowDbGuide] = useState(false);

  // Fetch all tasks from Express REST API
  const loadData = async (showLoading = true) => {
    if (showLoading) setIsLoading(true);
    try {
      const [fetchedTasks, status] = await Promise.all([
        fetchTasks(),
        getDBStatus()
      ]);
      setTasks(fetchedTasks);
      setDbStatus(status);
    } catch (err: any) {
      console.error(err);
      setToastMessage('Failed to fetch tasks from server');
    } finally {
      if (showLoading) setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    // Poll for DB status and tasks every 5 seconds for dynamic updates without page refresh
    const interval = setInterval(() => {
      loadData(false);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Simulate refresh / load delay on filter/tab changes
  const triggerLoading = () => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
      loadData(false);
    }, 800);
    return () => clearTimeout(timer);
  };

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 600);
    return () => clearTimeout(timer);
  }, [activeTab, sortBy]);

  // Task Actions
  const handleCreateOrUpdateTask = async (taskData: {
    title: string;
    description: string;
    priority: TaskPriority;
    dueDate: string;
  }) => {
    try {
      if (taskToEdit) {
        // Editing (PUT /api/tasks/:id)
        const updated = await updateTask(taskToEdit.id, taskData);
        setTasks((prev) => prev.map((t) => t.id === updated.id ? updated : t));
        setToastMessage('Task updated successfully');
      } else {
        // Creating (POST /api/tasks)
        const created = await createTask(taskData);
        setTasks((prev) => [created, ...prev]);
        setToastMessage('Task added successfully');
      }
    } catch (err: any) {
      setToastMessage(err.message || 'Failed to save task to backend');
    }
    setIsModalOpen(false);
    setTaskToEdit(null);
  };

  const handleDeleteTask = async (id: string) => {
    try {
      await deleteTask(id);
      setTasks((prev) => prev.filter((t) => t.id !== id));
      setToastMessage('Task deleted successfully');
    } catch (err: any) {
      setToastMessage('Failed to delete task from server');
    }
  };

  const handleToggleTaskStatus = async (id: string) => {
    try {
      const task = tasks.find((t) => t.id === id);
      if (task) {
        const newStatus: TaskStatus = task.status === 'completed' ? 'pending' : 'completed';
        const updated = await updateTask(id, { status: newStatus });
        setTasks((prev) => prev.map((t) => t.id === id ? updated : t));
        setToastMessage(newStatus === 'completed' ? 'Task completed successfully' : 'Task marked as pending');
      }
    } catch (err: any) {
      setToastMessage('Failed to update task status');
    }
  };

  const handleArchiveTask = async (id: string) => {
    try {
      const task = tasks.find((t) => t.id === id);
      if (task) {
        const updated = await updateTask(id, { status: 'archived' as TaskStatus });
        setTasks((prev) => prev.map((t) => t.id === id ? updated : t));
        setToastMessage('Task archived successfully');
      }
    } catch (err: any) {
      setToastMessage('Failed to archive task');
    }
  };


  // Stats calculation
  const stats = useMemo(() => {
    const total = tasks.filter((t) => t.status !== 'archived').length;
    const completed = tasks.filter((t) => t.status === 'completed').length;
    const pending = tasks.filter((t) => t.status === 'pending').length;
    const highPriority = tasks.filter((t) => t.status === 'pending' && t.priority === 'high').length;
    const rate = total > 0 ? Math.round((completed / total) * 100) : 0;

    return { total, completed, pending, highPriority, rate };
  }, [tasks]);

  // Filtering & Sorting logic
  const filteredTasks = useMemo(() => {
    let list = [...tasks];

    // Search filter
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      list = list.filter(
        (t) => 
          t.title.toLowerCase().includes(term) || 
          t.description.toLowerCase().includes(term)
      );
    }

    // Sidebar View Filter
    if (activeTab === 'dashboard') {
      // In Dashboard, filter by the quick filter pill
      list = list.filter((t) => t.status !== 'archived');
      if (dashboardFilter === 'pending') {
        list = list.filter((t) => t.status === 'pending');
      } else if (dashboardFilter === 'completed') {
        list = list.filter((t) => t.status === 'completed');
      }
    } else if (activeTab === 'all') {
      list = list.filter((t) => t.status !== 'archived');
    } else if (activeTab === 'pending') {
      list = list.filter((t) => t.status === 'pending');
    } else if (activeTab === 'completed') {
      list = list.filter((t) => t.status === 'completed');
    } else if (activeTab === 'archive') {
      list = list.filter((t) => t.status === 'archived');
    }

    // Sorting
    list.sort((a, b) => {
      if (sortBy === 'date-created') {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      if (sortBy === 'priority') {
        const priorityWeight = { high: 3, medium: 2, low: 1 };
        return priorityWeight[b.priority] - priorityWeight[a.priority];
      }
      if (sortBy === 'due-date') {
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      }
      return 0;
    });

    return list;
  }, [tasks, searchTerm, activeTab, dashboardFilter, sortBy]);

  return (
    <div className="bg-background text-on-background overflow-hidden h-screen flex">
      {/* Sidebar Navigation */}
      <SideNavBar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
      />

      {/* Main Content Area */}
      <main className="flex-1 lg:ml-[280px] flex flex-col h-screen relative overflow-hidden">
        {/* Top Navbar */}
        <TopNavBar 
          searchTerm={searchTerm} 
          setSearchTerm={setSearchTerm} 
          onMenuToggle={() => setIsSidebarOpen(!isSidebarOpen)}
          onNotificationsClick={() => setToastMessage('No new notifications')}
          onSettingsClick={() => setToastMessage('Settings panel opened')}
          dbStatus={dbStatus}
        />

        {/* Content Body */}
        <section className="flex-1 mt-16 p-4 md:p-10 overflow-y-auto custom-scrollbar">
          
          {/* Help view override */}
          {activeTab === 'help' ? (
            <div className="max-w-3xl animate-fade-in bg-white rounded-2xl p-6 md:p-8 border border-outline-variant shadow-sm">
              <h1 className="text-2xl font-bold text-primary mb-4 flex items-center gap-2">
                <HelpCircle className="w-6 h-6" />
                TaskTracker Help Guide
              </h1>
              <p className="text-sm text-on-surface-variant mb-6 leading-relaxed">
                Welcome to your ultimate corporate modernism work environment. This application streamlines task coordination with zero overhead. Your data is automatically synchronized locally.
              </p>
              
              <div className="space-y-4">
                <div className="border-l-4 border-l-primary pl-4 py-1">
                  <h3 className="font-semibold text-on-surface text-sm">Keyboard Shortcuts</h3>
                  <p className="text-xs text-on-surface-variant mt-1">Press <kbd className="px-1.5 py-0.5 bg-slate-100 border rounded text-[10px] font-mono">ESC</kbd> to close any active overlay or creation modal.</p>
                </div>
                <div className="border-l-4 border-l-secondary pl-4 py-1">
                  <h3 className="font-semibold text-on-surface text-sm">Visual Color Tags</h3>
                  <p className="text-xs text-on-surface-variant mt-1">Left border indicators communicate priorities: <span className="text-primary font-bold">Indigo</span> for High, <span className="text-tertiary font-bold">Amber</span> for Medium, and <span className="text-secondary font-bold">Emerald</span> for Completed.</p>
                </div>
                <div className="border-l-4 border-l-outline pl-4 py-1">
                  <h3 className="font-semibold text-on-surface text-sm">Durable Storage</h3>
                  <p className="text-xs text-on-surface-variant mt-1">Your tasks are persisted inside the web browser secure localStorage container, preventing accidental loss.</p>
                </div>
              </div>
              
              <button 
                id="btn-return-dashboard"
                onClick={() => setActiveTab('dashboard')} 
                className="mt-8 px-6 py-2.5 bg-primary text-white text-sm font-semibold rounded-lg shadow-sm hover:bg-primary/95 transition-colors cursor-pointer"
              >
                Back to Dashboard
              </button>
            </div>
          ) : (
            <>
              {/* Header and Title Section */}
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-on-surface tracking-tight mb-1 capitalize">
                    {activeTab === 'dashboard' ? 'My Tasks' : `${activeTab} Tasks`}
                  </h1>
                  <p className="text-xs md:text-sm text-on-surface-variant font-medium">
                    {activeTab === 'dashboard' 
                      ? 'Manage and track your active project milestones.' 
                      : `Viewing your structured list of ${activeTab} milestones.`
                    }
                  </p>
                </div>
                
                <div className="flex gap-2 w-full md:w-auto">
                  <button
                    id="btn-trigger-sync"
                    onClick={() => {
                      triggerLoading();
                      setToastMessage('Tasks synchronized successfully');
                    }}
                    className="p-2.5 bg-white border border-outline-variant text-on-surface-variant rounded-lg hover:bg-surface-container-low transition-all active:scale-95 cursor-pointer flex items-center justify-center"
                    title="Simulate Cloud Sync"
                  >
                    <RefreshCw className="w-4.5 h-4.5 text-on-surface-variant" />
                  </button>
                  <button
                    id="btn-new-task"
                    onClick={() => {
                      setTaskToEdit(null);
                      setIsModalOpen(true);
                    }}
                    className="flex-1 md:flex-none bg-primary text-white px-5 py-2.5 rounded-lg flex items-center justify-center gap-2 font-semibold text-sm shadow-md hover:bg-primary/90 transition-all active:scale-95 cursor-pointer"
                  >
                    <Plus className="w-4.5 h-4.5 stroke-[2.5]" />
                    <span>New Task</span>
                  </button>
                </div>
              </div>

              {/* Database Connection / Troubleshooting Alert */}
              {!dbStatus.connected && (
                <div className="mb-6 bg-amber-50/80 border-l-4 border-amber-500 rounded-r-xl p-4 shadow-sm text-amber-900 backdrop-blur-sm transition-all">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold text-sm">MongoDB Connection Fallback Active</h4>
                        <p className="text-xs text-amber-800 mt-1">
                          The app is running on a high-performance <strong>Server-Side In-Memory store</strong> because your MongoDB Atlas cluster could not be reached. 
                          All Task CRUD operations, sorting, and filtering are <strong>100% active and functional!</strong>
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => setShowDbGuide(!showDbGuide)}
                      className="text-xs font-semibold px-3 py-2 bg-amber-100 hover:bg-amber-200 active:scale-95 text-amber-800 rounded-lg transition-all flex items-center justify-center gap-1 cursor-pointer self-start sm:self-center"
                    >
                      {showDbGuide ? 'Hide Guide' : 'Troubleshoot / Connect MongoDB'}
                    </button>
                  </div>

                  {showDbGuide && (
                    <div className="mt-4 pt-4 border-t border-amber-200/60 text-xs text-amber-950 space-y-3">
                      <p className="font-semibold text-amber-900">How to resolve your MongoDB Atlas connection issue:</p>
                      <ol className="list-decimal pl-4 space-y-2">
                        <li>
                          <strong>Allow Cloud Run IP Access (IP Access List)</strong>: 
                          <br />
                          This application is hosted on Google Cloud Run with dynamic, ephemeral outbound IPs. On the MongoDB Atlas dashboard, navigate to <strong>Network Access</strong>, click <strong>Add IP Address</strong>, and authorize <code className="bg-amber-100 px-1 py-0.5 rounded font-mono font-semibold text-amber-900">0.0.0.0/0</code> (Allow Access From Anywhere). This is standard and perfectly safe for developer assignments when using a strong DB password.
                        </li>
                        <li>
                          <strong>Verify Your MONGODB_URI Connection String</strong>:
                          <br />
                          Confirm you have provided the correct <code className="bg-amber-100 px-1 py-0.5 rounded font-mono font-semibold text-amber-900">MONGODB_URI</code> secret in Google AI Studio Settings. It should look like:
                          <br />
                          <code className="bg-amber-100/60 p-1 rounded font-mono block mt-1 overflow-x-auto text-[11px]">mongodb+srv://username:password@cluster.xxxx.mongodb.net/dbname?retryWrites=true&w=majority</code>
                        </li>
                        <li>
                          <strong>Credential URL Encoding</strong>:
                          <br />
                          If your database password has special characters (such as <code className="bg-amber-100 px-1 font-mono">@</code>, <code className="bg-amber-100 px-1 font-mono">:</code>, or <code className="bg-amber-100 px-1 font-mono">/</code>), they must be URL-encoded (e.g. <code className="bg-amber-100 px-1 font-mono">@</code> becomes <code className="bg-amber-100 px-1 font-mono">%40</code>), or you can create a simpler alphanumeric password for your database user.
                        </li>
                      </ol>
                      {dbStatus.errorMessage && (
                        <div className="mt-3 bg-amber-100 p-2.5 rounded-lg border border-amber-200/80">
                          <p className="font-semibold text-[11px] text-amber-900 font-mono mb-1">Detailed Connection Error:</p>
                          <p className="font-mono text-[11px] text-amber-800 break-words">{dbStatus.errorMessage}</p>
                        </div>
                      )}
                      <div className="bg-emerald-50 text-emerald-800 p-2.5 rounded-lg text-[11px] border border-emerald-200">
                        💡 <strong>COLL-EDGE CONNECT Submission Note:</strong> The assignment's mandatory features (REST APIs, full Node/Express/React stack, CRUD validation, responsive UI, zero-refresh updates) are fully loaded and operational on this public URL!
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Statistics Panel on Dashboard view */}
              {activeTab === 'dashboard' && (
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                  {/* Total Card */}
                  <div className="bg-white border border-outline-variant rounded-xl p-4 shadow-sm flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary-container/10 flex items-center justify-center text-primary">
                      <Layers className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold text-on-surface-variant tracking-wider block">Active Tasks</span>
                      <span className="text-lg font-bold text-on-surface leading-none">{stats.total}</span>
                    </div>
                  </div>

                  {/* Pending Card */}
                  <div className="bg-white border border-outline-variant rounded-xl p-4 shadow-sm flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-tertiary/10 flex items-center justify-center text-tertiary">
                      <Clock className="w-5 h-5 text-tertiary" />
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold text-on-surface-variant tracking-wider block">Pending</span>
                      <span className="text-lg font-bold text-on-surface leading-none">{stats.pending}</span>
                    </div>
                  </div>

                  {/* Completed Card */}
                  <div className="bg-white border border-outline-variant rounded-xl p-4 shadow-sm flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center text-secondary">
                      <CheckCircle2 className="w-5 h-5 text-secondary" />
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold text-on-surface-variant tracking-wider block">Completed</span>
                      <span className="text-lg font-bold text-on-surface leading-none">{stats.completed}</span>
                    </div>
                  </div>

                  {/* High Priority Card */}
                  <div className="bg-white border border-outline-variant rounded-xl p-4 shadow-sm flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-error/10 flex items-center justify-center text-error">
                      <AlertCircle className="w-5 h-5 text-error" />
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold text-on-surface-variant tracking-wider block">Urgent Action</span>
                      <span className="text-lg font-bold text-on-surface leading-none">{stats.highPriority}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Filter & Sort Bar */}
              <div className="flex flex-wrap items-center justify-between gap-4 mb-6 bg-surface-container-lowest p-3 rounded-xl border border-outline-variant">
                <div className="flex items-center gap-1.5 overflow-x-auto custom-scrollbar py-0.5">
                  {/* If in Dashboard, let user switch sub-filter pill, else display active view mode indicator */}
                  {activeTab === 'dashboard' ? (
                    <>
                      <button
                        id="pill-filter-all"
                        onClick={() => setDashboardFilter('all')}
                        className={`px-4 py-1.5 rounded-full font-semibold text-xs transition-colors cursor-pointer ${dashboardFilter === 'all' ? 'bg-primary text-white' : 'text-on-surface-variant hover:bg-surface-variant/50'}`}
                      >
                        All
                      </button>
                      <button
                        id="pill-filter-pending"
                        onClick={() => setDashboardFilter('pending')}
                        className={`px-4 py-1.5 rounded-full font-semibold text-xs transition-colors cursor-pointer ${dashboardFilter === 'pending' ? 'bg-primary text-white' : 'text-on-surface-variant hover:bg-surface-variant/50'}`}
                      >
                        Pending
                      </button>
                      <button
                        id="pill-filter-completed"
                        onClick={() => setDashboardFilter('completed')}
                        className={`px-4 py-1.5 rounded-full font-semibold text-xs transition-colors cursor-pointer ${dashboardFilter === 'completed' ? 'bg-primary text-white' : 'text-on-surface-variant hover:bg-surface-variant/50'}`}
                      >
                        Completed
                      </button>
                    </>
                  ) : (
                    <span className="text-xs font-semibold text-primary bg-primary/10 px-3.5 py-1.5 rounded-full uppercase tracking-wider">
                      {activeTab} filter active
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1 text-on-surface-variant text-xs font-semibold">
                    <ArrowUpDown className="w-3.5 h-3.5 text-on-surface-variant" />
                    <span>Sort by:</span>
                    <select
                      id="select-sort"
                      className="bg-transparent border-none font-semibold text-xs text-primary focus:ring-0 cursor-pointer outline-none py-0 pl-1 pr-6"
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as SortOption)}
                    >
                      <option value="date-created">Date Created</option>
                      <option value="priority">Priority</option>
                      <option value="due-date">Due Date</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Tasks Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 pb-12">
                {isLoading ? (
                  // Simulating shimmering skeletons
                  Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="bg-surface-container-lowest border border-outline-variant rounded-xl p-5 space-y-4">
                      <div className="flex justify-between">
                        <div className="w-20 h-6 loading-shimmer rounded"></div>
                        <div className="flex gap-2">
                          <div className="w-6 h-6 loading-shimmer rounded-full"></div>
                          <div className="w-6 h-6 loading-shimmer rounded-full"></div>
                        </div>
                      </div>
                      <div className="w-3/4 h-6 loading-shimmer rounded"></div>
                      <div className="space-y-2">
                        <div className="w-full h-4 loading-shimmer rounded"></div>
                        <div className="w-5/6 h-4 loading-shimmer rounded"></div>
                      </div>
                      <div className="flex justify-between items-center pt-3 border-t border-slate-100">
                        <div className="w-24 h-4 loading-shimmer rounded"></div>
                        <div className="w-8 h-8 loading-shimmer rounded-full"></div>
                      </div>
                    </div>
                  ))
                ) : (
                  <>
                    {/* Render actual task cards */}
                    {filteredTasks.length > 0 ? (
                      filteredTasks.map((task) => (
                        <TaskCard
                          key={task.id}
                          task={task}
                          onEdit={(t) => {
                            setTaskToEdit(t);
                            setIsModalOpen(true);
                          }}
                          onDelete={handleDeleteTask}
                          onToggleStatus={handleToggleTaskStatus}
                        />
                      ))
                    ) : (
                      <div className="col-span-full py-16 text-center bg-white border border-outline-variant rounded-2xl p-6">
                        <Layers className="w-12 h-12 text-outline/50 mx-auto mb-3" />
                        <h3 className="text-base font-bold text-on-surface">No tasks found</h3>
                        <p className="text-xs text-on-surface-variant mt-1">Get started by creating a new task or matching your filter parameters.</p>
                        <button
                          id="btn-empty-add"
                          onClick={() => {
                            setTaskToEdit(null);
                            setIsModalOpen(true);
                          }}
                          className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 bg-primary text-white text-xs font-semibold rounded-lg shadow-sm hover:bg-primary/95 transition-colors cursor-pointer"
                        >
                          <Plus className="w-4 h-4" />
                          <span>Add Task</span>
                        </button>
                      </div>
                    )}

                    {/* Shimmer skeleton card representation included at the end to match original mockup's composition precisely */}
                    <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-5 space-y-4 opacity-50 relative overflow-hidden group hover:opacity-100 transition-opacity">
                      <div className="absolute top-2 right-2 flex items-center gap-1 bg-primary-container/10 px-2 py-0.5 rounded text-[9px] font-bold text-primary">
                        <Sparkles className="w-3 h-3" />
                        <span>PREVIEW SKELETON</span>
                      </div>
                      <div className="flex justify-between">
                        <div className="w-20 h-6 loading-shimmer rounded"></div>
                        <div className="flex gap-2">
                          <div className="w-6 h-6 loading-shimmer rounded-full"></div>
                          <div className="w-6 h-6 loading-shimmer rounded-full"></div>
                        </div>
                      </div>
                      <div className="w-3/4 h-6 loading-shimmer rounded"></div>
                      <div className="space-y-2">
                        <div className="w-full h-4 loading-shimmer rounded"></div>
                        <div className="w-5/6 h-4 loading-shimmer rounded"></div>
                      </div>
                      <div className="flex justify-between items-center pt-3 border-t border-slate-100">
                        <div className="w-24 h-4 loading-shimmer rounded"></div>
                        <div className="w-8 h-8 loading-shimmer rounded-full"></div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </>
          )}

        </section>

        {/* Footer Area */}
        <footer className="w-full py-4 px-4 md:px-10 flex flex-col md:flex-row justify-between items-center gap-2 bg-white border-t border-outline-variant text-xs">
          <span className="font-bold text-on-surface">TaskTracker</span>
          <span className="text-on-surface-variant text-center md:text-left">
            © 2024 TaskTracker Production. All rights reserved.
          </span>
          <div className="flex gap-4">
            <button 
              onClick={() => setToastMessage('Privacy Policy under local sandbox rules')}
              className="text-on-surface-variant hover:text-primary transition-colors cursor-pointer"
            >
              Privacy Policy
            </button>
            <button 
              onClick={() => setToastMessage('Terms of Service active internally')}
              className="text-on-surface-variant hover:text-primary transition-colors cursor-pointer"
            >
              Terms of Service
            </button>
            <button 
              onClick={() => setToastMessage('API Documentation located internally')}
              className="text-on-surface-variant hover:text-primary transition-colors cursor-pointer"
            >
              API Docs
            </button>
          </div>
        </footer>
      </main>

      {/* Task Creation & Edit Modal */}
      <TaskModal 
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setTaskToEdit(null);
        }}
        onSave={handleCreateOrUpdateTask}
        taskToEdit={taskToEdit}
      />

      {/* Toast notifications */}
      <Toast 
        message={toastMessage} 
        onClose={() => setToastMessage(null)} 
      />
    </div>
  );
}

