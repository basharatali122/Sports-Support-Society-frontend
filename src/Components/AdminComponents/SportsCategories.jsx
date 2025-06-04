import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { toast } from "react-toastify";

function SportsCategories() {
  const [sportsCategories, setSportsCategories] = useState([]);
  const [categories, setCategories] = useState([]);
  const [organizers, setOrganizers] = useState([]);
  const [newCategory, setNewCategory] = useState("");
  const [selectedOrganizer, setSelectedOrganizer] = useState({});

  // UseEffect 
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await axios.get(
          "http://localhost:3000/sport-categories"
        );
        setCategories(Array.isArray(data.categories) ? data.categories : []);
      } catch (error) {
        console.error("Error fetching sports categories:", error);
      }
    };

    // Fetch organizer list (from users)
    const fetchOrganizers = async () => {
      const res = await axios.get(
        "http://localhost:3000/users/getAllUsers?role=coach"
      );
      setOrganizers(res.data);
    };
    fetchCategories();
    fetchOrganizers();
  }, []);

  // Function 
  const handleCategoryManagement = async (action, categoryId) => {
    try {
      if (action === "add") {
        await axios.post("http://localhost:3000/sportsCategories", {
          name: "New Category",
        });
        toast.success("New category added");
      } else if (action === "delete") {
        await axios.delete(
          `http://localhost:3000/sportsCategories/${categoryId}`
        );
        toast.success("Category deleted");
      }
      fetchSportsCategories(); // Refresh the categories
    } catch (error) {
      toast.error("Error managing category");
    }
  };
  // Add new category
  const handleAddCategory = async () => {
    if (!newCategory.trim()) return alert("Category name required");
    await axios.post("http://localhost:3000/sport-categories", {
      name: newCategory,
    });
    setNewCategory("");
    fetchCategories();
  };
  // Assign organizer
  const handleAssignOrganizer = async (categoryId, organizerId) => {
    await axios.put(
      `http://localhost:3000/sport-categories/${categoryId}/assign-organizer`,
      {
        organizerId,
      }
    );
    fetchCategories();
  };

  // Delete category
  const handleDeleteCategory = async (categoryId) => {
    if (!window.confirm("Are you sure you want to delete this category?"))
      return;
    await axios.delete(`http://localhost:3000/sport-categories/${categoryId}`);
    fetchCategories();
  };

  return (
    <div>
      <div className="bg-gray-100 rounded-2xl shadow-lg p-8  max-w-9xl mx-auto space-y-6">
        <h2 className="text-2xl font-bold text-blue-500">
          Manage Sports Categories
        </h2>

        {/* Add Category Input */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
          <input
            type="text"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            placeholder="New category name"
            className="flex-1 px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-600 transition"
          />
          <button
            onClick={handleAddCategory}
            className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold shadow-md hover:bg-blue-700 transition"
          >
            Add
          </button>
        </div>

        {/* Categories Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto bg-white rounded-xl overflow-hidden">
            <thead className="bg-blue-600 text-white">
              <tr>
                {["Category", "Organizer", "Assign Organizer", "Actions"].map(
                  (header) => (
                    <th
                      key={header}
                      className="px-6 py-4 text-left text-sm font-semibold tracking-wide"
                    >
                      {header}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody>
              {categories.length > 0 ? (
                categories.map((cat) => (
                  <tr
                    key={cat._id}
                    className="border-b hover:bg-blue-50 transition"
                  >
                    <td className="px-6 py-4 text-gray-800">{cat.name}</td>
                    <td className="px-6 py-4 text-gray-600">
                      {cat.organizer?.name || (
                        <span className="text-gray-400 italic">
                          Not Assigned
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <select
                        defaultValue={cat.organizer?._id || ""}
                        onChange={(e) =>
                          handleAssignOrganizer(cat._id, e.target.value)
                        }
                        className="w-full px-3 py-2 border rounded-lg shadow-sm focus:ring-blue-500"
                      >
                        <option value="">-- Select Organizer --</option>
                        {organizers.map((org) => (
                          <option key={org._id} value={org._id}>
                            {org.name}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleDeleteCategory(cat._id)}
                        className="bg-cyan-600 text-white px-4 py-2 rounded-lg shadow hover:bg-red-600 transition"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="4"
                    className="px-6 py-6 text-center text-gray-500 italic"
                  >
                    No categories available.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default SportsCategories;
