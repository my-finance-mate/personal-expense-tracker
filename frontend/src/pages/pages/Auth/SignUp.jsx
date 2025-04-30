import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Input from '../../components/Inputs/input';
import ProfilePhotoSelector from '../../components/ProfilePhotoSelector';
import { validateEmail } from '../../utils/helper';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';
import { UserContext } from '../../context/userContext';
import uploadImage from '../../utils/uploadImage';

const SignUp = () => {
  const [profilePic, setProfilePic] = useState(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const { updateUser } = useContext(UserContext);
  const navigate = useNavigate();

  const handleTextOnlyChange = (setter) => (e) => {
    const value = e.target.value;
    // Allow only letters and space
    if (/^[A-Za-z\s]*$/.test(value)) {
      setter(value);
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();

    if (!firstName || !lastName) {
      setError("Please enter your first and last name.");
      return;
    }

    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (!email.endsWith("@gmail.com")) {
      alert("Email must end with @gmail.com");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    setError("");

    try {
      let profileImageUrl = "";

      if (profilePic) {
        const imgUploadRes = await uploadImage(profilePic);
        profileImageUrl = imgUploadRes?.imageUrl || "";
      }

      const response = await axiosInstance.post(API_PATHS.AUTH.REGISTER, {
        firstName,
        lastName,
        email,
        password,
        profileImageUrl,
      });

      const { token, user } = response.data;

      if (token) {
        localStorage.setItem("token", token);
        updateUser(user);
        navigate("/dashboard");
      }
    } catch (error) {
      if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else {
        setError("Something went wrong. Please try again.");
      }
    }
  };

  return (
    <div className="md:max-w-lg mx-auto p-6 rounded-xl shadow-lg bg-[#fffdfa] border border-gray-200">
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold text-gray-800 mb-2">Create New Account</h3>
        <p className="text-gray-600 text-sm">Start your journey with us in just a few clicks</p>
      </div>

      <form onSubmit={handleSignUp} className="space-y-4">
        <div className="flex justify-center">
          <ProfilePhotoSelector
            image={profilePic}
            setImage={setProfilePic}
            className="hover:opacity-90 transition-opacity"
          />
        </div>

        <div className="space-y-4">
          <Input
            value={firstName}
            onChange={handleTextOnlyChange(setFirstName)}
            label="First Name"
            placeholder="John"
            type="text"
          />
          <Input
            value={lastName}
            onChange={handleTextOnlyChange(setLastName)}
            label="Last Name"
            placeholder="Doe"
            type="text"
          />
          <Input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            label="Email Address"
            placeholder="john.doe@gmail.com"
            type="email"
          />
          <Input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            label="Password"
            placeholder="••••••••"
            type="password"
            helperText="Minimum 8 characters with at least one number"
          />
        </div>

        {error && (
          <div className="p-3 bg-red-50 rounded-lg animate-fade-in">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        <button
          type="submit"
          className="w-full py-3 bg-[#6fad4a] text-white rounded-lg font-medium hover:bg-[#5d9540] transition-colors duration-200"
        >
          Create Account
        </button>

        <p className="text-center text-sm text-gray-600 mt-4">
          Already registered?{" "}
          <Link to="/login" className="text-[#6fad4a] font-medium hover:text-[#5d9540] transition-colors">
            Login in here
          </Link>
        </p>
      </form>
    </div>
  );
};

export default SignUp;
