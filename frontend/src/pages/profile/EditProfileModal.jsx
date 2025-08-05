import { useEffect, useState } from "react";
import { IoMdClose } from "react-icons/io";
import useUpdateProfile from "../../hooks/useUpdateProfile";

const EditProfileModal = ({ authUser }) => {
  const { updateProfile, isUpdatingProfile } = useUpdateProfile();
  const [formData, setFormData] = useState({
    fullName: "",
    username: "",
    email: "",
    bio: "",
    link: "",
    newPassword: "",
    currentPassword: "",
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
    updateProfile(formData);
  };

  useEffect(() => {
    if (authUser) {
      setFormData({
        fullName: authUser.fullName,
        username: authUser.username,
        email: authUser.email,
        bio: authUser.bio,
        link: authUser.link,
      });
    }
  }, [authUser]);

  return (
    <>
      <button
        className='btn btn-outline rounded-full btn-sm'
        onClick={() =>
          document.getElementById("edit_profile_modal").showModal()
        }
      >
        Edit profile
      </button>

      <dialog id='edit_profile_modal' className='modal'>
        <div className='modal-box border rounded-md border-gray-700 shadow-md'>
          <div className='flex justify-between'>
            <h3 className='font-bold text-lg my-3'>Update Profile</h3>
            <IoMdClose
              className='hover:text-red-400 cursor-pointer transition duration-300'
              onClick={() =>
                document.getElementById("edit_profile_modal").close()
              }
            />
          </div>
          <form className='flex flex-col gap-4' onSubmit={handleFormSubmit}>
            <div className='flex flex-wrap gap-2'>
              <div className='flex flex-col gap-1 flex-1'>
                <label className='text-sm text-white font-semibold'>
                  Email
                </label>
                <input
                  type='email'
                  placeholder='Email'
                  className='flex-1 input border border-gray-700 rounded p-2 input-md bg-gray-900'
                  value={formData.email}
                  name='email'
                  onChange={handleInputChange}
                  readOnly
                />
              </div>
              <div className='flex flex-col gap-1 flex-1'>
                <label className='text-sm text-white font-semibold'>
                  Username
                </label>
                <input
                  type='text'
                  placeholder='Username'
                  className='flex-1 input border border-gray-700 rounded p-2 input-md bg-gray-900'
                  value={formData.username}
                  name='username'
                  onChange={handleInputChange}
                  readOnly
                />
              </div>
            </div>
            <div className='flex flex-wrap gap-2'>
              <div className='flex flex-col gap-1 flex-1'>
                <label className='text-sm text-white font-semibold'>
                  Full Name
                </label>
                <input
                  type='text'
                  placeholder='Full Name'
                  className='flex-1 input border border-gray-700 rounded p-2 input-md'
                  value={formData.fullName}
                  name='fullName'
                  onChange={handleInputChange}
                />
              </div>

              <div className='flex flex-col gap-1 flex-1'>
                <label className='text-sm text-white font-semibold'>Link</label>
                <input
                  type='text'
                  placeholder='Link'
                  className='flex-1 input border border-gray-700 rounded p-2 input-md'
                  value={formData.link}
                  name='link'
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div className='flex flex-wrap gap-2'>
              <div className='flex flex-col gap-1 flex-1'>
                <label className='text-sm text-white font-semibold'>
                  Current Password
                </label>
                <input
                  type='password'
                  placeholder='Current Password'
                  className='flex-1 input border border-gray-700 rounded p-2 input-md'
                  value={formData.password}
                  onChange={handleInputChange}
                />
              </div>
              <div className='flex flex-col gap-1 flex-1'>
                <label className='text-sm text-white font-semibold'>
                  New Password
                </label>
                <input
                  type='password'
                  placeholder='New Password'
                  className='flex-1 input border border-gray-700 rounded p-2 input-md'
                  value={formData.password}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div className='flex flex-col gap-1 flex-1'>
              <label className='text-sm text-white font-semibold'>Bio</label>
              <textarea
                placeholder='Bio'
                className='flex-1 input border border-gray-700 rounded p-2 input-md'
                value={formData.bio}
                name='bio'
                onChange={handleInputChange}
              />
            </div>

            <button className='btn btn-primary rounded-full btn-sm text-white'>
              {isUpdatingProfile ? "Updating..." : "Update"}
            </button>
          </form>
        </div>
        <form method='dialog' className='modal-backdrop'>
          <button className='outline-none'>Close</button>
        </form>
      </dialog>
    </>
  );
};

export default EditProfileModal;
