import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import { motion } from "framer-motion";
import pfp from "../../assets/images/pf.jpg";
import CommentSection from "./CommentSection";
import Footer from "../../components/Footer";

const IndividualBlog = () => {
  const [isFocused, setIsFocused] = useState(false);
  const [blog, setBlog] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBlogPost = async () => {
      const response = await fetch(
        `http://localhost:8000/blog/blogposts/${id}/`
      );
      const data = await response.json();
      setBlog(data);
    };

    fetchBlogPost();
  }, [id]);

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
          <div className="w-full font-serif font-medium flex items-center gap-x-4">
            <div>{blog.date}</div>
          </div>
          <div className="text-5xl font-serif font-bold w-full leading-tight">
            {blog.title}
          </div>
          <div
            className="text-base text-gray-500 italic hover:underline cursor-pointer"
            onClick={() => navigate(`/user/${blog.author}`)}
          >
            by {blog.author}
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
