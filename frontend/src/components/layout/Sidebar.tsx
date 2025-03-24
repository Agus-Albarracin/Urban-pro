import { BookOpen, Home, LogOut, Users, User, Grid, Calendar} from 'react-feather';
import { Link, useNavigate } from 'react-router-dom';

import useAuth from '../../hooks/useAuth';
import authService from '../../services/AuthService';
import SidebarItem from './SidebarItem';
import bgdash from '../../assets/sidemenu-bg1.jpg';
import logowhite from '../../assets/urbano-logo-white.png';

interface SidebarProps {
  className: string;
}

export default function Sidebar({ className }: SidebarProps) {
  const navigate = useNavigate();

  const { authenticatedUser, setAuthenticatedUser } = useAuth();

  const handleLogout = async () => {
    await authService.logout();
    setAuthenticatedUser(null);
    navigate('/login');
  };

  return (
    <div className={'sidebar ' + className}
    style={{
      backgroundImage: `url(${bgdash})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      zIndex: 1000,
    }}>
      <Link to="/" className="no-underline text-black">
        <img src={logowhite} alt="Urban Logo" className="mx-auto mb-[20%] w-42 h-auto" />
      </Link>

      <nav className="mt-5 flex flex-col gap-3 flex-grow">

      <SidebarItem to="/user">
          <User /> User
      </SidebarItem>

      {authenticatedUser?.role !== 'user' ? (
      <SidebarItem to="/">
          <Grid /> Dashboard
      </SidebarItem>
      ) : null}

      {authenticatedUser?.role === 'user' ? (
      <SidebarItem to="/home">
          <Home /> Home
      </SidebarItem>
      ) : null}

      <SidebarItem to="/calendary">
          <Calendar /> Calendary
      </SidebarItem>

      <SidebarItem to="/courses">
        <BookOpen /> Courses
      </SidebarItem>

      {authenticatedUser?.role === 'admin' ? (
        <SidebarItem to="/users">
          <Users /> Users
        </SidebarItem>
      ) : null}


      </nav>
      <button
        className="bg-red-700 hover:bg-red-400 text-white rounded-md p-3 transition-colors flex gap-3 justify-center items-center font-semibold focus:outline-none z-100"
        onClick={handleLogout}
      >
        <LogOut /> Logout
      </button>
    </div>
  );
}
