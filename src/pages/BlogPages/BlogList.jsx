import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import { motion } from "framer-motion";
import { Typewriter } from "react-simple-typewriter";
import Footer from "../../components/Footer";

const BlogList = () => {
  const navigate = useNavigate();
  const [blogs, setBlogs] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(null);
  const [loggedInUsername, setLoggedInUsername] = useState(() =>
    localStorage.getItem("username")?.replace(/"/g, "").trim()
  );
  
  useEffect(() => {
    // If for some reason username was undefined during first render
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
          console.log("Fetched blogs:", data);
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
        console.log("Blog deleted successfully");
      } else {
        console.error("Failed to delete the blog");
      }
    } catch (error) {
      console.error("Error deleting blog:", error);
    }
  };

  return (
    <div className="flex flex-col min-h-screen font-serif bg-[#f3f8f6] py-[100px]">
      <Navbar isBlack={true} />
      <div className="flex gap-x-20 px-[10%]">
        {/* Sidebar */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeInOut" }}
          viewport={{ once: true }}
          className="flex flex-col mt-[150px] fixed gap-y-4 w-[35%]"
        >
          <div className="text-9xl font-serif font-bold break-words">Blogs</div>
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
              // Debugging per blog
              console.log(`📘 Blog: ${blog.title}`);
              console.log("blog.author:", blog.author);
              console.log("loggedInUsername:", loggedInUsername);
              console.log("Match?", blog.author === loggedInUsername);

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

                    <div className="w-full font-serif font-medium flex items-center gap-x-4">
                      <div className="px-4 py-1 rounded-2xl bg-black text-white text-sm">#blog</div>
                      <div className="px-4 py-1 rounded-2xl bg-black text-white text-sm">#trekking</div>
                      <div className="px-4 py-1 rounded-2xl bg-black text-white text-sm">#nepal</div>
                      <div
  className="text-base text-gray-500 italic hover:underline cursor-pointer"
  onClick={(e) => {
    e.stopPropagation();
    navigate(`/user/${blog.author}`);
  }}
>
  by {blog.author}
</div>

                      {/* Show 3-dot menu only for blog author */}
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

                    <div className="text-3xl font-serif font-bold">
                      {blog.title}
                    </div>
                  </div>

                  <div className="text-base font-serif w-full line-clamp-4">
                    {blog.description}
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
      <Footer />
    </div>
  );
};

export default BlogList;
