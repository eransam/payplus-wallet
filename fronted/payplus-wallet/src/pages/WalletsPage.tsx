import WalletsList from "../components/WalletsList";

function WalletsPage() {
  return (
    <div>
      <header className="page-header">
        <h1>ארנקים</h1>
        <p>צור ונהל ארנקים דיגיטליים</p>
      </header>
      <WalletsList />
    </div>
  );
}

export default WalletsPage;
