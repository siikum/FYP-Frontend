// src/components/ProfilePage.jsx
import React, { useState, useEffect, useRef } from 'react';
import Navbar from "../components/Navbar";
import { FaPencilAlt, FaTrash, FaUpload } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom'; // Import for potential redirects

// --- Configuration ---
// IMPORTANT: Replace with your actual backend API URL
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'; // Use env variable or default
const PROFILE_API_URL = `${API_BASE_URL}/account/profile/`;

const ProfilePage = () => {
    const [user, setUser] = useState(null); // Initialize user as null
    const [editedBio, setEditedBio] = useState('');
    const [isLoading, setIsLoading] = useState(true); // Loading state for initial fetch
    const [isUpdating, setIsUpdating] = useState(false); // Loading state for updates
    const [error, setError] = useState(null); // Error state

    const [showPicOptions, setShowPicOptions] = useState(false);
    const [showBioOptions, setShowBioOptions] = useState(false);
    const [isEditingBio, setIsEditingBio] = useState(false);

    const bioOptionsRef = useRef(null);
    const picOptionsRef = useRef(null);
    const fileInputRef = useRef(null); // Ref for the hidden file input

    const navigate = useNavigate(); // Hook for navigation

    // --- Helper: Get Auth Token ---
    const getAuthToken = () => {
        // Replace with your actual token storage mechanism
        const token = localStorage.getItem('authToken');
        if (!token) {
            console.error("Authentication token not found.");
            // Optionally redirect to login
            // navigate('/login');
            return null;
        }
        return token;
    };

    // --- Fetch Profile Data on Mount ---
    useEffect(() => {
        const fetchProfileData = async () => {
            setIsLoading(true);
            setError(null);
            const token = getAuthToken();
            if (!token) {
                setIsLoading(false);
                setError("You are not logged in."); // Set error state
                return; // Stop if no token
            }

            try {
                const response = await fetch(PROFILE_API_URL, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Token ${token}`,
                        'Content-Type': 'application/json', // Optional for GET, but good practice
                    },
                });

                if (response.status === 401) {
                    throw new Error("Unauthorized. Please log in again.");
                    // Consider removing invalid token and redirecting
                    // localStorage.removeItem('authToken');
                    // navigate('/login');
                }
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }

                const data = await response.json();
                setUser(data);
                setEditedBio(data.bio || ''); // Initialize editedBio
            } catch (err) {
                console.error("Failed to fetch profile:", err);
                setError(err.message || "Failed to load profile data.");
                 // Handle specific errors like 401 (Unauthorized) potentially
                 if (err.message.includes("Unauthorized")) {
                    // Handle token expiry or invalid token - maybe clear token and redirect
                    localStorage.removeItem('authToken');
                    navigate('/login'); // Redirect to login page
                }
            } finally {
                setIsLoading(false);
            }
        };

        fetchProfileData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [navigate]); // Add navigate to dependencies, or disable lint rule for this line


    // --- Close dropdowns when clicking outside ---
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (picOptionsRef.current && !picOptionsRef.current.contains(event.target)) {
                setShowPicOptions(false);
            }
            if (bioOptionsRef.current && !bioOptionsRef.current.contains(event.target) &&
                !bioOptionsRef.current.querySelector('button')?.contains(event.target)) {
               setShowBioOptions(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);


    // --- Generic Update Function ---
    const updateProfile = async (payload, isFormData = false) => {
        setIsUpdating(true);
        setError(null);
        const token = getAuthToken();
        if (!token) {
             setError("Authentication token missing.");
             setIsUpdating(false);
             return false; // Indicate failure
        }

        const headers = {
            'Authorization': `Token ${token}`,
        };
        // Don't set Content-Type for FormData, fetch does it automatically with boundary
        if (!isFormData) {
            headers['Content-Type'] = 'application/json';
        }

        try {
            const response = await fetch(PROFILE_API_URL, {
                method: 'PATCH',
                headers: headers,
                body: isFormData ? payload : JSON.stringify(payload),
            });

            if (!response.ok) {
                // Try to get error details from backend response
                let errorData = { message: `HTTP error! Status: ${response.status}`};
                try {
                    errorData = await response.json();
                } catch (jsonError) { /* Ignore if response is not JSON */ }
                console.error("Update failed:", errorData);
                throw new Error(errorData.detail || errorData.message || `Failed to update profile. Status: ${response.status}`);
            }

            const updatedUserData = await response.json();
            setUser(updatedUserData); // Update local state with response from backend
             // If bio was updated, also update editedBio in case user cancels next edit
            if (payload.bio !== undefined) {
                setEditedBio(updatedUserData.bio || '');
            }
            return true; // Indicate success

        } catch (err) {
            console.error("Profile update error:", err);
            setError(err.message || "An error occurred while updating.");
            return false; // Indicate failure
        } finally {
            setIsUpdating(false);
        }
    };


    // --- Profile Picture Handlers ---
    const togglePicOptions = (e) => {
        e.stopPropagation();
        setShowPicOptions(prev => !prev);
        setShowBioOptions(false);
    };

    const handleDeletePicture = async () => {
        if (window.confirm("Are you sure you want to delete your profile picture?")) {
            setShowPicOptions(false); // Close dropdown immediately
            const success = await updateProfile({ profile_picture: null }); // Send null to backend
            if (!success) {
                // Error already set by updateProfile
                // Optionally show a specific message: setError("Could not delete picture.");
            }
        } else {
            setShowPicOptions(false);
        }
    };

    const handleChangePictureClick = () => {
        setShowPicOptions(false);
        // Trigger the hidden file input
        fileInputRef.current?.click();
    };

    const handleFileSelected = async (event) => {
        const file = event.target.files?.[0];
        if (!file) {
            return; // No file selected
        }

        // Basic file type check (optional but recommended)
        if (!file.type.startsWith('image/')) {
            setError("Please select an image file.");
            return;
        }
        // Basic file size check (optional - e.g., 5MB)
        if (file.size > 5 * 1024 * 1024) {
             setError("File is too large. Maximum size is 5MB.");
             return;
        }


        const formData = new FormData();
        formData.append('profile_picture', file); // Key must match backend field name

        const success = await updateProfile(formData, true); // Pass FormData and flag

         // Clear the file input value after upload attempt (success or fail)
         // This allows selecting the same file again if needed after an error
        if (event.target) {
            event.target.value = null;
        }

        if (!success) {
            // Error already set by updateProfile
            // setError("Could not upload picture.");
        }
    };


    // --- Bio Handlers ---
    const toggleBioOptions = (e) => {
        e.stopPropagation();
        setShowBioOptions(prev => !prev);
        setShowPicOptions(false);
    };

    const handleUpdateBioClick = () => {
        // Initialize editor with the LATEST user bio from state
        setEditedBio(user?.bio || '');
        setIsEditingBio(true);
        setShowBioOptions(false);
    };

    const handleDeleteBio = async () => {
        if (window.confirm("Are you sure you want to delete your bio? This cannot be undone.")) {
            setShowBioOptions(false);
            const success = await updateProfile({ bio: null }); // Send null or "" based on backend expectation
            if (!success) {
                 // Error already set by updateProfile
                // setError("Could not delete bio.");
            } else {
                setIsEditingBio(false); // Ensure edit mode is off if deletion successful
            }
        } else {
            setShowBioOptions(false);
        }
    };

    const handleBioChange = (event) => {
        setEditedBio(event.target.value);
    };

    const handleSaveBio = async () => {
        const success = await updateProfile({ bio: editedBio });
        if (success) {
            setIsEditingBio(false); // Exit edit mode only on success
        } else {
             // Error already set by updateProfile
            // setError("Could not save bio.");
        }
    };

    const handleCancelEditBio = () => {
        setIsEditingBio(false);
        // Reset editedBio to the current user bio from state, discarding changes
        setEditedBio(user?.bio || '');
    };


    // --- Render Logic ---
    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-amber-50">
                <Navbar isBlack={true} />
                <p>Loading profile...</p> {/* Replace with a spinner component if desired */}
            </div>
        );
    }

     // Handle case where user data couldn't be loaded but not technically 'loading'
    if (!user && !isLoading) {
         return (
             <div className="flex flex-col items-center justify-center min-h-screen bg-amber-50 px-4">
                 <Navbar isBlack={true} />
                 <p className="text-red-600 text-center mt-20">
                     {error || "Could not load profile data. Please try logging in again."}
                 </p>
                 {/* Optional: Add a button to retry or go to login */}
                 <button
                     onClick={() => navigate('/login')}
                     className="mt-4 px-4 py-2 bg-amber-500 text-white rounded hover:bg-amber-600 transition duration-200"
                 >
                     Go to Login
                 </button>
             </div>
         );
     }

    // --- Full Component Render (User data loaded) ---
    return (
        <div className="flex flex-col raleway bg-amber-50 py-[100px] min-h-screen">
            <Navbar isBlack={true} />

            {/* Hidden File Input */}
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileSelected}
                style={{ display: 'none' }}
                accept="image/png, image/jpeg, image/gif" // Specify accepted image types
            />

            <div className="flex flex-col md:flex-row gap-x-20 px-[5%] sm:px-[10%] items-start">
                {/* Left Side */}
                <div className="w-full md:w-[35%] mt-[50px] md:mt-[150px] mb-10 md:mb-0">
                    <div className="text-6xl md:text-9xl raleway font-bold break-words text-center md:text-left">My Profile</div>
                </div>

                {/* Right Side */}
                <div className="w-full md:w-[55%] mt-0 md:mt-[100px]">
                    {/* Error Display Area */}
                    {error && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
                            <strong className="font-bold">Error: </strong>
                            <span className="block sm:inline">{error}</span>
                            <span className="absolute top-0 bottom-0 right-0 px-4 py-3" onClick={() => setError(null)}>
                                <svg className="fill-current h-6 w-6 text-red-500" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><title>Close</title><path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z"/></svg>
                            </span>
                        </div>
                    )}

                    {/* Profile Card */}
                    <div className={`bg-white rounded-lg shadow-xl p-6 ${isUpdating ? 'opacity-70' : ''}`}> {/* Indicate update in progress */}
                        {/* Profile Picture and User Info Row */}
                        <div className="flex flex-col sm:flex-row items-center">
                            {/* Profile Picture Section */}
                            <div ref={picOptionsRef} className="relative mb-4 sm:mb-0 sm:mr-4">
                                <div
                                    className="w-32 h-32 rounded-full overflow-hidden border-4 border-white cursor-pointer relative group"
                                    onClick={togglePicOptions}
                                >
                                    <img
                                        // Construct full URL if backend provides relative path
                                        src={user?.profile_picture ? `${API_BASE_URL}${user.profile_picture}` : '/path/to/default-avatar.png'}
                                        alt="Profile"
                                        className="w-full h-full object-cover"
                                        onError={(e) => { e.target.onerror = null; e.target.src='/path/to/default-avatar.png' }} // Fallback on image load error
                                    />
                                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-0 group-hover:bg-opacity-50 text-gray-300 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                        <FaPencilAlt size="1.5em" />
                                    </div>
                                </div>

                                {/* Picture Options Dropdown */}
                                {showPicOptions && (
                                <div className="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 border border-gray-200">
                                    <ul>
                                        <li onClick={handleDeletePicture} className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left cursor-pointer">
                                            <FaTrash className="mr-3 text-gray-500" /> Delete Picture
                                        </li>
                                        <li onClick={handleChangePictureClick} className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left cursor-pointer">
                                            <FaUpload className="mr-3 text-gray-500" /> Change Picture
                                        </li>
                                    </ul>
                                </div>
                                )}
                            </div>
                            {/* User Info */}
                            <div className="text-center sm:text-left">
                                <h2 className="text-2xl font-semibold text-gray-800">{user?.username || 'Username'}</h2>
                                {/* Display First/Last Name if available */}
                                {(user?.first_name || user?.last_name) && (
                                     <p className="text-gray-600 text-sm mt-1">{`${user.first_name || ''} ${user.last_name || ''}`.trim()}</p>
                                )}
                            </div>
                        </div>

                        {/* Bio Section */}
                        <div className="mt-6 border-t pt-4">
                            {isEditingBio ? (
                                // Editing View
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Edit Bio</h3>
                                    <textarea
                                        className="w-full p-2 border rounded text-gray-700 focus:outline-none focus:ring-2 focus:ring-amber-500 transition duration-200"
                                        value={editedBio}
                                        onChange={handleBioChange}
                                        rows={5}
                                        placeholder="Tell us about yourself..."
                                        disabled={isUpdating} // Disable while updating
                                    />
                                    <div className="flex justify-end gap-2 mt-3">
                                        <button
                                            onClick={handleCancelEditBio}
                                            className="px-4 py-1 bg-gray-200 hover:bg-gray-300 rounded text-gray-800 text-sm transition duration-200 disabled:opacity-50"
                                            disabled={isUpdating}
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={handleSaveBio}
                                            className="px-4 py-1 bg-amber-500 hover:bg-amber-600 rounded text-white text-sm transition duration-200 disabled:opacity-50"
                                            disabled={isUpdating}
                                        >
                                            {isUpdating ? 'Saving...' : 'Save Changes'}
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                // Display View
                                <div>
                                    <div className="flex justify-between items-center mb-2">
                                        <h3 className="text-lg font-semibold text-gray-800">Bio</h3>
                                        <div ref={bioOptionsRef} className="relative">
                                            <button
                                                onClick={toggleBioOptions}
                                                className="text-gray-500 hover:text-gray-800 px-2 py-1 rounded hover:bg-gray-100 transition duration-200 focus:outline-none disabled:opacity-50"
                                                aria-label="Bio options"
                                                disabled={isUpdating} // Disable while any update is happening
                                            >
                                                …
                                            </button>
                                            {showBioOptions && (
                                                <div className="absolute right-0 mt-1 w-36 bg-white rounded-md shadow-lg z-10 border border-gray-200">
                                                    <ul className="py-1">
                                                        <li className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer" onClick={handleUpdateBioClick}>
                                                            <FaPencilAlt className="mr-3 text-gray-500" size={12} /> Update Bio
                                                        </li>
                                                        <li className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-100 cursor-pointer" onClick={handleDeleteBio}>
                                                            <FaTrash className="mr-3" size={12} /> Delete Bio
                                                        </li>
                                                    </ul>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <p className="text-gray-700 whitespace-pre-wrap min-h-[4em]"> {/* Added min-height */}
                                        {user?.bio || <span className="text-gray-400 italic">No bio yet. Click the '…' to add one.</span>}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Posts Section Placeholder */}
                    <div className="bg-white rounded-lg shadow-xl p-6 mt-6">
                        <h3 className="text-lg font-semibold mb-2">Posts</h3>
                        <p className="text-gray-700">
                            User's posts will be displayed here. (This is a placeholder)
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;