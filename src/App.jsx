import  { Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./redux/store";
import Layout from "./components/layout/Layout";
import "./App.css";

// Lazy imports
const LoginPage = lazy(() => import("./pages/LoginPage"));
const DashboardPage = lazy(() => import("./pages/DashboardPage"));
const UsersPage = lazy(() => import("./pages/UsersPage"));
const NotFoundPage = lazy(() => import("./pages/NotFoundPage"));
const CategoryManagement = lazy(() => import("./pages/category/CategoryManagement"));
const SubCategoryManagement = lazy(() => import("./pages/subcategory/SubCategory"));
const ProductManagement = lazy(() => import("./pages/product/ProductPage"));

const OrderHistory = lazy(() => import("./pages/orderhistroy/OrderHistory"));
const Notification = lazy(() => import("./pages/notification/Notification"));
const Offer = lazy(() => import("./pages/offer/Offer"));
import Banner from './pages/banner/Banner';
import LocationManagement from "./pages/location/LocationManagement";

function App() {
  return (
    <Provider store={store}>
      <Router>
        <Suspense fallback={<div className="loading">Loading...</div>}>
          <Routes>
            {/* Public Route */}
            <Route path="/login" element={<LoginPage />} />
            <Route element={<Layout />}>
              <Route path="/" element={<DashboardPage />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/users" element={<UsersPage />} />
              <Route path="/category" element={<CategoryManagement />} />
              <Route path="/subcategories" element={<SubCategoryManagement />} />
              <Route path="/products" element={<ProductManagement />} />        
               <Route path="/banner" element={<Banner />} />
              <Route path="/orderhistory" element={<OrderHistory />} />
                 <Route path="/locations" element={<LocationManagement />} />
              <Route path="/offers" element={<Offer />} />
              <Route path="/notifications" element={<Notification />} />
            </Route>

            {/* 404 Fallback */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Suspense>
      </Router>
    </Provider>
  );
}

export default App;
