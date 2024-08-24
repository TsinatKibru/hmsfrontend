import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import jwt_decode from "jwt-decode";
import { loginSuccess } from "../store";
import { useSelector, useDispatch } from "react-redux";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const baseUrl = "http://localhost:8000/api/";
  const dispatch = useDispatch();

  const handleNav = () => {
    navigate("/");
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    const response = await fetch("http://localhost:8000/api/login/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username,
        password,
      }),
    });

    const data = await response.json();

    if (response.ok) {
      localStorage.removeItem("token");
      localStorage.removeItem("refresh");

      localStorage.setItem("token", data.access);
      localStorage.setItem("refresh", data.refresh);
      dispatch(loginSuccess(data.role));
      //   // Redirect to the appropriate route based on role
      handleNav();
    } else {
      console.log(data);
      setError("Incorrect Username or Password");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <form className="w-80 bg-white p-6 rounded shadow">
        <h2 className="text-2xl font-bold mb-6">Login</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <input
          type="username"
          className="w-full border border-gray-300 rounded mb-3 p-2"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          className="w-full border border-gray-300 rounded mb-3 p-2"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          type="submit"
          className="w-full bg-thirtiaryD text-white rounded py-2"
          onClick={handleLogin}>
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
