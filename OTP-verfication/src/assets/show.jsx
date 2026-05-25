import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Show() {
  const nav = useNavigate();
const API_URL = import.meta.env.VITE_API_URL;

  const [googleUsers, setGoogleUsers] = useState([]);
  const [otpUsers, setOtpUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);

        const [googleRes, otpRes] = await Promise.all([
          fetch(`${API_URL}/shows`),
  fetch(`${API_URL}/getregister`),
        ]);

        const googleData = await googleRes.json();
        const otpData = await otpRes.json();

        setGoogleUsers(googleData || []);
        setOtpUsers(otpData || []);
      } catch (err) {
        console.log("Error fetching users", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-100">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-100 p-4 sm:p-6">
      <div className="max-w-6xl mx-auto space-y-10">

        {/* HEADER */}
        <div className="text-center">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
            All Registered Users
          </h1>
          <p className="text-gray-500 text-sm sm:text-base">
            Google Sign-in + OTP Users Dashboard
          </p>
        </div>

        {/* OTP USERS */}
        <div>
          <h2 className="text-lg sm:text-xl font-semibold mb-4 text-gray-700">
            🧾 OTP Registered Users
          </h2>

          <div className="overflow-x-auto">
            <div className="flex gap-4 w-max px-1 snap-x snap-mandatory">

              {otpUsers.length > 0 ? (
                otpUsers.map((user, i) => (
                  <div
                    key={i}
                    className="min-w-[260px] sm:min-w-[300px] bg-white p-4 rounded-xl shadow hover:shadow-lg transition snap-start"
                  >
                    <p className="font-semibold text-gray-800">
                      {user.name}
                    </p>

                    <p className="text-gray-600 text-sm">
                      {user.email}
                    </p>

                    <p className="text-xs text-gray-400 mt-2">
                      {user.createdAt
                        ? new Date(user.createdAt).toLocaleString()
                        : "N/A"}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-gray-500">No OTP users found</p>
              )}

            </div>
          </div>
        </div>

        {/* GOOGLE USERS */}
        <div>
          <h2 className="text-lg sm:text-xl font-semibold mb-4 text-gray-700">
            🔐 Google Users
          </h2>

          <div className="overflow-x-auto">
            <div className="flex gap-4 w-max px-1 snap-x snap-mandatory">

              {googleUsers.length > 0 ? (
                googleUsers.map((user, i) => (
                  <div
                    key={i}
                    className="min-w-[260px] sm:min-w-[300px] bg-white p-4 rounded-xl shadow hover:shadow-lg transition flex flex-col items-center text-center snap-start"
                  >
                    <img
                      src={user?.photoURL}
                      alt="profile"
                      className="w-16 h-16 rounded-full mb-2 border"
                    />

                    <p className="font-semibold text-gray-800">
                      {user?.displayName || "No Name"}
                    </p>

                    <p className="text-gray-600 text-sm">
                      {user?.email || "No Email"}
                    </p>

                    <p className="text-xs text-gray-400 mt-2">
                      {user?.createdAt || "No Date"}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-gray-500">No Google users found</p>
              )}

            </div>
          </div>
        </div>

        {/* BACK BUTTON */}
        <div className="flex justify-center pt-6">
          <button
            onClick={() => nav(-1)}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 hover:scale-105 active:scale-95 transition"
          >
            ← Back
          </button>
        </div>

      </div>
    </div>
  );
}