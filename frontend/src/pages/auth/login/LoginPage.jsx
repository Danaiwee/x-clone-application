import { useState } from "react";
import { MdOutlineMail, MdPassword } from "react-icons/md";
import { Link } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import XSvg from "../../../components/svg/X";
import InputField from "../../../components/common/InputField";
import ButtonInput from "../../../components/common/ButtonInput";

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const queryClient = useQueryClient();

  const { mutate: loginMutation, isPending } = useMutation({
    mutationFn: async ({ email, password }) => {
      try {
        const res = await fetch("/api/auth/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to login");

        return data;
      } catch (error) {
        console.log("Error in login mutation", error);
        throw error;
      }
    },

    onSuccess: () => {
      toast.success("Login successfully");
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

    loginMutation(formData);
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
            Let&apos;s go
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
            icon={MdPassword}
            name='password'
            id='password'
            type='password'
            value={formData.password}
            onChange={handleInputChange}
            placeholder='●●●●●●●●'
          />

          <ButtonInput type='submit' text='Sign in' isLoading={isPending} />
        </form>

        <div className='w-full flex items-center justify-center gap-1 mt-3'>
          <p className='text-gray-500 text-sm font-semibold'>
            Don&apos;t have an account?{" "}
          </p>
          <Link to='/signup' className='text-sm text-primary font-semibold'>
            Sign up
          </Link>
        </div>
      </div>
    </main>
  );
};

export default LoginPage;
