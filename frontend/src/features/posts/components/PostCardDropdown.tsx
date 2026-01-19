// frontend/src/features/posts/components/PostDropdown.tsx
import React, { useState } from 'react'; // Added useState
import { PostStatus, type Post } from '../types';
import {
  FaEdit,
  FaTrashAlt,
  FaRegBookmark,
  FaBookmark,
  FaFlag, // Import Flag icon for reporting
} from 'react-icons/fa';
import { BsThreeDots } from 'react-icons/bs';
import Dropdown from '../../../shared/components/ui/Dropdown';
import { Button } from '../../../shared/components/ui/Button';
import { useAuth } from '../../auth/hooks/useAuth';
import { useDeletePostMutation, useUpdateCommentLockedStatusMutation } from '../services/postsApi';
import { ReportForm } from '../../reports/components/ReportForm'; // Adjust path
import { Modal } from '../../../shared/components/ui/Modal';
import { useCreateSavedPostMutation, useDeleteSavedPostMutation } from '../../saved-posts/services/savedPostsApi';
import EditPostForm from './EditPostForm';

interface PostDropdownProps {
  post: Post;
}

const PostDropdown: React.FC<PostDropdownProps> = ({ post }) => {
  const { user } = useAuth();
  const [deletePost, { isLoading }] = useDeletePostMutation();

    const [lockComments] = useUpdateCommentLockedStatusMutation();
    const [savePost] = useCreateSavedPostMutation();
    const [unSavePost] = useDeleteSavedPostMutation();

    
  const [isReportModalOpen, setIsReportModalOpen] = useState(false); // Modal state
  const [isEditModalOpen, setIsEditModalOpen] = useState(false); // Modal state

  const handleEditPost = () => {
    console.log('Edit post:', post.id);
  };

  const handleDeletePost = async () => {
    try {
      await deletePost(post.id).unwrap();
    } catch (error) {
      console.error('Failed to delete post', error);
    }
  };

   const handleToggleCommentsLocked = async () => {
    try {
      await lockComments({id:post.id ,commentsLocked:!post.commentsLocked}).unwrap();
    } catch (error) {
      console.error('Failed to lock post comments', error);
    }
  };

  const handleToggleSave = async () => { 
 
   try {

    console.log(post);
    
    if(post.userSaved)
      await unSavePost(post.id ).unwrap();
    else 

      await savePost({postId:post.id} ).unwrap();

  } catch (error) {
      console.error('Failed to save / unsave post', error);
    }
   };


  return (
    <>
      <div className="">
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

              {1==1 && (
   <Button
              variant='ghost'
                onClick={() => setIsEditModalOpen(true)}
              >
                Edit 
              </Button>

              )}
           

                <button
                  onClick={handleDeletePost}
                  className="flex items-center w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-600"
                >
                  <FaTrashAlt className="mr-2" />
                  Delete
                </button>

                  <button
                onClick={handleToggleCommentsLocked}
                className="flex items-center w-full text-left px-4 py-2 text-sm text-amber-600 dark:text-amber-400 hover:bg-gray-100 dark:hover:bg-gray-600"
              >
                <FaFlag className="mr-2" />
            {!post.commentsLocked ? 'Lock Comments' : 'Unlock Comments'}  
              </button>
              </>
            )}

            {/* NEW: Report Button - Only visible if not the author */}
            {user?.id !== post.author.id && (
              <>
              
                <button
                onClick={() => setIsReportModalOpen(true)}
                className="flex items-center w-full text-left px-4 py-2 text-sm text-amber-600 dark:text-amber-400 hover:bg-gray-100 dark:hover:bg-gray-600"
              >
                <FaFlag className="mr-2" />
                Report Post
              </button>

               
              </>
            
            )}
            {post.status==PostStatus.APPROVED && <>
            
               <button
              onClick={handleToggleSave}
              className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600"
            >
              {post.userSaved ? (
                <><FaBookmark className="mr-2" /> Unsave</>
              ) : (
                <><FaRegBookmark className="mr-2" /> Save</>
              )}
            </button>

              
            
            </>
            
             
            }

        
          </div>
        </Dropdown>
      </div>

      {/* Shared Modal Integration */}
      <Modal
        open={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
      >
        <ReportForm
          reportableId={post.id}
          reportableType="post"
          onSuccess={() => setIsReportModalOpen(false)}
          onCancel={() => setIsReportModalOpen(false)}
        />
      </Modal>

        <Modal
        open={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
      >
        <EditPostForm
          post={post}
          onSuccess={() => setIsEditModalOpen(false)}
          onCancel={() => setIsEditModalOpen(false)}
        />
      </Modal>
    </>
  );
};

export default PostDropdown;