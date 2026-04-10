import { useState } from 'react';
import './Calculator.css';

function CalculatorPage({ isAdmin }) {
  const [priceInYuan, setPriceInYuan] = useState('');
  const [itemType, setItemType] = useState('10CM');
  const [result, setResult] = useState(null);
  const [weightInput, setWeightInput] = useState('');

  const handleCalculate = async (e) => {
    e.preventDefault();
    const res = await fetch("http://localhost:8080/api/public/calculator/calculate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        priceInYuan: parseFloat(priceInYuan), 
        itemCategory: "DOLLS", 
        itemType: itemType,
        weightInput: parseFloat(weightInput) || 0
      })
    });
    if (res.ok) {
      const data = await res.json();
      setResult(data);
    }
  };

  return (
    /* Switches mode based on the URL/Prop */
    <div className={isAdmin ? "calc-container-admin" : "calc-container-public"}>
      
      <div className="calc-content-wrapper">
        <div className="calc-header">
          <img src="/toramie-icon.png" alt="Logo" className="calc-logo-img" />
          <h1 className="brand-font">Toramie Calculator</h1>
          <p className="calc-subtitle">ONLINE SHOP ESTIMATOR</p>
        </div>

        <div className="card calc-card-width">
          <form onSubmit={handleCalculate}>
            <div className="calc-input-group">
              <label>PRICE (YUAN) ⓘ</label>
              <input 
                type="number" 
                value={priceInYuan} 
                onChange={(e) => setPriceInYuan(e.target.value)} 
                placeholder="0.00" 
                required
              />
            </div>

            <div className="calc-input-group">
              <label>ITEM TYPE</label>
              <select value={itemType} onChange={(e) => setItemType(e.target.value)}>
                <option value="10CM">10cm Doll</option>
                <option value="20CM">20cm Doll</option>
                <option value="40CM">40cm Doll</option>
                <option value="WEIGHT_BASED">Weight Based</option>
              </select>
            </div>

            {itemType === 'WEIGHT_BASED' && (
              <div className="calc-input-group">
                <label>WEIGHT (GRAMS)</label>
                <input 
                  type="number" 
                  value={weightInput} 
                  onChange={(e) => setWeightInput(e.target.value)} 
                  placeholder="e.g. 100"
                  required
                />
              </div>
            )}

            <button type="submit" className="btn-action btn-blue w-full-btn">
              Calculate Total →
            </button>
          </form>
          
          {result && (
            <div className="total-result-box">
              <span className="total-label">Total IDR</span>
              <span className="total-amount">Rp {result.toLocaleString()}</span>
            </div>
          )}
        </div>
        
        <p className="powered-by">POWERED BY TORAMIE SHOP</p>
      </div>
    </div>
  );
}

export default CalculatorPage;