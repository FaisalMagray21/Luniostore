import { useNavigate } from "react-router-dom";

const RoleSelection = () => {
  const navigate = useNavigate();

  const handleRole = (role) => {
    navigate(`/signup?role=${role}`);
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-950 text-white">
      <h1 className="text-3xl mb-6">Continue as</h1>
      <div className="space-x-4">
        <button
          onClick={() => handleRole("buyer")}
          className="bg-cyan-600 hover:bg-cyan-700 px-6 py-3 rounded"
        >
          Buyer (Buy Now)
        </button>
        <button
          onClick={() => handleRole("seller")}
          className="bg-purple-600 hover:bg-purple-700 px-6 py-3 rounded"
        >
          Seller
        </button>
      </div>
    </div>
  );
};

export default RoleSelection;
