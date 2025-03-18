import { useState } from "react";
import api from "../api";
import { useNavigate, Link } from "react-router-dom";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";
import LoadingIndicator from "./LoadingIndicator";
import AnimalBanner from "../images/AnimalBanner.jpg";

function Form({ route, method }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [bio, setBio] = useState("");
  const [hobbies, setHobbies] = useState("");
  const [town, setTown] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  //Form states
  const name = method === "login" ? "Login" : "Register";

  // Content for welcome messages
  const welcomeTitle = method === "login" 
    ? "Welcome Back!" 
    : "Join Our Community";
  
  const welcomeMessage = method === "login"
    ? "We're excited to see you again. Login to access your account and continue your journey with our community of animal lovers."
    : "Sign up to become part of our organization dedicated to helping stray animals. Together we can make a difference in their lives.";

  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();

    try {
      const res = await api.post(route, {
        username,
        password,
        email: method === "register" ? email : undefined,
        bio: method === "register" ? bio : undefined,
        hobbies: method === "register" ? hobbies : undefined,
        town: method === "register" ? town : undefined,
      });
      if (method === "login") {
        localStorage.setItem(ACCESS_TOKEN, res.data.access);
        localStorage.setItem(REFRESH_TOKEN, res.data.refresh);
        navigate("/");
      } else {
        navigate("/login");
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.detail ||
        error.response?.data?.message ||
        "Registration failed. Please try again.";
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 backdrop:saturate-100" 
      style={{
        backgroundImage: `url(${AnimalBanner})`,
        backgroundSize: 'auto',
        backgroundPosition: 'top',
        backgroundRepeat: 'no-repeat'
      }}
    >
      <div className="w-full max-w-5xl flex flex-col md:flex-row items-center justify-between gap-8">
        {/* Welcome message section */}
        <div className="w-full md:w-1/2 text-white p-6 rounded-lg bg-gray-800 bg-opacity-80 border border-gray-700 shadow-xl">
          <h2 className="text-3xl font-bold mb-4 text-indigo-400">{welcomeTitle}</h2>
          <p className="text-lg mb-6">{welcomeMessage}</p>
          <div className="hidden md:block">
            <div className="border-t border-gray-600 my-4"></div>
            {method === "login" ? (
              <p className="text-indigo-300 font-medium">
                Don't have an account? <Link to="/register" className="text-indigo-400 hover:text-indigo-300 font-bold underline transition-colors">Sign up now!</Link>
              </p>
            ) : (
              <p className="text-indigo-300 font-medium">
                Already a member? <Link to="/login" className="text-indigo-400 hover:text-indigo-300 font-bold underline transition-colors">Login to your account!</Link>
              </p>
            )}
          </div>
        </div>

        {/* Form section */}
        <div className="w-full md:w-1/2 max-w-md">
          <form onSubmit={handleSubmit} className="bg-gray-800 rounded-lg shadow-xl border border-gray-700 p-8">
            <h1 className="text-2xl font-semibold text-white mb-6 text-center">{name}</h1>
            <div className="space-y-4">
              <input
                className="w-full p-2.5 bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username"
              />
              <input
                className="w-full p-2.5 bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
              />
              {method === "register" && (
                <div className="space-y-4">
                  <input
                    className="w-full p-2.5 bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email"
                    required
                  />
                  <input
                    className="w-full p-2.5 bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                    type="text"
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Bio"
                    required
                  />
                  <input
                    className="w-full p-2.5 bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                    type="text"
                    value={hobbies}
                    onChange={(e) => setHobbies(e.target.value)}
                    placeholder="Hobbies"
                    required
                  />
                  <input
                    className="w-full p-2.5 bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                    type="text"
                    value={town}
                    onChange={(e) => setTown(e.target.value)}
                    placeholder="Town"
                    required
                  />
                </div>
              )}
              {loading && <div className="flex justify-center"><LoadingIndicator /></div>}
              <button 
                className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 shadow-md text-sm mt-4"
                type="submit"
                disabled={loading}
              >
                {name}
              </button>
            </div>
            
            {/* Mobile view account switch link */}
            <div className="mt-6 text-center md:hidden">
              {method === "login" ? (
                <p className="text-indigo-300 font-medium">
                  Don't have an account? <Link to="/register" className="text-indigo-400 hover:text-indigo-300 font-bold underline transition-colors">Sign up now!</Link>
                </p>
              ) : (
                <p className="text-indigo-300 font-medium">
                  Already a member? <Link to="/login" className="text-indigo-400 hover:text-indigo-300 font-bold underline transition-colors">Login</Link>
                </p>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Form;
