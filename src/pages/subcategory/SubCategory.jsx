// ====== MAIN SUBCATEGORY MANAGEMENT COMPONENT ======

import { useState, useEffect, useRef } from "react";
import { Plus, Edit, Trash2 } from "lucide-react";
import { SubCategoryForm } from "./SubCategoryForm";
import Table from "../../components/models/Table";
import { categoriesAPI, subcategoriesAPI } from "../../components/api/api";

const SubCategoryManagement = () => {
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formLoading, setFormLoading] = useState(false);
  const [mode, setMode] = useState("view");
  const [editingSubcategory, setEditingSubcategory] = useState(null);
  const subcategoriesLoaded = useRef(false);

  const columns = [
    {
      key: "id",
      header: "ID",
      className: "whitespace-nowrap font-medium text-green-600",
      render: (value, row) => {
        const displayId = value || row._id || "N/A";
        return <span className="text-xs">{displayId.substring(0, 8)}...</span>;
      },
    },
    {
      key: "image",
      header: "Image",
      className: "whitespace-nowrap",
      render: (image, row) => (
        <img
          src={
            image ||
            "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMjAiIGZpbGw9IiNFNUU3RUIiLz4KPHBhdGggZD0iTTIwIDIwQzIyLjc2MTQgMjAgMjUgMTcuNzYxNCAyNSAxNUMyNSAxMi4yMzg2IDIyLjc2MTQgMTAgMjAgMTBDMTcuMjM4NiAxMCAxNSAxMi4yMzg2IDE1IDE1QzE1IDE3Ljc2MTQgMTcuNzYxNCAyMCAyMFoiIGZpbGw9IiM5Q0E0QUYiLz4KPHN2Zy8+"
          }
          alt={row.name}
          className="rounded-full w-10 h-10 object-cover"
          onError={(e) => {
            e.target.src =
              "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMjAiIGZpbGw9IiNFNUU3RUIiLz4KPHBhdGggZD0iTTIwIDIwQzIyLjc2MTQgMjAgMjUgMTcuNzYxNCAyNSAxNUMyNSAxMi4yMzg2IDIyLjc2MTQgMTAgMjAgMTBDMTcuMjM4NiAxMCAxNSAxMi4yMzg2IDE1IDE1QzE1IDE3Ljc2MTQgMTcuNzYxNCAyMCAyMFoiIGZpbGw9IiM5Q0E0QUYiLz4KPHN2Zy8+";
            e.target.onError = null; // Prevent further error handling
          }}
        />
      ),
    },
    {
      key: "name",
      header: "SubCategory Name",
      className: "whitespace-nowrap font-semibold uppercase",
    },
    {
      key: "description",
      header: "Description",
      className: "text-gray-600",
    },
  ];

  const actions = [
    {
      icon: <Edit size={16} />,
      onClick: handleEdit,
      className: "text-green-600 hover:text-green-900 hover:bg-green-100",
      title: "Edit SubCategory",
    },
    {
      icon: <Trash2 size={16} />,
      onClick: handleDelete,
      className: "text-red-600 hover:text-red-900 hover:bg-red-100",
      title: "Delete SubCategory",
    },
  ];

  const fetchCategories = async () => {
    try {
      const response = await categoriesAPI.getCategories({ limit: 1000 });

      let categoriesData = [];
      if (response.data.data?.data && Array.isArray(response.data.data.data)) {
        categoriesData = response.data.data.data;
      } else if (response.data.data && Array.isArray(response.data.data)) {
        categoriesData = response.data.data;
      } else if (Array.isArray(response.data)) {
        categoriesData = response.data;
      }

      setCategories(categoriesData);
    } catch (error) {
      console.error("Error fetching categories:", error);
      setCategories([]);
    }
  };

  const fetchSubcategories = async () => {
    try {
      setLoading(true);
      const response = await subcategoriesAPI.getSubcategories({ limit: 1000 });

      let subcategoriesData = [];
      if (response.data.data?.data && Array.isArray(response.data.data.data)) {
        subcategoriesData = response.data.data.data;
      } else if (response.data.data && Array.isArray(response.data.data)) {
        subcategoriesData = response.data.data;
      } else if (Array.isArray(response.data)) {
        subcategoriesData = response.data;
      }

      const mappedSubcategories = subcategoriesData.map((sub) => ({
        ...sub,
        id: sub.id || sub._id,
      }));

      setSubcategories(mappedSubcategories);
    } catch (error) {
      console.error("Error fetching subcategories:", error);
      setSubcategories([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    if (categories.length > 0 && !subcategoriesLoaded.current) {
      fetchSubcategories();
      subcategoriesLoaded.current = true;
    }
  }, [categories]);

async function handleAdd(formData, categoryId, subcategoryId = null) {
    try {
      setFormLoading(true);

      if (!categoryId) {
        alert("Please select a valid category");
        return;
      }

      console.log("Creating subcategory with categoryId:", categoryId);

      let response;
      if (subcategoryId) {
        // Update existing subcategory
        response = await subcategoriesAPI.updateSubcategory(
          subcategoryId,
          formData,
        );
      } else {
        // Create new subcategory
        response = await subcategoriesAPI.createSubcategory(
          categoryId,
          formData,
        );
      }

      // Extract the new/updated subcategory from response
      const newSubcategory = response?.data?.data || response?.data || {};

      if (subcategoryId) {
        // Update in list
        setSubcategories(
          subcategories.map((sub) =>
            (sub.id || sub._id) === subcategoryId
              ? {
                  ...newSubcategory,
                  id: newSubcategory.id || newSubcategory._id,
                }
              : sub,
          ),
        );
        alert("SubCategory updated successfully!");
      } else {
        // Add to list
        setSubcategories([
          ...subcategories,
          {
            ...newSubcategory,
            id: newSubcategory.id || newSubcategory._id,
          },
        ]);
        alert("SubCategory created successfully!");
      }

      setMode("view");
      setEditingSubcategory(null);
    } catch (error) {
      console.error("Error saving subcategory:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        "Failed to save subcategory";
      alert(errorMessage);
    } finally {
      setFormLoading(false);
    }
  }

  function handleEdit(subcategory) {
    setEditingSubcategory(subcategory);
    setMode("edit");
  }

  async function handleDelete(subcategory) {
    if (
      !window.confirm(`Are you sure you want to delete "${subcategory.name}"?`)
    ) {
      return;
    }

    try {
      const subId = subcategory.id || subcategory._id;
      await subcategoriesAPI.deleteSubcategory(subId);

      setSubcategories(
        subcategories.filter((sub) => (sub.id || sub._id) !== subId),
      );
      alert("SubCategory deleted successfully!");
    } catch (error) {
      console.error("Error deleting subcategory:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Failed to delete subcategory";
      alert(errorMessage);
    }
  }

  function handleCancel() {
    setMode("view");
    setEditingSubcategory(null);
  }

  const handleRefresh = () => {
    subcategoriesLoaded.current = false;
    fetchCategories();
    fetchSubcategories();
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                🍚 Rice Deal - SubCategory Management
              </h1>
              <p className="text-gray-600">
                Manage your subcategories with FormData file upload
              </p>
            </div>
            <button
              onClick={handleRefresh}
              disabled={loading}
              className="px-4 py-2 text-green-600 hover:text-green-800 hover:bg-green-50 rounded-md transition-colors disabled:opacity-50"
            >
              {loading ? "Loading..." : "Refresh"}
            </button>
          </div>
        </div>

        {/* Add Form Modal */}
        {mode === "add" && (
          <div className="fixed inset-0 backdrop-blur-sm bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="w-full max-w-md">
              <SubCategoryForm
                categories={categories}
                onSave={handleAdd}
                onCancel={handleCancel}
                title="Add New SubCategory"
                loading={formLoading}
              />
            </div>
          </div>
        )}

        {/* Edit Form Modal */}
        {mode === "edit" && editingSubcategory && (
          <div className="fixed inset-0 backdrop-blur-sm bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="w-full max-w-md">
              <SubCategoryForm
                subcategory={editingSubcategory}
                categories={categories}
                onSave={handleAdd}
                onCancel={handleCancel}
                title="Edit SubCategory"
                loading={formLoading}
              />
            </div>
          </div>
        )}

        {/* Add Button */}
        {mode === "view" && (
          <div className="mb-6">
            <button
              onClick={() => setMode("add")}
              disabled={categories.length === 0}
              className="flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 shadow-md hover:shadow-lg transition-all disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              <Plus size={18} />
              Add New SubCategory
            </button>
            {categories.length === 0 && (
              <p className="text-sm text-red-500 mt-2">
                Please add categories first before creating subcategories
              </p>
            )}
          </div>
        )}

        {/* SubCategories Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800">
              SubCategories {!loading && `(${subcategories.length})`}
            </h2>
          </div>
          <Table
            columns={columns}
            data={subcategories}
            actions={actions}
            loading={loading}
            emptyMessage="No subcategories found. Add your first subcategory to get started!"
          />
        </div>

        {/* Stats */}
        {!loading && subcategories.length > 0 && (
          <div className="mt-6 bg-green-50 rounded-lg p-4">
            <div className="flex items-center justify-between text-green-800">
              <span className="font-medium">
                Total SubCategories: {subcategories.length}
              </span>
              <span className="text-sm">
                Categories: {categories.length} | FormData Upload ✓
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SubCategoryManagement;
