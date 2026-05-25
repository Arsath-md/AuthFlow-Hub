import { useParams } from "react-router-dom";

export default function Waits(){
    const {email} = useParams();

    return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-purple-200 px-4">
      <div className="bg-white shadow-2xl rounded-2xl p-8 max-w-md text-center">
        
        <div className="w-14 h-14 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>

        <h1 className="text-2xl font-bold mt-5 text-gray-800">
          Verify your email
        </h1>

        <p className="text-gray-500 mt-2">
          We sent a verification link to:
        </p>

        <p className="font-semibold text-blue-600 mt-1">
          {email}
        </p>

        <p className="text-sm text-gray-400 mt-4">
          After verification, you will be automatically redirected.
        </p>
      </div>
    </div>
  );

}