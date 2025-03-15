import { useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";
import "../styles/Form.css";
import LoadingIndicator from "./LoadingIndicator";

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
    <form onSubmit={handleSubmit} className="form-container">
      <h1>{name}</h1>
      <input
        className="form-input"
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Username"
      />
      <input
        className="form-input"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
      />
      {method === "register" && (
        <>
          <input
            className="form-input"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
          />
          <input
            className="form-input"
            type="text"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Bio"
            required
          />
          <input
            className="form-input"
            type="text"
            value={hobbies}
            onChange={(e) => setHobbies(e.target.value)}
            placeholder="Hobbies"
            required
          />
          <input
            className="form-input"
            type="text"
            value={town}
            onChange={(e) => setTown(e.target.value)}
            placeholder="Town"
            required
          />
        </>
      )}
      {loading && <LoadingIndicator />}
      <button className="form-button" type="submit">
        {name}
      </button>
    </form>
  );
}

export default Form;
