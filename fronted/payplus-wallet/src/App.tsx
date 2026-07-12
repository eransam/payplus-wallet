import { Route, Routes } from "react-router-dom";
import ErrorBoundary from "./components/ErrorBoundary";
import Layout from "./components/Layout";
import DashboardPage from "./pages/DashboardPage";
import MerchantsPage from "./pages/MerchantsPage";
import TransactionsPage from "./pages/TransactionsPage";
import WalletDetailsPage from "./pages/WalletDetailsPage";
import WalletsPage from "./pages/WalletsPage";
import ApiLearnPage from "./pages/learn/ApiLearnPage";
import BasicsLearnPage from "./pages/learn/BasicsLearnPage";
import ContextLearnPage from "./pages/learn/ContextLearnPage";
import CustomHooksLearnPage from "./pages/learn/CustomHooksLearnPage";
import DropdownLearnPage from "./pages/learn/DropdownLearnPage";
import ErrorBoundaryLearnPage from "./pages/learn/ErrorBoundaryLearnPage";
import FormsLearnPage from "./pages/learn/FormsLearnPage";
import LearnHubPage from "./pages/learn/LearnHubPage";
import ReactHookFormLearnPage from "./pages/learn/ReactHookFormLearnPage";
import ReactQueryLearnPage from "./pages/learn/ReactQueryLearnPage";
import RouterLearnPage from "./pages/learn/RouterLearnPage";
import TestingLearnPage from "./pages/learn/TestingLearnPage.tsx";
import UseParamsLearnPage from "./pages/learn/UseParamsLearnPage";
import ValidationLearnPage from "./pages/learn/ValidationLearnPage";

function App() {
  return (
    <Layout>
      <ErrorBoundary>
        <Routes>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/merchants" element={<MerchantsPage />} />
        <Route path="/wallets" element={<WalletsPage />} />
        <Route path="/wallets/:id" element={<WalletDetailsPage />} />
        <Route path="/transactions" element={<TransactionsPage />} />
        <Route path="/learn" element={<LearnHubPage />} />
        <Route path="/learn/basics" element={<BasicsLearnPage />} />
        <Route path="/learn/api" element={<ApiLearnPage />} />
        <Route path="/learn/forms" element={<FormsLearnPage />} />
        <Route path="/learn/router" element={<RouterLearnPage />} />
        <Route path="/learn/use-params" element={<UseParamsLearnPage />} />
        <Route path="/learn/dropdown" element={<DropdownLearnPage />} />
        <Route path="/learn/custom-hooks" element={<CustomHooksLearnPage />} />
        <Route path="/learn/context" element={<ContextLearnPage />} />
        <Route path="/learn/validation" element={<ValidationLearnPage />} />
        <Route path="/learn/react-query" element={<ReactQueryLearnPage />} />
        <Route path="/learn/testing" element={<TestingLearnPage />} />
        <Route path="/learn/react-hook-form" element={<ReactHookFormLearnPage />} />
        <Route path="/learn/error-boundary" element={<ErrorBoundaryLearnPage />} />
        </Routes>
      </ErrorBoundary>
    </Layout>
  );
}

export default App;
