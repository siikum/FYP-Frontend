import { Link } from "react-router-dom";

const BlogNavbar = () => {
  return (
    <nav className="bg-black shadow-md p-4 flex justify-between items-center fixed top-0 left-0 w-full z-10">
    {/* Left: Blog Title */}
      <h1 className="text-2xl font-bold text-white-800">My Blog</h1>
      
      {/* Center: Navigation Links */}
      <div className="space-x-6">
        <Link to="/blog" className="text-gray-600 hover:text-white">Home</Link>
        <Link to="/blog/MessagesPages" className="text-gray-600 hover:text-white">Messages</Link>
        <Link to="/blog/profile" className="text-gray-600 hover:text-white">Profile</Link>
      </div>
      
      {/* Right: User Profile Icon */}
      <div className="w-10 h-10 bg-gray-300 rounded-full cursor-pointer"></div>
    </nav>
  );
};

export default BlogNavbar;
