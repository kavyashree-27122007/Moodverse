import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import MoodyMascot from './MoodyMascot';

const AppLayout: React.FC = () => {
  return (
    <div className="flex min-h-screen bg-background relative overflow-hidden">
      <Sidebar />
      <main className="flex-1 ml-64 min-h-screen overflow-x-hidden overflow-y-auto z-10">
        <Outlet />
      </main>
      <div className="fixed bottom-6 right-6 z-50">
        <MoodyMascot />
      </div>
    </div>
  );
};

export default AppLayout;
