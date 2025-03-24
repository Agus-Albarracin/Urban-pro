import { useQuery } from '@tanstack/react-query';
import Layout from '../components/layout';
import CourseService from '../services/CourseService';
import Course from '../models/course/Course';
import { useNavigate } from 'react-router-dom';
import { Video, Award, MapPin } from 'react-feather';
import logo from '../assets/urbano-logo.png';
import { FormattedMessage } from 'react-intl';


const getCourses = async (): Promise<Course[]> => {
  const allCourses = await CourseService.findAll({});
  return allCourses
    .sort((a, b) => new Date(b.dateCreated).getTime() - new Date(a.dateCreated).getTime())
    .slice(0, 2);
};

export default function HomeUser() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['courses'],
    queryFn: getCourses,
  });
  const history = useNavigate();

  const handleCourseClick = (courseId: string) => {
    history(`/courses/${courseId}`);
  };

  return (
    <Layout>
      <h1 className="font-semibold text-3xl md:text-4xl mb-5 text-center"><FormattedMessage id='exploreAndLearn' /></h1>
      <h2 className="text-lg md:text-xl text-gray-700 text-center mb-8"><FormattedMessage id='latestNews' /></h2>
      <hr />

      {/* Cursos */}
      <div className="mt-5 flex flex-col gap-8 px-4 md:px-0">
        {isLoading ? (
          <p className="text-center text-lg"><FormattedMessage id='LoadingCourses' /></p>
        ) : isError ? (
          <p className="text-center text-red-500"><FormattedMessage id='LoadingError' /></p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {data?.map((course) => (
              <div key={course.id} className="shadow-lg rounded-lg overflow-hidden bg-white">
                <img
                  src={course.filePath}
                  alt={course.name}
                  className="w-full h-48 md:h-60 object-cover"
                />
                <div className="p-5">
                  <h2 className="text-xl md:text-2xl font-semibold">{course.name}</h2>
                  <p className="text-gray-600 mt-2 text-sm md:text-base">{course.description}</p>
                  <div className="mt-4 text-right">
                    <button
                      className="btn bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                      onClick={() => handleCourseClick(course.id)}
                    >
                      <FormattedMessage id='viewDetails' />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Sección de características */}
      <div className="mt-16 text-center px-4 md:px-0">
        <h2 className="text-2xl font-semibold mb-6"><FormattedMessage id='WhyUs' /></h2>
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-20 justify-center">
          <div className="flex flex-col items-center">
            <Video width={40} height={40} className="text-red-600" />
            <p className="mt-2 text-gray-700 text-sm md:text-base"><FormattedMessage id='liveClass' /></p>
          </div>
          <div className="flex flex-col items-center">
            <Award width={40} height={40} className="text-red-600" />
            <p className="mt-2 text-gray-700 text-sm md:text-base"><FormattedMessage id='digitalCertificates' /></p>
          </div>
          <div className="flex flex-col items-center">
            <MapPin width={40} height={40} className="text-red-600" />
            <p className="mt-2 text-gray-700 text-sm md:text-base"><FormattedMessage id='locations' /></p>
          </div>
        </div>
      </div>

      {/* Logo y descripción */}
      <div className="mt-20 text-center px-4 md:px-0">
        <img src={logo} alt="Urbano Logo" className="mx-auto w-32 md:w-40 h-auto" />
        <h2 className="text-2xl font-semibold mt-4"><FormattedMessage id='ourCompany' /></h2>
        <p className="mt-2 text-gray-600 max-w-md md:max-w-lg mx-auto text-sm md:text-base">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin ac nunc id neque fermentum 
          viverra nec id mauris. Fusce euismod augue vel libero blandit cursus.
        </p>
      </div>
    </Layout>
  );
}