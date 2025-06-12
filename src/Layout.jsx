import { Outlet } from 'react-router-dom';
import ApperIcon from './components/ApperIcon';

function Layout() {
  return (
    <div className="h-screen flex flex-col overflow-hidden">
      {/* Header */}
      <header className="flex-shrink-0 h-16 bg-white border-b border-surface-200 z-40">
        <div className="container mx-auto px-4 md:px-6 lg:px-8 h-full flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 gradient-primary rounded-lg flex items-center justify-center">
              <ApperIcon name="Upload" className="w-4 h-4 text-white" />
            </div>
            <h1 className="text-xl font-heading font-semibold text-surface-900">
              DropZone
            </h1>
          </div>
          
          <div className="text-sm text-surface-500">
            Efficient file uploads with visual feedback
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}

export default Layout;