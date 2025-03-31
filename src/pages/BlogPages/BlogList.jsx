// src/pages/BlogList.js (or your specific path)

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar"; // Adjust path if needed

// --- Corrected Imports for LinkedIn-style Chat ---
import DockedMessagingTab from "./DockedMessagingTab"; // Import new tab component
import MessagingListPanel from "./MessagingListPanel"; // Import list panel component
import ChatPopup from "./ChatPopup"; // Import chat window component
// --- Remove old ChatListBar import if present ---
// import ChatListBar from "./ChatListBar"; // REMOVE THIS LINE

import { motion } from "framer-motion";

const BlogList = () => {
    const navigate = useNavigate();
    const [blogs, setBlogs] = useState([]);
    const [dropdownOpen, setDropdownOpen] = useState(null);

    // --- Updated LinkedIn Style Chat State ---
    const [isMessagingPanelOpen, setIsMessagingPanelOpen] = useState(false); // Is the list panel expanded?
    const [activeChatId, setActiveChatId] = useState(null); // Which chat window is open? (null if none)

    // --- Dummy Conversation Data (Replace/Fetch Real Data) ---
    // Add more details like last message, timestamp, unread count from your backend
    const [conversations, setConversations] = useState([
        { id: 'chat1', name: 'Design Chat', avatar: 'https://via.placeholder.com/40/8B5CF6/FFFFFF?text=DC', lastMessage: 'Jessie: Check out the new icons!', timestamp: '10:30 AM', unread: 1, participants: [/* user objects */] },
        { id: 'chat2', name: 'Osman Campos', avatar: 'https://via.placeholder.com/40/3B82F6/FFFFFF?text=OC', lastMessage: 'You: Okay, sounds good!', timestamp: 'Yesterday', unread: 0 },
        { id: 'chat3', name: 'Jasmin Lowery', avatar: 'https://via.placeholder.com/40/F87171/FFFFFF?text=JL', lastMessage: 'Let\'s sync up tomorrow.', timestamp: 'Mar 15', unread: 3 },
        { id: 'chat4', name: 'Jessie Rollins', avatar: 'https://via.placeholder.com/40/FDBA74/FFFFFF?text=JR', lastMessage: 'Voice message (0:15)', timestamp: 'Mar 14', unread: 0 },
        { id: 'chat5', name: 'Alex Hunt', avatar: 'https://via.placeholder.com/40/60A5FA/FFFFFF?text=AH', lastMessage: 'Thanks for the update!', timestamp: 'Mar 12', unread: 0 },
        // Add more conversations fetched from your backend
    ]);
    // Replace with the actual logged-in user's avatar URL
    const currentUserAvatar = 'https://via.placeholder.com/32/777/FFF?text=Me';

    // --- Updated Chat Handlers for LinkedIn Style ---

    // Expands the list panel from the docked tab
    const handleExpandMessaging = () => {
        setIsMessagingPanelOpen(true);
    };

    // Minimizes (closes) the list panel and any open chat window
    const handleMinimizeMessaging = () => {
        setIsMessagingPanelOpen(false);
        setActiveChatId(null); // Ensure chat window also closes when panel minimizes
    };

    // Selects a chat from the list panel, opening its window
    const handleChatSelect = (chatId) => {
        setActiveChatId(chatId); // Set the selected chat as active
        // TODO: Add logic here to mark the selected chat 'chatId' as read in your backend/state
        console.log("Selected chat:", chatId);
    };

    // Closes only the individual chat window (keeps list panel open)
    const handleCloseChatWindow = () => {
        setActiveChatId(null); // Clear the active chat ID
    };

    // --- End Updated Chat Handlers ---


    // Fetch blogs from the API (Your existing useEffect)
    useEffect(() => {
        const fetchBlogs = async () => {
            try {
                const response = await fetch("http://localhost:8000/blog/blogposts");
                if (response.ok) {
                    const data = await response.json();
                    console.log("Fetched blogs:", data);
                    setBlogs(data);
                } else {
                    console.error("Failed to fetch blogs");
                    setBlogs([]); // Set to empty array on failure
                }
            } catch (error) {
                console.error("Error fetching blogs:", error);
                setBlogs([]); // Set to empty array on error
            }
        };

        fetchBlogs();
    }, []); // Empty dependency array means this will run only once

    // Toggle for blog options dropdown (Your existing function)
    const toggleDropdown = (index) => {
        if (dropdownOpen === index) {
            setDropdownOpen(null);
        } else {
            setDropdownOpen(index);
        }
    };

    // Delete blog handler (Your existing function)
    const handleDelete = async (id) => {
        try {
            // Optional: Add a confirmation dialog before deleting
            // if (!window.confirm("Are you sure you want to delete this blog?")) {
            //   return;
            // }

            const response = await fetch(`http://localhost:8000/blog/blogposts/${id}/delete/`, {
                method: "DELETE",
                // Add headers like Authorization if needed:
                // headers: { 'Authorization': `Bearer ${your_token}` }
            });

            if (response.ok) {
                setBlogs((prevBlogs) => prevBlogs.filter((blog) => blog.id !== id));
                setDropdownOpen(null); // Close dropdown after deletion
                console.log("Blog deleted successfully");
                // Optionally show a success message to the user
            } else {
                console.error("Failed to delete the blog:", response.status, response.statusText);
                // Optionally show an error message to the user
            }
        } catch (error) {
            console.error("Error deleting blog:", error);
            // Optionally show an error message to the user
        }
    };

    // --- Get details for the currently active chat window ---
    // Find the full chat object from the conversations list based on the activeChatId
    const activeChatDetails = activeChatId
        ? conversations.find(c => c.id === activeChatId)
        : null;

    return (
        // Added min-h-screen and relative positioning for fixed chat elements
        <div className="flex flex-col bg-amber-50 py-[100px] min-h-screen relative pb-10"> {/* Added padding-bottom */}
            <Navbar isBlack={true} />

            <div className="flex gap-x-20 px-[10%] flex-grow"> {/* Added flex-grow */}

                {/* --- Left Panel (Fixed) --- */}
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, ease: "easeInOut" }}
                    viewport={{ once: true }}
                    className="flex flex-col mt-[150px] fixed gap-y-4 w-[35%]" // Keep your layout
                >
                    <div className="text-9xl raleway font-bold break-words">Blogs</div>
                    <div className="w-[50%] text-2xl raleway font-medium break-words self-end text-end">
                        Explore the world through the eyes of our travelers
                    </div>
                    <button
                        onClick={() => navigate("/blog/add")}
                        className="text-2xl font-medium w-fit text-white bg-orange-500 hover:bg-orange-400 self-end rounded-3xl px-6 py-2 cursor-pointer"
                    >
                        Create Blog
                    </button>

                    {/* Remove the old example chat buttons if they were here */}
                    {/* The chat is now initiated from the docked tab */}

                </motion.div>

                {/* --- Spacer Element --- */}
                {/* This pushes the blog list to the right of the fixed left panel */}
                <div className="w-[calc(35%+5rem)] flex-shrink-0"></div> {/* Adjust if needed based on gap */}


                {/* --- Right Panel (Scrollable Blog List) --- */}
                <div className="flex flex-col w-[calc(65%-5rem)] gap-y-10"> {/* Adjusted width */}
                    {blogs.length > 0 ? (
                        blogs.map((blog, index) => (
                            // --- Your Blog Card Component ---
                            <motion.div
                                initial={{ opacity: 0, y: 50 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 1, ease: "easeInOut" }}
                                viewport={{ once: true }}
                                key={blog.id || index}
                                className="flex flex-col h-fit group border border-transparent hover:border-gray-200 p-4 rounded-lg transition-colors duration-200 bg-white shadow-sm hover:shadow-md" // Added bg-white, shadow
                            >
                                <div className="flex flex-col gap-y-3"> {/* Reduced gap slightly */}
                                    {/* Image container */}
                                    <div
                                        onClick={() => navigate(`/blog/${blog.id}`)}
                                        className="cursor-pointer overflow-hidden rounded-lg border" // Added overflow-hidden here too
                                    >
                                        <div className="h-[200px] ">
                                            <img src={blog.image} alt={blog.title} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300" />
                                        </div>
                                    </div>

                                    {/* Meta and Options */}
                                    <div className="w-full raleway font-medium flex items-center justify-between gap-x-4">
                                        <div className="flex items-center gap-x-2">
                                            <span className="px-3 py-0.5 rounded-full bg-black text-white text-xs font-semibold">
                                                Blog
                                            </span>
                                            {/* Optional: Add date/author */}
                                            {/* <span className="text-xs text-gray-500"> - {new Date(blog.createdAt).toLocaleDateString()}</span> */}
                                        </div>

                                        {/* Three-dot button and Dropdown */}
                                        <div className="relative">
                                            <button
                                                onClick={(e) => { e.stopPropagation(); toggleDropdown(index); }}
                                                className="px-2 py-1 text-gray-500 hover:text-black rounded hover:bg-gray-100"
                                                aria-haspopup="true" aria-expanded={dropdownOpen === index}
                                            >
                                                … {/* Ellipsis */}
                                            </button>
                                            {dropdownOpen === index && (
                                                <div
                                                    className="absolute right-0 mt-2 w-32 bg-white border border-gray-200 rounded-lg shadow-lg z-20"
                                                    onClick={(e) => e.stopPropagation()}
                                                >
                                                    <ul className="py-1">
                                                        <li>
                                                            <button
                                                                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                                onClick={() => { navigate(`/blog/${blog.id}/update`); setDropdownOpen(null); }}
                                                            > Update </button>
                                                        </li>
                                                        <li>
                                                            <button
                                                                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                                                                onClick={() => { handleDelete(blog.id); }}
                                                            > Delete </button>
                                                        </li>
                                                    </ul>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Title */}
                                    <h2
                                        onClick={() => navigate(`/blog/${blog.id}`)}
                                        className="text-xl lg:text-2xl raleway font-bold cursor-pointer hover:text-purple-700 transition-colors duration-200 line-clamp-2" // Slightly smaller title, line-clamp
                                    >
                                        {blog.title}
                                    </h2>

                                    {/* Description */}
                                    <div className="text-sm raleway text-gray-600 w-full line-clamp-3 mt-1"> {/* Smaller text, adjusted margin */}
                                        {blog.description}
                                    </div>
                                </div>
                                {/* Removed hr, card structure provides separation */}
                            </motion.div>
                            // --- End Blog Card ---
                        ))
                    ) : (
                        <div className="text-center text-gray-500 mt-20 col-span-full"> {/* Ensure it spans if using grid */}
                            No blogs available yet.
                        </div>
                    )}
                </div>
            </div> {/* End main content flex container */}


            {/* --- Updated LinkedIn Style Chat UI Rendering --- */}

            {/* Render Docked Tab only if Panel is Closed/Minimized */}
            {!isMessagingPanelOpen && (
                <DockedMessagingTab
                    userAvatar={currentUserAvatar} // Pass the logged-in user's avatar
                    onExpand={handleExpandMessaging} // Function to open the panel
                />
            )}

            {/* Render Messaging Panel and potentially the Chat Window if Panel is Open */}
            {isMessagingPanelOpen && (
                <>
                    {/* The panel listing conversations */}
                    <MessagingListPanel
                        conversations={conversations} // Pass the list of chats
                        onChatSelect={handleChatSelect} // Function called when a chat is clicked
                        onMinimize={handleMinimizeMessaging} // Function to collapse the panel
                        // onClose={handleMinimizeMessaging} // You can map onClose to minimize as well
                        activeChatId={activeChatId} // Highlight the selected chat in the list
                    />

                    {/* Render the specific chat popup IF a chat is selected (activeChatId is not null) */}
                    {activeChatDetails && ( // Check if we found details for the active chat
                        <ChatPopup
                            key={activeChatDetails.id} // Key ensures re-render if chat changes
                            chat={activeChatDetails} // Pass the specific chat data
                            onClose={handleCloseChatWindow} // Function to close *only* this window
                        />
                    )}
                </>
            )}
            {/* --- End Chat UI Rendering --- */}

        </div> // End main page container
    );
};

export default BlogList;