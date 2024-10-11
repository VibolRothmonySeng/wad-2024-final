"use client";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";

export default function CustomerPage() {
  const APIBASE = process.env.NEXT_PUBLIC_API_URL;
  const [customerList, setCustomerList] = useState([]);
  const [focusedCustomer, setFocusedCustomer] = useState(null); // For storing the selected customer
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false); // Loading state for feedback
  const [message, setMessage] = useState(null); // Success/Error message

  const { register, handleSubmit, reset, setValue } = useForm();

  // Fetch all customers inside useEffect to avoid dependency warnings
  useEffect(() => {
    const fetchCustomers = async () => {
      setLoading(true);
      try {
        const data = await fetch(`${APIBASE}/customer`);
        const customers = await data.json();
        setCustomerList(customers);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        setMessage({ type: "error", text: "Failed to load customers." });
      }
    };

    fetchCustomers();
  }, [APIBASE]); // Ensure APIBASE is included in the dependency array

  // Set the clicked customer as focused to show details
  const handleCustomerClick = (customer) => {
    setFocusedCustomer(customer);
    setEditMode(true);
    // Populate the form with selected customer details
    setValue("name", customer.name);
    setValue("dateOfBirth", customer.dateOfBirth);
    setValue("interests", customer.interests);
  };

  // Function to handle form submission (create or update customer)
  const handleCustomerFormSubmit = (data) => {
    setLoading(true);
    if (editMode) {
      // Update customer
      fetch(`${APIBASE}/customer`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...data, _id: focusedCustomer._id }), // Include _id for updating
      })
        .then(() => {
          setMessage({ type: "success", text: "Customer updated successfully!" });
          reset({ name: "", dateOfBirth: "", interests: "" });
          setEditMode(false);
          setFocusedCustomer(null);
          setLoading(false);
        })
        .catch(() => {
          setMessage({ type: "error", text: "Failed to update customer." });
          setLoading(false);
        });
      return;
    }

    // Add new customer
    fetch(`${APIBASE}/customer`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then(() => {
        setMessage({ type: "success", text: "Customer added successfully!" });
        reset({ name: "", dateOfBirth: "", interests: "" });
        setLoading(false);
      })
      .catch(() => {
        setMessage({ type: "error", text: "Failed to add customer." });
        setLoading(false);
      });
  };

  return (
    <main>
      <div className="flex flex-row gap-4">
        {/* Left side: List all customers */}
        <div className="border m-4 bg-slate-300 flex-1 w-64">
          <h2>Customer List</h2>
          {loading ? (
            <p>Loading...</p>
          ) : (
            <ul>
              {customerList.map((customer) => (
                <li
                  key={customer._id}
                  onClick={() => handleCustomerClick(customer)} // Set focused customer on click
                  className="cursor-pointer hover:bg-gray-200 p-2"
                >
                  {customer.name} - {new Date(customer.dateOfBirth).toLocaleDateString()}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Right side: Show the focused customer details */}
        <div className="border m-4 bg-slate-200 flex-1 w-64">
          {focusedCustomer ? (
            <div>
              <h2>Customer Details</h2>
              <p><strong>Name:</strong> {focusedCustomer.name}</p>
              <p><strong>Date of Birth:</strong> {new Date(focusedCustomer.dateOfBirth).toLocaleDateString()}</p>
              <p><strong>Interests:</strong> {focusedCustomer.interests}</p>
            </div>
          ) : (
            <p>Select a customer to view their details.</p>
          )}
        </div>
      </div>

      {/* Customer Form: For adding or editing customers */}
      <div className="flex-1 w-64 m-4">
        {message && (
          <div className={`p-2 mb-4 ${message.type === "success" ? "text-green-600" : "text-red-600"}`}>
            {message.text}
          </div>
        )}
        <form onSubmit={handleSubmit(handleCustomerFormSubmit)}>
          <div className="grid grid-cols-2 gap-4 w-fit m-4">
            <div>Name:</div>
            <div>
              <input
                name="name"
                type="text"
                {...register("name", { required: true })}
                className="border border-gray-600 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              />
            </div>
            <div>Date of Birth:</div>
            <div>
              <input
                name="dateOfBirth"
                type="date"
                {...register("dateOfBirth", { required: true })}
                className="border border-gray-600 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              />
            </div>
            <div>Interests:</div>
            <div>
              <input
                name="interests"
                type="text"
                {...register("interests", { required: false })}
                className="border border-gray-600 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              />
            </div>
            <div className="col-span-2 text-right">
              {editMode ? (
                <input
                  type="submit"
                  value="Update"
                  className="bg-blue-800 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
                />
              ) : (
                <input
                  type="submit"
                  value="Add"
                  className="bg-green-800 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-full"
                />
              )}
              {editMode && (
                <button
                  type="button"
                  onClick={() => {
                    reset({ name: "", dateOfBirth: "", interests: "" });
                    setEditMode(false);
                    setFocusedCustomer(null);
                  }}
                  className="ml-2 bg-gray-800 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-full"
                >
                  Cancel
                </button>
              )}
            </div>
          </div>
        </form>
      </div>
    </main>
  );
}
