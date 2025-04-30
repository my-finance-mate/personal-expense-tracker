import React, { useRef, useState } from 'react';
import { LuUser, LuUpload, LuTrash } from 'react-icons/lu';

const ProfilePhotoSelector = ({ image, setImage }) => {
  const inputRef = useRef(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const handleImageChange = (event) => {
    const file = event.target.files[0];

    if (file) {
      // Update the image state
      setImage(file);

      // Generate preview URL from the file
      const preview = URL.createObjectURL(file);
      setPreviewUrl(preview);
    }
  };

  const handleRemoveImage = () => {
    setImage(null);
    setPreviewUrl(null);
  };

  const onChooseFile = () => {
    inputRef.current.click();
  };

  return (
    <div className="flex justify-center items-center flex-col">
      {/* Hidden File Input */}
      <input
        type="file"
        accept="image/*"
        ref={inputRef}
        onChange={handleImageChange}
        className="hidden"
      />

      {/* If no image, show upload icon and button */}
      {!image ? (
        <div className="flex flex-col items-center">
          <div className="bg-gray-200 p-4 rounded-full">
            <LuUser className="w-12 h-12 text-gray-500" />
          </div>

          <button
            type="button"
            className="mt-3 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            onClick={onChooseFile}
          >
            <LuUpload />
          </button>
        </div>
      ) : (
        <div className="relative">
          <img
            src={previewUrl || URL.createObjectURL(image)}
            alt="Profile"
            className="w-24 h-24 rounded-full"
          />

          <button
            type="button"
            className="absolute top-0 right-0 bg-white rounded-full p-1"
            onClick={handleRemoveImage}
          >
            <LuTrash />
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfilePhotoSelector;
