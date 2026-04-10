import { useState, useEffect } from 'react';

const initialFormState = {
  customerName: '', customerAddress: '', phoneNumber: '',
  itemType: '10CM', itemName: '', quantity: 1,
  priceInYuan: '', paymentStatus: 'DP', shippingStatus: 'SHIPPING',
  platform: 'WD', domesticPostage: 0, extras: 0,
  downPayment: 0, repayment: 0, information: ''
};

function OrderEntryPage({ editingId, onComplete }) {
  const [formData, setFormData] = useState(initialFormState);
  const [message, setMessage] = useState('');
  const isEditMode = !!editingId;

  const authHeader = { 'Authorization': `Basic ${localStorage.getItem("userAuth")}` };

  // Load data if we are editing
  useEffect(() => {
    if (isEditMode) {
      const fetchOrder = async () => {
        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/admin/orders/${editingId}`, { headers: authHeader });
        if (res.ok) {
          const data = await res.json();
          setFormData({
            customerName: data.customerDetails?.customerName || '',
            customerAddress: data.customerDetails?.customerAddress || '',
            phoneNumber: data.customerDetails?.phoneNumber || '',
            itemName: data.orderDetails?.itemName || '',
            itemType: data.orderDetails?.itemType || '10CM',
            weightInput: data.orderFinancials?.weightInput || '', 
            quantity: data.orderDetails?.quantity || 1,
            priceInYuan: data.orderFinancials?.priceInYuan || 0,
            domesticPostage: data.orderFinancials?.domesticPostage || 0,
            extras: data.orderFinancials?.extras || 0,
            downPayment: data.orderFinancials?.downPayment || 0,
            repayment: data.orderFinancials?.repayment || 0,
            paymentStatus: data.orderFinancials?.paymentStatus || 'DP',
            shippingStatus: data.orderFinancials?.shippingStatus || 'SHIPPING',
            information: data.orderFinancials?.information || '',
            platform: data.orderId ? data.orderId.substring(0, 2) : 'WD'
          });
        }
      };
      fetchOrder();
    }
  }, [editingId]);

  const handleChange = (e) => {
    const { name, value, type } = e.target;

    const finalValue = type === 'number' 
    ? (value === '' ? '' : parseFloat(value)) 
    : value;
    setFormData({ ...formData, [name]: finalValue });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = isEditMode ? 
    `${import.meta.env.VITE_API_BASE_URL}/api/admin/orders/${editingId}` : `${import.meta.env.VITE_API_BASE_URL}/api/admin/orders`;
    
    const method = isEditMode ? "PUT" : "POST";

    const response = await fetch(url, {
      method: method,
      headers: { ...authHeader, "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    if (response.ok) {
      onComplete();
    } else {
      setMessage("Error saving order.");
    }
  };

  return (
    <div className="order-form-container">
      <h3>{isEditMode ? `Edit Order ${editingId}` : 'Create New Order'}</h3>
      {message && <p className="error-msg">{message}</p>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
          <div>
            <label>Platform</label>
            <select name="platform" value={formData.platform} onChange={handleChange} disabled={isEditMode}>
              <option value="WD">Weidiyan</option>
              <option value="XHS">XiaoHongShu</option>
              <option value="XY">XianYu</option>
            </select>
          </div>
          <div>
            <label>Customer Name</label>
            <input name="customerName" value={formData.customerName} onChange={handleChange} required />
          </div>
          <div style={{ gridColumn: 'span 2' }}>
            <label>Address</label>
            <input name="customerAddress" value={formData.customerAddress} onChange={handleChange} required />
          </div>
          <div>
            <label>Item Name</label>
            <input name="itemName" value={formData.itemName} onChange={handleChange} required />
          </div>
          <div>
            <label>Item Type</label>
            <select name="itemType" value={formData.itemType} onChange={handleChange}>
              <option value="10CM">10cm Doll</option>
              <option value="20CM">20cm Doll</option>
              <option value="40CM">40cm Doll</option>
              <option value="WEIGHT_BASED">Weight Based</option>
            </select>
          </div>
          {formData.itemType === 'WEIGHT_BASED' && (
            <div className="input-block">
              <label className="soft-label">Weight (Grams)</label>
                <input 
                  type="number" 
                  name="weightInput" 
                  value={formData.weightInput || ''} 
                  onChange={handleChange} 
                  required 
                  placeholder="e.g. 500"
                />
            </div>
          )}
          <div>
            <label>RMB Price</label>
            <input type="number" name="priceInYuan" value={formData.priceInYuan} onChange={handleChange} required/>
          </div>
          <div>
            <label>Quantity</label>
            <input type="number" name="quantity" value={formData.quantity} onChange={handleChange} />
          </div>
          <div>
            <label>DP Paid (IDR)</label>
            <input type="number" name="downPayment" value={formData.downPayment} onChange={handleChange} />
          </div>
          <div>
            <label>Repayment (IDR)</label>
            <input type="number" name="repayment" value={formData.repayment} onChange={handleChange} />
          </div>
          <div>
            <label>Status</label>
            <select name="paymentStatus" value={formData.paymentStatus} onChange={handleChange}>
              <option value="DP">Down Payment</option>
              <option value="FULL">Full Payment</option>
              <option value="PAID">Paid</option>
            </select>
          </div>
          <div>
            <label>Shipping</label>
            <select name="shippingStatus" value={formData.shippingStatus} onChange={handleChange}>
              <option value="SHIPPING">Shipping</option>
              <option value="ARRIVED">Arrived</option>
            </select>
          </div>
        </div>
        <button type="submit" className="btn-save-form">
          {editingId ? "Update & Recalculate" : "Save Order"}
        </button>
      </form>
    </div>
  );
}

export default OrderEntryPage;