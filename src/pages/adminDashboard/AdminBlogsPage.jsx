import React, { useEffect, useState } from "react";
import axios from "axios";

const AdminBlogsPage = () => {
  const [blogs, setBlogs] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    image: null,
  });
  const [editingId, setEditingId] = useState(null);

  const fetchBlogs = async () => {
    try {
      const res = await axios.get("http://localhost:8000/admin_dashboard/blogs/", {
        headers: {
          Authorization: `Token ${localStorage.getItem("adminAuthToken")}`
        },
      });
      setBlogs(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      setFormData({ ...formData, image: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("title", formData.title);
    data.append("description", formData.description);
    if (formData.image) data.append("image", formData.image);

    const url = editingId
      ? `http://localhost:8000/admin_dashboard/blogs/${editingId}/`
      : "http://localhost:8000/admin_dashboard/blogs/";

    const method = editingId ? "patch" : "post";

    try {
      await axios[method](url, data, {
        headers: {
          Authorization: `Token ${localStorage.getItem("adminAuthToken")}`,
          "Content-Type": "multipart/form-data",
        },
      });
      setFormData({ title: "", description: "", image: null });
      setEditingId(null);
      fetchBlogs();
    } catch (err) {
      console.error("Failed to save blog", err);
    }
  };

  const handleEdit = (blog) => {
    setEditingId(blog.id);
    setFormData({ title: blog.title, description: blog.description, image: null });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this blog?")) return;
    try {
      await axios.delete(`http://localhost:8000/admin_dashboard/blogs/${id}/`, {
        headers: {
          Authorization: `Token ${localStorage.getItem("authToken")}`,
        },
      });
      fetchBlogs();
    } catch (err) {
      console.error("Failed to delete blog", err);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold text-[#0B3D20] mb-6">Manage Blogs</h1>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white p-6 rounded shadow mb-10">
        <input
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Blog title"
          className="p-2 border rounded"
          required
        />
        <input
          type="file"
          name="image"
          accept="image/*"
          onChange={handleChange}
          className="p-2 border rounded"
        />
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Description"
          className="col-span-2 p-2 border rounded"
          rows={4}
          required
        />

        <div className="col-span-2">
          <button
            type="submit"
            className="bg-[#0B3D20] text-white py-2 px-4 rounded hover:bg-[#12492b]"
          >
            {editingId ? "Update Blog" : "Create Blog"}
          </button>
          {editingId && (
            <button
              type="button"
              className="ml-4 text-sm text-gray-500 underline"
              onClick={() => {
                setEditingId(null);
                setFormData({ title: "", description: "", image: null });
              }}
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      <div className="overflow-x-auto bg-white rounded shadow">
        <table className="min-w-full text-sm text-left">
          <thead className="bg-[#0B3D20] text-white">
            <tr>
              <th className="px-6 py-3">Title</th>
              <th className="px-6 py-3">Author</th>
              <th className="px-6 py-3">Created</th>
              <th className="px-6 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {blogs.map((blog) => (
              <tr key={blog.id} className="border-b">
                <td className="px-6 py-2">{blog.title}</td>
                <td className="px-6 py-2">{blog.author}</td>
                <td className="px-6 py-2">{new Date(blog.created_at).toLocaleDateString()}</td>
                <td className="px-6 py-2 flex gap-3">
                  <button onClick={() => handleEdit(blog)} className="text-blue-600 hover:underline text-sm">Edit</button>
                  <button onClick={() => handleDelete(blog.id)} className="text-red-600 hover:underline text-sm">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminBlogsPage;
