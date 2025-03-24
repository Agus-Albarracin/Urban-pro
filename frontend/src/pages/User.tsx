import UpdateProfile from '../components/dashboard/UpdateProfile';
import Layout from '../components/layout';
import { FormattedMessage } from 'react-intl';


const User: React.FC = () => {
  return (
    <Layout>
      <h1 className="font-semibold text-3xl mb-5"><FormattedMessage id="UserSettings" /></h1>
      <hr />
      <div className="mt-5">
        <UpdateProfile />
      </div>
    </Layout>
  );
}

export default User;