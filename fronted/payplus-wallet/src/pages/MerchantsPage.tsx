import MerchantsList from "../components/MerchantsList";

function MerchantsPage() {
  return (
    <div>
      <header className="page-header">
        <h1>סוחרים</h1>
        <p>ניהול סוחרים פעילים במערכת</p>
      </header>
      <MerchantsList />
    </div>
  );
}

export default MerchantsPage;
