import { useState } from "react"

import XSvg from "../../../components/svg/X";

import { MdOutlineMail } from "react-icons/md";
import { MdPassword } from "react-icons/md";
import { Link } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

const LoginPage = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });

  const queryClient = useQueryClient();

  const {mutate: loginMutation, isError, isPending, error} = useMutation({
    mutationFn: async ({username, password}) => {
      try {
        const res = await fetch("/api/auth/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({username, password})
        })

        const data = await res.json();
        if(!res.ok) throw new Error(data.error || "Failed to login");

        return data;

      } catch (error) {
        console.log("Error in login mutation", error);
        throw error;
      }
    },

    onSuccess: () => {
      toast.success("Login successfully");
      queryClient.invalidateQueries({queryKey: ["authUser"]});
    },

    onError: (error) => {
      toast.error(error.message);
    }
  })

  const handleInputChange = (e) => {
    const {name, value} = e.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    loginMutation(formData);
  };

  return (
    <div className='w-full mx-auto flex h-screen px-10 justify-center items-center'>
      <div className='flex-1 hidden lg:flex items-center justify-center'>
        <XSvg className='fill-white lg:w-2/3' />
      </div>

      <div className='flex-1 flex flex-col justify-center items-center'>
        <form
          className='flex gap-4 flex-col w-2/3 mx-auto md:mx-20 lg:w-2/3'
          onSubmit={handleSubmit}
        >
          <XSvg className='w-24 lg:hidden fill-white' />
          <h1 className='text-4xl font-extrabold rounded flex items-center gap-2'>
            {"Let's"} go
          </h1>
          <label className='input input-bordered rounded flex items-center gap-2'>
            <MdOutlineMail />
            <input 
              type='text'
              className='grow'
              placeholder='Username'
              name='username'
              value={formData.username}
              onChange={handleInputChange}
            />

            </label>
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
              {isPending ? "Loging in..." : "Log in"}
            </button>
              {isError && (
                <p className='text-red-500'>{error.message}</p>
              )}
        </form>

        <div className='flex flex-col gap-2 mt-4'>
          <p className='text-white text-lg'>{"Don't have an account ?"}</p>
          <Link to='/signup'>
              <button className='btn rounded-full btn-primary text-white btn-outline w-full'>
                Sign Up
              </button>
          </Link>
        </div>  
      </div>
    </div>
  )
}

export default LoginPage