import { CiImageOn } from "react-icons/ci";
import { BsEmojiSmileFill } from "react-icons/bs";
import { useRef, useState } from "react";
import { IoCloseSharp } from "react-icons/io5";

const CreatePost = () => {
  const [text, setText] = useState("");
  const [img, setImg] = useState(null);

  const data = {
    profileImg: "/avatars/boy1.png",
  };

  const imgRef = useRef(null);

  const isPending = false;
  const isError = false;

  const handleImgChange = () => {};

  const handleSubmit = () => {};
  return (
    <div className="flex p-4 items-start gap-4 border-b border-gray-700">
      <div className="avatar">
        <div className="w-8 rounded-full">
          <img src={data.profileImg || "/avatar-placeholder.png"} />
        </div>
      </div>
      
      <form onSubmit={handleSubmit} className='w-full flex flex-col gap-2'>
        <textarea
          className="textarea w-full p-0 text-lg resize-none border-none focus:outline-none border-gray-800"
          placeholder="What is happening ?!"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />

        {img && (
          <div className="relative w-72 mx-auto">
            <IoCloseSharp 
              className='absolute top-0 right-0 text-white bg-gray-800 rounded-full size-5 cursor-pointer'
              onClick={() => {
                setImg(null)
                imgRef.current.value = null
              }}
            />
            <img src={img} className='w-full mx-auto h-72 object-contain rounded' />
          </div>
        )}

        <div className='w-full flex justify-between border-t py-2 border-t-gray-700'>
          <div className='flex gap-1 items-center'>
            <CiImageOn 
              className='fill-primary size-6 cursor-pointer'
              onClick={() => imgRef.current.click()}
            />
            <BsEmojiSmileFill className='fill-primary size-5 cursor-pointer' />
          </div>

          <input 
            ref={imgRef}
            type='file'
            accept="image/*"
            hidden
            onChange={handleImgChange}
          />

          <button className='btn btn-primary rounded-full btn-sm text-white px-4'>
            {isPending ? "Posting..." : "Post"}
          </button>
        </div>

        {isError && (
          <div className='text-red-500'>Something went wrong</div>
        )}
      </form>
    </div>
  );
};

export default CreatePost;
