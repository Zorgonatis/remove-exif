import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to the RemoveExif page
    navigate('/remove-exif');
  }, [navigate]);

  return null;
};

export default Index;