import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Input } from './ui/input';
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown,
  CreditCard,
  FileText,
  AlertCircle,
  Search,
  Download,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { toast } from 'sonner@2.0.3';

const formatCurrency = (cents: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(cents / 100);
};

const revenueData = [
  { month: 'Jan', mrr: 185000, arr: 2220000, newRevenue: 24500, churn: -3200 },
  { month: 'Feb', mrr: 198000, arr: 2376000, newRevenue: 31000, churn: -18000 },
  { month: 'Mar', mrr: 215000, arr: 2580000, newRevenue: 28500, churn: -11500 },
  { month: 'Apr', mrr: 228000, arr: 2736000, newRevenue: 22000, churn: -9000 },
  { month: 'May', mrr: 241000, arr: 2892000, newRevenue: 19500, churn: -6500 },
  { month: 'Jun', mrr: 257000, arr: 3084000, newRevenue: 21000, churn: -5000 },
];

const subscriptionTiers = [
  { tier: 'Enterprise', price: 39900, companies: 42, mrr: 1675800 },
  { tier: 'Professional', price: 19900, companies: 128, mrr: 2547200 },
  { tier: 'Starter', price: 9900, companies: 77, mrr: 762300 },
];

const recentInvoices = [
  { id: 'INV-2501', company: 'Comfort Climate HVAC', amount: 39900, status: 'paid', date: '2025-01-20', plan: 'Enterprise' },
  { id: 'INV-2502', company: 'Peak Performance Plumbing', amount: 19900, status: 'pending', date: '2025-01-21', plan: 'Professional' },
  { id: 'INV-2503', company: 'Elite Electrical Services', amount: 19900, status: 'paid', date: '2025-01-21', plan: 'Professional' },
  { id: 'INV-2504', company: 'Superior Heating & Cooling', amount: 39900, status: 'paid', date: '2025-01-22', plan: 'Enterprise' },
  { id: 'INV-2505', company: 'Total Home Services LLC', amount: 9900, status: 'overdue', date: '2025-01-15', plan: 'Starter' },
  { id: 'INV-2506', company: 'Metro HVAC Solutions', amount: 19900, status: 'paid', date: '2025-01-22', plan: 'Professional' },
  { id: 'INV-2507', company: 'Precision Plumbing Co.', amount: 9900, status: 'pending', date: '2025-01-23', plan: 'Starter' },
];

const paymentMethods = [
  { method: 'Credit Card', count: 198, percentage: 80.2 },
  { method: 'ACH/Bank Transfer', count: 42, percentage: 17.0 },
  { method: 'Wire Transfer', count: 7, percentage: 2.8 },
];

