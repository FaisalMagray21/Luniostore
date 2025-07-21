const Contact = () => {
  return (
    <div className="bg-gray-950 text-gray-200 min-h-screen">
      <section className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-4 text-center">Contact Us</h1>
        <p className="text-center text-gray-400 max-w-2xl mx-auto">
          Have questions, feedback, or just want to say hello? Fill out the form below or reach us via the contact details. We’d love to hear from you!
        </p>

        <div className="grid md:grid-cols-2 gap-8 mt-8">
          {/* Form */}
          <div className="bg-gray-800 p-6 rounded shadow">
            <form className="space-y-4">
              <input
                type="text"
                placeholder="Your Name"
                className="w-full px-4 py-2 rounded bg-gray-700 text-gray-200 focus:outline-none"
              />
              <input
                type="email"
                placeholder="Your Email"
                className="w-full px-4 py-2 rounded bg-gray-700 text-gray-200 focus:outline-none"
              />
              <input
                type="text"
                placeholder="Subject"
                className="w-full px-4 py-2 rounded bg-gray-700 text-gray-200 focus:outline-none"
              />
              <textarea
                rows="4"
                placeholder="Your Message"
                className="w-full px-4 py-2 rounded bg-gray-700 text-gray-200 focus:outline-none"
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
