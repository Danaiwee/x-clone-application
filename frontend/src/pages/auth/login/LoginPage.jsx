import { useState } from "react"

import XSvg from "../../../components/svg/X";

import { MdOutlineMail } from "react-icons/md";
import { MdPassword } from "react-icons/md";
import { Link } from "react-router-dom";

const LoginPage = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });

  const handleInputChange = (e) => {
    const {name, value} = e.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log(formData);
  };

  const isError = false;
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
              Log in
            </button>
              {isError && (
                <p className='text-red-500'>Something went wrong</p>
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