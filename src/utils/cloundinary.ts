import axios from 'axios';

//I kept these in here instead of env because its a test account and for testing it woud be helpful
const UPLOAD_PRESET = 'ml_default';
const CLOUDINARY_URL = 'https://api.cloudinary.com/v1_1/dwxwfv7yt/image/upload';

//cloudinary function to upload the files to cloudinary
export const uploadImage = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', UPLOAD_PRESET);


  try {
    const response = await axios.post(CLOUDINARY_URL, formData);
 
    
    if (response.data && response.data.secure_url) {
      return response.data.secure_url; 
    } else {
      throw new Error('Something went wrong');
    }
  } catch (error) {

    throw new Error('Image upload failed');
  } 
};
