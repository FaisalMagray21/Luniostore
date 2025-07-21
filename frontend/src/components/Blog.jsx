import { useNavigate } from "react-router-dom";
import socialmediaboost from "../assets/socialmediaboost.jpg";
import smartwatch from "../assets/smartwatch.jpg";
import cloudstorage from "../assets/cloudstorage.jpg";

const Blog = () => {
  const navigate = useNavigate();

  const posts = [
    {
      id: 1,
      title: "Boost Your Brand with Social Media",
      img: socialmediaboost,
      excerpt:
        "Learn how to effectively boost your brand and connect with your audience using social media platforms like Facebook, Instagram, and LinkedIn.",
      category: "Services",
      date: "July 12, 2025",
      author: "Lunio",
    },
    {
      id: 2,
      title: "Why a Smart Watch Is More Than Just a Watch",
      img: smartwatch,
      excerpt:
        "Discover how a smartwatch can help you stay connected, track fitness, and improve your daily productivity beyond just telling time.",
      category: "Hardware",
      date: "July 11, 2025",
      author: "Lunio",
    },
    {
      id: 3,
      title: "The Future is Cloud: Why You Should Move Your Data",
      img: cloudstorage,
      excerpt:
        "Find out why businesses and individuals are moving to cloud storage for flexibility, security, and scalability at affordable prices.",
      category: "Software",
      date: "July 10, 2025",
      author: "Lunio",
    },
  ];

  return (
    <div className="bg-gray-950 text-gray-200 min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-to-r from-purple-800 to-indigo-900 py-10">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h1 className="text-4xl font-bold text-cyan-300 mb-2">Our Blog</h1>
          <p className="text-gray-300">
            Insights, tips & trends on hardware, software, and digital services.
          </p>
        </div>
      </section>

      {/* Blog Posts */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <div
              key={post.id}
              className="bg-gray-800 rounded-lg overflow-hidden shadow-md hover:shadow-xl transform hover:-translate-y-1 transition"
            >
              <img
                src={post.img}
                alt={post.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <span className="text-xs bg-purple-600 px-2 py-1 rounded">
                  {post.category}
                </span>
                <h2 className="text-lg font-bold mt-2">{post.title}</h2>
                <p className="text-sm text-gray-400">{post.excerpt}</p>
                <div className="text-xs text-gray-500 mt-2">
                  By {post.author} | {post.date}
                </div>
                <button
                  onClick={() => navigate(`/blog/${post.id}`)}
                  className="mt-4 bg-cyan-600 hover:bg-cyan-700 text-white px-3 py-1 rounded text-sm"
                >
                  Read More
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Blog;
