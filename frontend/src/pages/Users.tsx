import { useState } from 'react';
import { Loader, Plus, X, RefreshCw } from 'react-feather';
import { useForm } from 'react-hook-form';
import { useQuery } from '@tanstack/react-query';

import Layout from '../components/layout';
import Modal from '../components/shared/Modal';
import UsersTable from '../components/users/UsersTable';
import useAuth from '../hooks/useAuth';
import CreateUserRequest from '../models/user/CreateUserRequest';
import userService from '../services/UserService';

const Users: React.FC = () => {
  const { authenticatedUser } = useAuth();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');

  const [addUserShow, setAddUserShow] = useState<boolean>(false);
  const [error, setError] = useState<string>();

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['users', firstName, lastName, username, role],
    queryFn: async () => {
      const response = await userService.findAll({
        firstName: firstName || '',
        lastName: lastName || '',
        email: email || '',
        username: username || '',
        role: role || '',
      });

      return response.filter((user) => user.id !== authenticatedUser?.id);
    },
    refetchInterval: false,
    enabled: !!(firstName || lastName || username || role),
  });

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
    reset,
  } = useForm<CreateUserRequest>();

  const saveUser = async (createUserRequest: CreateUserRequest) => {
    try {
      await userService.save(createUserRequest);
      setAddUserShow(false);
      setError(undefined);
      reset();
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('An unknown error occurred');
      }
    }
  };

  return (
    <Layout>
      <h1 className="font-semibold text-3xl mb-5">Manage Users</h1>
      <hr />
      <div className="flex items-center justify-between w-full">
        <button
          className="btn my-5 flex gap-2 sm:w-auto justify-center"
          onClick={() => setAddUserShow(true)}
        >
          <Plus /> Add User
        </button>
        <button
          onClick={() => refetch()}
          title="Click to refresh"
          className="p-3 border rounded-lg text-white bg-red-700 hover:bg-red-400 flex items-center gap-2"
        >
          <RefreshCw />
        </button>
      </div>

      <div className="table-filter mt-2 bg-gray-200">
        <div className="flex flex-row gap-5">
          <input
            type="text"
            className="input w-1/2"
            placeholder="Filter name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
          <input
            type="text"
            className="input w-1/2"
            placeholder="Filter last name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
        </div>
        <div className="flex flex-row gap-5">
          <input
            type="text"
            className="input w-1/2"
            placeholder="Filter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="text"
            className="input w-1/2"
            placeholder="Filter user"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <select
            name=""
            id=""
            className="input w-1/2"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="">Please select role</option>
            <option value="user">User</option>
            <option value="editor">Editor</option>
            <option value="admin">Admin</option>
          </select>
        </div>
      </div>

      <UsersTable data={data ?? []} isLoading={isLoading} />

      {/* Add User Modal */}
      <Modal show={addUserShow}>
        <div className="flex">
          <h1 className="font-semibold mb-3">Add User</h1>
          <button
            className="ml-auto focus:outline-none"
            onClick={() => {
              reset();
              setError(undefined);
              setAddUserShow(false);
            }}
          >
            <X width={24} height={24} />
          </button>
        </div>
        <hr />

        <form
          className="flex flex-col gap-5 mt-5"
          onSubmit={handleSubmit(saveUser)}
        >
          <div className="flex flex-col gap-5 sm:flex-row">
            <input
              type="text"
              className="input sm:w-1/2"
              placeholder="First Name"
              required
              disabled={isSubmitting}
              {...register('firstName')}
            />
            <input
              type="text"
              className="input sm:w-1/2"
              placeholder="Last Name"
              required
              disabled={isSubmitting}
              {...register('lastName')}
            />
          </div>
          <input
              type="text"
              className="input sm:w-1/2"
              placeholder="User name"
              required
              disabled={isSubmitting}
              {...register('username')}
            />
          <input
            type="text"
            className="input"
            required
            placeholder="E-mail"
            disabled={isSubmitting}
            {...register('email')}
          />
          <input
            type="password"
            className="input"
            required
            placeholder="Password (min 6 characters)"
            disabled={isSubmitting}
            {...register('password')}
          />
          <select
            className="input"
            required
            {...register('role')}
            disabled={isSubmitting}
          >
            <option value="user">User</option>
            <option value="editor">Editor</option>
            <option value="admin">Admin</option>
          </select>
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
};

export default Users;
