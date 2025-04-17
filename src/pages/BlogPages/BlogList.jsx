import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import { motion } from "framer-motion";
import { Typewriter } from "react-simple-typewriter";
import Footer from "../../components/Footer";
import Swal from "sweetalert2";

const BlogList = () => {
  const navigate = useNavigate();
  const [blogs, setBlogs] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(null);
  const [loggedInUsername, setLoggedInUsername] = useState(() =>
    localStorage.getItem("username")?.replace(/"/g, "").trim()
  );

  useEffect(() => {
    if (!loggedInUsername) {
      const storedUsername = localStorage.getItem("username");
      if (storedUsername) {
        setLoggedInUsername(storedUsername.replace(/"/g, "").trim());
      }
    }
  }, []);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await fetch("http://localhost:8000/blog/blogposts/");
        if (response.ok) {
          const data = await response.json();
          setBlogs(data);
        } else {
          console.error("Failed to fetch blogs");
        }
      } catch (error) {
        console.error("Error fetching blogs:", error);
      }
    };

    fetchBlogs();
  }, []);

  const toggleDropdown = (index) => {
    setDropdownOpen(dropdownOpen === index ? null : index);
  };

  const handleDelete = async (id) => {
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
        const response = await fetch(
          `http://localhost:8000/blog/blogposts/${id}/delete/`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Token ${localStorage.getItem("authToken")}`,
            },
          }
        );

        if (response.ok) {
          setBlogs((prevBlogs) => prevBlogs.filter((blog) => blog.id !== id));
          Swal.fire({
            icon: "success",
            title: "Deleted!",
            text: "Your blog post has been removed.",
            confirmButtonColor: "#0B3D20",
          });
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

  return (
    <div className="flex flex-col min-h-screen font-serif bg-[#f3f8f6]">
      <Navbar isBlack={true} />

      <main className="flex-grow py-[100px]">
        <div className="flex gap-x-20 px-[10%]">
          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeInOut" }}
            viewport={{ once: true }}
            className="flex flex-col mt-[150px] fixed gap-y-4 w-[35%]"
          >
            <div className="text-9xl font-serif font-bold break-words">
              Blogs
            </div>
            <div className="w-[50%] mt-5 font-serif text-2xl font-medium break-words self-end text-end mr-62">
              <Typewriter
                words={["Share your stories."]}
                loop={false}
                cursor
                cursorStyle="_"
                typeSpeed={200}
                deleteSpeed={0}
                delaySpeed={4000}
              />
            </div>

            <button
              onClick={() => navigate("/blog/add")}
              className="text-2xl font-medium mr-62 w-fit text-white bg-[#0B3D20] hover:bg-green-900 self-end rounded-3xl px-6 py-2 cursor-pointer"
            >
              Create
            </button>
          </motion.div>

          <div className="w-[50%]"></div>

          <div className="flex flex-col w-[50%] gap-y-10">
            {blogs.length > 0 ? (
              blogs.map((blog, index) => {
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, ease: "easeInOut" }}
                    viewport={{ once: true }}
                    onClick={() => navigate(`/blog/${blog.id}`)}
                    className="flex flex-col h-fit cursor-pointer"
                  >
                    <div className="flex flex-col gap-y-4">
                      <div className="h-[200px] rounded-lg border overflow-hidden">
                        <img
                          src={blog.image}
                          alt={blog.title}
                          className="h-full w-full object-cover"
                        />
                      </div>

                      {/* Author and 3-dot */}
                      <div className="w-full font-serif font-medium flex items-center gap-x-4">
                        <div
                          className="text-base text-gray-500 italic hover:underline cursor-pointer"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/user/${blog.author}`);
                          }}
                        >
                          by {blog.author}
                        </div>

                        {blog.author === loggedInUsername && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleDropdown(index);
                            }}
                            className="relative px-2 py-1 text-black"
                          >
                            &#8230;
                            {dropdownOpen === index && (
                              <div className="absolute right-0 mt-2 w-32 bg-white border border-gray-200 rounded-lg shadow-md z-10">
                                <ul>
                                  <li
                                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                    onClick={() => navigate(`/blog/${blog.id}/update`)}
                                  >
                                    Update
                                  </li>
                                  <li
                                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleDelete(blog.id);
                                    }}
                                  >
                                    Delete
                                  </li>
                                </ul>
                              </div>
                            )}
                          </button>
                        )}
                      </div>

                      {/* Blog Title + Created Date + Comment Count */}
                      <div className="flex flex-col gap-1">
                        <div className="text-3xl font-serif font-bold">
                          {blog.title}
                        </div>
                        <div className="flex items-center gap-x-4 text-black text-sm mt-1 underline">
                          <div>
                            {blog.created_at &&
                              new Date(blog.created_at).toDateString()}
                          </div>
                          <div>• {blog.comment_count} Comments</div>
                        </div>
                      </div>

                      {/* Blog Description */}
                      <div className="text-base font-serif w-full line-clamp-4">
                        {blog.description}
                      </div>
                    </div>

                    <hr className="mt-10" />
                  </motion.div>
                );
              })
            ) : (
              <div>No blogs available</div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default BlogList;
