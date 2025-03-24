import { useQuery } from "@tanstack/react-query";
import Layout from "../components/layout";
import CourseService from "../services/CourseService";
import Course from "../models/course/Course";
import { useState } from "react";
import Calendar from "react-calendar";
import { useNavigate } from "react-router-dom";
import "react-calendar/dist/Calendar.css";
import './calendar.css'
import { FormattedMessage } from 'react-intl';


const getCourses = async (): Promise<Course[]> => {
  return await CourseService.findAll({});
};

export default function CalendarPage() {
  const { data } = useQuery({
    queryKey: ["courses"],
    queryFn: getCourses,
  });

  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const events = data?.reduce((acc, course) => {
    const date = new Date(course.startDate).toDateString();
    if (!acc[date]) acc[date] = [];
    acc[date].push(course);
    return acc;
  }, {} as Record<string, Course[]>);

  return (
    <Layout>
      <div className="max-w-5xl mx-auto p-6">
        <h1 className="text-4xl font-bold text-center text-gray-800">
        <FormattedMessage id="calendarOfCourses" />
        </h1>
        <p className="text-lg text-center text-gray-600 mt-2">
          Lorem ipsum lorem pisum asis ashuy
        </p>
        <hr className="my-6 border-gray-300" />

        {/* Principal */}
        <div className="flex flex-col md:flex-row gap-10 mt-10">

          {/* Calendario */}
          <div className="w-full md:w-1/2">
            <Calendar
              onChange={(date) => setSelectedDate(date as Date)}
              value={selectedDate}
              tileClassName={({ date }) =>
                events && events[date.toDateString()]
                  ? "bg-red-500 text-gray font-bold rounded-lg"
                  : ""
              }
              className="react-calendar" 
            />
          </div>

          {/* Detalles del curso seleccionado */}
          <div className="w-full md:w-1/2 mt-6 md:mt-0">
            {selectedDate ? (
              <div>
                <h2 className="text-2xl font-semibold text-gray-800">
        <FormattedMessage id="startsOn" /> {selectedDate.toDateString()}
                </h2>
                <div className="mt-5 space-y-4">
                  {events?.[selectedDate.toDateString()]?.map((course) => (
                    <div
                      key={course.id}
                      className="p-4 bg-white shadow-lg rounded-lg border-l-4 border-red-500 transition-transform transform hover:scale-105 cursor-pointer"
                      onClick={() => navigate(`/courses/${course.id}`)}
                    >
                      <h3 className="text-xl font-semibold text-gray-800">
                        {course.name}
                      </h3>
                      <p className="text-gray-600">{course.description}</p>
                    </div>
                  )) || (
                    <p className="text-gray-600 text-lg">
                      <FormattedMessage id="noHayCursos" />

                    </p>
                  )}
                </div>
              </div>
            ) : (
              <p className="text-gray-600 text-lg">
              <FormattedMessage id="seleccionaUnaFechaEn" />
              </p>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
