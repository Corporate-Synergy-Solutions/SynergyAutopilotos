import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  TrendingUp, 
  Users, 
  Activity, 
  Zap,
  Phone,
  Bot,
  Calendar,
  Briefcase,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const userGrowthData = [
  { month: 'Jan', users: 2840, companies: 198 },
  { month: 'Feb', users: 3021, companies: 215 },
  { month: 'Mar', users: 3245, companies: 228 },
  { month: 'Apr', users: 3456, companies: 235 },
  { month: 'May', users: 3621, companies: 241 },
  { month: 'Jun', users: 3842, companies: 247 },
];

const featureUsageData = [
  { month: 'Jan', receptionist: 12450, foreman: 8920, serviceRep: 5340, inventory: 3210 },
  { month: 'Feb', receptionist: 13200, foreman: 9560, serviceRep: 5890, inventory: 3580 },
  { month: 'Mar', receptionist: 14100, foreman: 10240, serviceRep: 6320, inventory: 3890 },
  { month: 'Apr', receptionist: 15300, foreman: 11050, serviceRep: 6840, inventory: 4120 },
  { month: 'May', receptionist: 16800, foreman: 12100, serviceRep: 7450, inventory: 4560 },
  { month: 'Jun', receptionist: 18500, foreman: 13240, serviceRep: 8120, inventory: 4980 },
];

const companyDistributionData = [
  { name: 'HVAC', value: 98, color: '#3b82f6' },
  { name: 'Plumbing', value: 72, color: '#8b5cf6' },
  { name: 'Electrical', value: 45, color: '#f59e0b' },
  { name: 'General Contracting', value: 32, color: '#10b981' },
];

const apiUsageData = [
  { endpoint: 'AI Receptionist', calls: 185000, avgResponse: 245 },
  { endpoint: 'AI Foreman', calls: 132400, avgResponse: 312 },
  { endpoint: 'Job Management', calls: 98750, avgResponse: 128 },
  { endpoint: 'Customer Portal', calls: 76200, avgResponse: 156 },
  { endpoint: 'Inventory Sync', calls: 49800, avgResponse: 89 },
];

