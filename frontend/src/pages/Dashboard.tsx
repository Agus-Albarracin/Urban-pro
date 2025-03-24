import { useQuery } from '@tanstack/react-query';
import Layout from '../components/layout';
import statsService from '../services/StatsService';
import useAuth from '../hooks/useAuth';
import { FormattedMessage } from 'react-intl';


interface StatsData {
  numberOfUsers: number;
  numberOfCourses: number;
  numberOfContents: number;
}

const getStats = async (): Promise<StatsData> => {
  return await statsService.getStats();
};

export default function Dashboard() {
  const { authenticatedUser } = useAuth();
  
  const { data, isLoading } = useQuery({
    queryKey: ['stats'],
    queryFn: getStats,
  });

  return (
    <Layout>
      <h1 className="font-semibold text-3xl mb-5">Dashboard</h1>
      <hr />
      <div className="mt-5 flex flex-col gap-5">
        {!isLoading ? (
          <div className="flex flex-col sm:flex-row gap-5">
            {authenticatedUser?.role === 'admin' && (
            <div className="card shadow text-white bg-blue-500 flex-1">
              <h1 className="font-semibold sm:text-4xl text-center mb-3">
                {data?.numberOfUsers ?? 0}
              </h1>
              <p className="text-center sm:text-lg font-semibold"><FormattedMessage id="users" /></p>
            </div>
          )}
            <div className="card shadow text-white bg-indigo-500 flex-1">
              <h1 className="font-semibold sm:text-4xl mb-3 text-center">
                {data?.numberOfCourses ?? 0}
              </h1>
              <p className="text-center sm:text-lg font-semibold"><FormattedMessage id="courses" /></p>
            </div>
            <div className="card shadow text-white bg-green-500 flex-1">
              <h1 className="font-semibold sm:text-4xl mb-3 text-center">
                {data?.numberOfContents ?? 0}
              </h1>
              <p className="text-center sm:text-lg font-semibold"><FormattedMessage id="contents" /></p>
            </div>
          </div>
        ) : null}

      </div>
    </Layout>
  );
}

