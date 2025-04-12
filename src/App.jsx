import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./chartSetup";

import Home from "./pages/Home.jsx";
import Footer from "./components/Footer.jsx";
import TrialPage from "./pages/trial/TrialPage..jsx";
import IndividualDestination from "./pages/IndividualDestion.tsx/IndividualDestination.jsx";
import TripPlannerForm from "./pages/TripPlannerForm.jsx";
import About from "./pages/About.jsx";
import IndividualBlog from "./pages/BlogPages/IndividualBlog.jsx";
import BlogList from "./pages/BlogPages/BlogList.jsx";
import CreateBlog from "./pages/BlogPages/CreateBlog.jsx";
import UpdateBlog from "./pages/BlogPages/UpdateBlog.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";
import PublicProfile from "./pages/PublicProfile";
import NewSignUpPage from "./pages/NewSignUpPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import ChannelList from "./pages/channels/ChannelList.jsx";
import ChannelMessage from "./pages/channels/ChannelMessage.jsx";

import AdminLayout from "./pages/adminDashboard/AdminLayout";
import DashboardHome from "./pages/adminDashboard/DashboardHome";
import UsersPage from "./pages/adminDashboard/UsersPage";
import DestinationsPage from "./pages/adminDashboard/DestinationsPage";
import GroupChatsPage from "./pages/adminDashboard/GroupChatsPage";
import JoinRequestsPage from "./pages/adminDashboard/JoinRequestsPage";
import ContactMessagesPage from "./pages/adminDashboard/ContactMessagesPage";
import AdminLogin from "./pages/adminDashboard/AdminLogin";
import AdminBlogsPage from "./pages/adminDashboard/AdminBlogsPage.jsx";
import AdminSentimentReviews from "./pages/adminDashboard/AdminSentimentReviews.jsx";


function App() {
  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Home />} />
        <Route path="/parallax" element={<TrialPage />} />
        <Route path="/Footer" element={<Footer />} />
        <Route path="/destination/:slug" element={<IndividualDestination />} />
        <Route path="/TripPlannerForm" element={<TripPlannerForm />} />
        <Route path="/About" element={<About />} />
        <Route path="/blog" element={<BlogList />} />
        <Route path="/blog/:id" element={<IndividualBlog />} />
        <Route path="/blog/add" element={<CreateBlog />} />
        <Route path="/blog/:id/update" element={<UpdateBlog />} />
        <Route path="/ProfilePage" element={<ProfilePage />} />
        <Route path="/user/:username" element={<PublicProfile />} />
        <Route path="/NewSignUpPage" element={<NewSignUpPage />} />
        <Route path="/LoginPage" element={<LoginPage />} />
        <Route path="/channels" element={<ChannelList />} />
        <Route path="/channels/:id" element={<ChannelMessage />} />

        {/* ✅ Admin Panel with nested pages */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="dashboard" element={<DashboardHome />} />
          <Route path="users" element={<UsersPage />} />
          <Route path="destinations" element={<DestinationsPage />} />
          <Route path="groupchats" element={<GroupChatsPage />} />
          <Route path="joinrequests" element={<JoinRequestsPage />} />
          <Route path="messages" element={<ContactMessagesPage />} />
          <Route path="AdminBlogsPage" element={<AdminBlogsPage />} />
          <Route path="AdminSentimentReviews" element={<AdminSentimentReviews />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
