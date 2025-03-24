import { useState } from 'react';
import { Loader, Plus, X, RefreshCw } from 'react-feather';
import { useForm } from 'react-hook-form';
import { useQuery } from '@tanstack/react-query';

import { useParams } from 'react-router';

import ContentsTable from '../components/content/ContentsTable';
import Layout from '../components/layout';
import Modal from '../components/shared/Modal';
import useAuth from '../hooks/useAuth';
import CreateContentRequest from '../models/content/CreateContentRequest';
import contentService from '../services/ContentService';
import courseService from '../services/CourseService';

export default function Course() {
  const { id } = useParams<{ id?: string }>();
  const { authenticatedUser } = useAuth();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [profesional, setProfesional] = useState('');
  const [addContentShow, setAddContentShow] = useState<boolean>(false);
  const [error, setError] = useState<string>();

  const userQuery = useQuery({
    queryKey: ['user', id],
    queryFn: async () => {
      if (!id) {
        throw new Error("El ID del curso no está definido."); 
      }
      return courseService.findOne(id);
    },
    enabled: !!id, 
  });

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
    reset,
  } = useForm<CreateContentRequest>();


  const { data, isLoading, refetch } = useQuery({
    queryKey: id ? [`contents-${id}`, name, description, profesional] : [`contents-empty`], 
    queryFn: async () => {
      if (!id) {
        return [];
      }
      return contentService.findAll(id, {
        name: name || undefined,
        description: description || undefined,
        profesional: profesional || undefined,
      });
    },
    enabled: !!id, // Solo ejecuta la consulta si id es válido
    refetchInterval: false, 
  });
  

  interface AxiosErrorResponse {
    response?: {
      data?: {
        message?: string;
      };
    };
  }
  
  const saveCourse = async (createContentRequest: CreateContentRequest) => {
    if (!id) {
      setError("El ID del curso no está definido.");
      return;
    }
  
    try {
      await contentService.save(id, createContentRequest);
      setAddContentShow(false);
      reset();
      setError(undefined);
    } catch (error: unknown) {
      if (isAxiosError(error)) {
        setError(error.response?.data?.message || "Error al guardar el contenido.");
      } else {
        setError("Ocurrió un error desconocido.");
      }
    }
  };
  
  //Vaerifica si el error es un error de tipo Axios
  function isAxiosError(error: unknown): error is AxiosErrorResponse {
    return (error as AxiosErrorResponse).response !== undefined;
  }
  

  return (
    <Layout>
    <h1 className="font-semibold text-3xl mb-5">
        {userQuery.isLoading ? 'Loading...' : `${userQuery.data?.name} Contents`}
      </h1>
      <hr />
      {authenticatedUser && authenticatedUser.role !== 'user' ? (
        <>
          <div className="flex items-center justify-between w-full">
            <button
              className="btn my-5 flex gap-2 sm:w-auto justify-center"
              onClick={() => setAddContentShow(true)}
              title="Click to Add new content"
            >
              <Plus /> Add Content
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
            placeholder="Filter name content"
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
          <input
            type="text"
            className="input w-1/2"
            placeholder="Filter profesional"
            value={profesional}
            onChange={(e) => setProfesional(e.target.value)}
          />
        </div>
      </div>

      <ContentsTable data={data ?? []} isLoading={isLoading} courseId={id} />

      {/* Add User Modal */}
      <Modal show={addContentShow}>
        <div className="flex">
          <h1 className="font-semibold mb-3">Add Content</h1>
          <button
            className="ml-auto focus:outline-none"
            onClick={() => {
              reset();
              setAddContentShow(false);
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
          <input
            type="text"
            className="input"
            placeholder="Profesional"
            disabled={isSubmitting}
            required
            {...register('profesional')}
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
