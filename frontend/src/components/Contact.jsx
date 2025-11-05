import { useState } from "react";
import emailjs from "@emailjs/browser";

const Contact = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    title: "",
    message: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    emailjs
      .send(
        "service_dfyxbyr",      // ⚡ Aapka Service ID
        "template_od0dlvs",     // ⚡ Aapka Template ID
        {
          name: form.name,       // match {{name}}
          email: form.email,     // match {{email}}
          title: form.title,     // match {{title}}
          message: form.message, // match {{message}}
        },
        "ZqSP9GoGwYcEvpVg8"     // ⚡ Aapka Public Key
      )
      .then(
        () => {
          alert("✅ Message sent successfully!");
          setForm({ name: "", email: "", title: "", message: "" });
        },
        (error) => {
          console.error("EmailJS Error:", error);
          alert("❌ Failed to send message. Check console for details.");
        }
      );
  };

  return (
    <div className="bg-gray-950 text-gray-200 min-h-screen">
      <section className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-4 text-center">
          Contact Us
        </h1>
        <p className="text-center text-gray-400 max-w-2xl mx-auto">
          Have questions, feedback, or just want to say hello? Fill out the form
          below or reach us via the contact details. We’d love to hear from you!
        </p>

        <div className="grid md:grid-cols-2 gap-8 mt-8">
          {/* Form */}
          <div className="bg-gray-800 p-6 rounded shadow">
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Your Name"
                className="w-full px-4 py-2 rounded bg-gray-700 text-gray-200 focus:outline-none"
                required
              />
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Your Email"
                className="w-full px-4 py-2 rounded bg-gray-700 text-gray-200 focus:outline-none"
                required
              />
              <input
                type="text"
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="Subject"
                className="w-full px-4 py-2 rounded bg-gray-700 text-gray-200 focus:outline-none"
              />
              <textarea
                name="message"
                rows="4"
                value={form.message}
                onChange={handleChange}
                placeholder="Your Message"
                className="w-full px-4 py-2 rounded bg-gray-700 text-gray-200 focus:outline-none"
                required
              ></textarea>
              <button
                type="submit"
                className="bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 rounded"
              >
                Send Message
              </button>
            </form>
          </div>

          {/* Contact Info + Map */}
          <div>
            <div className="bg-gray-800 p-6 rounded shadow mb-6">
              <h2 className="text-xl font-semibold mb-2">Our Office</h2>
              <p>📍 123 Tech Street, Kathmandu, Nepal</p>
              <p>📞 +977 1-5555555</p>
              <p>✉️ hello@lunio.com</p>
            </div>

            <div className="rounded overflow-hidden shadow">
              <iframe
                title="Google Map"
                src="https://maps.google.com/maps?q=kathmandu%20nepal&t=&z=13&ie=UTF8&iwloc=&output=embed"
                className="w-full h-64 border-0"
                allowFullScreen
                loading="lazy"
              ></iframe>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
