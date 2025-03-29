import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";  // Import useParams
import Navbar from "../../components/Navbar";
import { motion } from "framer-motion";
import pfp from "../../assets/images/pf.jpg";
import CommentSection from "./CommentSection"; 


const IndividualBlog = () => {
  const [isFocused, setIsFocused] = useState(false);
  const [blog, setBlog] = useState(null);  // State to store the fetched blog
  const { id } = useParams();  // Get the blog id from the URL

  useEffect(() => {
    const fetchBlogPost = async () => {
      const response = await fetch(`http://localhost:8000/blog/blogposts/${id}/`);
      const data = await response.json();
      setBlog(data);  // Set the blog data to state
    };

    fetchBlogPost();
  }, [id]);  // Fetch the blog when the component mounts or when the id changes

  if (!blog) {
    return <div>Loading...</div>;  // Show loading while fetching
  }

  return (
    <div className="flex flex-col bg-amber-50 py-[100px]">
      <Navbar isBlack={true} />
      <div className="flex flex-col gap-y-16 px-[10%]">
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
            className="w-full h-full object-cover"  // Makes the image fill the container
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.75, ease: "easeInOut" }}
          viewport={{ once: true }}
          className="flex flex-col gap-y-4"
        >
          <div className="w-full raleway font-medium flex items-center gap-x-4">
            <div className="px-4 py-1 rounded-2xl bg-black text-white text-sm">
              Blog
            </div>
            <div className="">{blog.date}</div>
          </div>
          <div className="text-7xl raleway font-bold w-[45%]">
            {blog.title}
          </div>
        </motion.div>
        <div className="flex flex-col gap-y-5">
          <div className="text-2xl raleway text-justify w-[60%]">
            {blog.description}
          </div>
        </div>
        {/* Comments Section */}
        <CommentSection postId={id} />
      </div>
    </div>
  );
};

export default IndividualBlog;
