import { useState } from "react";
import { MdOutlineMail } from "react-icons/md";
import { FaUser } from "react-icons/fa";
import { MdPassword } from "react-icons/md";
import { MdDriveFileMoveOutline } from "react-icons/md";
import { Link } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import XSvg from "../../../components/svg/X";
import InputField from "../../../components/common/InputField";
import ButtonInput from "../../../components/common/ButtonInput";

const SignUpPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    fullName: "",
    password: "",
  });

  const queryClient = useQueryClient();

  const { mutate: signupMutation, isPending } = useMutation({
    mutationFn: async ({ email, username, fullName, password }) => {
      try {
        const res = await fetch("/api/auth/signup", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, username, fullName, password }),
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to create account");
        console.log(data);

        return data;
      } catch (error) {
        console.log(error);
        throw error;
      }
    },

    onSuccess: () => {
      toast.success("Created account successfully");
      setFormData({
        email: "",
        username: "",
        fullName: "",
        password: "",
      });

      queryClient.invalidateQueries({ queryKey: ["authUser"] });
    },

    onError: (error) => {
      toast.error(error.message);
    },
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();

    signupMutation(formData);
  };

  return (
    <main className='max-w-screen mx-auto flex h-screen px-10 gap-5'>
      <div className='flex-1 hidden lg:flex items-center justify-center px-4'>
        <XSvg className='w-full fill-white' />
      </div>

      <div className='flex-1 flex flex-col justify-center items-center px-4'>
        <form
          className='w-full mx-auto md:mx-20 flex gap-4 flex-col'
          onSubmit={handleFormSubmit}
        >
          <XSvg className='w-24 lg:hidden fill-white' />
          <h1 className='text-4xl font-extrabold text-white mb-5'>
            Join Today
          </h1>

          <InputField
            icon={MdOutlineMail}
            name='email'
            id='email'
            type='email'
            value={formData.email}
            onChange={handleInputChange}
            placeholder='john@email.com'
          />

          <InputField
            icon={FaUser}
            name='username'
            id='username'
            value={formData.username}
            onChange={handleInputChange}
            placeholder='johndoe'
          />

          <InputField
            icon={MdDriveFileMoveOutline}
            name='fullName'
            id='fullName'
            value={formData.fullName}
            onChange={handleInputChange}
            placeholder='John Doe'
          />

          <InputField
            icon={MdPassword}
            name='password'
            id='password'
            type='password'
            value={formData.password}
            onChange={handleInputChange}
            placeholder='●●●●●●●●'
          />

          <ButtonInput type='submit' text='Sign up' isLoading={isPending} />
        </form>

        <div className='w-full flex items-center justify-center gap-1 mt-3'>
          <p className='text-gray-500 text-sm font-semibold'>
            Already have an account?{" "}
          </p>
          <Link to='/login' className='text-sm text-primary font-semibold'>
            Sign in
          </Link>
        </div>
      </div>
    </main>
  );
};

export default SignUpPage;