export function PlatformAnalyticsPage() {
  const [timeRange, setTimeRange] = useState('30d');

  const metrics = [
    {
      title: 'Monthly Active Users',
      value: '3,842',
      change: '+4.1%',
      trend: 'up',
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      title: 'AI Agent Interactions',
      value: '44.7k',
      change: '+12.3%',
      trend: 'up',
      icon: Bot,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
    {
      title: 'Jobs Created',
      value: '12,456',
      change: '+8.7%',
      trend: 'up',
      icon: Briefcase,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      title: 'Avg Session Duration',
      value: '18m 42s',
      change: '+2.1%',
      trend: 'up',
      icon: Activity,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
    },
  ];

  return (
    <div className="space-y-6 h-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-slate-900 mb-1">Platform Analytics</h2>
          <p className="text-slate-600">Usage metrics and engagement analytics across all companies</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant={timeRange === '7d' ? 'default' : 'outline'}
            onClick={() => setTimeRange('7d')}
          >
            7 Days
          </Button>
          <Button
            size="sm"
            variant={timeRange === '30d' ? 'default' : 'outline'}
            onClick={() => setTimeRange('30d')}
          >
            30 Days
          </Button>
          <Button
            size="sm"
            variant={timeRange === '90d' ? 'default' : 'outline'}
            onClick={() => setTimeRange('90d')}
          >
            90 Days
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric) => {
          const Icon = metric.icon;
          return (
            <Card key={metric.title}>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-2">
                  <div className={`p-2 rounded-lg ${metric.bgColor}`}>
                    <Icon className={`h-5 w-5 ${metric.color}`} />
                  </div>
                  {metric.trend === 'up' ? (
                    <ArrowUpRight className="h-4 w-4 text-green-600" />
                  ) : (
                    <ArrowDownRight className="h-4 w-4 text-red-600" />
                  )}
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-slate-600">{metric.title}</p>
                  <p className="text-2xl text-slate-900">{metric.value}</p>
                  <p className={`text-xs ${metric.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                    {metric.change} from last period
                  </p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Tabs defaultValue="growth" className="space-y-4">
        <TabsList>
          <TabsTrigger value="growth">Growth</TabsTrigger>
          <TabsTrigger value="features">Feature Usage</TabsTrigger>
          <TabsTrigger value="companies">Companies</TabsTrigger>
          <TabsTrigger value="api">API Usage</TabsTrigger>
        </TabsList>

        <TabsContent value="growth" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>User & Company Growth</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <LineChart data={userGrowthData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Legend />
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="users"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    name="Total Users"
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="companies"
                    stroke="#8b5cf6"
                    strokeWidth={2}
                    name="Active Companies"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-sm text-slate-600 mb-2">User Growth Rate</p>
                  <p className="text-3xl text-slate-900 mb-1">+35.2%</p>
                  <p className="text-xs text-green-600">vs last 6 months</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-sm text-slate-600 mb-2">Avg Users per Company</p>
                  <p className="text-3xl text-slate-900 mb-1">15.6</p>
                  <p className="text-xs text-blue-600">+1.2 from last month</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-sm text-slate-600 mb-2">User Retention Rate</p>
                  <p className="text-3xl text-slate-900 mb-1">94.3%</p>
                  <p className="text-xs text-green-600">+2.1% improvement</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="features" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>AI Agent Usage Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={featureUsageData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="receptionist" fill="#3b82f6" name="AI Receptionist" />
                  <Bar dataKey="foreman" fill="#8b5cf6" name="AI Foreman" />
                  <Bar dataKey="serviceRep" fill="#f59e0b" name="AI Service Rep" />
                  <Bar dataKey="inventory" fill="#10b981" name="AI Inventory" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 rounded-lg bg-blue-100">
                    <Phone className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-600">AI Receptionist</p>
                    <p className="text-xl text-slate-900">18.5k</p>
                  </div>
                </div>
                <p className="text-xs text-green-600">+12.3% usage</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 rounded-lg bg-purple-100">
                    <Bot className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-600">AI Foreman</p>
                    <p className="text-xl text-slate-900">13.2k</p>
                  </div>
                </div>
                <p className="text-xs text-green-600">+8.4% usage</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 rounded-lg bg-orange-100">
                    <Zap className="h-5 w-5 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-600">AI Service Rep</p>
                    <p className="text-xl text-slate-900">8.1k</p>
                  </div>
                </div>
                <p className="text-xs text-green-600">+15.2% usage</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 rounded-lg bg-green-100">
                    <Activity className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-600">AI Inventory</p>
                    <p className="text-xl text-slate-900">5.0k</p>
                  </div>
                </div>
                <p className="text-xs text-green-600">+9.1% usage</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="companies" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Company Distribution by Industry</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={companyDistributionData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={(entry) => `${entry.name}: ${entry.value}`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {companyDistributionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Company Tiers</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <div>
                    <p className="font-medium text-slate-900">Enterprise</p>
                    <p className="text-xs text-slate-600">$399/month</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl text-slate-900">42</p>
                    <p className="text-xs text-slate-600">companies</p>
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <div>
                    <p className="font-medium text-slate-900">Professional</p>
                    <p className="text-xs text-slate-600">$199/month</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl text-slate-900">128</p>
                    <p className="text-xs text-slate-600">companies</p>
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <div>
                    <p className="font-medium text-slate-900">Starter</p>
                    <p className="text-xs text-slate-600">$99/month</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl text-slate-900">77</p>
                    <p className="text-xs text-slate-600">companies</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="api" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>API Usage Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {apiUsageData.map((api) => (
                  <div
                    key={api.endpoint}
                    className="flex items-center justify-between p-4 border border-slate-200 rounded-lg"
                  >
                    <div className="flex-1">
                      <p className="font-medium text-slate-900 mb-1">{api.endpoint}</p>
                      <div className="flex items-center gap-4 text-sm text-slate-600">
                        <span>{api.calls.toLocaleString()} calls/month</span>
                        <span>•</span>
                        <span>Avg: {api.avgResponse}ms</span>
                      </div>
                    </div>
                    <Badge variant="secondary">
                      {api.avgResponse < 200 ? 'Fast' : api.avgResponse < 300 ? 'Good' : 'Slow'}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-sm text-slate-600 mb-2">Total API Calls</p>
                  <p className="text-3xl text-slate-900 mb-1">542k</p>
                  <p className="text-xs text-slate-600">this month</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-sm text-slate-600 mb-2">Avg Response Time</p>
                  <p className="text-3xl text-slate-900 mb-1">186ms</p>
                  <p className="text-xs text-green-600">-12ms improvement</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-sm text-slate-600 mb-2">Error Rate</p>
                  <p className="text-3xl text-slate-900 mb-1">0.12%</p>
                  <p className="text-xs text-green-600">-0.03% improvement</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
