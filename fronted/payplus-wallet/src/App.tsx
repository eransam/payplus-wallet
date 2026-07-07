import { Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import DashboardPage from "./pages/DashboardPage";
import MerchantsPage from "./pages/MerchantsPage";
import WalletsPage from "./pages/WalletsPage";

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/merchants" element={<MerchantsPage />} />
        <Route path="/wallets" element={<WalletsPage />} />
      </Routes>
    </Layout>
  );
}

export default App;
