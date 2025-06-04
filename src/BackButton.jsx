import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export default function BackButton() {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate('/')}
      className="
        fixed 
        bottom-6 right-3 
        sm:bottom-8 sm:right-4 
        md:bottom-16 md:right-6 
        h-12 w-12 sm:h-14 sm:w-14 
        bg-gray-700 text-white 
        rounded-full shadow-lg 
        flex items-center justify-center 
        hover:bg-gray-800 transition
      "
      title="Back to Home"
    >
      <ArrowLeft size={22} className="sm:size-6" />
    </button>
  );
}
