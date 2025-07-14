import { Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Layout from "@/components/organisms/Layout";
import Dashboard from "@/components/pages/Dashboard";
import Officers from "@/components/pages/Officers";
import Templates from "@/components/pages/Templates";
import SendNotice from "@/components/pages/SendNotice";
import Reports from "@/components/pages/Reports";

function App() {
  return (
    <div className="min-h-screen bg-white">
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/officers" element={<Officers />} />
          <Route path="/templates" element={<Templates />} />
          <Route path="/send-notice" element={<SendNotice />} />
          <Route path="/reports" element={<Reports />} />
        </Routes>
      </Layout>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </div>
  );
}

export default App;