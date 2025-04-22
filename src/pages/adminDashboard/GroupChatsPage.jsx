import React, { useEffect, useState } from "react";
import axios from "axios";

const GroupChatsPage = () => {
  const [groups, setGroups] = useState([]);
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({
    group_name: "",
    group_image: null,
    members: [],
  });
  const [editingGroup, setEditingGroup] = useState(null);

  const fetchGroups = async () => {
    const res = await axios.get(
      "http://localhost:8000/admin_dashboard/groupchats/",
      {
        headers: {
          Authorization: `Token ${localStorage.getItem("authToken")}`
        },
      }
    );
    setGroups(res.data);
  };

  const fetchUsers = async () => {
    const res = await axios.get(
      "http://localhost:8000/admin_dashboard/users/",
      {
        headers: {
          Authorization: `Token ${localStorage.getItem("authToken")}`
        },
      }
    );
    setUsers(res.data);
  };

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "group_image") {
      setFormData({ ...formData, [name]: files[0] });
    } else if (name === "members") {
      const selected = Array.from(e.target.selectedOptions).map(
        (opt) => opt.value
      );
      setFormData({ ...formData, members: selected });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("group_name", formData.group_name);
    if (formData.group_image) data.append("group_image", formData.group_image);
    formData.members.forEach((memberId) => data.append("members", memberId));

    const url = editingGroup
      ? `http://localhost:8000/admin_dashboard/groupchats/${editingGroup.group_id}/`
      : "http://localhost:8000/admin_dashboard/groupchats/";

    const method = editingGroup ? "patch" : "post";

    await axios[method](url, data, {
      headers: {
        Authorization: `Token ${localStorage.getItem("authToken")}`, // ✅ fixed
        "Content-Type": "multipart/form-data",
      },
    });
    

    setFormData({ group_name: "", group_image: null, members: [] });
    setEditingGroup(null);
    fetchGroups();
  };

  const handleEdit = (group) => {
    setEditingGroup(group);
    setFormData({
      group_name: group.group_name,
      group_image: null,
      members: group.members,
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this group?")) return;
    await axios.delete(
      `http://localhost:8000/admin_dashboard/groupchats/${id}/`,
      {
        headers: {
          Authorization: `Token ${localStorage.getItem("authToken")}`
        },
      }
    );
    fetchGroups();
  };

  useEffect(() => {
    fetchGroups();
    fetchUsers();
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold text-[#0B3D20] mb-6">
        Manage Group Chats
      </h1>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white p-6 rounded shadow mb-10"
      >
        <input
          type="text"
          name="group_name"
          value={formData.group_name}
          onChange={handleInputChange}
          placeholder="Group name"
          className="p-2 border rounded"
          required
        />
        <input
          type="file"
          name="group_image"
          onChange={handleInputChange}
          className="p-2 border rounded"
        />
        <select
          name="members"
          multiple
          value={formData.members}
          onChange={handleInputChange}
          className="col-span-2 p-2 border rounded h-32"
        >
          {users.map((user) => (
            <option key={user.id} value={user.id}>
              {user.username}
            </option>
          ))}
        </select>

        <button
          type="submit"
          className="md:col-span-2 bg-[#0B3D20] text-white py-2 px-4 rounded hover:bg-[#12492b]"
        >
          {editingGroup ? "Update Group" : "Create Group"}
        </button>
      </form>

      {/* Group List */}
      <div className="overflow-x-auto bg-white rounded shadow">
        <table className="min-w-full text-sm text-left">
          <thead className="bg-[#0B3D20] text-white">
            <tr>
              <th className="px-6 py-3">Group Name</th>
              <th className="px-6 py-3">Created By</th>
              <th className="px-6 py-3">Members</th>
              <th className="px-6 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {groups.map((group) => (
              <tr key={group.group_id} className="border-b">
                <td className="px-6 py-3">{group.group_name}</td>
                <td className="px-6 py-3">{group.created_by}</td>
                <td className="px-6 py-3">
                  {Array.isArray(group.members)
                    ? group.members
                        .map((m, i) => (typeof m === "object" ? m.username : m))
                        .join(", ")
                    : "No members"}
                </td>
                <td className="px-6 py-3 flex gap-3">
                  <button
                    onClick={() => handleEdit(group)}
                    className="text-blue-600 hover:underline text-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(group.group_id)}
                    className="text-red-600 hover:underline text-sm"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default GroupChatsPage;
