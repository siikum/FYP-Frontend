// ✅ CLEANED & ORGANIZED PROFILE PAGE
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from "../components/Navbar";
import { FaPencilAlt, FaTrash, FaUpload } from 'react-icons/fa';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
const PROFILE_API_URL = `${API_BASE_URL}/account/profile/`;

const ProfilePage = () => {
  // 🧠 State Management
  const [user, setUser] = useState(null);
  const [editedBio, setEditedBio] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState(null);

  const [isEditingBio, setIsEditingBio] = useState(false);
  const [showPicOptions, setShowPicOptions] = useState(false);
  const [showBioOptions, setShowBioOptions] = useState(false);

  const fileInputRef = useRef(null);
  const bioOptionsRef = useRef(null);
  const picOptionsRef = useRef(null);
  const navigate = useNavigate();

  // 🔐 Token Helper
  const getAuthToken = () => localStorage.getItem('authToken');

  // 📦 Fetch Profile
  useEffect(() => {
    const fetchProfile = async () => {
      setIsLoading(true);
      const token = getAuthToken();
      if (!token) return navigate('/login');

      try {
        const res = await fetch(PROFILE_API_URL, {
          headers: { Authorization: `Token ${token}` },
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        setUser(data);
        setEditedBio(data.bio || '');
      } catch (err) {
        console.error(err);
        setError("Could not load profile.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfile();
  }, [navigate]);

  // 🧹 Close dropdowns
  useEffect(() => {
    const handleClick = (e) => {
      if (!picOptionsRef.current?.contains(e.target)) setShowPicOptions(false);
      if (!bioOptionsRef.current?.contains(e.target)) setShowBioOptions(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  // 🔄 Profile Updater
  const updateProfile = async (payload, isFormData = false) => {
    const token = getAuthToken();
    if (!token) return false;
    setIsUpdating(true);
    setError(null);

    const headers = { Authorization: `Token ${token}` };
    if (!isFormData) headers['Content-Type'] = 'application/json';

    try {
      const res = await fetch(PROFILE_API_URL, {
        method: 'PATCH',
        headers,
        body: isFormData ? payload : JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const updated = await res.json();
      setUser(updated);
      if (payload.bio !== undefined) setEditedBio(updated.bio || '');
      return true;
    } catch (err) {
      setError("Update failed.");
      return false;
    } finally {
      setIsUpdating(false);
    }
  };

  // 📸 Picture Handlers
  const handleFileSelected = async (e) => {
    const file = e.target.files?.[0];
    if (!file || !file.type.startsWith('image/')) return;
    const formData = new FormData();
    formData.append('profile_picture', file);
    await updateProfile(formData, true);
    e.target.value = null;
  };

  const handleDeletePicture = () => updateProfile({ profile_picture: null });

  // ✍️ Bio Handlers
  const handleSaveBio = async () => {
    const success = await updateProfile({ bio: editedBio });
    if (success) setIsEditingBio(false);
  };

  if (isLoading) return <div className="text-center py-32">Loading...</div>;
  if (!user) return <div className="text-center py-32 text-red-500">{error || "User not found"}</div>;

  return (
    <div className="min-h-screen bg-amber-50 pt-24 px-4 md:px-20">
      <Navbar isBlack={true} />

      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/*"
        onChange={handleFileSelected}
      />

      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-6">
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <div ref={picOptionsRef} className="relative group">
            <img
              src={user.profile_picture ? `${API_BASE_URL}${user.profile_picture}` : '/path/to/default-avatar.png'}
              className="w-32 h-32 rounded-full object-cover border-2 border-gray-300 cursor-pointer"
              alt="Profile"
              onClick={() => setShowPicOptions((prev) => !prev)}
            />
            {showPicOptions && (
              <div className="absolute z-10 mt-2 bg-white border rounded shadow-md w-40">
                <button onClick={() => fileInputRef.current?.click()} className="block w-full px-4 py-2 hover:bg-gray-100 text-left">Change</button>
                <button onClick={handleDeletePicture} className="block w-full px-4 py-2 hover:bg-gray-100 text-left text-red-600">Delete</button>
              </div>
            )}
          </div>

          <div className="text-center sm:text-left">
            <h2 className="text-2xl font-bold">{user.username}</h2>
            {(user.first_name || user.last_name) && (
              <p className="text-gray-500">{user.first_name} {user.last_name}</p>
            )}
          </div>
        </div>

        {/* 🧾 BIO SECTION */}
        <div className="mt-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Bio</h3>
            <div ref={bioOptionsRef}>
              {!isEditingBio && (
                <button
                  onClick={() => setIsEditingBio(true)}
                  className="text-sm text-blue-500 hover:underline"
                >
                  Edit
                </button>
              )}
            </div>
          </div>

          {isEditingBio ? (
            <div className="mt-2">
              <textarea
                className="w-full border rounded p-2"
                rows={4}
                value={editedBio}
                onChange={(e) => setEditedBio(e.target.value)}
              />
              <div className="flex justify-end mt-2 gap-2">
                <button onClick={() => setIsEditingBio(false)} className="text-sm px-3 py-1 bg-gray-200 rounded">Cancel</button>
                <button onClick={handleSaveBio} className="text-sm px-3 py-1 bg-amber-500 text-white rounded">Save</button>
              </div>
            </div>
          ) : (
            <p className="text-gray-700 mt-2 whitespace-pre-wrap min-h-[4em]">
              {user.bio || <span className="italic text-gray-400">No bio added yet.</span>}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;