export function PlatformRevenuePage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [timeRange, setTimeRange] = useState('6m');

  const currentMRR = 257000;
  const previousMRR = 241000;
  const mrrGrowth = ((currentMRR - previousMRR) / previousMRR) * 100;
  
  const currentARR = currentMRR * 12;
  const previousARR = previousMRR * 12;
  const arrGrowth = ((currentARR - previousARR) / previousARR) * 100;

  const filteredInvoices = recentInvoices.filter(invoice =>
    invoice.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
    invoice.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleExportReport = () => {
    toast.success('Revenue report exported successfully');
  };

  const handleDownloadInvoice = (id: string) => {
    toast.success(`Invoice ${id} downloaded`);
  };

  return (
    <div className="space-y-6 h-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-slate-900 mb-1">Platform Revenue</h2>
          <p className="text-slate-600">Financial overview and billing management</p>
        </div>
        <Button onClick={handleExportReport}>
          <Download className="h-4 w-4 mr-2" />
          Export Report
        </Button>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <div className="p-2 rounded-lg bg-green-100">
                <DollarSign className="h-5 w-5 text-green-600" />
              </div>
              <ArrowUpRight className="h-4 w-4 text-green-600" />
            </div>
            <div className="space-y-1">
              <p className="text-sm text-slate-600">Monthly Recurring Revenue</p>
              <p className="text-2xl text-slate-900">{formatCurrency(currentMRR * 100)}</p>
              <p className="text-xs text-green-600">+{mrrGrowth.toFixed(1)}% from last month</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <div className="p-2 rounded-lg bg-blue-100">
                <TrendingUp className="h-5 w-5 text-blue-600" />
              </div>
              <ArrowUpRight className="h-4 w-4 text-green-600" />
            </div>
            <div className="space-y-1">
              <p className="text-sm text-slate-600">Annual Recurring Revenue</p>
              <p className="text-2xl text-slate-900">{formatCurrency(currentARR * 100)}</p>
              <p className="text-xs text-green-600">+{arrGrowth.toFixed(1)}% from last month</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <div className="p-2 rounded-lg bg-purple-100">
                <CreditCard className="h-5 w-5 text-purple-600" />
              </div>
              <ArrowDownRight className="h-4 w-4 text-orange-600" />
            </div>
            <div className="space-y-1">
              <p className="text-sm text-slate-600">Monthly Churn</p>
              <p className="text-2xl text-slate-900">{formatCurrency(5000 * 100)}</p>
              <p className="text-xs text-orange-600">1.9% churn rate</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <div className="p-2 rounded-lg bg-orange-100">
                <FileText className="h-5 w-5 text-orange-600" />
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-slate-600">Outstanding Invoices</p>
              <p className="text-2xl text-slate-900">
                {recentInvoices.filter(i => i.status !== 'paid').length}
              </p>
              <p className="text-xs text-slate-600">
                {formatCurrency(
                  recentInvoices
                    .filter(i => i.status !== 'paid')
                    .reduce((sum, i) => sum + i.amount, 0)
                )}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="subscriptions">Subscriptions</TabsTrigger>
          <TabsTrigger value="invoices">Invoices</TabsTrigger>
          <TabsTrigger value="payments">Payments</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Revenue Growth Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <LineChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value: number) => formatCurrency(value)}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="mrr"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    name="Monthly Recurring Revenue"
                  />
                  <Line
                    type="monotone"
                    dataKey="newRevenue"
                    stroke="#10b981"
                    strokeWidth={2}
                    name="New Revenue"
                  />
                  <Line
                    type="monotone"
                    dataKey="churn"
                    stroke="#f59e0b"
                    strokeWidth={2}
                    name="Churn"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Revenue by Subscription Tier</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={subscriptionTiers}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="tier" />
                    <YAxis />
                    <Tooltip formatter={(value: number) => formatCurrency(value)} />
                    <Bar dataKey="mrr" fill="#3b82f6" name="Monthly Revenue" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Key Metrics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <span className="text-sm text-slate-600">Average Revenue Per Account</span>
                  <span className="font-medium text-slate-900">
                    {formatCurrency((currentMRR / 247) * 100)}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <span className="text-sm text-slate-600">Customer Lifetime Value</span>
                  <span className="font-medium text-slate-900">$18,450</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <span className="text-sm text-slate-600">Net Revenue Retention</span>
                  <span className="font-medium text-slate-900">112%</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <span className="text-sm text-slate-600">Gross Margin</span>
                  <span className="font-medium text-slate-900">87.3%</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="subscriptions" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {subscriptionTiers.map((tier) => (
              <Card key={tier.tier}>
                <CardHeader>
                  <CardTitle>{tier.tier}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-3xl text-slate-900">{formatCurrency(tier.price)}</p>
                    <p className="text-sm text-slate-600">per month</p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-600">Active Companies</span>
                      <span className="font-medium">{tier.companies}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-600">Monthly Revenue</span>
                      <span className="font-medium">{formatCurrency(tier.mrr)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-600">% of Total MRR</span>
                      <span className="font-medium">
                        {((tier.mrr / currentMRR) * 100).toFixed(1)}%
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Subscription Changes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 border border-slate-200 rounded-lg">
                  <div>
                    <p className="font-medium text-slate-900">New Subscriptions (This Month)</p>
                    <p className="text-sm text-slate-600">12 new companies joined</p>
                  </div>
                  <Badge className="bg-green-100 text-green-700">+{formatCurrency(21000 * 100)}</Badge>
                </div>
                <div className="flex items-center justify-between p-3 border border-slate-200 rounded-lg">
                  <div>
                    <p className="font-medium text-slate-900">Upgrades (This Month)</p>
                    <p className="text-sm text-slate-600">8 companies upgraded</p>
                  </div>
                  <Badge className="bg-green-100 text-green-700">+{formatCurrency(8000 * 100)}</Badge>
                </div>
                <div className="flex items-center justify-between p-3 border border-slate-200 rounded-lg">
                  <div>
                    <p className="font-medium text-slate-900">Downgrades (This Month)</p>
                    <p className="text-sm text-slate-600">2 companies downgraded</p>
                  </div>
                  <Badge className="bg-orange-100 text-orange-700">-{formatCurrency(2000 * 100)}</Badge>
                </div>
                <div className="flex items-center justify-between p-3 border border-slate-200 rounded-lg">
                  <div>
                    <p className="font-medium text-slate-900">Cancellations (This Month)</p>
                    <p className="text-sm text-slate-600">3 companies cancelled</p>
                  </div>
                  <Badge className="bg-red-100 text-red-700">-{formatCurrency(5000 * 100)}</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="invoices" className="space-y-4">
          <Card>
            <CardContent className="pt-6">
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Search invoices..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Invoices</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {filteredInvoices.map((invoice) => (
                  <div
                    key={invoice.id}
                    className="flex items-center justify-between p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <span className="font-medium text-slate-900">{invoice.id}</span>
                        <Badge
                          variant={
                            invoice.status === 'paid' ? 'default' :
                            invoice.status === 'pending' ? 'secondary' :
                            'destructive'
                          }
                        >
                          {invoice.status}
                        </Badge>
                        <Badge variant="outline">{invoice.plan}</Badge>
                      </div>
                      <div className="flex items-center gap-3 text-sm text-slate-600">
                        <span>{invoice.company}</span>
                        <span>•</span>
                        <span>{new Date(invoice.date).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-medium text-slate-900">
                        {formatCurrency(invoice.amount)}
                      </span>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDownloadInvoice(invoice.id)}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payments" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {paymentMethods.map((method) => (
              <Card key={method.method}>
                <CardContent className="pt-6">
                  <div className="text-center space-y-2">
                    <p className="text-sm text-slate-600">{method.method}</p>
                    <p className="text-3xl text-slate-900">{method.count}</p>
                    <p className="text-sm text-slate-600">{method.percentage}% of total</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Payment Health</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-lg">
                <div>
                  <p className="font-medium text-slate-900">Successful Payments (This Month)</p>
                  <p className="text-sm text-slate-600">234 of 247 invoices paid on time</p>
                </div>
                <span className="text-2xl text-green-600">94.7%</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-orange-50 border border-orange-200 rounded-lg">
                <div>
                  <p className="font-medium text-slate-900">Failed Payments (This Month)</p>
                  <p className="text-sm text-slate-600">8 payment failures requiring attention</p>
                </div>
                <span className="text-2xl text-orange-600">3.2%</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-red-50 border border-red-200 rounded-lg">
                <div>
                  <p className="font-medium text-slate-900">Overdue Invoices</p>
                  <p className="text-sm text-slate-600">5 invoices past due date</p>
                </div>
                <span className="text-2xl text-red-600">2.0%</span>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
