import { useState } from 'react';
import { Loader, Plus, RefreshCw, X} from 'react-feather';
import { useForm } from 'react-hook-form';
import { useQuery } from '@tanstack/react-query';
import Calendar from 'react-calendar';


import CoursesTable from '../components/courses/CoursesTable';
import Layout from '../components/layout';
import Modal from '../components/shared/Modal';
import useAuth from '../hooks/useAuth';
import CreateCourseRequest from '../models/course/CreateCourseRequest';
import courseService from '../services/CourseService';

export default function Courses() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState('')
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [sortOrder, setSortOrder] = useState('desc');

  const [addCourseShow, setAddCourseShow] = useState<boolean>(false);
  const [error, setError] = useState<string>();
  const [file, setFile] = useState<File | null>(null);

  const { authenticatedUser } = useAuth();
  const { data, isLoading, refetch } = useQuery({
    queryKey: ['courses', name, description, type],
    queryFn: () =>
      courseService.findAll({
        name: name || undefined,
        description: description || undefined,
        type: type || undefined,
      }),
    refetchInterval: false, 
  });

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
    reset,
  } = useForm<CreateCourseRequest>();

  const sortedCourses = data?.sort((a, b) => {
    const dateA = new Date(a.startDate);
    const dateB = new Date(b.startDate);
    if (sortOrder === 'desc') {
      return dateB.getTime() - dateA.getTime(); // De mayor a menor (descendente)
    } else {
      return dateA.getTime() - dateB.getTime(); // De menor a mayor (ascendente)
    }
  }) ?? [];

    const saveCourse = async (createCourseRequest: CreateCourseRequest) => {
      try {
        const formData = new FormData();
        formData.append('name', createCourseRequest.name);
        formData.append('description', createCourseRequest.description);
        formData.append('type', createCourseRequest.type);

        if (selectedDate) {
          formData.append('startDate', selectedDate.toISOString());
        } else {
          setError('No start date selected');
          return;
        }

        if (file) {
          formData.append('file', file);
        } else {
          setError('No file selected');
          return;
        }

            // Ver los valores dentro de FormData
    formData.forEach((value, key) => {
      console.log(key, value);
    });

        await courseService.save(formData);
        reset();
        setError(undefined);

      } catch (error) {
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError('An unknown error occurred');
        }
      }
    };
    
  return (
    <Layout>
      <h1 className="font-semibold text-3xl mb-5">Manage Courses</h1>
      <hr />
      {authenticatedUser?.role !== 'user' ? (
        <>
          <div className="flex items-center justify-between w-full">
            <button
              className="btn my-5 flex gap-2 sm:w-auto justify-center"
              onClick={() => setAddCourseShow(true)}
            >
              <Plus /> Add Course
            </button>
            <button
              onClick={() => refetch()}
              title="Click to refresh"
              className="p-3 border rounded-lg text-white bg-red-700 hover:bg-red-400 flex items-center gap-2"
            >
              <RefreshCw />
            </button>
          </div>
        </>
      ) : null}



      <div className="table-filter bg-gray-200">
        <div className="flex flex-row gap-5">
          <input
            type="text"
            className="input w-1/2"
            placeholder="Filter name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type="text"
            className="input w-1/2"
            placeholder="Filter description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <select
      className="input w-1/3"
      value={type}
      onChange={(e) => setType(e.target.value)}
    >
      <option value="">All</option>
      <option value="Presencial">Presencial</option>
      <option value="Virtual">Virtual</option>
    </select>

    <select
      className="input w-1/3"
      value={sortOrder}
      onChange={(e) => setSortOrder(e.target.value)}
    >
      <option value="desc">Fechas lejanas</option>
      <option value="asc">Próximos eventos</option>
    </select>
  </div>

      <CoursesTable data={sortedCourses ?? []} isLoading={isLoading}/>

      {/* Add User Modal */}
      <Modal show={addCourseShow}>
        <div className="flex">
          <h1 className="font-semibold mb-3">Add Course</h1>
          <button
            className="ml-auto focus:outline-none"
            onClick={() => {
              reset();
              setAddCourseShow(false);
            }}
          >
            <X width={24} height={24} />
          </button>
        </div>
        <hr />

        <form
          className="flex flex-col gap-5 mt-5"
          onSubmit={handleSubmit(saveCourse)}
        >
          <input
            type="text"
            className="input"
            placeholder="Name"
            disabled={isSubmitting}
            required
            {...register('name')}
          />
          <input
            type="text"
            className="input"
            placeholder="Description"
            disabled={isSubmitting}
            required
            {...register('description')}
          />
          <select
            className="input"
            disabled={isSubmitting}
            required
            {...register('type')}
          >
            <option value="">Selecciona modalidad</option>
            <option value="Presencial">Presencial</option>
            <option value="Virtual">Virtual</option>
          </select>

          <div className="mt-5">
          <label htmlFor="startDate" className="font-semibold text-gray-800">
            Start Date
          </label>
          <Calendar
            onChange={(date) => setSelectedDate(date as Date)} // Actualiza el estado con la fecha seleccionada
            value={selectedDate}
            className="w-full shadow-lg p-4 rounded-lg border border-gray-300"
          />
        </div>

          <input
            type="file"
            className="input"
            disabled={isSubmitting}
            onChange={(e) => setFile(e.target.files?.[0] || null)}
          />
          <button className="btn" disabled={isSubmitting}>
            {isSubmitting ? (
              <Loader className="animate-spin mx-auto" />
            ) : (
              'Save'
            )}
          </button>
          {error ? (
            <div className="text-red-500 p-3 font-semibold border rounded-md bg-red-50">
              {error}
            </div>
          ) : null}
        </form>
      </Modal>
    </Layout>
  );
}
