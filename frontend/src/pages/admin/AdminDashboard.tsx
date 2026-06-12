import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useGetDashboardStatsQuery } from '../../store/api/adminApi';
import { formatPrice } from '../../utils/formatPrice';

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { data: statsRes, isLoading: statsLoading, isFetching: statsFetching } = useGetDashboardStatsQuery();

  const stats = statsRes?.data;
  const isLoading = statsLoading || statsFetching;

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-gray-400 font-dm space-y-4">
        <div className="animate-spin rounded-full h-10 w-10 border-2 border-electric border-t-transparent"></div>
        <p className="text-[11px] uppercase tracking-widest font-black">Syncing command center...</p>
      </div>
    );
  }

  // Fallbacks if stats are empty
  const totalOrders = stats?.totalOrders || 0;
  const totalRevenue = stats?.totalRevenue || 0;
  const totalCollected = stats?.totalCollected || 0;
  const unpaidOrders = stats?.unpaidOrders || 0;
  const recentOrders = stats?.recentOrders || [];

  return (
    <div className="animate-fadeIn font-dm relative space-y-6">
      
      {/* HEADER & PORTAL INFO */}
      <div className="flex items-center justify-between border-b border-navy-light pb-5">
        <div className="flex items-center gap-3">
          <h1 className="font-heading text-white text-3xl font-bold">DiveneCraft</h1>
        </div>
        <p className="text-gray-400 tracking-[0.2em] text-[10px] uppercase font-bold hidden sm:block">
          Admin Portal • Retail Dashboard
        </p>
      </div>

      {/* KPI CARDS GRID */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
        {/* 1. Total Orders */}
        <div className="bg-navy-mid border border-navy-light p-5 rounded-xl shadow-xs border-l-4 border-l-electric">
          <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">
            Total Orders
          </p>
          <h3 className="text-2xl font-bold text-white font-heading">{totalOrders}</h3>
          <p className="text-[10px] text-gray-500 mt-1.5 uppercase font-bold tracking-wider">
            Retail Transactions
          </p>
        </div>

        {/* 2. Total Revenue */}
        <div className="bg-navy-mid border border-navy-light p-5 rounded-xl shadow-xs border-l-4 border-l-electric">
          <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">
            Total Revenue
          </p>
          <h3 className="text-2xl font-bold text-white font-heading">{formatPrice(totalRevenue)}</h3>
          <p className="text-[10px] text-gray-500 mt-1.5 uppercase font-bold tracking-wider">
            Gross Sales
          </p>
        </div>

        {/* 3. Total Collected */}
        <div className="bg-navy-mid border border-navy-light p-5 rounded-xl shadow-xs border-l-4 border-l-emerald-500">
          <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">
            Total Collected
          </p>
          <h3 className="text-2xl font-bold text-emerald-400 font-heading">
            {formatPrice(totalCollected)}
          </h3>
          <p className="text-[10px] text-gray-500 mt-1.5 uppercase font-bold tracking-wider">
            Received Payments
          </p>
        </div>

        {/* 4. Unpaid Orders */}
        <div className="bg-navy-mid border border-navy-light p-5 rounded-xl shadow-xs border-l-4 border-l-amber-500">
          <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">
            Unpaid Orders
          </p>
          <h3 className="text-2xl font-bold text-white font-heading">{unpaidOrders}</h3>
          <p className="text-[10px] text-gray-500 mt-1.5 uppercase font-bold tracking-wider">
            Pending / COD
          </p>
        </div>
      </div>

      {/* RECENT ORDERS PANEL (Full Width for retail dashboard) */}
      <div className="bg-navy-mid border border-navy-light rounded-xl overflow-hidden shadow-sm">
        <div className="px-5 py-4 border-b border-navy-light flex justify-between items-center bg-navy-mid shrink-0">
          <h3 className="font-heading text-white text-base font-bold">Recent Orders</h3>
          <button
            onClick={() => navigate('/admin/orders')}
            className="text-[10px] font-black uppercase tracking-widest text-electric hover:underline cursor-pointer"
          >
            All Orders &rarr;
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left whitespace-nowrap text-[12px]">
            <thead className="bg-navy-dark/40 border-b border-navy-light text-gray-400 font-bold uppercase text-[9px] tracking-widest">
              <tr>
                <th className="px-4 py-3">Order ID</th>
                <th className="px-4 py-3">Customer Info</th>
                <th className="px-4 py-3 text-right">Amount</th>
                <th className="px-4 py-3 text-center">Status</th>
                <th className="px-4 py-3">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-navy-light/60">
              {recentOrders.slice(0, 10).map((order) => {
                const customerName = order.ownerName || order.customerName || '—';
                const customerAddress = order.shopName || order.customerAddress || '—';
                return (
                  <tr
                    key={order._id}
                    onClick={() => navigate(`/admin/orders/${order._id}`)}
                    className="hover:bg-navy-light/20 transition-colors cursor-pointer"
                  >
                    <td className="px-4 py-3.5 font-mono font-bold text-electric">
                      {order.orderId || order.orderNumber || '—'}
                    </td>
                    <td className="px-4 py-3.5">
                      <p className="text-white font-bold uppercase tracking-wide">
                        {customerName}
                      </p>
                      <p className="text-gray-400 text-[10px]">{customerAddress}</p>
                    </td>
                    <td className="px-4 py-3.5 text-right font-bold text-white">
                      {formatPrice(order.totalAmount)}
                    </td>
                    <td className="px-4 py-3.5 text-center">
                      <span className={`text-[8px] font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-full ${
                        order.paymentStatus === 'paid' ? 'bg-emerald-950/40 text-emerald-400 border border-emerald-800' :
                        order.paymentStatus === 'partial' ? 'bg-amber-950/40 text-amber-400 border border-amber-800' :
                        'bg-red-950/40 text-red-400 border border-red-800'
                      }`}>
                        {order.paymentStatus}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-gray-400 font-medium">
                      {new Date(order.createdAt).toLocaleDateString('en-PK', {
                        day: 'numeric',
                        month: 'short',
                      })}
                    </td>
                  </tr>
                );
              })}
              {recentOrders.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-10 text-center text-gray-500 font-bold uppercase tracking-widest">
                    No orders found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

export default AdminDashboard;
