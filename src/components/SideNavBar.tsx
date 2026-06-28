import { 
  LayoutDashboard, 
  ClipboardList, 
  Clock, 
  CheckCircle2, 
  HelpCircle, 
  Archive,
  FolderLock
} from 'lucide-react';
import { ActiveTab } from '../types';

interface SideNavBarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  isOpen: boolean;
  onClose: () => void;
}

export default function SideNavBar({ activeTab, setActiveTab, isOpen, onClose }: SideNavBarProps) {
  const menuItems = [
    { id: 'dashboard' as ActiveTab, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'all' as ActiveTab, label: 'All Tasks', icon: ClipboardList },
    { id: 'pending' as ActiveTab, label: 'Pending', icon: Clock },
    { id: 'completed' as ActiveTab, label: 'Completed', icon: CheckCircle2 },
  ];

  const bottomItems = [
    { id: 'help' as ActiveTab, label: 'Help', icon: HelpCircle },
    { id: 'archive' as ActiveTab, label: 'Archive', icon: Archive },
  ];

  const handleTabClick = (tabId: ActiveTab) => {
    setActiveTab(tabId);
    onClose();
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside 
        id="sidebar"
        className={`
          fixed left-0 top-0 h-full py-6 px-4 bg-surface-container-low border-r border-outline-variant w-[280px] z-50 
          transition-transform duration-300 ease-in-out lg:translate-x-0
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:flex lg:flex-col
        `}
      >
        {/* Logo/Header */}
        <div className="flex items-center gap-3 px-1 mb-8">
          <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center text-on-primary shadow-sm">
            <FolderLock className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-primary tracking-tight leading-none">Project Space</h2>
            <p className="text-xs text-on-surface-variant font-medium mt-1">Task Management</p>
          </div>
        </div>

        {/* Main Navigation */}
        <nav className="flex-1 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                id={`nav-${item.id}`}
                onClick={() => handleTabClick(item.id)}
                className={`
                  w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer
                  ${isActive 
                    ? 'bg-primary-container text-white font-semibold shadow-sm' 
                    : 'text-on-surface-variant hover:bg-surface-variant/50 hover:text-on-surface'
                  }
                `}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-on-surface-variant'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Bottom Section */}
        <div className="mt-auto pt-6 border-t border-outline-variant space-y-1">
          {bottomItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                id={`nav-${item.id}`}
                onClick={() => handleTabClick(item.id)}
                className={`
                  w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer
                  ${isActive 
                    ? 'bg-primary-container text-white font-semibold shadow-sm' 
                    : 'text-on-surface-variant hover:bg-surface-variant/50 hover:text-on-surface'
                  }
                `}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-on-surface-variant'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </aside>
    </>
  );
}
