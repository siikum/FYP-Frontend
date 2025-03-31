import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home.jsx";
import AuthPage from "./pages/AuthPage.jsx";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import Footer from "./components/Footer.jsx";
import Rara from "./pages/destinations/Rara.jsx"; // Import your Rara page
import TrialPage from "./pages/trial/TrialPage..jsx";
import DestionationPage from "./pages/DestinationPage/DestinationPage.jsx";
import IndividualDestination from "./pages/IndividualDestion.tsx/IndividualDestination.jsx";
import TripPlannerForm from "./pages/TripPlannerForm.jsx";
import SentimentTest from "./pages/SentimentTest.jsx";
import About from "./pages/About.jsx";
import IndividualBlog from "./pages/BlogPages/IndividualBlog.jsx";
import BlogList from "./pages/BlogPages/BlogList.jsx";
import CreateBlog from "./pages/BlogPages/CreateBlog.jsx";
import UpdateBlog from "./pages/BlogPages/UpdateBlog.jsx";
import AdminDashboard from "./pages/admin_dashboard.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";
import NewSignUpPage  from "./pages/NewSignUpPage.jsx";
import LoginPage  from "./pages/LoginPage.jsx";




function App() {
  console.log("App Component Loaded!");

  return (
    <Router>
      {" "}
      {/*  */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/auth" component={AuthPage} />
        <Route path="/Login" element={<Login />} />
        <Route path="/parallax" element={<TrialPage />} />
        <Route path="/Signup" element={<Signup />} />
        <Route path="/Footer" element={<Footer />} />
        <Route path="/destinations/Rara" element={<Rara />} />
        <Route path="/destination" element={<DestionationPage />} />
        <Route path="/destination/:id" element={<IndividualDestination />} />
        {/* <PrivateRoute path="/home" component={Post} /> */}
        {/* <Route path="/blog/:id" element={<BlogDetail />} /> */}
        <Route path="/TripPlannerForm" element={<TripPlannerForm />} />
        <Route path="/SentimentTest" element={<SentimentTest />} />
        <Route path="/About" element={<About />} />
        <Route path="/blog" element={<BlogList />} />
        <Route path="/blog/:id" element={<IndividualBlog />} />
        <Route path="/blog/add" element={<CreateBlog />} />
        <Route path="/blog/:id/update" element={<UpdateBlog />} />
        <Route path="/AdminDashboard" element={<AdminDashboard />} />
        <Route path="/ProfilePage" element={<ProfilePage />} />
        <Route path="/ProfilePage" element={<ProfilePage />} />
        <Route path="/NewSignUpPage" element={<NewSignUpPage  />} />
        <Route path="/LoginPage" element={<LoginPage  />} />

      </Routes>
    </Router>
  );
}

export default App;
