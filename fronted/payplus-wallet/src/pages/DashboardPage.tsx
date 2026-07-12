import Alert from "react-bootstrap/Alert";
import Badge from "react-bootstrap/Badge";
import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Spinner from "react-bootstrap/Spinner";
import Table from "react-bootstrap/Table";
import { useMemo } from "react";
import { Link } from "react-router-dom";
import DashboardStatCard from "../components/dashboard/DashboardStatCard";
import { useAuth } from "../contexts/AuthContext";
import { useHealth } from "../hooks/useHealth";
import { useMerchants } from "../hooks/useMerchants";
import { useTransactions } from "../hooks/useTransactions";
import { useWallets } from "../hooks/useWallets";
import { statusLabel, transactionTypeLabel } from "../utils/labels";

function formatMoney(amount: number) {
  return amount.toLocaleString("he-IL", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function DashboardPage() {
  const { user } = useAuth();
  const { merchants, loading: merchantsLoading } = useMerchants();
  const { wallets, loading: walletsLoading } = useWallets();
  const { transactions, loading: transactionsLoading } = useTransactions();
  const { health, loading: healthLoading, error: healthError } = useHealth();

  const loading = merchantsLoading || walletsLoading || transactionsLoading;

  const stats = useMemo(() => {
    const totalBalance = wallets.reduce((sum, wallet) => sum + Number(wallet.balance), 0);
    const activeMerchants = merchants.filter((merchant) => merchant.status === "active").length;
    const activeWallets = wallets.filter((wallet) => wallet.status === "active").length;
    const completed = transactions.filter((transaction) => transaction.status === "completed");
    const charges = completed.filter((transaction) => transaction.type === "charge");
    const refunds = completed.filter((transaction) => transaction.type === "refund");
    const chargeVolume = charges.reduce((sum, transaction) => sum + Number(transaction.amount), 0);
    const refundVolume = refunds.reduce((sum, transaction) => sum + Number(transaction.amount), 0);
    const merchantRevenue = merchants.reduce(
      (sum, merchant) => sum + Number(merchant.total_received ?? 0),
      0,
    );

    return {
      merchantsCount: merchants.length,
      activeMerchants,
      walletsCount: wallets.length,
      activeWallets,
      totalBalance,
      transactionsCount: transactions.length,
      completedCount: completed.length,
      chargeVolume,
      netVolume: chargeVolume - refundVolume,
      merchantRevenue,
    };
  }, [merchants, wallets, transactions]);

  const recentTransactions = transactions.slice(0, 6);

  if (loading) {
    return (
      <div className="dashboard-loading">
        <Spinner animation="border" variant="primary" />
        <p>טוען לוח בקרה...</p>
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      <header className="dashboard-hero eb-card">
        <div>
          <p className="dashboard-hero__eyebrow">PayPlus ארנק</p>
          <h1>שלום, {user?.full_name ?? "משתמש"}</h1>
          <p>סקירה מהירה של הסוחרים, הארנקים והעסקאות שלך.</p>
        </div>
        <div className="dashboard-hero__actions">
          <Link to="/transactions" className="btn btn-eb-primary">
            בצע עסקה
          </Link>
          <Link to="/wallets" className="btn btn-eb-outline">
            צור ארנק
          </Link>
        </div>
      </header>

      <Row className="g-3 dashboard-stats">
        <Col sm={6} xl={3}>
          <DashboardStatCard
            label="סוחרים"
            value={String(stats.merchantsCount)}
            hint={`${stats.activeMerchants} פעילים`}
            icon="🏪"
            to="/merchants"
            accent="purple"
          />
        </Col>
        <Col sm={6} xl={3}>
          <DashboardStatCard
            label="ארנקים"
            value={String(stats.walletsCount)}
            hint={`${stats.activeWallets} פעילים`}
            icon="💳"
            to="/wallets"
            accent="blue"
          />
        </Col>
        <Col sm={6} xl={3}>
          <DashboardStatCard
            label="יתרה כוללת"
            value={`${formatMoney(stats.totalBalance)} ILS`}
            hint="סכום בכל הארנקים"
            icon="💰"
            to="/wallets"
            accent="green"
          />
        </Col>
        <Col sm={6} xl={3}>
          <DashboardStatCard
            label="עסקאות"
            value={String(stats.transactionsCount)}
            hint={`${stats.completedCount} הושלמו`}
            icon="↔"
            to="/transactions"
            accent="orange"
          />
        </Col>
      </Row>

      <Row className="g-3">
        <Col lg={8}>
          <Card className="eb-card dashboard-panel h-100">
            <Card.Header className="dashboard-panel__header">
              <div>
                <Card.Title className="mb-0">עסקאות אחרונות</Card.Title>
                <Card.Subtitle className="text-muted">
                  {recentTransactions.length === 0
                    ? "עדיין אין עסקאות"
                    : `${recentTransactions.length} האחרונות`}
                </Card.Subtitle>
              </div>
              <Link to="/transactions" className="dashboard-panel__link">
                לכל העסקאות →
              </Link>
            </Card.Header>
            <Card.Body>
              {recentTransactions.length === 0 ? (
                <Alert variant="info" className="mb-0">
                  עדיין לא בוצעו עסקאות. התחל מדף העסקאות.
                </Alert>
              ) : (
                <Table responsive hover className="dashboard-table mb-0">
                  <thead>
                    <tr>
                      <th>מזהה</th>
                      <th>סוג</th>
                      <th>סכום</th>
                      <th>ארנק</th>
                      <th>סוחר</th>
                      <th>סטטוס</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentTransactions.map((transaction) => (
                      <tr key={transaction.id}>
                        <td>#{transaction.id}</td>
                        <td>{transactionTypeLabel(transaction.type)}</td>
                        <td>
                          {transaction.amount} {transaction.currency}
                        </td>
                        <td>#{transaction.wallet_id}</td>
                        <td>#{transaction.merchant_id}</td>
                        <td>
                          <Badge
                            bg={
                              transaction.status === "completed"
                                ? "success"
                                : transaction.status === "declined"
                                  ? "warning"
                                  : "danger"
                            }
                          >
                            {statusLabel(transaction.status)}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              )}
            </Card.Body>
          </Card>
        </Col>

        <Col lg={4}>
          <Card className="eb-card dashboard-panel h-100">
            <Card.Header>
              <Card.Title className="mb-0">סיכום פעילות</Card.Title>
            </Card.Header>
            <Card.Body className="dashboard-summary">
              <div className="dashboard-summary__row">
                <span>נפח חיובים שהושלמו</span>
                <strong>{formatMoney(stats.chargeVolume)} ILS</strong>
              </div>
              <div className="dashboard-summary__row">
                <span>התקבל אצל סוחרים</span>
                <strong>{formatMoney(stats.merchantRevenue)} ILS</strong>
              </div>
              <div className="dashboard-summary__row">
                <span>נטו (חיובים פחות החזרים)</span>
                <strong>{formatMoney(stats.netVolume)} ILS</strong>
              </div>
              <hr />
              <div className="dashboard-summary__row">
                <span>סטטוס API</span>
                {healthLoading ? (
                  <Spinner animation="border" size="sm" />
                ) : healthError ? (
                  <Badge bg="danger">לא זמין</Badge>
                ) : (
                  <Badge bg="success">פעיל</Badge>
                )}
              </div>
              <div className="dashboard-summary__row">
                <span>מסד נתונים</span>
                <strong>{health?.database ?? "—"}</strong>
              </div>
              <div className="dashboard-summary__row">
                <span>Redis</span>
                <strong>{health?.redis ?? "—"}</strong>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default DashboardPage;
