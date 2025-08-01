import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";

import Posts from "../../components/common/Posts";
import ProfileHeaderSkeleton from "../../components/skeletons/ProfileHeaderSkeleton";
import EditProfileModal from "./EditProfileModal";

import { POSTS } from "../../utils/db/dummy.js";

import { FaArrowLeft } from "react-icons/fa";
import { IoCalendarOutline } from "react-icons/io5";
import { FaLink } from "react-icons/fa";
import { MdEdit } from "react-icons/md";
import { useQuery } from "@tanstack/react-query";
import { formatMemberSinceDate } from "../../utils/date";

import useUpdateProfile from "../../hooks/useUpdateProfile";
import useFollow from '../../hooks/useFollow';

const ProfilePage = () => {
  const [coverImg, setCoverImg] = useState(null);
  const [profileImg, setProfileImg] = useState(null);
  const [feedType, setFeedType] = useState("posts");
  const {username} = useParams();

  const {data: authUser} = useQuery({queryKey: ["authUser"]});
  console.log("authUser in Profile page: ", authUser);
  
  const coverImgRef = useRef(null);
  const profileImgRef = useRef(null);

  const {data: user, isLoading, refetch, isRefetching} = useQuery({
    queryKey: ['userProfile'],
    queryFn: async () => {
      try {
        const res = await fetch(`/api/users/profile/${username}`);
        const data = await res.json();

        if(!res.ok) throw new Error(data.error);

        console.log("profile data: ", data);
        return data;

      } catch (error) {
        console.log("Error in user profile query: ", error.message);
        throw new Error(error);
      }
    },
  });

  const isMyProfile = authUser?._id === user?._id;
  
  const {updateProfile, isUpdatingProfile} = useUpdateProfile();

  const handleImageChange = (e, state) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        state === "coverImg" && setCoverImg(reader.result);
        state === "profileImg" && setProfileImg(reader.result);
      };

      reader.readAsDataURL(file);
    }
  };

  const handleUpdateProfile = async () => {
    await updateProfile({coverImg, profileImg});
    setCoverImg(null);
    setProfileImg(null);
  };

  const {follow, isPending: isFollowing} = useFollow();
  
  const handleFollow = () => {
    follow(user._id);
  }
  const isFollowed = authUser.following.includes(user?._id);
  
  useEffect(() => {
    refetch();
  },[username, refetch]);

  return (
    <>
      <div className="flex-[4_4_0] border-r border-gray-700 min-h-screen">
        {/*Header*/}
        {(isLoading || isRefetching) && <ProfileHeaderSkeleton />}
        {!isLoading && !isRefetching && !user && (
          <p className="text-center text-lg mt-4">User not found</p>
        )}

        <div className="flex flex-col">
          {!isLoading && !isRefetching && user && (
            <>
              <div className="flex gap-10 px-4 py-2 items-center mt-1">
                <Link to="/">
                  <FaArrowLeft className="size-4" />
                </Link>
                <div className="flex flex-col">
                  <p className="font-bold text-lg">{user?.fullName}</p>
                  <span className="text-sm text-slate-500">
                    {POSTS?.length} posts
                  </span>
                </div>
              </div>

              {/*COVER IMAGE*/}
              <div className="relative group/cover">
                <img
                  src={coverImg || user?.coverImg || "/cover.png"}
                  className="h-52 w-full object-cover"
                  alt="cover image"
                />

                {isMyProfile && (
                  <div 
                    className="absolute top-2 right-2 rounded-full p-2 bg-gray-800 bg-opacity-75 cursor-pointer opacity-0 group-hover/cover:opacity-100 transition duration-300"
                    onClick={() => coverImgRef.current.click()}
                >
                    <MdEdit className="size-5 text-white" />
                  </div>
                )}

                <input
                  type="file"
                  hidden
                  ref={coverImgRef}
                  onChange={(e) => handleImageChange(e, "coverImg")}
                />

                <input
                  type="file"
                  hidden
                  ref={profileImgRef}
                  onChange={(e) => handleImageChange(e, "profileImg")}
                />

                {/*USER AVATAR*/}
                <div className="avatar absolute -bottom-16 left-4">
                  <div className="w-32 rounded-full relative group/avatar">
                    <img
                      src={
                        profileImg ||
                        user?.profileImg ||
                        "/avatar-placeholder.png"
                      }
                    />
                    <div className="absolute top-5 right-3 p-1 bg-primary rounded-full group-hover/avatar:opacity-100 opacity-0 cursor-pointer">
                      {isMyProfile && (
                        <MdEdit
                          className="size-4 text-white"
                          onClick={() => profileImgRef.current.click()}
                        />
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end px-4 mt-5">
                {isMyProfile && <EditProfileModal authUser={authUser} />}
                {!isMyProfile && (
                  <button
                    className="btn btn-outline rounded-full btn-sm"
                    onClick={handleFollow}
                  >
                    {isFollowing && "Loading..."}
                    {(!isFollowing && isFollowed) && "Following"}
                    {(!isFollowing && !isFollowed) && "Follow"}
                  </button>
                )}

                {(coverImg || profileImg) && (
                  <button
                    className="btn btn-primary rounded-full btn-sm text-white px-4 ml-2"
                    onClick={handleUpdateProfile}
                  >
                    {isUpdatingProfile ? "Updating..." : "Update"}
                  </button>
                )}
              </div>

              <div className="flex flex-col gap-4 mt-14 px-4">
                <div className="flex flex-col">
                  <span className="font-bold text-lg">{user?.fullName}</span>
                  <span className="text-sm text-slate-500">
                    @{user?.username}
                  </span>
                  <span className="text-sm my-1">{user?.bio}</span>
                </div>

                <div className="flex gap-2 flex-wrap">
                  {user?.link && (
                    <div className="flex gap-1 items-center">
                      <>
                        <FaLink className="size-3 text-slate-500" />
                        <a
                          href="https://youtube.com/@asaprogrammer_"
                          target="_blank"
                          rel="noreferrer"
                          className="text-sm text-blue-500 hover:underline"
                        >
                          youtube.com/@asaprogrammer_
                        </a>
                      </>
                    </div>
                  )}

                  <div className="flex gap-2 items-center">
                    <IoCalendarOutline className="size-4 text-slate-500" />
                    <span className="text-sm text-slate-500">
                      {formatMemberSinceDate(user.createdAt)}
                    </span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <div className="flex gap-1 items-center">
                    <span className="font-bold text-xs">
                      {user?.following.length}
                    </span>
                    <span className="text-slate-500 text-xs">Following</span>
                  </div>

                  <div className="flex gap-1 items-center">
                    <span className="font-bold text-xs">
                      {user?.followers.length}
                    </span>
                    <span className="text-slate-500 text-xs">Followers</span>
                  </div>
                </div>
              </div>

              <div className="flex w-full border-b border-gray-700 mt-4">
                <div
                  className="flex justify-center flex-1 p-3 hover:bg-secondary transition duration-300 relative cursor-pointer"
                  onClick={() => setFeedType("posts")}
                >
                  Posts
                  {feedType === "posts" && (
                    <div className="absolute bottom-0 w-10 h-1 rounded-full bg-primary" />
                  )}
                </div>
                <div 
                    className="flex justify-center flex-1 p-3 text-slate-500 hover:bg-secondary transition duration-300 relative cursor-pointer"
                    onClick={() => setFeedType('likes')}
                >
                    Likes
                    {feedType === 'likes' && (
                        <div className='absolute bottom-0 w-10 h-1 rounded-full bg-primary' />
                    )}
                </div>
              </div>
            </>
          )}

          <Posts feedType={feedType} username={username} userId={user?._id} />
        </div>
      </div>
    </>
  );
};

export default ProfilePage;
