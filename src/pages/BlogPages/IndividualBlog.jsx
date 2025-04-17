import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import { motion } from "framer-motion";
import pfp from "../../assets/images/pf.jpg";
import CommentSection from "./CommentSection";
import Footer from "../../components/Footer";
import Swal from "sweetalert2";

const IndividualBlog = () => {
  const [blog, setBlog] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();
  const loggedInUsername = localStorage.getItem("username")?.replace(/"/g, "").trim();
  const dropdownRef = useRef(null);

  useEffect(() => {
    const fetchBlogPost = async () => {
      const response = await fetch(`http://localhost:8000/blog/blogposts/${id}/`);
      const data = await response.json();
      setBlog(data);
    };
    fetchBlogPost();
  }, [id]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleDelete = async () => {
    const confirmResult = await Swal.fire({
      title: "Are you sure?",
      text: "This blog post will be permanently deleted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#B91C1C",
      cancelButtonColor: "#0B3D20",
      confirmButtonText: "Yes, delete it!",
    });

    if (confirmResult.isConfirmed) {
      try {
        const response = await fetch(`http://localhost:8000/blog/blogposts/${id}/delete/`, {
          method: "DELETE",
          headers: {
            Authorization: `Token ${localStorage.getItem("authToken")}`,
          },
        });

        if (response.ok) {
          Swal.fire({
            icon: "success",
            title: "Deleted!",
            text: "Your blog post has been removed.",
            confirmButtonColor: "#0B3D20",
          });
          navigate("/blog");
        } else {
          Swal.fire({
            icon: "error",
            title: "Failed!",
            text: "Could not delete the blog post.",
            confirmButtonColor: "#B91C1C",
          });
        }
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Oops!",
          text: "Something went wrong while deleting the blog.",
          confirmButtonColor: "#B91C1C",
        });
        console.error("Error deleting blog:", error);
      }
    }
  };

  const toggleDropdown = (e) => {
    e.stopPropagation();
    setDropdownOpen((prev) => !prev);
  };

  if (!blog) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col min-h-screen font-serif bg-[#f3f8f6]">
      <Navbar isBlack={true} />

      <main className="flex-grow py-[100px] px-[10%] flex flex-col gap-y-16">
        {/* Blog Image */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.75, ease: "easeInOut" }}
          viewport={{ once: true }}
          className="h-[500px] rounded-lg border overflow-hidden relative"
        >
          <img
            src={blog.image || pfp}
            alt={blog.title}
            className="w-full h-full object-cover"
          />
        </motion.div>

        {/* Blog Info */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.75, ease: "easeInOut" }}
          viewport={{ once: true }}
          className="flex flex-col gap-y-4"
        >
          <div className="text-gray-500 italic text-base flex items-center gap-x-2 relative">
            <div
              className="hover:underline cursor-pointer"
              onClick={() => navigate(`/user/${blog.author}`)}
            >
              by {blog.author}
            </div>

            {blog.author === loggedInUsername && (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={toggleDropdown}
                  className="text-black text-xl px-2 py-1"
                >
                  &#8230;
                </button>
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-32 bg-white border border-gray-200 rounded-lg shadow-md z-10">
                    <ul>
                      <li
                        className="px-4 py-2 text-black hover:bg-gray-100 cursor-pointer"
                        onClick={() => navigate(`/blog/${id}/update`)}
                      >
                        Update
                      </li>
                      <li
                        className="px-4 py-2 text-black hover:bg-gray-100 cursor-pointer"
                        onClick={handleDelete}
                      >
                        Delete
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="text-5xl font-serif font-bold w-full leading-tight">
            {blog.title}
          </div>
        </motion.div>

        {/* Blog Description */}
        <div className="flex flex-col gap-y-5">
          <div className="text-2xl font-serif text-justify w-full">
            {blog.description}
          </div>
        </div>

        {/* Comments */}
        <CommentSection postId={id} />
      </main>

      <Footer />
    </div>
  );
};

export default IndividualBlog;
