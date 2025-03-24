import { ReactNode } from 'react';
import { ChevronRight } from 'react-feather';
import { Link } from 'react-router-dom';

interface SidebarItemProps {
  children: ReactNode;
  to: string;
  active?: boolean;
}

export default function SidebarItem({
  children,
  to,
  active = false,
}: SidebarItemProps) {
  return (
    <Link
    to={to}
    className="no-underline text-white bg-red-700 hover:bg-red-400 rounded-md p-3 hover:shadow-xl transition-all duration-300"
  >
    <span className="flex gap-5 font-semibold">
      {children} {active ? <ChevronRight /> : null}
    </span>
  </Link>
  );
}
