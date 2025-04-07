import React, { useState } from "react";

const ContactUs = () => {
const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    message: "",
    });

  const [responseMsg, setResponseMsg] = useState("");

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://127.0.0.1:8000/account/contact/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${localStorage.getItem("authToken")}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        setResponseMsg(data.message);
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          phone: "",
          message: "",
        });
      } else {
        setResponseMsg("Something went wrong. Please try again.");
      }
    } catch (err) {
      setResponseMsg("Server error.");
    }
  };

  return (
    <section className="w-full bg-[#f3f8f6] text-[#0B3D20] py-24 px-4">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-16 items-start">
        {/* Left Info */}
        <div className="flex-1 space-y-8">
          <div>
            <h2 className="text-4xl md:text-5xl font-serif font-bold mb-8">Contact Us</h2>
            <p className="text-lg max-w-md mt-10">
              Reach out to us for any inquiries, suggestions, or media-related questions. We're always happy to connect.
            </p>
            <p className="mt-10 text-md">
              <strong>Email:</strong> info@trailhimalaya.com
            </p>
            <p className="text-md">
              <strong>Phone:</strong> +977-9828839274
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm text-[#295b42] mt-18 mb-8">
            <div>
              <h4 className="font-semibold mb-2">Suggestions</h4>
              <p>We welcome your feedback to make Trail Himalaya even better.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Media Inquiries</h4>
              <p>Email us at media@trailhimalaya.com for media/press queries.</p>
            </div>
          </div>
        </div>

        {/* Right Form */}
        <div className="flex-1 bg-white rounded-xl shadow-md p-8 w-full max-w-xl">
          <h3 className="text-2xl font-bold mb-6">Get in Touch</h3>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="flex gap-4">
              <input
                type="text"
                name="first_name"
                placeholder="First name"
                value={formData.firstName}
                onChange={handleChange}
                className="w-1/2 px-4 py-3 border rounded-md outline-green-800"
              />
              <input
                type="text"
                name="last_name"
                placeholder="Last name"
                value={formData.lastName}
                onChange={handleChange}
                className="w-1/2 px-4 py-3 border rounded-md outline-green-800"
              />
            </div>
            <input
              type="email"
              name="email"
              placeholder="Your email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-3 border rounded-md outline-green-800"
            />
            <input
              type="tel"
              name="phone"
              placeholder="+977 Phone number"
              value={formData.phone}
              onChange={handleChange}
              className="w-full px-4 py-3 border rounded-md outline-green-800"
            />
            <textarea
              name="message"
              placeholder="How can we help?"
              maxLength="120"
              rows="4"
              value={formData.message}
              onChange={handleChange}
              className="w-full px-4 py-3 border rounded-md resize-none outline-green-800"
            />
            <button
              type="submit"
              className="w-full bg-[#0B3D20] text-white font-semibold py-3 rounded-md hover:bg-green-900 transition"
            >
              Submit
            </button>
            <p className="text-xs text-center text-[#295b42] mt-2">
              By contacting us, you agree to our <span className="underline font-medium">Terms</span> and <span className="underline font-medium">Privacy Policy</span>.
            </p>

            {responseMsg && (
              <p className="text-sm text-center mt-4 text-green-700">{responseMsg}</p>
            )}
          </form>
        </div>
      </div>
    </section>
  );
};

export default ContactUs;
