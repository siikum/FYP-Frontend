import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import { motion } from "framer-motion";

const BlogList = () => {
  const navigate = useNavigate();
  const [blogs, setBlogs] = useState([]); // State to hold the list of blogs

  // Fetch blogs from the API
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await fetch("http://localhost:8000/blog/blogposts"); // Make sure this is correct
        if (response.ok) {
          const data = await response.json();
          console.log(data); // For debugging, see if the blog posts are returned
          setBlogs(data); // Or whatever state setter you use to display the blogs
        } else {
          console.error("Failed to fetch blogs");
        }
      } catch (error) {
        console.error("Error fetching blogs:", error);
      }
    };

    fetchBlogs(); // Call the fetch function
  }, []); // Empty dependency array means this will run only once, when the component mounts

  const [dropdownOpen, setDropdownOpen] = useState(null); // Manage which dropdown is open

  const toggleDropdown = (index) => {
    if (dropdownOpen === index) {
      setDropdownOpen(null); // Close dropdown if clicked again
    } else {
      setDropdownOpen(index); // Open specific dropdown
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:8000/blog/blogposts/${id}/delete/`, {
        method: "DELETE",
      });
  
      if (response.ok) {
        // Remove the deleted blog from the list
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
    <div className="flex flex-col bg-amber-50 py-[100px]">
      <Navbar isBlack={true} />
      <div className="flex gap-x-20 px-[10%]">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeInOut" }}
          viewport={{ once: true }}
          className="flex flex-col mt-[150px] fixed gap-y-4 w-[35%]"
        >
          <div className="text-9xl raleway font-bold break-words">Blogs</div>
          <div className="w-[50%] text-2xl raleway font-medium break-words self-end text-end">
            Explore the world through the eyes of our travelers
          </div>
          <button
            onClick={() => {
              navigate("/blog/add");
            }}
            className="text-2xl font-medium w-fit text-white bg-orange-500 hover:bg-orange-400 self-end rounded-3xl px-6 py-2 cursor-pointer"
          >
            Create
          </button>
        </motion.div>
        <div className="w-[50%]"></div>
        <div className="flex flex-col w-[50%] gap-y-10">
          {blogs.length > 0 ? (
            blogs.map((blog, index) => (
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, ease: "easeInOut" }}
                viewport={{ once: true }}
                key={index}
                onClick={() => {
                  navigate(`/blog/${blog.id}`); // Use dynamic routing for single blog
                }}
                className="flex flex-col h-fit cursor-pointer"
              >
                <div className="flex flex-col gap-y-4">
                  <div>
                    <div className="h-[200px] rounded-lg border overflow-hidden">
                      <img src={blog.image} className="h-full w-full object-cover" />
                    </div>
                  </div>
                  <div className="w-full raleway font-medium flex items-center gap-x-4">
                    <div className="px-4 py-1 rounded-2xl bg-black text-white text-sm">
                      Blog
                    </div>
                    {/* Three-dot button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent click from triggering the blog navigation
                        toggleDropdown(index);
                      }}
                      className="relative px-2 py-1 text-black"
                    >
                      &#8230; {/* Ellipsis */}
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
                              e.stopPropagation(); // Prevent triggering blog card click
                              handleDelete(blog.id); // Pass the blog id
                            }}
                          >
                            Delete
                          </li>
                          </ul>
                        </div>
                      )}
                    </button>
                  </div>
                  <div className="text-3xl raleway font-bold">{blog.title}</div>
                </div>

                <div className="text-base raleway w-full line-clamp-4">
                  {blog.description}
                </div>
                <hr className="mt-10" />
              </motion.div>
            ))
          ) : (
            <div>No blogs available</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BlogList;
