
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar } from 'recharts';
import { TrendingUp, ShoppingCart, DollarSign, Package } from 'lucide-react';

const AnalyticsTab = () => {
  // Mock data for charts
  const ordersData = [
    { date: '2024-01-01', orders: 12 },
    { date: '2024-01-02', orders: 19 },
    { date: '2024-01-03', orders: 15 },
    { date: '2024-01-04', orders: 25 },
    { date: '2024-01-05', orders: 22 },
    { date: '2024-01-06', orders: 30 },
    { date: '2024-01-07', orders: 28 },
  ];

  const productTypesData = [
    { name: 'T-Shirts', value: 45, color: '#8A2BE2' },
    { name: 'Hoodies', value: 30, color: '#4682B4' },
    { name: 'Jackets', value: 15, color: '#c039ff' },
    { name: 'Accessories', value: 10, color: '#00bfff' },
  ];

  const topProductsData = [
    { name: 'Premium T-Shirt', sales: 85 },
    { name: 'Designer Hoodie', sales: 72 },
    { name: 'Classic Jacket', sales: 63 },
    { name: 'Sport Cap', sales: 45 },
    { name: 'Winter Scarf', sales: 38 },
  ];

  const keyMetrics = [
    { title: 'Total Revenue', value: '245,750 DA', icon: DollarSign, change: '+12.5%' },
    { title: 'Total Orders', value: '1,247', icon: ShoppingCart, change: '+8.2%' },
    { title: 'Average Order', value: '3,250 DA', icon: TrendingUp, change: '+4.1%' },
    { title: 'Total Products', value: '89', icon: Package, change: '+15.3%' },
  ];

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold">Analytics & Statistics</h2>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {keyMetrics.map((metric, index) => (
          <motion.div
            key={metric.title}
            className="glass-effect p-6 rounded-xl border"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 rounded-lg bg-primary/10">
                <metric.icon className="w-6 h-6 text-primary" />
              </div>
              <span className="text-sm text-green-500 font-medium">{metric.change}</span>
            </div>
            <h3 className="text-2xl font-bold mb-1">{metric.value}</h3>
            <p className="text-muted-foreground text-sm">{metric.title}</p>
          </motion.div>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Orders Per Day Chart */}
        <motion.div
          className="glass-effect p-6 rounded-xl border"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h3 className="text-lg font-semibold mb-4">Orders Per Day (Last 7 Days)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={ordersData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis 
                dataKey="date" 
                stroke="#9CA3AF"
                fontSize={12}
                tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              />
              <YAxis stroke="#9CA3AF" fontSize={12} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(17, 24, 39, 0.9)', 
                  border: '1px solid #374151',
                  borderRadius: '8px',
                  color: '#F9FAFB'
                }}
                labelFormatter={(value) => new Date(value).toLocaleDateString()}
              />
              <Line 
                type="monotone" 
                dataKey="orders" 
                stroke="url(#gradient)" 
                strokeWidth={3}
                dot={{ fill: '#8A2BE2', strokeWidth: 2, r: 6 }}
                activeDot={{ r: 8, fill: '#c039ff' }}
              />
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#8A2BE2" />
                  <stop offset="100%" stopColor="#4682B4" />
                </linearGradient>
              </defs>
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Product Types Distribution */}
        <motion.div
          className="glass-effect p-6 rounded-xl border"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h3 className="text-lg font-semibold mb-4">Sales by Product Type</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={productTypesData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
              >
                {productTypesData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(17, 24, 39, 0.9)', 
                  border: '1px solid #374151',
                  borderRadius: '8px',
                  color: '#F9FAFB'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-wrap justify-center gap-4 mt-4">
            {productTypesData.map((item, index) => (
              <div key={index} className="flex items-center space-x-2">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-sm">{item.name} ({item.value}%)</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Top Products Bar Chart */}
      <motion.div
        className="glass-effect p-6 rounded-xl border"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <h3 className="text-lg font-semibold mb-4">Top Selling Products</h3>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={topProductsData} layout="horizontal">
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis type="number" stroke="#9CA3AF" fontSize={12} />
            <YAxis type="category" dataKey="name" stroke="#9CA3AF" fontSize={12} width={120} />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'rgba(17, 24, 39, 0.9)', 
                border: '1px solid #374151',
                borderRadius: '8px',
                color: '#F9FAFB'
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
      </motion.div>
    </div>
  );
};

export default AnalyticsTab;
