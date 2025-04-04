import { useState } from 'react';
import { Loader } from 'react-feather';
import { useForm } from 'react-hook-form';
import { useQuery } from '@tanstack/react-query';
import User from '../../models/user/User';

import useAuth from '../../hooks/useAuth';
import UpdateUserRequest from '../../models/user/UpdateUserRequest';
import userService from '../../services/UserService';
import { FormattedMessage } from 'react-intl';


export default function UpdateProfile() {
  const { authenticatedUser } = useAuth();
  if (!authenticatedUser) return null;
  const [error, setError] = useState<string>();

  const { data, isLoading, refetch } = useQuery<User>({
    queryKey: ['user', authenticatedUser.id],
    queryFn: () => userService.findOne(authenticatedUser.id),
  });

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
    setValue,
  } = useForm<UpdateUserRequest>();

  const handleUpdateUser = async (updateUserRequest: UpdateUserRequest) => {
    try {
      if (data && updateUserRequest.username === data.username) {
        delete updateUserRequest.username;
      }
      await userService.update(authenticatedUser.id, updateUserRequest);
      setError(undefined);
      setValue('password', '');
      refetch();
    } catch (error) {
      let errorMessage = "Failed to do something exceptional";
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      console.log(errorMessage);
    }
  };

  if (!isLoading) {
    return (
      <div className="card shadow">
        <form
          className="flex mt-3 flex-col gap-3 justify-center md:w-1/2 lg:w-1/3 mx-auto items-center"
          onSubmit={handleSubmit(handleUpdateUser)}
        >
          <h1 className="font-semibold text-4xl mb-10"><FormattedMessage id="welcome" /> {data?.firstName}</h1>
          <hr />
          <div className="flex gap-3 w-full">
            <div className="w-1/2">
              <label className="font-semibold"><FormattedMessage id="firstname" /> </label>
              <input
                type="text"
                className="input w-full mt-1"
                defaultValue={data?.firstName}
                disabled={isSubmitting}
                placeholder="First Name"
                {...register('firstName')}
              />
            </div>
            <div className="w-1/2">
              <label className="font-semibold"><FormattedMessage id="lastname" /> </label>
              <input
                type="text"
                className="input w-full mt-1"
                defaultValue={data?.lastName}
                disabled={isSubmitting}
                placeholder="Last Name"
                {...register('lastName')}
              />
            </div>
          </div>
          <div className="w-full">
            <label className="font-semibold"><FormattedMessage id="username" /> </label>
            <input
              type="text"
              className="input w-full mt-1"
              defaultValue={data?.username}
              disabled={isSubmitting}
              placeholder="Username"
              {...register('username')}
            />
          </div>
          <div className="w-full">
            <label className="font-semibold"><FormattedMessage id="password" /> </label>
            <input
              type="password"
              className="input w-full mt-1"
              placeholder="(min 6 characters)"
              disabled={isSubmitting}
              {...register('password')}
            />
          </div>
          <button className="btn w-full" disabled={isSubmitting}>
            {isSubmitting ? (
              <Loader className="animate-spin mx-auto" />
            ) : (
              <FormattedMessage id="update" /> 
            )}
          </button>
          {error ? (
            <div className="text-red-500 p-3 font-semibold border rounded-md bg-red-50">
              {error}
            </div>
          ) : null}
        </form>
      </div>
    );
  }

  return null;
}
