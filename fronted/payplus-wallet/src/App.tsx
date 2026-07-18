import { lazy, Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Spinner from "react-bootstrap/Spinner";
import AppLayout from "./components/layout/AppLayout";
import PublicLayout from "./components/layout/PublicLayout";
import ErrorBoundary from "./components/ErrorBoundary";
import ProtectedRoute from "./components/ProtectedRoute";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";

/** דפים כבדים / לא קריטיים לטעינה ראשונה — נטענים רק כשנכנסים ל-route */
const DashboardPage = lazy(() => import("./pages/DashboardPage"));
const MerchantsPage = lazy(() => import("./pages/MerchantsPage"));
const WalletsPage = lazy(() => import("./pages/WalletsPage"));
const WalletDetailsPage = lazy(() => import("./pages/WalletDetailsPage"));
const TransactionsPage = lazy(() => import("./pages/TransactionsPage"));
const LearnHubPage = lazy(() => import("./pages/learn/LearnHubPage"));
const BasicsLearnPage = lazy(() => import("./pages/learn/BasicsLearnPage"));
const ApiLearnPage = lazy(() => import("./pages/learn/ApiLearnPage"));
const FormsLearnPage = lazy(() => import("./pages/learn/FormsLearnPage"));
const RouterLearnPage = lazy(() => import("./pages/learn/RouterLearnPage"));
const UseParamsLearnPage = lazy(() => import("./pages/learn/UseParamsLearnPage"));
const DropdownLearnPage = lazy(() => import("./pages/learn/DropdownLearnPage"));
const CustomHooksLearnPage = lazy(() => import("./pages/learn/CustomHooksLearnPage"));
const ContextLearnPage = lazy(() => import("./pages/learn/ContextLearnPage"));
const ValidationLearnPage = lazy(() => import("./pages/learn/ValidationLearnPage"));
const ReactQueryLearnPage = lazy(() => import("./pages/learn/ReactQueryLearnPage"));
const TestingLearnPage = lazy(() => import("./pages/learn/TestingLearnPage"));
const ReactHookFormLearnPage = lazy(() => import("./pages/learn/ReactHookFormLearnPage"));
const ErrorBoundaryLearnPage = lazy(() => import("./pages/learn/ErrorBoundaryLearnPage"));
const CodeSplittingLearnPage = lazy(() => import("./pages/learn/CodeSplittingLearnPage"));
const UseRefLearnPage = lazy(() => import("./pages/learn/UseRefLearnPage"));
const ReduxLearnPage = lazy(() => import("./pages/learn/ReduxLearnPage"));
const OptimisticUpdatesLearnPage = lazy(
  () => import("./pages/learn/OptimisticUpdatesLearnPage"),
);
const DeploymentLearnPage = lazy(() => import("./pages/learn/DeploymentLearnPage"));
const PgAdminLearnPage = lazy(() => import("./pages/learn/PgAdminLearnPage"));
const ReactInternalsLearnPage = lazy(
  () => import("./pages/learn/ReactInternalsLearnPage"),
);
const MemoryLeakLearnPage = lazy(() => import("./pages/learn/MemoryLeakLearnPage"));
const UseReducerLearnPage = lazy(() => import("./pages/learn/UseReducerLearnPage"));
const MemoLearnPage = lazy(() => import("./pages/learn/MemoLearnPage"));
const UseMemoLearnPage = lazy(() => import("./pages/learn/UseMemoLearnPage"));
const UseCallbackLearnPage = lazy(() => import("./pages/learn/UseCallbackLearnPage"));
const StatePatternsLearnPage = lazy(
  () => import("./pages/learn/StatePatternsLearnPage"),
);
const ForwardRefLearnPage = lazy(() => import("./pages/learn/ForwardRefLearnPage"));
const UseLayoutEffectLearnPage = lazy(
  () => import("./pages/learn/UseLayoutEffectLearnPage"),
);
const ConcurrentLearnPage = lazy(() => import("./pages/learn/ConcurrentLearnPage"));
const AccessibilityLearnPage = lazy(
  () => import("./pages/learn/AccessibilityLearnPage"),
);
const TypescriptReactLearnPage = lazy(
  () => import("./pages/learn/TypescriptReactLearnPage"),
);

/** Node.js learn track */
const NodeWhatIsLearnPage = lazy(
  () => import("./pages/learn/node/NodeWhatIsLearnPage"),
);
const NodeEventLoopLearnPage = lazy(
  () => import("./pages/learn/node/NodeEventLoopLearnPage"),
);
const NodeModulesLearnPage = lazy(
  () => import("./pages/learn/node/NodeModulesLearnPage"),
);
const NodeAsyncLearnPage = lazy(
  () => import("./pages/learn/node/NodeAsyncLearnPage"),
);
const NodeHttpLearnPage = lazy(
  () => import("./pages/learn/node/NodeHttpLearnPage"),
);
const NodeExpressLearnPage = lazy(
  () => import("./pages/learn/node/NodeExpressLearnPage"),
);
const NodeMiddlewareLearnPage = lazy(
  () => import("./pages/learn/node/NodeMiddlewareLearnPage"),
);
const NodeArchitectureLearnPage = lazy(
  () => import("./pages/learn/node/NodeArchitectureLearnPage"),
);
const NodeErrorsLearnPage = lazy(
  () => import("./pages/learn/node/NodeErrorsLearnPage"),
);
const NodeEnvLearnPage = lazy(() => import("./pages/learn/node/NodeEnvLearnPage"));
const NodePostgresLearnPage = lazy(
  () => import("./pages/learn/node/NodePostgresLearnPage"),
);
const NodeTransactionsLearnPage = lazy(
  () => import("./pages/learn/node/NodeTransactionsLearnPage"),
);
const NodeRedisLearnPage = lazy(
  () => import("./pages/learn/node/NodeRedisLearnPage"),
);
const NodeIdempotencyLearnPage = lazy(
  () => import("./pages/learn/node/NodeIdempotencyLearnPage"),
);
const NodeAuthLearnPage = lazy(
  () => import("./pages/learn/node/NodeAuthLearnPage"),
);
const NodeSecurityLearnPage = lazy(
  () => import("./pages/learn/node/NodeSecurityLearnPage"),
);
const NodeLoggingLearnPage = lazy(
  () => import("./pages/learn/node/NodeLoggingLearnPage"),
);
const NodeProcessLearnPage = lazy(
  () => import("./pages/learn/node/NodeProcessLearnPage"),
);
const NodeStreamsLearnPage = lazy(
  () => import("./pages/learn/node/NodeStreamsLearnPage"),
);
const NodeTypescriptLearnPage = lazy(
  () => import("./pages/learn/node/NodeTypescriptLearnPage"),
);
const NodeTestingLearnPage = lazy(
  () => import("./pages/learn/node/NodeTestingLearnPage"),
);
const NodeValidationLearnPage = lazy(
  () => import("./pages/learn/node/NodeValidationLearnPage"),
);
const NodeDockerLearnPage = lazy(
  () => import("./pages/learn/node/NodeDockerLearnPage"),
);
const NodeScalingLearnPage = lazy(
  () => import("./pages/learn/node/NodeScalingLearnPage"),
);
const NodeInterviewQaLearnPage = lazy(
  () => import("./pages/learn/node/NodeInterviewQaLearnPage"),
);

function RouteFallback() {
  return (
    <div className="d-flex justify-content-center py-5">
      <Spinner animation="border" role="status" />
    </div>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <Suspense fallback={<RouteFallback />}>
        <Routes>
          <Route element={<PublicLayout />}>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
          </Route>

          <Route
            element={
              <ProtectedRoute>
                <AppLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/dashboard" element={<DashboardPage />} />
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
            <Route path="/learn/code-splitting" element={<CodeSplittingLearnPage />} />
            <Route path="/learn/use-ref" element={<UseRefLearnPage />} />
            <Route path="/learn/redux" element={<ReduxLearnPage />} />
            <Route
              path="/learn/optimistic-updates"
              element={<OptimisticUpdatesLearnPage />}
            />
            <Route path="/learn/deployment" element={<DeploymentLearnPage />} />
            <Route path="/learn/pgadmin" element={<PgAdminLearnPage />} />
            <Route
              path="/learn/react-internals"
              element={<ReactInternalsLearnPage />}
            />
            <Route path="/learn/memory-leaks" element={<MemoryLeakLearnPage />} />
            <Route path="/learn/use-reducer" element={<UseReducerLearnPage />} />
            <Route path="/learn/memo" element={<MemoLearnPage />} />
            <Route path="/learn/use-memo" element={<UseMemoLearnPage />} />
            <Route path="/learn/use-callback" element={<UseCallbackLearnPage />} />
            <Route
              path="/learn/performance"
              element={<Navigate to="/learn/memo" replace />}
            />
            <Route
              path="/learn/state-patterns"
              element={<StatePatternsLearnPage />}
            />
            <Route path="/learn/forward-ref" element={<ForwardRefLearnPage />} />
            <Route
              path="/learn/use-layout-effect"
              element={<UseLayoutEffectLearnPage />}
            />
            <Route path="/learn/concurrent" element={<ConcurrentLearnPage />} />
            <Route
              path="/learn/accessibility"
              element={<AccessibilityLearnPage />}
            />
            <Route
              path="/learn/typescript-react"
              element={<TypescriptReactLearnPage />}
            />

            {/* Node.js track */}
            <Route path="/learn/node-what-is" element={<NodeWhatIsLearnPage />} />
            <Route
              path="/learn/node-event-loop"
              element={<NodeEventLoopLearnPage />}
            />
            <Route path="/learn/node-modules" element={<NodeModulesLearnPage />} />
            <Route path="/learn/node-async" element={<NodeAsyncLearnPage />} />
            <Route path="/learn/node-http" element={<NodeHttpLearnPage />} />
            <Route path="/learn/node-express" element={<NodeExpressLearnPage />} />
            <Route
              path="/learn/node-middleware"
              element={<NodeMiddlewareLearnPage />}
            />
            <Route
              path="/learn/node-architecture"
              element={<NodeArchitectureLearnPage />}
            />
            <Route path="/learn/node-errors" element={<NodeErrorsLearnPage />} />
            <Route path="/learn/node-env" element={<NodeEnvLearnPage />} />
            <Route
              path="/learn/node-postgres"
              element={<NodePostgresLearnPage />}
            />
            <Route
              path="/learn/node-transactions"
              element={<NodeTransactionsLearnPage />}
            />
            <Route path="/learn/node-redis" element={<NodeRedisLearnPage />} />
            <Route
              path="/learn/node-idempotency"
              element={<NodeIdempotencyLearnPage />}
            />
            <Route path="/learn/node-auth" element={<NodeAuthLearnPage />} />
            <Route
              path="/learn/node-security"
              element={<NodeSecurityLearnPage />}
            />
            <Route path="/learn/node-logging" element={<NodeLoggingLearnPage />} />
            <Route path="/learn/node-process" element={<NodeProcessLearnPage />} />
            <Route path="/learn/node-streams" element={<NodeStreamsLearnPage />} />
            <Route
              path="/learn/node-typescript"
              element={<NodeTypescriptLearnPage />}
            />
            <Route path="/learn/node-testing" element={<NodeTestingLearnPage />} />
            <Route
              path="/learn/node-validation"
              element={<NodeValidationLearnPage />}
            />
            <Route path="/learn/node-docker" element={<NodeDockerLearnPage />} />
            <Route path="/learn/node-scaling" element={<NodeScalingLearnPage />} />
            <Route
              path="/learn/node-interview-qa"
              element={<NodeInterviewQaLearnPage />}
            />
          </Route>
        </Routes>
      </Suspense>
    </ErrorBoundary>
  );
}

export default App;
