import { Menu, Search, Bell, Settings, Database, CloudOff } from 'lucide-react';

interface TopNavBarProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  onMenuToggle: () => void;
  onNotificationsClick?: () => void;
  onSettingsClick?: () => void;
  dbStatus?: { connected: boolean; type: string; uriDefined: boolean };
}

export default function TopNavBar({
  searchTerm,
  setSearchTerm,
  onMenuToggle,
  onNotificationsClick,
  onSettingsClick,
  dbStatus,
}: TopNavBarProps) {
  return (
    <header className="fixed top-0 w-full lg:w-[calc(100%-280px)] lg:left-[280px] z-40 flex justify-between items-center px-4 md:px-10 h-16 bg-white border-b border-outline-variant shadow-sm transition-colors">
      <div className="flex items-center gap-4 w-full max-w-xl">
        {/* Sidebar Toggle for Mobile */}
        <button 
          id="mobile-sidebar-toggle"
          onClick={onMenuToggle}
          className="lg:hidden p-1.5 rounded-lg hover:bg-surface-container-low text-primary transition-colors cursor-pointer"
          aria-label="Toggle sidebar"
        >
          <Menu className="w-6 h-6" />
        </button>

        {/* Search bar */}
        <div className="relative w-full max-w-md">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-outline">
            <Search className="w-5 h-5 text-outline" />
          </span>
          <input
            id="task-search-input"
            type="text"
            className="w-full pl-10 pr-4 py-1.5 bg-surface-container-low border border-outline-variant rounded-full text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all placeholder:text-outline/80"
            placeholder="Search tasks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* MongoDB Connection Status Badge */}
        {dbStatus && (
          <div 
            className={`hidden md:flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${
              dbStatus.connected 
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                : 'bg-amber-50 text-amber-700 border-amber-200'
            }`}
            title={dbStatus.connected ? 'Connected to live MongoDB Database' : 'Using Server-Side In-Memory fallback'}
          >
            {dbStatus.connected ? (
              <Database className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
            ) : (
              <CloudOff className="w-3.5 h-3.5 text-amber-600" />
            )}
            <span className="max-w-[120px] truncate">{dbStatus.type}</span>
          </div>
        )}

        {/* Notifications */}
        <button 
          id="btn-notifications"
          onClick={onNotificationsClick}
          className="p-2 text-on-surface-variant hover:bg-surface-container-low rounded-full transition-colors cursor-pointer active:opacity-80"
          aria-label="View notifications"
        >
          <Bell className="w-5 h-5" />
        </button>

        {/* Settings */}
        <button 
          id="btn-settings"
          onClick={onSettingsClick}
          className="p-2 text-on-surface-variant hover:bg-surface-container-low rounded-full transition-colors cursor-pointer active:opacity-80"
          aria-label="Open settings"
        >
          <Settings className="w-5 h-5" />
        </button>

        {/* Avatar */}
        <div className="w-8 h-8 rounded-full bg-primary-container flex items-center justify-center overflow-hidden border border-outline-variant">
          <img 
            className="w-full h-full object-cover" 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCWauSM6YEk6Rdms09Cm0Icz7ygYBKaFhFvHUcTza4OpBaDfhA0Ih86xUTfYuCE-pMFAm5J_NiRYSzi1eGj0hxHcdlvRFxzuSNldJJr_NsrG1qWw-qObyVBbB_qaY0NIptVUP2faw8rrkZtCw_IyDy-l4ZyNHfp5R1OWk4zimUAl8ewY4IMpXlat3DGbp0RKyMlu9HDeRtja9sOcWSIIE7OTsxeFod0OJASv-lWqsXBqFEJ1lbZkBnTlj6MkMvL3g-Z5jNwT2y-Q88" 
            alt="User avatar"
            referrerPolicy="no-referrer"
          />
        </div>
      </div>
    </header>
  );
}
