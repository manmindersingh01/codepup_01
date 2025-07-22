import React, { useState, useEffect, useMemo } from "react";
import { useAuth } from "../contexts/AuthContext";
import { supabase } from "../lib/supabase";
import { Product, Order, Profile, Category, OrderItem } from "../types";
import {
  Users,
  Package,
  ShoppingCart,
  DollarSign,
  Plus,
  Edit,
  Trash2,
  Search,
  Filter,
  Eye,
  X,
  Check,
  AlertTriangle,
  BarChart3,
  TrendingUp,
  Calendar,
  Settings,
  LogOut,
  ChevronDown,
  ChevronRight,
  Upload,
  Save,
  RefreshCw,
} from "lucide-react";

interface AdminStats {
  totalProducts: number;
  totalOrders: number;
  totalUsers: number;
  totalRevenue: number;
  monthlyRevenue: number;
  pendingOrders: number;
}

interface FormErrors {
  [key: string]: string;
}

const AdminDashboard: React.FC = () => {
  const { user, profile, loading: authLoading, logout } = useAuth();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [users, setUsers] = useState<Profile[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<
    "create" | "edit" | "view" | "delete"
  >("create");
  const [modalEntity, setModalEntity] = useState<
    "product" | "order" | "user" | "category"
  >("product");
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [formData, setFormData] = useState<any>({});
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);
  const [stats, setStats] = useState<AdminStats>({
    totalProducts: 0,
    totalOrders: 0,
    totalUsers: 0,
    totalRevenue: 0,
    monthlyRevenue: 0,
    pendingOrders: 0,
  });

  // Authentication check
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-500 to-primary-600">
        <div className="glass-panel p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user || profile?.role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-500 to-primary-600">
        <div className="glass-panel p-8 text-center max-w-md">
          <AlertTriangle className="h-16 w-16 text-red-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Access Denied</h2>
          <p className="text-gray-200 mb-6">
            You don't have permission to access the admin dashboard.
          </p>
          <button
            onClick={() => (window.location.href = "/")}
            className="glass-button w-full"
          >
            Go to Home
          </button>
        </div>
      </div>
    );
  }

  // Toast notification
  const showToast = (message: string, type: "success" | "error") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Fetch all data
  const fetchAllData = async () => {
    try {
      setLoading(true);

      const [productsRes, ordersRes, usersRes, categoriesRes, orderItemsRes] =
        await Promise.all([
          supabase
            .from("products")
            .select("*")
            .order("created_at", { ascending: false }),
          supabase
            .from("orders")
            .select("*")
            .order("created_at", { ascending: false }),
          supabase
            .from("profiles")
            .select("*")
            .order("created_at", { ascending: false }),
          supabase
            .from("categories")
            .select("*")
            .order("created_at", { ascending: false }),
          supabase.from("order_items").select("*"),
        ]);

      if (productsRes.error) throw productsRes.error;
      if (ordersRes.error) throw ordersRes.error;
      if (usersRes.error) throw usersRes.error;
      if (categoriesRes.error) throw categoriesRes.error;
      if (orderItemsRes.error) throw orderItemsRes.error;

      setProducts(productsRes.data || []);
      setOrders(ordersRes.data || []);
      setUsers(usersRes.data || []);
      setCategories(categoriesRes.data || []);
      setOrderItems(orderItemsRes.data || []);

      // Calculate stats
      const totalRevenue = (ordersRes.data || []).reduce(
        (sum, order) =>
          order.status === "completed" ? sum + order.total_amount : sum,
        0
      );

      const currentMonth = new Date().getMonth();
      const currentYear = new Date().getFullYear();
      const monthlyRevenue = (ordersRes.data || []).reduce((sum, order) => {
        const orderDate = new Date(order.created_at);
        return order.status === "completed" &&
          orderDate.getMonth() === currentMonth &&
          orderDate.getFullYear() === currentYear
          ? sum + order.total_amount
          : sum;
      }, 0);

      setStats({
        totalProducts: productsRes.data?.length || 0,
        totalOrders: ordersRes.data?.length || 0,
        totalUsers: usersRes.data?.length || 0,
        totalRevenue,
        monthlyRevenue,
        pendingOrders: (ordersRes.data || []).filter(
          (order) => order.status === "pending"
        ).length,
      });
    } catch (error) {
      console.error("Admin data fetch error:", error);
      showToast("Failed to load admin data", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  // Form validation
  const validateForm = (entity: string, data: any): FormErrors => {
    const errors: FormErrors = {};

    switch (entity) {
      case "product":
        if (!data.name?.trim()) errors.name = "Product name is required";
        if (!data.price || data.price < 0)
          errors.price = "Valid price is required";
        if (!data.category_id) errors.category_id = "Category is required";
        break;
      case "category":
        if (!data.name?.trim()) errors.name = "Category name is required";
        if (!data.slug?.trim()) errors.slug = "Slug is required";
        break;
      case "user":
        if (!data.email?.trim()) errors.email = "Email is required";
        if (!data.role) errors.role = "Role is required";
        break;
    }

    return errors;
  };

  // CRUD Operations
  const handleCreate = async () => {
    const errors = validateForm(modalEntity, formData);
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    try {
      let result;
      const dataToInsert = {
        ...formData,
        updated_at: new Date().toISOString(),
      };

      switch (modalEntity) {
        case "product":
          result = await supabase.from("products").insert([dataToInsert]);
          break;
        case "category":
          result = await supabase.from("categories").insert([dataToInsert]);
          break;
        case "user":
          result = await supabase.from("profiles").insert([dataToInsert]);
          break;
      }

      if (result?.error) throw result.error;

      showToast(
        `${
          modalEntity.charAt(0).toUpperCase() + modalEntity.slice(1)
        } created successfully`,
        "success"
      );
      setShowModal(false);
      setFormData({});
      setFormErrors({});
      fetchAllData();
    } catch (error) {
      console.error("Create error:", error);
      showToast("Failed to create item", "error");
    }
  };

  const handleUpdate = async () => {
    const errors = validateForm(modalEntity, formData);
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    try {
      let result;
      const dataToUpdate = {
        ...formData,
        updated_at: new Date().toISOString(),
      };

      switch (modalEntity) {
        case "product":
          result = await supabase
            .from("products")
            .update(dataToUpdate)
            .eq("id", selectedItem.id);
          break;
        case "category":
          result = await supabase
            .from("categories")
            .update(dataToUpdate)
            .eq("id", selectedItem.id);
          break;
        case "user":
          result = await supabase
            .from("profiles")
            .update(dataToUpdate)
            .eq("id", selectedItem.id);
          break;
        case "order":
          result = await supabase
            .from("orders")
            .update(dataToUpdate)
            .eq("id", selectedItem.id);
          break;
      }

      if (result?.error) throw result.error;

      showToast(
        `${
          modalEntity.charAt(0).toUpperCase() + modalEntity.slice(1)
        } updated successfully`,
        "success"
      );
      setShowModal(false);
      setFormData({});
      setFormErrors({});
      fetchAllData();
    } catch (error) {
      console.error("Update error:", error);
      showToast("Failed to update item", "error");
    }
  };

  const handleDelete = async () => {
    try {
      let result;

      switch (modalEntity) {
        case "product":
          result = await supabase
            .from("products")
            .delete()
            .eq("id", selectedItem.id);
          break;
        case "category":
          result = await supabase
            .from("categories")
            .delete()
            .eq("id", selectedItem.id);
          break;
        case "user":
          result = await supabase
            .from("profiles")
            .delete()
            .eq("id", selectedItem.id);
          break;
      }

      if (result?.error) throw result.error;

      showToast(
        `${
          modalEntity.charAt(0).toUpperCase() + modalEntity.slice(1)
        } deleted successfully`,
        "success"
      );
      setShowModal(false);
      fetchAllData();
    } catch (error) {
      console.error("Delete error:", error);
      showToast("Failed to delete item", "error");
    }
  };

  // Modal handlers
  const openModal = (
    type: "create" | "edit" | "view" | "delete",
    entity: "product" | "order" | "user" | "category",
    item?: any
  ) => {
    setModalType(type);
    setModalEntity(entity);
    setSelectedItem(item);
    setFormData(item || {});
    setFormErrors({});
    setShowModal(true);
  };

  // Filtered data
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch =
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter =
        filterStatus === "all" ||
        (filterStatus === "active" && product.is_active) ||
        (filterStatus === "inactive" && !product.is_active);
      return matchesSearch && matchesFilter;
    });
  }, [products, searchTerm, filterStatus]);

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const matchesSearch = order.id
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesFilter =
        filterStatus === "all" || order.status === filterStatus;
      return matchesSearch && matchesFilter;
    });
  }, [orders, searchTerm, filterStatus]);

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const matchesSearch =
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.full_name?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter =
        filterStatus === "all" || user.role === filterStatus;
      return matchesSearch && matchesFilter;
    });
  }, [users, searchTerm, filterStatus]);

  const filteredCategories = useMemo(() => {
    return categories.filter((category) => {
      const matchesSearch = category.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesFilter =
        filterStatus === "all" ||
        (filterStatus === "active" && category.is_active) ||
        (filterStatus === "inactive" && !category.is_active);
      return matchesSearch && matchesFilter;
    });
  }, [categories, searchTerm, filterStatus]);

  // Get order items for specific order
  const getOrderItems = (orderId: string) => {
    return orderItems.filter((item) => item.order_id === orderId);
  };

  // Get product name by ID
  const getProductName = (productId: string) => {
    const product = products.find((p) => p.id === productId);
    return product?.name || "Unknown Product";
  };

  // Get category name by ID
  const getCategoryName = (categoryId: string) => {
    const category = categories.find((c) => c.id === categoryId);
    return category?.name || "No Category";
  };

  // Render form fields based on entity
  const renderFormFields = () => {
    switch (modalEntity) {
      case "product":
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Product Name
              </label>
              <input
                type="text"
                value={formData.name || ""}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="Enter product name"
              />
              {formErrors.name && (
                <p className="text-red-500 text-sm mt-1">{formErrors.name}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                value={formData.description || ""}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                rows={3}
                placeholder="Enter product description"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <select
                value={formData.category_id || ""}
                onChange={(e) =>
                  setFormData({ ...formData, category_id: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="">Select a category</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
              {formErrors.category_id && (
                <p className="text-red-500 text-sm mt-1">
                  {formErrors.category_id}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Price
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.price || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      price: parseFloat(e.target.value) || 0,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="0.00"
                />
                {formErrors.price && (
                  <p className="text-red-500 text-sm mt-1">
                    {formErrors.price}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Monthly Price
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.monthly_price || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      monthly_price: parseFloat(e.target.value) || 0,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="0.00"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Yearly Price
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.yearly_price || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      yearly_price: parseFloat(e.target.value) || 0,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="0.00"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Image URL
              </label>
              <input
                type="url"
                value={formData.image_url || ""}
                onChange={(e) =>
                  setFormData({ ...formData, image_url: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="https://example.com/image.jpg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Demo URL
              </label>
              <input
                type="url"
                value={formData.demo_url || ""}
                onChange={(e) =>
                  setFormData({ ...formData, demo_url: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="https://example.com/demo"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Trial Days
                </label>
                <input
                  type="number"
                  value={formData.trial_days || 7}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      trial_days: parseInt(e.target.value) || 7,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="7"
                />
              </div>

              <div className="flex items-center space-x-4 pt-6">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.is_active !== false}
                    onChange={(e) =>
                      setFormData({ ...formData, is_active: e.target.checked })
                    }
                    className="mr-2"
                  />
                  Active
                </label>

                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.subscription_required !== false}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        subscription_required: e.target.checked,
                      })
                    }
                    className="mr-2"
                  />
                  Subscription Required
                </label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Features (one per line)
              </label>
              <textarea
                value={
                  Array.isArray(formData.features)
                    ? formData.features.join("")
                    : ""
                }
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    features: e.target.value.split("").filter((f) => f.trim()),
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                rows={4}
                placeholder="Feature 1
Feature 2
Feature 3"
              />
            </div>
          </div>
        );

      case "category":
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category Name
              </label>
              <input
                type="text"
                value={formData.name || ""}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="Enter category name"
              />
              {formErrors.name && (
                <p className="text-red-500 text-sm mt-1">{formErrors.name}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Slug
              </label>
              <input
                type="text"
                value={formData.slug || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    slug: e.target.value.toLowerCase().replace(/\s+/g, "-"),
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="category-slug"
              />
              {formErrors.slug && (
                <p className="text-red-500 text-sm mt-1">{formErrors.slug}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                value={formData.description || ""}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                rows={3}
                placeholder="Enter category description"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Image URL
              </label>
              <input
                type="url"
                value={formData.image_url || ""}
                onChange={(e) =>
                  setFormData({ ...formData, image_url: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="https://example.com/image.jpg"
              />
            </div>

            <div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.is_active !== false}
                  onChange={(e) =>
                    setFormData({ ...formData, is_active: e.target.checked })
                  }
                  className="mr-2"
                />
                Active
              </label>
            </div>
          </div>
        );

      case "user":
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                value={formData.email || ""}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="user@example.com"
                disabled={modalType === "edit"}
              />
              {formErrors.email && (
                <p className="text-red-500 text-sm mt-1">{formErrors.email}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <input
                type="text"
                value={formData.full_name || ""}
                onChange={(e) =>
                  setFormData({ ...formData, full_name: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="Enter full name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Company
              </label>
              <input
                type="text"
                value={formData.company || ""}
                onChange={(e) =>
                  setFormData({ ...formData, company: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="Enter company name"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Role
                </label>
                <select
                  value={formData.role || "user"}
                  onChange={(e) =>
                    setFormData({ ...formData, role: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
                {formErrors.role && (
                  <p className="text-red-500 text-sm mt-1">{formErrors.role}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Subscription Tier
                </label>
                <select
                  value={formData.subscription_tier || "free"}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      subscription_tier: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="free">Free</option>
                  <option value="basic">Basic</option>
                  <option value="pro">Pro</option>
                  <option value="enterprise">Enterprise</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Avatar URL
              </label>
              <input
                type="url"
                value={formData.avatar_url || ""}
                onChange={(e) =>
                  setFormData({ ...formData, avatar_url: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="https://example.com/avatar.jpg"
              />
            </div>
          </div>
        );

      case "order":
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Order Status
              </label>
              <select
                value={formData.status || "pending"}
                onChange={(e) =>
                  setFormData({ ...formData, status: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
                <option value="refunded">Refunded</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Payment Method
              </label>
              <input
                type="text"
                value={formData.payment_method || ""}
                onChange={(e) =>
                  setFormData({ ...formData, payment_method: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="Credit Card, PayPal, etc."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Payment ID
              </label>
              <input
                type="text"
                value={formData.payment_id || ""}
                onChange={(e) =>
                  setFormData({ ...formData, payment_id: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="Payment transaction ID"
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-500 to-primary-600">
        <div className="glass-panel p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-500 to-primary-600">
      {/* Toast Notification */}
      {toast && (
        <div
          className={`fixed top-4 right-4 z-50 px-6 py-3 rounded-lg shadow-lg ${
            toast.type === "success" ? "bg-green-500" : "bg-red-500"
          } text-white`}
        >
          {toast.message}
        </div>
      )}

      {/* Header */}
      <header className="glass-panel mx-4 mt-4 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <BarChart3 className="h-8 w-8 text-white" />
            <div>
              <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
              <p className="text-gray-200">
                Welcome back, {profile?.full_name || profile?.email}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={fetchAllData}
              className="glass-button flex items-center space-x-2"
              disabled={loading}
            >
              <RefreshCw
                className={`h-4 w-4 ${loading ? "animate-spin" : ""}`}
              />
              <span>Refresh</span>
            </button>

            <button
              onClick={logout}
              className="glass-button flex items-center space-x-2 hover:bg-red-500/20"
            >
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      <div className="flex flex-col lg:flex-row gap-4 p-4">
        {/* Sidebar */}
        <aside className="lg:w-64">
          <nav className="glass-panel p-4">
            <ul className="space-y-2">
              {[
                { id: "dashboard", label: "Dashboard", icon: BarChart3 },
                { id: "products", label: "Products", icon: Package },
                { id: "categories", label: "Categories", icon: Filter },
                { id: "orders", label: "Orders", icon: ShoppingCart },
                { id: "users", label: "Users", icon: Users },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <li key={item.id}>
                    <button
                      onClick={() => setActiveTab(item.id)}
                      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                        activeTab === item.id
                          ? "bg-white/20 text-white"
                          : "text-gray-200 hover:bg-white/10 hover:text-white"
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                      <span>{item.label}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1">
          {activeTab === "dashboard" && (
            <div className="space-y-6">
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="glass-card p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-200 text-sm">Total Products</p>
                      <p className="text-3xl font-bold text-white">
                        {stats.totalProducts}
                      </p>
                    </div>
                    <Package className="h-8 w-8 text-accent-pink" />
                  </div>
                </div>

                <div className="glass-card p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-200 text-sm">Total Orders</p>
                      <p className="text-3xl font-bold text-white">
                        {stats.totalOrders}
                      </p>
                    </div>
                    <ShoppingCart className="h-8 w-8 text-accent-blue" />
                  </div>
                </div>

                <div className="glass-card p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-200 text-sm">Total Users</p>
                      <p className="text-3xl font-bold text-white">
                        {stats.totalUsers}
                      </p>
                    </div>
                    <Users className="h-8 w-8 text-accent-teal" />
                  </div>
                </div>

                <div className="glass-card p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-200 text-sm">Total Revenue</p>
                      <p className="text-3xl font-bold text-white">
                        ${stats.totalRevenue.toFixed(2)}
                      </p>
                    </div>
                    <DollarSign className="h-8 w-8 text-accent-purple" />
                  </div>
                </div>
              </div>

              {/* Additional Stats */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="glass-card p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-white">
                      Monthly Revenue
                    </h3>
                    <TrendingUp className="h-6 w-6 text-green-400" />
                  </div>
                  <p className="text-2xl font-bold text-white">
                    ${stats.monthlyRevenue.toFixed(2)}
                  </p>
                  <p className="text-gray-200 text-sm mt-2">This month</p>
                </div>

                <div className="glass-card p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-white">
                      Pending Orders
                    </h3>
                    <Calendar className="h-6 w-6 text-yellow-400" />
                  </div>
                  <p className="text-2xl font-bold text-white">
                    {stats.pendingOrders}
                  </p>
                  <p className="text-gray-200 text-sm mt-2">
                    Awaiting processing
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Products Tab */}
          {activeTab === "products" && (
            <div className="glass-panel p-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 space-y-4 sm:space-y-0">
                <h2 className="text-2xl font-bold text-white">
                  Products Management
                </h2>
                <button
                  onClick={() => openModal("create", "product")}
                  className="glass-button flex items-center space-x-2"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add Product</span>
                </button>
              </div>

              {/* Search and Filter */}
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>

              {/* Products Table */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/20">
                      <th className="text-left py-3 px-4 text-white font-semibold">
                        Product
                      </th>
                      <th className="text-left py-3 px-4 text-white font-semibold">
                        Category
                      </th>
                      <th className="text-left py-3 px-4 text-white font-semibold">
                        Price
                      </th>
                      <th className="text-left py-3 px-4 text-white font-semibold">
                        Status
                      </th>
                      <th className="text-left py-3 px-4 text-white font-semibold">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProducts.map((product) => (
                      <tr
                        key={product.id}
                        className="border-b border-white/10 hover:bg-white/5"
                      >
                        <td className="py-3 px-4">
                          <div className="flex items-center space-x-3">
                            {product.image_url && (
                              <img
                                src={product.image_url}
                                alt={product.name}
                                className="w-10 h-10 rounded-lg object-cover"
                              />
                            )}
                            <div>
                              <p className="text-white font-medium">
                                {product.name}
                              </p>
                              <p className="text-gray-300 text-sm truncate max-w-xs">
                                {product.description}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-gray-200">
                          {getCategoryName(product.category_id || "")}
                        </td>
                        <td className="py-3 px-4 text-gray-200">
                          ${product.price}
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              product.is_active
                                ? "bg-green-500/20 text-green-400"
                                : "bg-red-500/20 text-red-400"
                            }`}
                          >
                            {product.is_active ? "Active" : "Inactive"}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() =>
                                openModal("view", "product", product)
                              }
                              className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                            >
                              <Eye className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() =>
                                openModal("edit", "product", product)
                              }
                              className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() =>
                                openModal("delete", "product", product)
                              }
                              className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Categories Tab */}
          {activeTab === "categories" && (
            <div className="glass-panel p-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 space-y-4 sm:space-y-0">
                <h2 className="text-2xl font-bold text-white">
                  Categories Management
                </h2>
                <button
                  onClick={() => openModal("create", "category")}
                  className="glass-button flex items-center space-x-2"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add Category</span>
                </button>
              </div>

              {/* Search and Filter */}
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search categories..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>

              {/* Categories Table */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/20">
                      <th className="text-left py-3 px-4 text-white font-semibold">
                        Category
                      </th>
                      <th className="text-left py-3 px-4 text-white font-semibold">
                        Slug
                      </th>
                      <th className="text-left py-3 px-4 text-white font-semibold">
                        Status
                      </th>
                      <th className="text-left py-3 px-4 text-white font-semibold">
                        Created
                      </th>
                      <th className="text-left py-3 px-4 text-white font-semibold">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredCategories.map((category) => (
                      <tr
                        key={category.id}
                        className="border-b border-white/10 hover:bg-white/5"
                      >
                        <td className="py-3 px-4">
                          <div className="flex items-center space-x-3">
                            {category.image_url && (
                              <img
                                src={category.image_url}
                                alt={category.name}
                                className="w-10 h-10 rounded-lg object-cover"
                              />
                            )}
                            <div>
                              <p className="text-white font-medium">
                                {category.name}
                              </p>
                              <p className="text-gray-300 text-sm truncate max-w-xs">
                                {category.description}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-gray-200">
                          {category.slug}
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              category.is_active
                                ? "bg-green-500/20 text-green-400"
                                : "bg-red-500/20 text-red-400"
                            }`}
                          >
                            {category.is_active ? "Active" : "Inactive"}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-gray-200">
                          {new Date(category.created_at).toLocaleDateString()}
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() =>
                                openModal("view", "category", category)
                              }
                              className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                            >
                              <Eye className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() =>
                                openModal("edit", "category", category)
                              }
                              className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() =>
                                openModal("delete", "category", category)
                              }
                              className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Orders Tab */}
          {activeTab === "orders" && (
            <div className="glass-panel p-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 space-y-4 sm:space-y-0">
                <h2 className="text-2xl font-bold text-white">
                  Orders Management
                </h2>
              </div>

              {/* Search and Filter */}
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search orders..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="processing">Processing</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                  <option value="refunded">Refunded</option>
                </select>
              </div>

              {/* Orders Table */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/20">
                      <th className="text-left py-3 px-4 text-white font-semibold">
                        Order ID
                      </th>
                      <th className="text-left py-3 px-4 text-white font-semibold">
                        Customer
                      </th>
                      <th className="text-left py-3 px-4 text-white font-semibold">
                        Amount
                      </th>
                      <th className="text-left py-3 px-4 text-white font-semibold">
                        Status
                      </th>
                      <th className="text-left py-3 px-4 text-white font-semibold">
                        Date
                      </th>
                      <th className="text-left py-3 px-4 text-white font-semibold">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredOrders.map((order) => {
                      const customer = users.find(
                        (u) => u.id === order.user_id
                      );
                      return (
                        <tr
                          key={order.id}
                          className="border-b border-white/10 hover:bg-white/5"
                        >
                          <td className="py-3 px-4 text-gray-200 font-mono text-sm">
                            {order.id.slice(0, 8)}...
                          </td>
                          <td className="py-3 px-4 text-gray-200">
                            {customer?.full_name ||
                              customer?.email ||
                              "Unknown"}
                          </td>
                          <td className="py-3 px-4 text-gray-200">
                            ${order.total_amount.toFixed(2)}
                          </td>
                          <td className="py-3 px-4">
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${
                                order.status === "completed"
                                  ? "bg-green-500/20 text-green-400"
                                  : order.status === "pending"
                                  ? "bg-yellow-500/20 text-yellow-400"
                                  : order.status === "processing"
                                  ? "bg-blue-500/20 text-blue-400"
                                  : order.status === "cancelled"
                                  ? "bg-red-500/20 text-red-400"
                                  : "bg-gray-500/20 text-gray-400"
                              }`}
                            >
                              {order.status.charAt(0).toUpperCase() +
                                order.status.slice(1)}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-gray-200">
                            {new Date(order.created_at).toLocaleDateString()}
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() =>
                                  openModal("view", "order", order)
                                }
                                className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                              >
                                <Eye className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() =>
                                  openModal("edit", "order", order)
                                }
                                className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                              >
                                <Edit className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Users Tab */}
          {activeTab === "users" && (
            <div className="glass-panel p-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 space-y-4 sm:space-y-0">
                <h2 className="text-2xl font-bold text-white">
                  Users Management
                </h2>
              </div>

              {/* Search and Filter */}
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search users..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="all">All Roles</option>
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              {/* Users Table */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/20">
                      <th className="text-left py-3 px-4 text-white font-semibold">
                        User
                      </th>
                      <th className="text-left py-3 px-4 text-white font-semibold">
                        Email
                      </th>
                      <th className="text-left py-3 px-4 text-white font-semibold">
                        Role
                      </th>
                      <th className="text-left py-3 px-4 text-white font-semibold">
                        Subscription
                      </th>
                      <th className="text-left py-3 px-4 text-white font-semibold">
                        Joined
                      </th>
                      <th className="text-left py-3 px-4 text-white font-semibold">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((user) => (
                      <tr
                        key={user.id}
                        className="border-b border-white/10 hover:bg-white/5"
                      >
                        <td className="py-3 px-4">
                          <div className="flex items-center space-x-3">
                            {user.avatar_url ? (
                              <img
                                src={user.avatar_url}
                                alt={user.full_name || user.email}
                                className="w-10 h-10 rounded-full object-cover"
                              />
                            ) : (
                              <div className="w-10 h-10 rounded-full bg-primary-500 flex items-center justify-center">
                                <span className="text-white font-medium">
                                  {(user.full_name || user.email)
                                    .charAt(0)
                                    .toUpperCase()}
                                </span>
                              </div>
                            )}
                            <div>
                              <p className="text-white font-medium">
                                {user.full_name || "No name"}
                              </p>
                              <p className="text-gray-300 text-sm">
                                {user.company || "No company"}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-gray-200">
                          {user.email}
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              user.role === "admin"
                                ? "bg-purple-500/20 text-purple-400"
                                : "bg-blue-500/20 text-blue-400"
                            }`}
                          >
                            {user.role.charAt(0).toUpperCase() +
                              user.role.slice(1)}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              user.subscription_tier === "enterprise"
                                ? "bg-gold-500/20 text-gold-400"
                                : user.subscription_tier === "pro"
                                ? "bg-purple-500/20 text-purple-400"
                                : user.subscription_tier === "basic"
                                ? "bg-blue-500/20 text-blue-400"
                                : "bg-gray-500/20 text-gray-400"
                            }`}
                          >
                            {user.subscription_tier.charAt(0).toUpperCase() +
                              user.subscription_tier.slice(1)}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-gray-200">
                          {new Date(user.created_at).toLocaleDateString()}
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => openModal("view", "user", user)}
                              className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                            >
                              <Eye className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => openModal("edit", "user", user)}
                              className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="glass-panel max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-white">
                  {modalType === "create" &&
                    `Create ${
                      modalEntity.charAt(0).toUpperCase() + modalEntity.slice(1)
                    }`}
                  {modalType === "edit" &&
                    `Edit ${
                      modalEntity.charAt(0).toUpperCase() + modalEntity.slice(1)
                    }`}
                  {modalType === "view" &&
                    `View ${
                      modalEntity.charAt(0).toUpperCase() + modalEntity.slice(1)
                    }`}
                  {modalType === "delete" &&
                    `Delete ${
                      modalEntity.charAt(0).toUpperCase() + modalEntity.slice(1)
                    }`}
                </h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {modalType === "delete" ? (
                <div className="text-center">
                  <AlertTriangle className="h-16 w-16 text-red-400 mx-auto mb-4" />
                  <h4 className="text-lg font-semibold text-white mb-2">
                    Are you sure?
                  </h4>
                  <p className="text-gray-300 mb-6">
                    This action cannot be undone. This will permanently delete
                    the {modalEntity}.
                  </p>
                  <div className="flex justify-center space-x-4">
                    <button
                      onClick={() => setShowModal(false)}
                      className="px-6 py-2 bg-gray-500/20 text-gray-300 rounded-lg hover:bg-gray-500/30 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleDelete}
                      className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ) : modalType === "view" ? (
                <div className="space-y-4">
                  {modalEntity === "product" && selectedItem && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-1">
                            Name
                          </label>
                          <p className="text-white">{selectedItem.name}</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-1">
                            Category
                          </label>
                          <p className="text-white">
                            {getCategoryName(selectedItem.category_id)}
                          </p>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">
                          Description
                        </label>
                        <p className="text-white">
                          {selectedItem.description || "No description"}
                        </p>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-1">
                            Price
                          </label>
                          <p className="text-white">${selectedItem.price}</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-1">
                            Monthly Price
                          </label>
                          <p className="text-white">
                            ${selectedItem.monthly_price || "N/A"}
                          </p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-1">
                            Yearly Price
                          </label>
                          <p className="text-white">
                            ${selectedItem.yearly_price || "N/A"}
                          </p>
                        </div>
                      </div>
                      {selectedItem.features &&
                        selectedItem.features.length > 0 && (
                          <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">
                              Features
                            </label>
                            <ul className="text-white space-y-1">
                              {selectedItem.features.map(
                                (feature: string, index: number) => (
                                  <li
                                    key={index}
                                    className="flex items-center space-x-2"
                                  >
                                    <Check className="h-4 w-4 text-green-400" />
                                    <span>{feature}</span>
                                  </li>
                                )
                              )}
                            </ul>
                          </div>
                        )}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-1">
                            Status
                          </label>
                          <p
                            className={`${
                              selectedItem.is_active
                                ? "text-green-400"
                                : "text-red-400"
                            }`}
                          >
                            {selectedItem.is_active ? "Active" : "Inactive"}
                          </p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-1">
                            Trial Days
                          </label>
                          <p className="text-white">
                            {selectedItem.trial_days} days
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {modalEntity === "order" && selectedItem && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-1">
                            Order ID
                          </label>
                          <p className="text-white font-mono">
                            {selectedItem.id}
                          </p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-1">
                            Customer
                          </label>
                          <p className="text-white">
                            {users.find((u) => u.id === selectedItem.user_id)
                              ?.email || "Unknown"}
                          </p>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-1">
                            Total Amount
                          </label>
                          <p className="text-white text-xl font-bold">
                            ${selectedItem.total_amount.toFixed(2)}
                          </p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-1">
                            Status
                          </label>
                          <p
                            className={`font-medium ${
                              selectedItem.status === "completed"
                                ? "text-green-400"
                                : selectedItem.status === "pending"
                                ? "text-yellow-400"
                                : selectedItem.status === "processing"
                                ? "text-blue-400"
                                : "text-red-400"
                            }`}
                          >
                            {selectedItem.status.charAt(0).toUpperCase() +
                              selectedItem.status.slice(1)}
                          </p>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-1">
                            Payment Method
                          </label>
                          <p className="text-white">
                            {selectedItem.payment_method || "N/A"}
                          </p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-1">
                            Created
                          </label>
                          <p className="text-white">
                            {new Date(selectedItem.created_at).toLocaleString()}
                          </p>
                        </div>
                      </div>

                      {/* Order Items */}
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-3">
                          Order Items
                        </label>
                        <div className="space-y-2">
                          {getOrderItems(selectedItem.id).map((item) => (
                            <div
                              key={item.id}
                              className="flex justify-between items-center p-3 bg-white/5 rounded-lg"
                            >
                              <div>
                                <p className="text-white font-medium">
                                  {getProductName(item.product_id)}
                                </p>
                                <p className="text-gray-300 text-sm">
                                  Quantity: {item.quantity}
                                </p>
                              </div>
                              <p className="text-white font-medium">
                                ${item.price.toFixed(2)}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {modalEntity === "user" && selectedItem && (
                    <div className="space-y-4">
                      <div className="flex items-center space-x-4 mb-4">
                        {selectedItem.avatar_url ? (
                          <img
                            src={selectedItem.avatar_url}
                            alt={selectedItem.full_name || selectedItem.email}
                            className="w-16 h-16 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-16 h-16 rounded-full bg-primary-500 flex items-center justify-center">
                            <span className="text-white text-xl font-medium">
                              {(selectedItem.full_name || selectedItem.email)
                                .charAt(0)
                                .toUpperCase()}
                            </span>
                          </div>
                        )}
                        <div>
                          <h4 className="text-xl font-bold text-white">
                            {selectedItem.full_name || "No name"}
                          </h4>
                          <p className="text-gray-300">{selectedItem.email}</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-1">
                            Role
                          </label>
                          <p className="text-white">
                            {selectedItem.role.charAt(0).toUpperCase() +
                              selectedItem.role.slice(1)}
                          </p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-1">
                            Subscription Tier
                          </label>
                          <p className="text-white">
                            {selectedItem.subscription_tier
                              .charAt(0)
                              .toUpperCase() +
                              selectedItem.subscription_tier.slice(1)}
                          </p>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">
                          Company
                        </label>
                        <p className="text-white">
                          {selectedItem.company || "No company"}
                        </p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-1">
                            Joined
                          </label>
                          <p className="text-white">
                            {new Date(
                              selectedItem.created_at
                            ).toLocaleDateString()}
                          </p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-1">
                            Last Updated
                          </label>
                          <p className="text-white">
                            {new Date(
                              selectedItem.updated_at
                            ).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {modalEntity === "category" && selectedItem && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-1">
                            Name
                          </label>
                          <p className="text-white">{selectedItem.name}</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-1">
                            Slug
                          </label>
                          <p className="text-white">{selectedItem.slug}</p>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">
                          Description
                        </label>
                        <p className="text-white">
                          {selectedItem.description || "No description"}
                        </p>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-1">
                            Status
                          </label>
                          <p
                            className={`${
                              selectedItem.is_active
                                ? "text-green-400"
                                : "text-red-400"
                            }`}
                          >
                            {selectedItem.is_active ? "Active" : "Inactive"}
                          </p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-1">
                            Created
                          </label>
                          <p className="text-white">
                            {new Date(
                              selectedItem.created_at
                            ).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      {selectedItem.image_url && (
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-1">
                            Image
                          </label>
                          <img
                            src={selectedItem.image_url}
                            alt={selectedItem.name}
                            className="w-32 h-32 rounded-lg object-cover"
                          />
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                <div>
                  {renderFormFields()}

                  <div className="flex justify-end space-x-4 mt-6">
                    <button
                      onClick={() => setShowModal(false)}
                      className="px-6 py-2 bg-gray-500/20 text-gray-300 rounded-lg hover:bg-gray-500/30 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={
                        modalType === "create" ? handleCreate : handleUpdate
                      }
                      className="px-6 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors flex items-center space-x-2"
                    >
                      <Save className="h-4 w-4" />
                      <span>
                        {modalType === "create" ? "Create" : "Update"}
                      </span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
