import { auth } from "../assets/firebase";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";

export default function Login() {
  const nav = useNavigate();
  const provider = new GoogleAuthProvider();

  const googlelog = async () => {
    try {
      const signin = await signInWithPopup(auth, provider);

      const sender = await fetch(`${import.meta.env.VITE_API_URL}/getter`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(signin.user),
      });

      localStorage.setItem("email", signin.user.email);

      const res = await sender.json();

      if (res.msg) {
        toast.info("Already logged in");
      } else {
        toast.success("Login successful");
      }

      nav("/show");
    } catch (e) {
      console.log("error in auth");
      toast.error("Google Sign-in Failed");
    }
  };

  return (
    <>
      <ToastContainer position="top-center" />

      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 to-purple-200 px-4">
        <div className="w-full max-w-md bg-white shadow-2xl rounded-2xl p-8 text-center">
         
          <button
            onClick={googlelog}
            className="w-full flex items-center justify-center gap-3 border border-gray-300 rounded-xl py-3 px-4 hover:bg-gray-100 transition duration-300 shadow-sm"
          >
            <img
              src="https://developers.google.com/identity/images/g-logo.png"
              alt="Google"
              className="w-6 h-6"
            />

            <span className="text-gray-700 font-medium">
              Continue with Google
            </span>
          </button>
        </div>
      </div>
    </>
  );
}