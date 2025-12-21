import React from 'react';
import type { Post } from '../types';
import {
  FaEdit,
  FaTrashAlt,
  FaRegBookmark,
  FaBookmark,
} from 'react-icons/fa';
import { BsThreeDots } from 'react-icons/bs';
import Dropdown from '../../../shared/components/ui/Dropdown';
import { Button } from '../../../shared/components/ui/Button';
import { useAuth } from '../../auth/hooks/useAuth';
import { useDeletePostMutation } from '../services/postsApi';

interface PostDropdownProps {
  post: Post;
}

const PostDropdown: React.FC<PostDropdownProps> = ({ post }) => {
 
 const {user}=useAuth()
const [deletePost, { isLoading }] = useDeletePostMutation();

  const handleEditPost = () => {
    console.log('Edit post:', post.id);
    // TODO: Implement edit functionality
  };

  const  handleDeletePost = async () => {
    console.log('Delete post:', post.id);
    try {
    await deletePost(post.id).unwrap();
    console.log('Post deleted:', post.id);
  } catch (error) {
    console.error('Failed to delete post', error);
  }
  };

  const handleToggleSave = () => {
    console.log(post.userSaved ? 'Unsave post:' : 'Save post:', post.id);
    // TODO: Implement save/unsave functionality
  };

  return (
    <div className="absolute top-2 right-2">
      <Dropdown
        trigger={
          <Button variant="ghost" size="sm" className="p-2">
            <BsThreeDots className="text-lg text-gray-500 dark:text-gray-400" />
          </Button>
        }
        align="right"
      >
        <div className="py-1">
         {user?.id === post.author.id && (
  <>
    <button
      onClick={handleEditPost}
      className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600"
    >
      <FaEdit className="mr-2" />
      Edit
    </button>

    <button
      onClick={handleDeletePost}
      className="flex items-center w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-600"
    >
      <FaTrashAlt className="mr-2" />
      Delete
    </button>
  </>
)}

          <button
            onClick={handleToggleSave}
            className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600"
          >
            {post.userSaved ? (
              <>
                <FaBookmark className="mr-2" /> Unsave
              </>
            ) : (
              <>
                <FaRegBookmark className="mr-2" /> Save
              </>
            )}
          </button>
        </div>
      </Dropdown>
    </div>
  );
};

export default PostDropdown;
