import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const ProductReviews = () => {
  const { productId } = useParams();
  const [reviews, setReviews] = useState([]);
  const [text, setText] = useState("");
  const [rating, setRating] = useState(5);

  const token = localStorage.getItem("token");

  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/reviews/product/${productId}`)
      .then((res) => setReviews(res.data))
      .catch((err) => console.error(err));
  }, [productId]);

  const handleSubmit = () => {
    axios
      .post(
        "http://localhost:5000/api/reviews",
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
          className="w-full border rounded p-2"
        />
        <input
          type="number"
          value={rating}
          min={1}
          max={5}
          onChange={(e) => setRating(e.target.value)}
          className="w-20 mt-2"
        />
        <button
          onClick={handleSubmit}
          className="ml-2 bg-cyan-600 text-white px-3 py-1 rounded"
        >
          Submit
        </button>
      </div>

      {reviews.map((r) => (
        <div key={r._id} className="bg-white p-2 rounded shadow mb-2">
          <p>⭐ {r.rating}</p>
          <p>{r.text}</p>
          <small>- {r.user.name}</small>
        </div>
      ))}
    </div>
  );
};

export default ProductReviews;
