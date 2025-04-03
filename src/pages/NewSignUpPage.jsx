import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import firstIMG from "../assets/images/login-image.jpg";

const NewSignUpPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    password: '',
    retypePassword: '',
  });
  const [error, setError] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [resendDisabled, setResendDisabled] = useState(true);
  const [resendSeconds, setResendSeconds] = useState(60);
  const [registrationEmail, setRegistrationEmail] = useState(''); // Keep track of email used for registration.


  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleOtpChange = (e) => {
    setOtp(e.target.value);
  };


  const startResendTimer = () => {
    setResendDisabled(true);
    setResendSeconds(60);
    const intervalId = setInterval(() => {
      setResendSeconds((prevSeconds) => {
        if (prevSeconds === 1) {
          clearInterval(intervalId);
          setResendDisabled(false);
          return 60;
        }
        return prevSeconds - 1;
      });
    }, 1000);
  };

  useEffect(() => {
    if (otpSent) {
      startResendTimer();
    }
    // Cleanup on unmount
    return () => {
      // Find any intervals and clear it
      let intervalId = window.setInterval(()=>{}, 9999); // Get a big interval id
      for (let i = 1; i < intervalId; i++) {
        window.clearInterval(i);
      }
    };
  }, [otpSent]);


  const handleResendOtp = async () => {
    try {
      const response = await axios.post('http://127.0.0.1:8000/account/resend_otp/', { email: registrationEmail }); // used registrationEmail
      console.log(response.data);
      alert("New OTP sent to your email.");
      startResendTimer();
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to resend OTP');
    }
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (formData.password !== formData.retypePassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      const response = await axios.post('http://127.0.0.1:8000/account/register/', formData);
      console.log(response.data);
      setOtpSent(true);  // Show OTP input
      setRegistrationEmail(formData.email); // used formData.email instead of email.
      alert("Registration initiated. Please check your email for OTP.");
    } catch (error) {
      setError(error.response?.data?.error || 'Something went wrong during registration.');
    }
  };


  const handleVerifyOtp = async () => {
    try {
      const response = await axios.post('http://127.0.0.1:8000/account/verify_otp/', { email: registrationEmail, otp: otp }); // used registrationEmail
      console.log(response.data);
      alert("Email verified successfully!");
      navigate("/");  // Navigate to homepage
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to verify OTP.');
    }
  };


  return (
    <div className="flex h-screen raleway bg-amber-50 font-raleway">
      <div className="w-[60%] h-full">
        <img src={firstIMG} alt="Travel" className="object-cover h-full w-full" />
      </div>

      <div className="w-[40%] flex items-center justify-center">
        <div className="bg-amber-50 px-8 pt-6 pb-8 mb-4">
          <div className="text-6xl font-bold mb-6 text-center">Sign Up</div>
          <br />

          {!otpSent ? (
            <form onSubmit={handleSubmit}>
              <div className="flex mb-4 space-x-4">
                <div className="w-1/2">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="firstName">
                    First Name
                  </label>
                  <input
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    id="firstName"
                    type="text"
                    name="firstName"
                    placeholder="First Name"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="w-1/2">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="lastName">
                    Last Name
                  </label>
                  <input
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    id="lastName"
                    type="text"
                    name="lastName"
                    placeholder="Last Name"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="flex mb-4 space-x-4">
                <div className="w-1/2">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
                    Username
                  </label>
                  <input
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    id="username"
                    type="text"
                    name="username"
                    placeholder="Username"
                    value={formData.username}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="w-1/2">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                    Email
                  </label>
                  <input
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    id="email"
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="flex mb-6 space-x-4">
                <div className="w-1/2">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                    Password
                  </label>
                  <input
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                    id="password"
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="w-1/2">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="retypePassword">
                    Re-type Password
                  </label>
                  <input
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                    id="retypePassword"
                    type="password"
                    name="retypePassword"
                    placeholder="Re-type Password"
                    value={formData.retypePassword}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              {error && <p className="text-red-500 text-xs italic">{error}</p>}
              <div className="flex items-center justify-between">
                <button
                  className="bg-black hover:bg-white hover:text-black text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  type="submit"
                >
                  Sign Up
                </button>
                <Link to="/LoginPage" className="inline-block align-baseline font-bold text-sm text-black hover:text-blue-800">
                  Already have an account?
                </Link>
              </div>
            </form>
          ) : (
            <div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="otp">
                  OTP Code
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="otp"
                  type="text"
                  name="otp"
                  placeholder="Enter OTP"
                  value={otp}
                  onChange={handleOtpChange}
                  required
                />
              </div>
              {error && <p className="text-red-500 text-xs italic">{error}</p>}

              <div className="flex items-center justify-between">
                <button
                  className="bg-black hover:bg-white hover:text-black text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  type="button"
                  onClick={handleVerifyOtp}
                >
                  Verify OTP
                </button>
              </div>

              <button
                  className="mt-4 text-blue-500 hover:text-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={handleResendOtp}
                  disabled={resendDisabled}
                >
                  {resendDisabled
                    ? `Resend OTP in ${resendSeconds}s`
                    : "Resend OTP"}
                </button>

            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NewSignUpPage;