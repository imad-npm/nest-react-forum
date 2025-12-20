import React from 'react';
import CreatePostForm from '../components/CreatePostForm';

const CreatePostPage: React.FC = () => {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Create Post</h1>
      <CreatePostForm />
    </div>
  );
};

export default CreatePostPage;
