import Post from './Post';
import PostSkeleton from '../skeletons/PostSkeleton';
import {useQuery} from '@tanstack/react-query';
import { useEffect } from 'react';

const Posts = ({feedType}) => {

  const getPostEndPoint = () => {
    switch (feedType) {
      case 'forYou': return "/api/posts/all"
      case "following": return "api/posts/following" 
      default: return "/api/posts/all"
    };
  };

  const POST_ENDPOINT = getPostEndPoint();

  const {data: posts, isloading, refetch, isFetching} = useQuery({
    queryKey: ["posts"],
    queryFn: async () => {
      try {
        const res = await fetch(POST_ENDPOINT);
        const data = await res.json();

        if(!res.ok) throw new Error(data.error);
        console.log("Post datas: ", data);
        
        return data;

      } catch (error) {
        console.log("Error in posts query", error.message);
        throw error;
      }
    }
  });

  useEffect(() => {
    refetch();
  },[feedType, refetch])

  return (
    <>
      {(isloading || isFetching) && (
        <div className='flex flex-col justify-center'>
          <PostSkeleton />
          <PostSkeleton />
          <PostSkeleton />
        </div>
      )}

      {(!isloading || !isFetching)  && posts?.length === 0 && (
        <p className='text-center my-4'>
          No posts in this tab. Switch 👻
        </p>
      )}

      {(!isloading || !isFetching) && posts && (
        <div>
          {posts.map((post) => (
            <Post 
              key={post._id}
              post={post}
            />
          ))}
        </div>
      )}
    </>
  )
}

export default Posts