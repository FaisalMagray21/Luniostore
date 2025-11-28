import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const API_BASE = "https://luniostore-backend.vercel.app/api";

const ProductReviews = () => {
  const { productId } = useParams();
  const [reviews, setReviews] = useState([]);
  const [text, setText] = useState("");
  const [rating, setRating] = useState(5);

  const token = localStorage.getItem("token");

  useEffect(() => {
    axios
      .get(`${API_BASE}/reviews/product/${productId}`)
      .then((res) => setReviews(res.data))
      .catch((err) => console.error(err));
  }, [productId]);

  const handleSubmit = () => {
    if (!token) {
      alert("Please login to submit a review.");
      return;
    }

    axios
      .post(
        `${API_BASE}/reviews`,
        { product: productId, rating, text },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then((res) => {
        setReviews((prev) => [...prev, res.data.review]);
        setText("");
        setRating(5);
      })
      .catch((err) => console.error(err));
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Reviews</h2>
      <div className="mb-4">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Write your review"
          className="w-full border rounded p-2 bg-gray-800 text-gray-200"
        />
        <input
          type="number"
          value={rating}
          min={1}
          max={5}
          onChange={(e) => setRating(Number(e.target.value))}
          className="w-20 mt-2 bg-gray-700 text-white px-2 py-1 rounded"
        />
        <button
          onClick={handleSubmit}
          className="ml-2 bg-cyan-600 hover:bg-cyan-700 text-white px-3 py-1 rounded"
        >
          Submit
        </button>
      </div>

      {reviews.map((r) => (
        <div key={r._id} className="bg-gray-800 p-3 rounded shadow mb-2 text-gray-200">
          <p>⭐ {r.rating}</p>
          <p>{r.text}</p>
          <small className="text-gray-400">- {r.user.name}</small>
        </div>
      ))}
    </div>
  );
};

export default ProductReviews;
