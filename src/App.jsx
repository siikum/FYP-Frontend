import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home.jsx";
import Footer from "./components/Footer.jsx";
import TrialPage from "./pages/trial/TrialPage..jsx";
import DestionationPage from "./pages/DestinationPage/DestinationPage.jsx";
import IndividualDestination from "./pages/IndividualDestion.tsx/IndividualDestination.jsx";
import TripPlannerForm from "./pages/TripPlannerForm.jsx";
import About from "./pages/About.jsx";
import IndividualBlog from "./pages/BlogPages/IndividualBlog.jsx";
import BlogList from "./pages/BlogPages/BlogList.jsx";
import CreateBlog from "./pages/BlogPages/CreateBlog.jsx";
import UpdateBlog from "./pages/BlogPages/UpdateBlog.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";
import NewSignUpPage from "./pages/NewSignUpPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import ChannelList from "./pages/channels/ChannelList.jsx";
import ChannelMessage from "./pages/channels/ChannelMessage.jsx"; 

function App() {
  console.log("App Component Loaded!");

  return (
    <Router>
      {" "}
      {/*  */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/parallax" element={<TrialPage />} />
        <Route path="/Footer" element={<Footer />} />
        <Route path="/destination" element={<DestionationPage />} />
        <Route path="/destination/:slug" element={<IndividualDestination />} /> 
        {/* <PrivateRoute path="/home" component={Post} /> */}
        {/* <Route path="/blog/:id" element={<BlogDetail />} /> */}
        <Route path="/TripPlannerForm" element={<TripPlannerForm />} />
        <Route path="/About" element={<About />} />
        <Route path="/blog" element={<BlogList />} />
        <Route path="/blog/:id" element={<IndividualBlog />} />
        <Route path="/blog/add" element={<CreateBlog />} />
        <Route path="/blog/:id/update" element={<UpdateBlog />} />
        <Route path="/ProfilePage" element={<ProfilePage />} />
        <Route path="/ProfilePage" element={<ProfilePage />} />
        <Route path="/NewSignUpPage" element={<NewSignUpPage />} />
        <Route path="/LoginPage" element={<LoginPage />} />
        <Route path="/channels" element={<ChannelList />} />
        <Route path="/channels/:id" element={<ChannelMessage />} />
        
      </Routes>
    </Router>
  );
}

export default App;
