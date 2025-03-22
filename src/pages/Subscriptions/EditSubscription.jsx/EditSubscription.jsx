import React, { useState, useEffect } from "react";
import axios from "axios";
import "./editsubscription.css";
import { useTheme } from "../../../ThemeContext";
import { BASE_URL } from "../../../Utils/Config";
import { useNavigate, useParams } from "react-router-dom"; // Assuming you are using React Router
import { toast, Toaster } from "react-hot-toast";

const EditSubscription = () => {
  // States for managing form values
  const [subscriptionName, setSubscriptionName] = useState("");
  const [validity, setValidity] = useState("");

  const [error, setError] = useState(null); // State for errors
  const { theme } = useTheme();
  const navigate = useNavigate();

  // Get the ID from the URL
  const { id } = useParams();

  // Fetch subscription data
  useEffect(() => {
    const fetchSubscription = async () => {
      try {
        setError(null);

        const response = await axios.get(
          `${BASE_URL}/accounts/subscriptions/${id}/`
        );
        const subscriptionData = response.data;

        // Set the fetched data to state
        setSubscriptionName(subscriptionData.subscription_name);
        setValidity(subscriptionData.validity);

        console.log("Fetched subscription data:", subscriptionData);
      } catch (err) {
        console.error("Error fetching subscription data:", err);
        setError(
          err.response?.data?.message ||
            "An error occurred while fetching the subscription."
        );
      } finally {
      }
    };

    fetchSubscription();
  }, [id]);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setError(null);

      // Send updated data to the server
      await axios.put(`${BASE_URL}/accounts/subscriptions/${id}/`, {
        subscription_name: subscriptionName,
        validity,
      });

      toast.success("Subscription updated successfully!");
      navigate("/admin/manage-subscription");
    } catch (err) {
      console.error("Error updating subscription data:", err);
      toast.error(
        err.response?.data?.message ||
          "An error occurred while updating the subscription."
      );
    }
  };

  return (
    <div className={`editsub ${theme === "dark" ? "dark" : "light"}`}>
      <Toaster position="top-center" reverseOrder={false} />
      <div className="lg:w-1/3 p-5">
        <h2 className="editsubhead">Edit Subscription</h2>

        <form className="mt-5" onSubmit={handleSubmit}>
          {/* Subscription Name */}
          <div className="mb-5">
            <label htmlFor="subscriptionName" className="editsublabel">
              Subscription Name
            </label>
            <input
              type="text"
              id="subscriptionName"
              placeholder="Type here"
              value={subscriptionName}
              onChange={(e) => setSubscriptionName(e.target.value)}
              className="w-full editsubinput outline-none"
            />
          </div>

          {/* Validity Days */}
          <div className="mb-6">
            <label htmlFor="validity" className="editsublabel">
              Validity (Days)
            </label>
            <input
              type="number"
              id="validity"
              value={validity}
              onChange={(e) => setValidity(e.target.value)}
              className="w-full editsubinput outline-none"
            />
          </div>

          {/* Error Message */}
          {error && <p className="text-red-500">{error}</p>}

          {/* Update Button */}
          <button
            type="submit"
            className="w-full rounded-lg editsubbtn md:duration-200"
          >
            Update
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditSubscription;
