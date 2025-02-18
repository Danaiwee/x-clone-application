import { useState } from "react"

import XSvg from '../../../components/svg/X';

import {MdOutlineMail} from 'react-icons/md';
import {FaUser} from 'react-icons/fa';
import { MdPassword } from "react-icons/md";
import { MdDriveFileMoveOutline } from "react-icons/md";
import { Link } from "react-router-dom";
import {useMutation, useQueryClient} from '@tanstack/react-query';
import toast from 'react-hot-toast';


const SignUpPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    fullName: '',
    password: '',
  });

  const queryClient = useQueryClient();

  const {mutate: signupMutation, isError, isPending, error} = useMutation({
    mutationFn: async ({email, username, fullName, password}) => {
      try {
        const res = await fetch("/api/auth/signup" , {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({email, username, fullName, password})
        })
        
        const data = await res.json();
        if(!res.ok) throw new Error(data.error || "Failed to create account");
        console.log(data)

        return data;
      } catch (error) {
        console.log(error);
        throw error
      }
    },

    onSuccess: () => {
      toast.success("Created account successfully");
      setFormData({
        email: '',
        username: '',
        fullName: '',
        password: ''
      });

      queryClient.invalidateQueries({queryKey: ["authUser"]});
    },

    onError: (error) => {
      toast.error(error.message);
    }
  });

  const handleInputChange = (e) => {
    const {name, value} = e.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }))
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    signupMutation(formData);
  };

  return (
    <div className='max-w-screen-xl mx-auto flex h-screen px-10'>
      <div className='flex-1 hidden lg:flex items-center justify-center'>
        <XSvg className='lg:w-2/3 fill-white' />
      </div>

      <div className='flex-1 flex flex-col justify-center items-center'>
        <form 
          className='lg:w-2/3 mx-auto md:mx-20 flex gap-4 flex-col'
          onSubmit={handleSubmit}
        >
          <XSvg className='w-24 lg:hidden fill-white' />
          <h1 className='text-4xl font-extrabold text-white'>Join Today.</h1>
          <label
            className='input input-bordered rounded flex items-center gap-2'
          >
            <MdOutlineMail />
            <input 
              type='email'
              className='grow'
              placeholder='Email'
              name='email'
              onChange={handleInputChange}
              value={formData.email}
            />
          </label>

          <div className='flex gap-4 flex-wrap'>
            <label className='input input-bordered rounded flex items-center gap-2 flex-1'>
              <FaUser />
              <input 
                type='text'
                className='grow'
                placeholder="Username"
                name='username'
                value={formData.username}
                onChange={handleInputChange}
              />
            </label>
            <label className='input input-bordered rounded flex items-center gap-2 flex-1'>
              <MdDriveFileMoveOutline />
              <input 
                type='text'
                className='grow'
                placeholder='Full Name'
                name='fullName'
                value={formData.fullName}
                onChange={handleInputChange}
              />
            </label>
          </div>

          <label className='input input-bordered rounded flex items-center gap-2'>
            <MdPassword />
            <input 
              type='password'
              className='grow'
              placeholder="Password"
              name='password'
              value={formData.password}
              onChange={handleInputChange}
            />
          </label>

          <button className='btn rounded-full btn-primary text-white'>
            {isPending ? "Signing up..." : "Sign up"}
          </button>
          {isError && (
            <p className='text-red-500'>{error.message}</p>
          )}
        </form>

        <div className='flex flex-col lg:w-2/3 gap-2 mt-4'>
          <p className='text-white text-lg text-center'>
            Already have an account?
          </p>
          <Link to='/login'>
            <button className='btn rounded-full btn-primary text-white btn-outline w-full'>
              Sign in
            </button>          
          </Link>
        </div>
      </div>
    </div>
  )
}

export default SignUpPage