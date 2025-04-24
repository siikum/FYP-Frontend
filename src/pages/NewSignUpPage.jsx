import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import firstIMG from "../assets/images/login-image.jpg";
import Swal from "sweetalert2";

const NewSignUpPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    password: "",
    retypePassword: "",
  });
  const [error, setError] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [resendDisabled, setResendDisabled] = useState(true);
  const [resendSeconds, setResendSeconds] = useState(60);
  const [registrationEmail, setRegistrationEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      let intervalId = window.setInterval(() => {}, 9999); // Get a big interval id
      for (let i = 1; i < intervalId; i++) {
        window.clearInterval(i);
      }
    };
  }, [otpSent]);

  const handleResendOtp = async () => {
    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/account/resend_otp/",
        { email: registrationEmail }
      );
      console.log(response.data);
      Swal.fire({
        icon: "success",
        title: "OTP Resent",
        text: "A new OTP has been sent to your email address.",
        confirmButtonColor: "#0B3D20",
      });
      startResendTimer();
    } catch (error) {
      const errorMessage =
        error.response?.data?.error || "Failed to resend OTP";
      setError(errorMessage);
      Swal.fire({
        icon: "error",
        title: "Resend Failed",
        text: errorMessage,
        confirmButtonColor: "#B91C1C",
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true); // disable button immediately

    if (formData.password !== formData.retypePassword) {
      const errorMessage = "Passwords do not match.";
      setError(errorMessage);
      Swal.fire({
        icon: "warning",
        title: "Password Mismatch",
        text: errorMessage,
        confirmButtonColor: "#B91C1C",
      });
      setIsSubmitting(false); // re-enable if error
      return;
    }

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/account/register/",
        formData
      );
      console.log(response.data);
      setOtpSent(true);
      setRegistrationEmail(formData.email);
      Swal.fire({
        icon: "info",
        title: "OTP Sent!",
        text: "We've sent a verification code to your email. Please check your inbox.",
        confirmButtonColor: "#0B3D20",
      });
    } catch (error) {
      const errorMessage =
        error.response?.data?.error ||
        "Something went wrong during registration.";
      setError(errorMessage);
      Swal.fire({
        icon: "error",
        title: "Registration Failed",
        text: errorMessage,
        confirmButtonColor: "#B91C1C",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerifyOtp = async () => {
    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/account/verify_otp/",
        { email: registrationEmail, otp: otp }
      );
      console.log(response.data);
      Swal.fire({
        icon: "success",
        title: "Verified!",
        text: "Your email has been successfully verified. You can now log in!",
        confirmButtonColor: "#0B3D20",
      }).then(() => navigate("/LoginPage"));
    } catch (error) {
      const errorMessage =
        error.response?.data?.error || "Failed to verify OTP.";
      setError(errorMessage); // still update state for inline message
      Swal.fire({
        icon: "error",
        title: "Verification Failed",
        text: errorMessage,
        confirmButtonColor: "#B91C1C",
      });
    }
  };

  // const [showDetails, setShowDetails] = useState(false);
  // const toggleDetails = () => setShowDetails(!showDetails);

  return (
    <div className="flex h-screen raleway bg-amber-50 font-raleway">
      <div className="w-[60%] h-full">
        <img
          src={firstIMG}
          alt="Travel"
          className="object-cover h-full w-full"
        />
      </div>

      <div className="w-[40%] flex items-center justify-center relative">
        {/* Logo and Home Link */}
        <div className="absolute top-6 right-8 text-right">
          <Link to="/">
            <h1 className="text-2xl font-extrabold tracking-wide font-serif text-[#0B3D20]">
              <span className="text-black">Trail</span>
              <span className="text-[#295b42]">Himalaya</span>
            </h1>
          </Link>
          <Link
            to="/"
            className="text-sm text-gray-600 hover:text-black transition duration-200 mt-1 inline-block"
          >
            Go to Homepage &gt;
          </Link>
        </div>

        <div className="bg-amber-50 px-8 pt-6 pb-8 mb-4">
          <div className="text-6xl font-bold mb-2 text-center">Sign Up</div>
          <p className="text-[#295b42] text-mm text-center mb-6 italic">
            One step closer to the mountains.
          </p>

          <br />

          {!otpSent ? (
            <form onSubmit={handleSubmit}>
              <div className="flex mb-4 space-x-4">
                <div className="w-1/2">
                  <label
                    className="block text-gray-700 text-sm font-bold mb-2"
                    htmlFor="firstName"
                  >
                    First Name <span className="text-red-500">*</span>
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
                  <label
                    className="block text-gray-700 text-sm font-bold mb-2"
                    htmlFor="lastName"
                  >
                    Last Name <span className="text-red-500">*</span>
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
                  <label
                    className="block text-gray-700 text-sm font-bold mb-2"
                    htmlFor="username"
                  >
                    Username <span className="text-red-500">*</span>
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
                  <label
                    className="block text-gray-700 text-sm font-bold mb-2"
                    htmlFor="email"
                  >
                    Email <span className="text-red-500">*</span>
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
                  <label
                    className="block text-gray-700 text-sm font-bold mb-2"
                    htmlFor="password"
                  >
                    Password <span className="text-red-500">*</span>
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
                  <label
                    className="block text-gray-700 text-sm font-bold mb-2"
                    htmlFor="retypePassword"
                  >
                    Re-type Password <span className="text-red-500">*</span>
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
                  className="bg-black hover:bg-[#295b42] hover:text-white text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-50 disabled:cursor-not-allowed"
                  type="submit"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Processing..." : "Sign Up"}
                </button>

                <Link
                  to="/LoginPage"
                  className="inline-block align-baseline font-bold text-sm text-black hover:text-[#295b42]"
                >
                  Already have an account?
                </Link>
              </div>
              {/* <p className="text-sm text-gray-600 mt-6 text-center">
                Unlock your adventure toolkit.{" "}
                <button
                  onClick={toggleDetails}
                  className="text-[#295b42] hover:underline font-medium"
                >
                  {showDetails ? "Show less" : "Read more"}
                </button>
              </p>

              {showDetails && (
                <ul className="mt-4 text-sm text-gray-700 space-y-2 list-disc px-6">
                  <li>Create and share your own travel blogs</li>
                  <li>Generate personalized trekking itineraries</li>
                  <li>Join travel community channels</li>
                  <li>Review and rate destinations</li>
                  <li>Access real-time weather and safety alerts</li>
                  <li>Connect with other explorers worldwide</li>
                </ul>
              )} */}
            </form>
          ) : (
            <div>
              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="otp"
                >
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
