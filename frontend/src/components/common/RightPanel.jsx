import { Link } from "react-router-dom";
import RightPanelSkeleton from '../skeletons/RightPanelSkeleton';
import {useQuery} from '@tanstack/react-query';
import useFollow from "../../hooks/useFollow";

import LoadingSpinner from './LoadingSpinner';


const RightPanel = () => {
  const {data: suggestedUsers, isLoading} = useQuery({
    queryKey: ["suggestedUsers"],
    queryFn: async () => {
        try {
            const res = await fetch("/api/users/suggested");
            const data = await res.json();
            if(!res.ok) throw new Error(data.error);

            console.log("Suggested Users: ", data);
            return data;

        } catch (error) {
            console.log("Error in suggestedUser query", error.message);
            throw new Error(error);
        }
    },
  });

  const {follow, isPending} = useFollow();

  const handleFollow = (e,userId) => {
    e.preventDefault();
    follow(userId);
  };
  
  if(suggestedUsers?.length === 0) {
    return (
        <div className='md:w-64 w-0'></div>
    )
  };

  return (
    <div
        className='hidden lg:block my-4 mx-2'
    >
        <div className='bg-[#16181C] p-4 rounded-md sticky top-2'>
            <p className='font-bold mb-3'>Who to follow</p>
            <div className='flex flex-col gap-4'>
                {isLoading && (
                    <>
                        <RightPanelSkeleton />
                        <RightPanelSkeleton />
                        <RightPanelSkeleton />
                        <RightPanelSkeleton />
                    </>
                )}

                {!isLoading && (
                    suggestedUsers?.map((user) => (
                        <Link
                            key={user._id}
                            to={`/profile/${user.username}`}
                            className='flex items-center justify-between gap-4'
                        >
                            <div className='flex gap-2 items-center'>
                                <div className='avatar'>
                                    <div className='w-8 rounded-full'>
                                        <img 
                                            src={user.profileImg || '/avatar-placeholder.png'}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className='flex flex-col'>
                                    <span className='font-semibold tracking-tight truncate w-28'>
                                        {user.fullName}
                                    </span>
                                    <span className='text-sm text-slate-500'>
                                        @{user.username}
                                    </span>
                            </div>

                            <div>
                                <button
                                    className='btn bg-white text-black hover:bg-white hover:opacity-90 rounded-full btn-sm'
                                    onClick={(e) => handleFollow(e, user._id)}
                                >
                                    {isPending ? <LoadingSpinner size='sm' /> : "Follow"}
                                </button>
                            </div>
                        </Link>
                    ))
                )}
            </div>
        </div>
    </div>
  )
}

export default RightPanel