import { useState } from 'react';
import { Menu, X } from 'react-feather';
import { ReactNode } from 'react';

import Sidebar from './Sidebar';
interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [showSidebar, setShowSidebar] = useState(false);

  return (
    <>
      <Sidebar className={showSidebar ? 'show' : ''} />
      <div className="pt-10 lg:ml-72 mx-auto px-5 sm:px-10 py-5">
        {children}
      </div>
      <button
        className={`fixed bottom-5 border shadow-md bg-white p-3 rounded-full transition-all focus:outline-none lg:hidden ${
          showSidebar ? 'right-5' : 'left-5'
        }`}
        onClick={() => setShowSidebar(!showSidebar)}
      >
        {showSidebar ? <X width={24} height={24} /> : <Menu width={24} height={24} />}
      </button>
    </>
  );
}
