import { useState, useEffect } from 'react';
import OrderEntryPage from './OrderEntryPage';
import { X } from 'lucide-react';

function Orders() {
  const [searchQuery, setSearchQuery] = useState("");
  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState('JOINED');
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const authHeader = { 'Authorization': `Basic ${localStorage.getItem("userAuth")}` };

  useEffect(() => {
    fetchOrders();
  }, [searchQuery]);

  const fetchOrders = async () => {
    const url = searchQuery 
      ? `http://localhost:8080/api/admin/orders/search?query=${searchQuery}`
      : "http://localhost:8080/api/admin/orders";
    
    const res = await fetch(url, { headers: authHeader });
    if (res.ok) setOrders(await res.json());
  };

  const handleEdit = (id) => {
    setEditingId(id);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingId(null);
    fetchOrders(); // Refresh list after edit/save
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this order?")) {
      await fetch(`http://localhost:8080/api/admin/orders/${id}`, { method: 'DELETE', headers: authHeader });
      fetchOrders();
    }
  };

  const getPaymentStatusClass = (statuses) => {
    if (statuses === 'PAID') return 'status-paid';
    if (statuses === 'FULL') return 'status-full';
    return 'status-dp';
  }

  return (
    <div className="orders-container">
      <div className="page-header">
        <h1>Orders</h1>

        <div className="header-actions">
          <input 
            type="text" 
            placeholder="Search..." 
            className="search-input" 
            onChange={(e) => setQuery(e.target.value)} 
            style={{ width: '300px' }}
          />
          <button className="btn-action btn-blue" onClick={() => setShowModal(true)}>
            + New Order
          </button>
        </div>

      </div>

      <div className="tab-group modern-table">
        {['JOINED', 'CUSTOMER', 'DETAILS', 'FINANCE'].map(tab => (
          <button key={tab} className={`tab-btn ${activeTab === tab ? 'active' : ''}`} onClick={() => setActiveTab(tab)}>
            {tab}
          </button>
        ))}
      </div>

      <div className="card table-card">
        <div className="table-responsive">
          {activeTab === 'JOINED' && (
            <table className="modern-table">
              <thead>
                <tr><th>ID</th><th>CUSTOMER</th><th>ITEM</th><th>TOTAL</th><th>PAYMENT</th><th>SHIPPING</th><th>ACTIONS</th></tr>
              </thead>
              <tbody>
                {orders.map(o => (
                  <tr key={o.orderId}>
                    <td>{o.orderId}</td>
                    <td>{o.customerDetails.customerName}</td>
                    <td>{o.orderDetails.itemName}</td>
                    <td>Rp {o.orderFinancials.finalPrice.toLocaleString()}</td>
                    <td>
                        <span className={`status-pill ${getPaymentStatusClass(o.orderFinancials.paymentStatus)}`}>
                            {o.orderFinancials.paymentStatus}
                        </span>
                    </td>
                    <td>
                      <span className={`status-pill ${o.orderFinancials.shippingStatus === 'ARRIVED' ? 'status-arrived' : 'status-shipping'}`}>
                        {o.orderFinancials.shippingStatus}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button className="btn-action btn-edit" onClick={() => handleEdit(o.orderId)}>Edit</button>
                        <button className="btn-action btn-delete" onClick={() => handleDelete(o.orderId)}>Del</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

            {activeTab === 'CUSTOMER' && (
             <table className="modern-table">
               <thead><tr><th>ID</th><th>NAME</th><th>ADDRESS</th><th>PHONE</th></tr></thead>
               <tbody>
                 {orders.map(o => (
                   <tr key={o.orderId}>
                     <td>{o.orderId}</td>
                     <td>{o.customerDetails.customerName}</td>
                     <td>{o.customerDetails.customerAddress}</td>
                     <td>{o.customerDetails.phoneNumber}</td>
                   </tr>
                 ))}
               </tbody>
             </table>
            )}
          
            {activeTab === 'DETAILS' && (
                <table className="modern-table">
                        <thead>
                            <tr>
                                <th>ID</th><th>Item Type</th><th>Item Name</th><th>Quantity</th><th>Price in Yuan</th><th>Order Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map(order => (
                                <tr key={order.orderId}>
                                    <td>{order.orderId}</td>
                                    <td>{order.orderDetails.itemType}</td>
                                    <td>{order.orderDetails.itemName}</td>
                                    <td>{order.orderDetails.quantity}</td>
                                    <td>{order.orderDetails.priceInYuan}</td>
                                    <td>{order.orderDetails.orderStatus}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}

                {activeTab === 'FINANCE' && (
                    <div className="table-scroll-wrapper">
                    <table className="modern-table finance-table">
                        <thead>
                            <tr>
                                <th style={{ left: 0 }}>ID</th><th>RMB</th><th>Rate</th><th>DomPostage</th><th>IDR</th><th>Shipping</th><th>Quantity</th>
                                <th>Extras</th><th>Modal</th><th>Item Profit</th><th>Price</th><th>Final Price</th><th>DP</th>
                                <th>Repayment</th><th>DP Profit</th><th>Profit</th><th>Total Profit</th><th>Total w/ Shipping</th>
                                <th>Information</th><th>Status</th><th>Shipping Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map(order => (
                                <tr key={order.orderId}>
                                    <td>{order.orderId}</td>
                                    <td>{order.orderFinancials.priceInYuan}</td>
                                    <td>{order.orderFinancials.yuanRate}</td>
                                    <td>{order.orderFinancials.domPostage}</td>
                                    <td>{order.orderFinancials.idrAmount}</td>
                                    <td>{order.orderFinancials.shippingFee}</td>
                                    <td>{order.orderFinancials.quantity}</td>
                                    <td>{order.orderFinancials.extras}</td>
                                    <td>{order.orderFinancials.modal}</td>
                                    <td>{order.orderFinancials.itemTypeProfit}</td>
                                    <td>{order.orderFinancials.price}</td>
                                    <td>{order.orderFinancials.finalPrice}</td>
                                    <td>{order.orderFinancials.downPayment}</td>
                                    <td>{order.orderFinancials.repayment}</td>
                                    <td>{order.orderFinancials.dpProfit}</td>
                                    <td>{order.orderFinancials.profit}</td>
                                    <td>{order.orderFinancials.totalProfit}</td>
                                    <td>{order.orderFinancials.tProfitWithShipping}</td>
                                    <td>{order.orderFinancials.information}</td>
                                    <td>{order.orderFinancials.paymentStatus}</td>
                                    <td>{order.orderFinancials.shippingStatus}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    </div>
                )}
        </div>
      </div>

      {/* THE MODAL POPUP */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="close-modal-btn" onClick={handleCloseModal}>
              <X size={20} />
            </button>
            <OrderEntryPage editingId={editingId} onComplete={handleCloseModal} />
          </div>
        </div>
      )}
    </div>
  );
}

export default Orders;