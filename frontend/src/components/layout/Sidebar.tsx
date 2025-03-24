import { BookOpen, Home, LogOut, Users, User, Grid, Calendar, Globe} from 'react-feather';
import { Link, useNavigate } from 'react-router-dom';
import { useContext } from 'react';

import useAuth from '../../hooks/useAuth';
import authService from '../../services/AuthService';
import SidebarItem from './SidebarItem';
import bgdash from '../../assets/sidemenu-bg1.jpg';
import logowhite from '../../assets/urbano-logo-white.png';
import LanguageContext from '../../locales/i18n';
import { FormattedMessage } from 'react-intl';

interface SidebarProps {
  className: string;
}

export default function Sidebar({ className }: SidebarProps) {
  const navigate = useNavigate();

  const { authenticatedUser, setAuthenticatedUser } = useAuth();
  const { locale, switchLanguage } = useContext(LanguageContext)!;

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


      {authenticatedUser?.role !== 'user' 
      ? (
      <Link to="/dashboard" className="no-underline text-black">
      <img src={logowhite} alt="Urban Logo" className="mx-auto mb-[20%] w-42 h-auto" />
      </Link>
      ) : (
      <Link to="/home" className="no-underline text-black">
      <img src={logowhite} alt="Urban Logo" className="mx-auto mb-[20%] w-42 h-auto" />
      </Link>
      )}

      <nav className="mt-5 flex flex-col gap-3 flex-grow">

      <SidebarItem to="/user">
          <User /> <FormattedMessage id="user" />
      </SidebarItem>

      {authenticatedUser?.role !== 'user' ? (
      <SidebarItem to="/dashboard">
          <Grid /> <FormattedMessage id="dashboard" />
      </SidebarItem>
      ) : null}

      {authenticatedUser?.role === 'user' ? (
      <SidebarItem to="/home">
          <Home /> <FormattedMessage id="home" />
      </SidebarItem>
      ) : null}

      <SidebarItem to="/calendary">
          <Calendar /> <FormattedMessage id="calendary" />
      </SidebarItem>

      <SidebarItem to="/courses">
        <BookOpen /> <FormattedMessage id="courses" />
      </SidebarItem>

      {authenticatedUser?.role === 'admin' ? (
        <SidebarItem to="/users">
          <Users /> <FormattedMessage id="users" />
        </SidebarItem>
      ) : null}


      </nav>
      <button
          className="bg-gray-800 mb-5 hover:bg-red-400 text-white rounded-md p-3 transition-colors flex gap-3 justify-center items-center font-semibold focus:outline-none z-100"
          onClick={() => switchLanguage(locale === 'en' ? 'es' : 'en')}
        >
          <Globe /> <FormattedMessage id="language_button" />
      </button>

      <button
        className="bg-red-700 hover:bg-red-400 text-white rounded-md p-3 transition-colors flex gap-3 justify-center items-center font-semibold focus:outline-none z-100"
        onClick={handleLogout}
      >
        <LogOut /> <FormattedMessage id="logout" />
      </button>
    </div>
  );
}
