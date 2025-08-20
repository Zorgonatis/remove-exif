import { MadeWithDyad } from "@/components/made-with-dyad";
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const Index = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Welcome to Your Blank App</h1>
        <p className="text-xl text-gray-600">
          Start building your amazing project here!
        </p>
        <Link to="/remove-exif">
          <Button className="mt-4">Remove EXIF Metadata</Button>
        </Link>
      </div>
      <MadeWithDyad />
    </div>
  );
};

export default Index;