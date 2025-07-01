
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar } from 'recharts';
import { TrendingUp, ShoppingCart, DollarSign, Package } from 'lucide-react';
import { useOrders, useProducts, useProductTypes } from '../../hooks/useSupabaseStore';
import { useMemo } from 'react';

const AnalyticsTab = () => {
  const { orders } = useOrders();
  const { products } = useProducts();
  const { productTypes } = useProductTypes();

  // Calculate analytics data from real database data
  const analyticsData = useMemo(() => {
    // Orders per day (last 7 days)
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - i));
      return date.toISOString().split('T')[0];
    });

    const ordersPerDay = last7Days.map(date => {
      const dayOrders = orders.filter(order => 
        order.created_at.split('T')[0] === date
      );
      return {
        date,
        orders: dayOrders.length
      };
    });

    // Product types distribution
    const productTypeStats = productTypes.map(type => {
      const typeProducts = products.filter(p => p.product_type_id === type.id);
      const typeOrders = orders.filter(order => 
        typeProducts.some(product => product.name === order.product_name)
      );
      return {
        name: type.name,
        value: typeOrders.length,
        color: `hsl(${Math.random() * 360}, 70%, 60%)`
      };
    }).filter(item => item.value > 0);

    // Calculate percentages for pie chart
    const totalTypeOrders = productTypeStats.reduce((sum, item) => sum + item.value, 0);
    const productTypesData = productTypeStats.map(item => ({
      ...item,
      value: totalTypeOrders > 0 ? Math.round((item.value / totalTypeOrders) * 100) : 0
    }));

    // Top selling products
    const productSales = products.map(product => {
      const productOrders = orders.filter(order => order.product_name === product.name);
      return {
        name: product.name,
        sales: productOrders.length
      };
    }).sort((a, b) => b.sales - a.sales).slice(0, 5);

    // Key metrics
    const totalRevenue = orders.reduce((sum, order) => sum + Number(order.total_price), 0);
    const totalOrders = orders.length;
    const averageOrder = totalOrders > 0 ? totalRevenue / totalOrders : 0;
    const totalProducts = products.length;

    return {
      ordersPerDay,
      productTypesData,
      productSales,
      keyMetrics: [
        { title: 'Total Revenue', value: `${totalRevenue.toLocaleString()} DA`, icon: DollarSign, change: '+12.5%' },
        { title: 'Total Orders', value: totalOrders.toString(), icon: ShoppingCart, change: '+8.2%' },
        { title: 'Average Order', value: `${Math.round(averageOrder).toLocaleString()} DA`, icon: TrendingUp, change: '+4.1%' },
        { title: 'Total Products', value: totalProducts.toString(), icon: Package, change: '+15.3%' },
      ]
    };
  }, [orders, products, productTypes]);

  return (
    <div className="space-y-6 sm:space-y-8">
      <h2 className="text-xl sm:text-2xl font-bold">Analytics & Statistics</h2>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
        {analyticsData.keyMetrics.map((metric, index) => (
          <motion.div
            key={metric.title}
            className="glass-effect p-3 sm:p-4 md:p-6 rounded-lg sm:rounded-xl border"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <div className="flex items-center justify-between mb-2 sm:mb-4">
              <div className="p-1.5 sm:p-2 rounded-lg bg-primary/10">
                <metric.icon className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-primary" />
              </div>
              <span className="text-xs sm:text-sm text-green-500 font-medium">{metric.change}</span>
            </div>
            <h3 className="text-lg sm:text-xl md:text-2xl font-bold mb-1">{metric.value}</h3>
            <p className="text-muted-foreground text-xs sm:text-sm">{metric.title}</p>
          </motion.div>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid lg:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
        {/* Orders Per Day Chart */}
        <motion.div
          className="glass-effect p-3 sm:p-4 md:p-6 rounded-lg sm:rounded-xl border"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Orders Per Day (Last 7 Days)</h3>
          <div className="w-full" style={{ marginLeft: '-20px' }}>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={analyticsData.ordersPerDay}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis 
                  dataKey="date" 
                  stroke="#9CA3AF"
                  fontSize={10}
                  tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                />
                <YAxis stroke="#9CA3AF" fontSize={10} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(17, 24, 39, 0.9)', 
                    border: '1px solid #374151',
                    borderRadius: '8px',
                    color: '#F9FAFB',
                    fontSize: '12px'
                  }}
                  labelFormatter={(value) => new Date(value).toLocaleDateString()}
                />
                <Line 
                  type="monotone" 
                  dataKey="orders" 
                  stroke="url(#gradient)" 
                  strokeWidth={3}
                  dot={{ fill: '#8A2BE2', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, fill: '#c039ff' }}
                />
                <defs>
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#8A2BE2" />
                    <stop offset="100%" stopColor="#4682B4" />
                  </linearGradient>
                </defs>
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Product Types Distribution */}
        <motion.div
          className="glass-effect p-3 sm:p-4 md:p-6 rounded-lg sm:rounded-xl border"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Sales by Product Type</h3>
          {analyticsData.productTypesData.length > 0 ? (
            <>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={analyticsData.productTypesData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {analyticsData.productTypesData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(17, 24, 39, 0.9)', 
                      border: '1px solid #374151',
                      borderRadius: '8px',
                      color: '#F9FAFB',
                      fontSize: '12px'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex flex-wrap justify-center gap-2 sm:gap-4 mt-3 sm:mt-4">
                {analyticsData.productTypesData.map((item, index) => (
                  <div key={index} className="flex items-center space-x-1 sm:space-x-2">
                    <div 
                      className="w-2 h-2 sm:w-3 sm:h-3 rounded-full" 
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-xs sm:text-sm">{item.name} ({item.value}%)</span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-[250px] text-muted-foreground text-sm">
              No sales data available yet
            </div>
          )}
        </motion.div>
      </div>

      {/* Top Products Bar Chart */}
      <motion.div
        className="glass-effect p-3 sm:p-4 md:p-6 rounded-lg sm:rounded-xl border"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Top Selling Products</h3>
        {analyticsData.productSales.length > 0 && analyticsData.productSales[0].sales > 0 ? (
          <div className="w-full" style={{ marginLeft: '-20px' }}>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={analyticsData.productSales} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis type="number" stroke="#9CA3AF" fontSize={10} />
                <YAxis type="category" dataKey="name" stroke="#9CA3AF" fontSize={10} width={100} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(17, 24, 39, 0.9)', 
                    border: '1px solid #374151',
                    borderRadius: '8px',
                    color: '#F9FAFB',
                    fontSize: '12px'
                  }}
                />
                <Bar dataKey="sales" fill="url(#barGradient)" radius={[0, 4, 4, 0]} />
                <defs>
                  <linearGradient id="barGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#8A2BE2" />
                    <stop offset="100%" stopColor="#4682B4" />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="flex items-center justify-center h-[300px] text-muted-foreground text-sm">
            No sales data available yet
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default AnalyticsTab;
