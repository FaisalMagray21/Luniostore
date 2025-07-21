import { useParams, useNavigate } from "react-router-dom";
import socialmediaboost from "../assets/socialmediaboost.jpg";
import smartwatch from "../assets/smartwatch.jpg";
import cloudstorage from "../assets/cloudstorage.jpg";

const BlogDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const posts = {
    1: {
      title: "Boost Your Brand with Social Media",
      img: socialmediaboost,
      content: [
        "In today’s digital age, having a strong social media presence is crucial for any brand. Platforms like Facebook, Instagram, and LinkedIn allow businesses to connect with customers, showcase products, and build trust. A well-planned strategy can significantly boost engagement and sales, making your brand stand out from the competition.",
        "It’s important to tailor your content to each platform and understand your audience’s behavior. Interactive posts, stories, and live sessions keep your followers engaged. Analyzing performance metrics also helps refine your strategy for better results.",
        "Whether you’re a small business or an established company, investing in social media can bring immense value. It not only increases visibility but also builds long-term relationships with your customers."
      ],
      author: "Lunio Team",
      date: "July 12, 2025",
      category: "Services",
    },
    2: {
      title: "Why a Smart Watch Is More Than Just a Watch",
      img:smartwatch ,
      content: [
        "Smartwatches have evolved far beyond simple timekeeping. They help you track fitness, receive notifications, and even manage calls right from your wrist. With health monitoring, GPS tracking, and seamless smartphone integration, a smartwatch can enhance productivity and keep you connected on the go.",
        "Modern smartwatches also offer advanced features like ECG, sleep analysis, and voice assistants. These functionalities make them an essential tool for those who value both health and convenience.",
        "If you’re looking for a gadget that combines style, functionality, and innovation, a smartwatch is a perfect choice. It complements your lifestyle and keeps you informed without having to constantly check your phone."
      ],
      author: "Lunio Team",
      date: "July 11, 2025",
      category: "Hardware",
    },
    3: {
      title: "The Future is Cloud: Why You Should Move Your Data",
      img: cloudstorage,
      content: [
        "Cloud storage has revolutionized how we handle data. It offers secure, scalable, and cost-effective solutions for both businesses and individuals. Access your files anywhere, collaborate in real-time, and eliminate the risk of data loss due to hardware failures.",
        "As businesses expand globally, cloud solutions enable seamless communication and data sharing across teams. It also ensures your data is backed up and protected against cyber threats.",
        "Moving to the cloud isn’t just a trend — it’s a necessity in today’s fast-paced digital world. By adopting cloud technologies, you ensure your data remains safe, accessible, and ready for the future."
      ],
      author: "Lunio Team",
      date: "July 10, 2025",
      category: "Software",
    },
  };

  const post = posts[id];

  if (!post) {
    return (
      <div className="bg-gray-950 text-gray-200 min-h-screen flex items-center justify-center">
        <p>Blog post not found.</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-950 text-gray-200 min-h-screen">
      <section className="max-w-4xl mx-auto px-4 py-6">
        <button
          onClick={() => navigate(-1)}
          className="text-sm text-cyan-400 hover:underline mb-4"
        >
          ← Back
        </button>

        <h1 className="text-3xl md:text-4xl font-bold mb-2">{post.title}</h1>
        <div className="text-sm text-gray-400 mb-4">
          By <span className="text-cyan-300">{post.author}</span> |{" "}
          <span>{post.date}</span> |{" "}
          <span className="bg-purple-600 text-white px-2 py-0.5 rounded text-xs">
            {post.category}
          </span>
        </div>

        <img
          src={post.img}
          alt={post.title}
          className="w-full h-64 object-cover rounded mb-6 shadow-lg"
        />

        {post.content.map((para, idx) => (
          <p key={idx} className="text-gray-300 leading-relaxed mb-4 text-justify">
            {para}
          </p>
        ))}
      </section>
    </div>
  );
};

export default BlogDetail;
