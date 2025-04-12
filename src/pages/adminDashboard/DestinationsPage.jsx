import React, { useEffect, useState } from "react";
import axios from "axios";

const DestinationsPage = () => {
  const [destinations, setDestinations] = useState([]);
  const [selectedDestination, setSelectedDestination] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    display_title: "",
    altitude: "",
    grade: "Easy",
    duration: "",
    about: "",
    location: "",
    slug: "",
  });

  const [images, setImages] = useState({
    about_image_1: null,
    about_image_2: null,
    cover_image: null,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchDestinations = async () => {
    try {
      const res = await axios.get("http://localhost:8000/admin_dashboard/destinations/", {
        headers: {
          Authorization: `Token ${localStorage.getItem("authToken")}`,
        },
      });
      setDestinations(res.data);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch destinations.");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    setImages({ ...images, [e.target.name]: e.target.files[0] });
  };

  const handleCreateDestination = async (e) => {
    e.preventDefault();
    const data = new FormData();

    Object.entries(formData).forEach(([key, value]) => {
      data.append(key, value);
    });

    Object.entries(images).forEach(([key, file]) => {
      if (file) data.append(key, file);
    });

    try {
      const url = selectedDestination
        ? `http://localhost:8000/admin_dashboard/destinations/${selectedDestination.destination_id}/`
        : "http://localhost:8000/admin_dashboard/destinations/";

      const method = selectedDestination ? "patch" : "post";

      await axios[method](url, data, {
        headers: {
          Authorization: `Token ${localStorage.getItem("authToken")}`,
          "Content-Type": "multipart/form-data",
        },
      });

      setFormData({
        name: "",
        description: "",
        display_title: "",
        altitude: "",
        grade: "Easy",
        duration: "",
        about: "",
        location: "",
        slug: "",
      });

      setImages({
        about_image_1: null,
        about_image_2: null,
        cover_image: null,
      });

      setSelectedDestination(null);
      fetchDestinations();
    } catch (err) {
      console.error(err);
      alert("Failed to save destination");
    }
  };

  const handleEdit = (dest) => {
    setSelectedDestination(dest);
    setFormData({
      name: dest.name,
      description: dest.description,
      display_title: dest.display_title,
      altitude: dest.altitude,
      grade: dest.grade,
      duration: dest.duration,
      about: dest.about,
      location: dest.location,
      slug: dest.slug || "",
    });
    setImages({ about_image_1: null, about_image_2: null, cover_image: null });
  };

  const handleDelete = async (destination_id) => {
    if (!window.confirm("Are you sure you want to delete this destination?")) return;
    try {
      await axios.delete(`http://localhost:8000/admin_dashboard/destinations/${destination_id}/`, {
        headers: {
          Authorization: `Token ${localStorage.getItem("authToken")}`,
        },
      });
      fetchDestinations();
    } catch (err) {
      console.error(err);
      alert("Failed to delete destination");
    }
  };

  useEffect(() => {
    fetchDestinations();
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold text-[#0B3D20] mb-6">
        Manage Destinations
      </h1>

      {/* Add/Edit Destination Form */}
      <form
        onSubmit={handleCreateDestination}
        className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-white p-6 rounded-lg shadow mb-8"
        encType="multipart/form-data"
      >
        <input name="name" placeholder="Name" value={formData.name} onChange={handleInputChange} className="p-2 border rounded" required />
        <input name="display_title" placeholder="Display Title" value={formData.display_title} onChange={handleInputChange} className="p-2 border rounded" required />
        <textarea name="description" placeholder="Description" value={formData.description} onChange={handleInputChange} className="p-2 border rounded col-span-2" />
        <input name="altitude" placeholder="Altitude" value={formData.altitude} onChange={handleInputChange} type="number" className="p-2 border rounded" />
        <input name="duration" placeholder="Duration" value={formData.duration} onChange={handleInputChange} type="number" className="p-2 border rounded" />
        <select name="grade" value={formData.grade} onChange={handleInputChange} className="p-2 border rounded">
          <option value="Easy">Easy</option>
          <option value="Moderate">Moderate</option>
          <option value="Challenging">Hard</option>
        </select>
        <input name="location" placeholder="Location" value={formData.location} onChange={handleInputChange} className="p-2 border rounded" />
        <textarea name="about" placeholder="About" value={formData.about} onChange={handleInputChange} className="p-2 border rounded col-span-2" />

        {/* Image Uploads */}
        <div className="col-span-2">
          <label className="block text-sm font-medium mb-1 text-gray-700">About Image 1:</label>
          <input type="file" name="about_image_1" accept="image/*" onChange={handleImageChange} />
        </div>
        <div className="col-span-2">
          <label className="block text-sm font-medium mb-1 text-gray-700">About Image 2:</label>
          <input type="file" name="about_image_2" accept="image/*" onChange={handleImageChange} />
        </div>
        <div className="col-span-2">
          <label className="block text-sm font-medium mb-1 text-gray-700">Cover Image:</label>
          <input type="file" name="cover_image" accept="image/*" onChange={handleImageChange} />
        </div>

        <input name="slug" placeholder="Slug (optional)" value={formData.slug} onChange={handleInputChange} className="p-2 border rounded col-span-2" />

        <div className="flex items-center gap-4 sm:col-span-2">
          <button type="submit" className="bg-[#0B3D20] text-white py-2 px-4 rounded hover:bg-[#12492b]">
            {selectedDestination ? "Update" : "Add"} Destination
          </button>
          {selectedDestination && (
            <button type="button" onClick={() => setSelectedDestination(null)} className="text-sm text-gray-600 underline">
              Cancel Edit
            </button>
          )}
        </div>
      </form>

      {/* 📋 Table */}
      {loading ? (
        <p className="text-gray-500">Loading destinations...</p>
      ) : error ? (
        <p className="text-red-600">{error}</p>
      ) : (
        <div className="overflow-x-auto bg-white rounded-lg shadow">
          <table className="min-w-full text-sm text-left">
            <thead className="bg-[#0B3D20] text-white">
              <tr>
                <th className="px-6 py-3">Display Title</th>
                <th className="px-6 py-3">Grade</th>
                <th className="px-6 py-3">Altitude</th>
                <th className="px-6 py-3">Duration</th>
                <th className="px-6 py-3">Location</th>
                <th className="px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {destinations.map((dest) => (
                <tr key={dest.destination_id} className="border-b">
                  <td className="px-6 py-3">{dest.display_title}</td>
                  <td className="px-6 py-3">{dest.grade}</td>
                  <td className="px-6 py-3">{dest.altitude}</td>
                  <td className="px-6 py-3">{dest.duration}</td>
                  <td className="px-6 py-3">{dest.location}</td>
                  <td className="px-6 py-3 flex gap-3">
                    <button onClick={() => handleEdit(dest)} className="text-blue-600 hover:underline text-sm">Edit</button>
                    <button onClick={() => handleDelete(dest.destination_id)} className="text-red-600 hover:underline text-sm">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default DestinationsPage;
