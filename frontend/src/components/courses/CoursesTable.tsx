import { useState, useContext } from 'react';
import { AlertTriangle, Loader, X, Trash, Edit, ChevronLeft, ChevronRight } from 'react-feather';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';

import useAuth from '../../hooks/useAuth';
import Course from '../../models/course/Course';
import UpdateCourseRequest from '../../models/course/UpdateCourseRequest';
import courseService from '../../services/CourseService';
import Modal from '../shared/Modal';
import Table from '../shared/Table';
import TableItem from '../shared/TableItem';
import LanguageContext from "../../locales/i18n";
import { FormattedMessage } from 'react-intl';
import { toast } from 'react-toastify'; 



interface UsersTableProps {
  data: Course[];
  isLoading: boolean;
}

export default function CoursesTable({ data, isLoading }: UsersTableProps) {
  const { authenticatedUser } = useAuth();
  const [deleteShow, setDeleteShow] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [selectedCourseId, setSelectedCourseId] = useState<string | undefined>();
  const [error, setError] = useState<string | undefined>();
  const [updateShow, setUpdateShow] = useState<boolean>(false);
  

  const context = useContext(LanguageContext);
  const { locale } = context || { locale: "en" };
  const getColumns = (locale: string) => {
    const columnsEn = ['Img', 'Name', 'Description', 'Start', 'Mode'];
    const columnsEs = ['Imagen', 'Nombre', 'Descripción', 'Inicia', 'Modalidad'];
    return locale === "es" ? columnsEs : columnsEn;
  };
  const columns = getColumns(locale);

  const getUpdates = (locale: string) => {
    const updatesEn = {
      name: 'Name',
      description: 'Description',
      page: 'page',
      of: 'of'
    };
  
    const updatesEs = {
      name: 'Nombre',
      description: 'Descripción',
      page: 'página',
      of: 'de'
    };
  
    return locale === "es" ? updatesEs : updatesEn;
  };
  const updates = getUpdates(locale);


  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
    reset,
    setValue,
  } = useForm<UpdateCourseRequest>();

  const handleDelete = async () => {
    if (!selectedCourseId) {
      setError("Course ID is required.");
      toast.error("Error, try again")
      return;
    }

    try {
      setIsDeleting(true);
      await courseService.delete(selectedCourseId);

      toast.success('Course deleted successfully');
      setDeleteShow(false);
    } catch (error: any) {
      
      setError(error?.response?.data?.message || "An unexpected error occurred");
      toast.error(`Error: ${error?.response?.data?.message}`)
    } finally {
      setIsDeleting(false);
    }
  };

  const handleUpdate = async (updateCourseRequest: UpdateCourseRequest) => {
    if (!selectedCourseId) {
      setError("Course ID is required.");
      return;
    }
  
    const formData = new FormData();
  
    if (updateCourseRequest.name) formData.append("name", updateCourseRequest.name);
    if (updateCourseRequest.description) formData.append("description", updateCourseRequest.description);
    if (updateCourseRequest.type) formData.append("type", updateCourseRequest.type);
  
    
    if (updateCourseRequest.file && updateCourseRequest.file[0]) {
      formData.append('file', updateCourseRequest.file[0]);  
    }
  
    try {
     
      await courseService.update(selectedCourseId, formData);
      setUpdateShow(false);
      reset();
      setError(undefined);
    } catch (error: any) {
      setError(error?.response?.data?.message || "An unexpected error occurred");
    }
  };
  
  

  // Paginación
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 3;
  const totalPages = Math.ceil(data.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = currentPage * itemsPerPage;
  const currentCourses = data.slice(startIndex, endIndex);

  const goToPage = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  return (
    <>
      <div className="table-container">
        <Table columns={columns}>
          {isLoading
            ? null
            : currentCourses.map(({ id, name, description, startDate, type, filePath }) => 
            { console.log(`Curso: ${name}, file:`, filePath); 
              return( 
                <tr key={id}>
                  <TableItem>
                  {filePath && <img src={filePath} alt={name} width="50" />}
                  </TableItem>
                  <TableItem>
                    <Link to={`/courses/${id}`}>{name}</Link>
                  </TableItem>
                  <TableItem>{description}</TableItem>
                  <TableItem>{startDate ? new Date(startDate).toLocaleDateString('es-ES') : ''}</TableItem>
                  <TableItem>{type}</TableItem>
                  <TableItem className="text-right">
                      {authenticatedUser?.role && ['admin', 'editor'].includes(authenticatedUser?.role) ? (
                      <button
                        className="text-indigo-600 hover:text-indigo-900 focus:outline-none"
                        onClick={() => {
                          setSelectedCourseId(id);

                          setValue('name', name);
                          setValue('description', description);

                          setUpdateShow(true);
                        }}
                      >
                        <Edit />
                      </button>
                    ): null}
                    {authenticatedUser?.role === 'admin' ? (
                      <button
                        className="text-red-600 hover:text-red-900 ml-3 focus:outline-none"
                        onClick={() => {
                          setSelectedCourseId(id);
                          setDeleteShow(true);
                        }}
                      >
                      <Trash />
                      </button>
                    ) : null}

                    {/* {authenticatedUser?.role === 'user' ? (
                        <button
                          className="bg-green-600 text-white px-3 py-1 rounded-lg hover:bg-green-700 ml-3"
                          onClick={() => handleEnroll(id)}
                        >
                          Inscribirse
                        </button>
                    ) : null} */}

                  </TableItem>
                </tr>
              )}
              )}
        </Table>
        {!isLoading && data.length < 1 ? (
          <div className="text-center my-5 text-gray-500">
            <h1><FormattedMessage id='empty' /></h1>
          </div>
        ) : null}
      </div>

       {/* Paginación */}
       <div className="flex justify-center gap-2 my-4">
          <button
            onClick={() => goToPage(currentPage - 1)}
            className="p-1 border rounded-lg text-white bg-red-700 hover:bg-red-400 flex items-center gap-2"
            disabled={currentPage === 1}
          >
            <ChevronLeft />
          </button>
          <span className="flex items-center">{`${updates.page} ${currentPage} ${updates.of} ${totalPages}`}</span>
          <button
            onClick={() => goToPage(currentPage + 1)}
            className="p-1 border rounded-lg text-white bg-red-700 hover:bg-red-400 flex items-center gap-2"
            disabled={currentPage === totalPages}
          >
            <ChevronRight />
          </button>
        </div>

        {!isLoading && data.length < 1 ? (
          <div className="text-center my-5 text-gray-500">
            <h1><FormattedMessage id='empty' /></h1>
          </div>
        ) : null}
      
      {/* Delete Course Modal */}
      <Modal show={deleteShow}>
        <AlertTriangle width={24} height={24} className="text-red-500 mr-5 fixed" />
        <div className="ml-10">
          <h3 className="mb-2 font-semibold"><FormattedMessage id='deleteCourses' /></h3>
          <hr />
          <p className="mt-2">
            <FormattedMessage id="removedPermanently" />
            <br />
            <FormattedMessage id="ThisActionCannotBeUndone" />
          </p>
        </div>
        <div className="flex flex-row gap-3 justify-end mt-5">
          <button
            className="btn"
            onClick={() => {
              setError(undefined);
              setDeleteShow(false);
            }}
            disabled={isDeleting}
          >
            <FormattedMessage id="cancel" />
            
          </button>
          <button
            className="btn danger"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? (
              <Loader className="mx-auto animate-spin" />
            ) : (
            <FormattedMessage id="delete" />
            )}
          </button>
        </div>
        {error ? (
          <div className="text-red-500 p-3 font-semibold border rounded-md bg-red-50">
            {error}
          </div>
        ) : null}
      </Modal>

      {/* Update Course Modal */}
      <Modal show={updateShow}>
        <div className="flex">
          <h1 className="font-semibold mb-3"><FormattedMessage id="updateCourses" /></h1>
          <button
            className="ml-auto focus:outline-none"
            onClick={() => {
              setUpdateShow(false);
              setError(undefined);
              reset();
            }}
          >
            <X width={24} height={24} />
          </button>
        </div>
        <hr />

        <form
          className="flex flex-col gap-5 mt-5"
          onSubmit={handleSubmit(handleUpdate)}
          encType="multipart/form-data"
        >
          <input
            type="text"
            className="input border"
            placeholder={updates.name}
            required
            {...register('name')}
          />
          <input
            type="text"
            className="input border"
            placeholder={updates.description}
            required
            disabled={isSubmitting}
            {...register('description')}
          />
          <select
            className="input border"
            disabled={isSubmitting}
            required
            {...register('type')}
          >
            <option value=""><FormattedMessage id="selectMode" /></option>
            <option value="Presencial"><FormattedMessage id="presential" /></option>
            <option value="Virtual">Virtual</option>
          </select>

          <input
             type="file"
             className="input border"
             {...register('file')}
             disabled={isSubmitting}
           />

          <button className="btn" disabled={isSubmitting}>
            {isSubmitting ? (
              <Loader className="animate-spin mx-auto" />
            ) : (
              <FormattedMessage id='save' />
            )}
          </button>
          {error ? (
            <div className="text-red-500 p-3 font-semibold border rounded-md bg-red-50">
              {error}
            </div>
          ) : null}
        </form>
      </Modal>
    </>
  );
}
