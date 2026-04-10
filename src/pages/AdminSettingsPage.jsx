import { useState, useEffect } from 'react';
import { BadgeJapaneseYen, BanknoteArrowUp, CirclePlus, Save, Ship, WalletCards} from 'lucide-react';

function AdminSettingsPage() {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  const authHeader = { 'Authorization': `Basic ${localStorage.getItem("userAuth")}` };

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    const token = localStorage.getItem("userAuth");
    try {
      const response = await fetch("http://localhost:8080/api/admin/settings", {
        headers: {
          "Authorization": `Basic ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setSettings(data);
      }
    } catch (err) {
      setMessage("Connection error.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSettings({ ...settings, [name]: value === "" ? "" : parseFloat(value) });
  };

  const handleSave = async () => {
    setMessage('Saving...');
    try {
      const response = await fetch("http://localhost:8080/api/admin/settings", {
        method: "PUT",
        headers: { ...authHeader, "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      if (response.ok) setMessage("Settings updated successfully!");
    } catch (err) {
      setMessage("Error connecting to server.");
    }
  };

  if (!settings) {
    return <p>Loading or Access Denied...</p>;
  }

  return (
    <div className="page-body">
      <h1 className="brand-font" style={{ marginBottom: '10px' }}>Global Settings</h1>
      <p style={{ color: '#718096', marginBottom: '30px' }}>Manage exchange rates, profit margins, and shipping fees.</p>
      {message && (
        <div style={{ padding: '15px', background: '#EBF4FF', color: '#2A3B8F', borderRadius: '12px', marginBottom: '20px', fontWeight: '600' }}>
          {message}
        </div>
      )}

      <div className="card">
      <table className="modern-table settings-table" style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
        <thead>
          <tr>
              <th style={{ width: '60%' }}>Parameter Name</th>
              <th>Current Value</th>
            </tr>
        </thead>
        <tbody>
          {/* Section: Base Rates */}
          <tr className="settings-section-header">
              <td colSpan="2">
                <div className="section-label"><BadgeJapaneseYen size={18} /> Base Rates</div>
              </td>
          </tr>
          <tr>
            <td>Yuan Rate (IDR)</td>
            <td>
                <input type="number" name="yuanRate" className="settings-input" value={settings.yuanRate} onChange={handleChange} />
            </td>
          </tr>

          {/* Section: Category Modifiers */}
          <tr className="settings-section-header">
              <td colSpan="2">
                <div className="section-label"><WalletCards size={18} /> Category Modifier</div>
              </td>
          </tr>
          <tr>
            <td>Doll Profit Modifier</td>
            <td><input type="number" name="rateDollProfit" className="settings-input" value={settings.rateDollProfit} onChange={handleChange} /></td>
          </tr>
          <tr>
            <td>Others Profit Modifier</td>
            <td><input type="number" name="rateOthersProfit" className="settings-input" value={settings.rateOthersProfit} onChange={handleChange} /></td>
          </tr>

          {/* Section: Size-Based Profit */}
          <tr className="settings-section-header">
              <td colSpan="2">
                <div className="section-label"><BanknoteArrowUp size={18} /> Item Profit (by size)</div>
              </td>
            </tr>
          <tr>
            <td>10cm Profit</td>
            <td><input type="number" name="doll10CMProfit" className="settings-input" value={settings.doll10CMProfit} onChange={handleChange} /></td>
          </tr>
          <tr>
            <td>20cm Profit</td>
            <td><input type="number" name="doll20CMProfit" className="settings-input" value={settings.doll20CMProfit} onChange={handleChange} /></td>
          </tr>
          <tr>
            <td>40cm Profit</td>
            <td><input type="number" name="doll40CMProfit" className="settings-input" value={settings.doll40CMProfit} onChange={handleChange} /></td>
          </tr>

          {/* Section: Shipping Fees */}
            <tr className="settings-section-header">
              <td colSpan="2">
                <div className="section-label"><Ship size={18} /> Shipping Fees (by size)</div>
              </td>
            </tr>
          <tr>
            <td>Shipping 10cm</td>
            <td><input type="number" name="shippingFee10CM" className="settings-input" value={settings.shippingFee10CM} onChange={handleChange} /></td>
          </tr>
          <tr>
            <td>Shipping 20cm</td>
            <td><input type="number" name="shippingFee20CM" className="settings-input" value={settings.shippingFee20CM} onChange={handleChange} /></td>
          </tr>
          <tr>
            <td>Shipping 40cm</td>
            <td><input type="number" name="shippingFee40CM" className="settings-input" value={settings.shippingFee40CM} onChange={handleChange} /></td>
          </tr>
          <tr>
            <td>Shipping Weight-Based (per gram)</td>
            <td><input type="number" name="shippingFeeWeightBased" className="settings-input" value={settings.shippingFeeWeightBased} onChange={handleChange} /></td>
          </tr>

          {/* Section: Misc */}
            <tr className="settings-section-header">
              <td colSpan="2">
                <div className="section-label"><CirclePlus size={18} /> Miscellaneous (by size)</div>
              </td>
            </tr>
          <tr>
            <td>Packing Fee</td>
            <td><input type="number" name="packingFee" className="settings-input" value={settings.packingFee} onChange={handleChange} /></td>
          </tr>
          <tr>
            <td>Rounding Multiple</td>
            <td><input type="number" name="roundingValue" className="settings-input" value={settings.roundingValue} onChange={handleChange} /></td>
          </tr>
        </tbody>
      </table>
      </div>

      <button onClick={handleSave} className="btn-save-settings">
          <Save size={20} /> Update All Settings
        </button>
    </div>
  );
}

export default AdminSettingsPage;