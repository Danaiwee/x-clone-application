import XSvg from "../svg/X";
import toast from "react-hot-toast";

import { MdHomeFilled } from "react-icons/md";
import { IoNotifications } from "react-icons/io5";
import { FaUser } from "react-icons/fa";
import { Link } from "react-router-dom";
import { BiLogOut } from "react-icons/bi";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const Sidebar = () => {
  const queryClient = useQueryClient();

  const { mutate: logoutMutation } = useMutation({
    mutationFn: async () => {
      try {
        const res = await fetch("/api/auth/logout", {
          method: "POST",
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed in loging out");

        return data;
      } catch (error) {
        console.log("Error in logout mutation", error.message);
        throw error;
      }
    },

    onSuccess: () => {
      toast.success("Logout successfully");
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
    },

    onError: (error) => {
      toast.error(error.message);
    },
  });

  const { data: authUser } = useQuery({ queryKey: ["authUser"] });

  const handleLogout = (e) => {
    e.preventDefault();
    logoutMutation();
  };

  return (
    <div className='md:flex-[2_2_0] w-18 max-w-52'>
      <div className='sticky top-0 left-0 h-screen flex flex-col border-r border-gray-700 w-20 md:w-full'>
        <Link to='/' className='flex justify-center md:justify-start'>
          <XSvg className='px-2 w-12 h-12 rounded-full fill-white' />
        </Link>

        <ul className='flex flex-col gap-4 mt-4 items-center md:items-start'>
          <li className='w-full flex justify-center md:justify-start'>
            <Link
              to='/'
              className='w-full flex gap-3 items-center hover:bg-stone-900 transition-all rounded-md duration-300 py-2 pl-2 pr-4  cursor-pointer'
            >
              <MdHomeFilled className='w-8 h-8' />
              <span className='text-lg hidden md:block'>Home</span>
            </Link>
          </li>

          <li className='w-full flex justify-center md:justify-start'>
            <Link
              to='/notifications'
              className='w-full flex gap-3 items-center hover:bg-stone-900 transition-all rounded-md duration-300 py-2 pl-2 pr-4 cursor-pointer'
            >
              <IoNotifications className='size-8' />
              <span className='text-lg hidden md:block'>Notifications</span>
            </Link>
          </li>

          <li className='w-full flex justify-center md:justify-start'>
            <Link
              to={`/profile/${authUser?.username}`}
              className='w-full flex gap-3 items-center hover:bg-stone-900 transition-all duration-300 rounded-md py-2 pl-2 pr-4 cursor-pointer'
            >
              <FaUser className='size-8' />
              <span className='text-lg hidden md:block'>Profile</span>
            </Link>
          </li>
        </ul>

        {authUser && (
          <Link
            to={`/profile/${authUser?.username}`}
            className='mt-auto mb-10 flex gap-2 items-start transition-all duration-300 py-2 px-4 rounded-md'
          >
            <div className='avatar hidden md:inline-flex'>
              <div className='w-8 rounded-full'>
                <img src={authUser?.profileImg || "/avatar-placeholder.png"} />
              </div>
            </div>

            <div className='flex justify-center md:justify-between flex-1'>
              <div className='hidden md:block'>
                <p className='text-white font-bold text-sm w-20 truncate'>
                  {authUser?.fullName}
                </p>
                <p className='text-slate-500 text-sm'>@{authUser?.username}</p>
              </div>
              <BiLogOut
                className='size-5 cursor-pointe'
                onClick={handleLogout}
              />
            </div>
          </Link>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
