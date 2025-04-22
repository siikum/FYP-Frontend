import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import "./chartSetup";

import Home from "./pages/Home.jsx";
import Footer from "./components/Footer.jsx";
import TrialPage from "./pages/trial/TrialPage..jsx";
import IndividualDestination from "./pages/IndividualDestion.tsx/IndividualDestination.jsx";
import SavedDestinations from "./pages/SavedDestinations.jsx";
import RecommendedHotels from "./pages/RecommendHotels.jsx";
import TripPlannerForm from "./pages/TripPlannerForm.jsx";
import SavedItineraries from "./pages/SavedItineraries.jsx";
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
import MyChannels from "./pages/channels/MyChannels.jsx";

import AdminLayout from "./pages/adminDashboard/AdminLayout";
import DashboardHome from "./pages/adminDashboard/DashboardHome";
import UsersPage from "./pages/adminDashboard/UsersPage";
import DestinationsPage from "./pages/adminDashboard/DestinationsPage";
import GroupChatsPage from "./pages/adminDashboard/GroupChatsPage";
import JoinRequestsPage from "./pages/adminDashboard/JoinRequestsPage";
import ContactMessagesPage from "./pages/adminDashboard/ContactMessagesPage";
import AdminBlogsPage from "./pages/adminDashboard/AdminBlogsPage.jsx";
import AdminSentimentReviews from "./pages/adminDashboard/AdminSentimentReviews.jsx";
import { useEffect } from "react";

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0); // always scroll to top
  }, [pathname]);

  return null;
};

function App() {
  return (
    <>
      <Router>
        <ScrollToTop />
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Home />} />
          <Route path="/parallax" element={<TrialPage />} />
          <Route path="/Footer" element={<Footer />} />
          <Route
            path="/destination/:slug"
            element={<IndividualDestination />}
          />
          <Route path="/SavedDestinations" element={<SavedDestinations />} />
          <Route path="/TripPlannerForm" element={<TripPlannerForm />} />
          <Route path="/SavedItineraries" element={<SavedItineraries />} />
          <Route path="/recommended-hotels/:destinationName" element={<RecommendedHotels />} />
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
          <Route path="/MyChannels" element={<MyChannels />} />

          {/* ✅ Admin Panel with nested pages */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route path="dashboard" element={<DashboardHome />} />
            <Route path="users" element={<UsersPage />} />
            <Route path="destinations" element={<DestinationsPage />} />
            <Route path="groupchats" element={<GroupChatsPage />} />
            <Route path="joinrequests" element={<JoinRequestsPage />} />
            <Route path="messages" element={<ContactMessagesPage />} />
            <Route path="AdminBlogsPage" element={<AdminBlogsPage />} />
            <Route
              path="AdminSentimentReviews"
              element={<AdminSentimentReviews />}
            />
          </Route>
        </Routes>
      </Router>
    </>
  );
}

export default App;
