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

      </Routes>
    </Router>
  );
}

export default App;
