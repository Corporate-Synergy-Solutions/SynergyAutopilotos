import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { 
  Building2, 
  DollarSign, 
  Users, 
  TrendingUp, 
  Activity,
  AlertCircle,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';

const formatCurrency = (cents: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(cents / 100);
};

interface SystemAdminDashboardProps {
  onNavigate?: (page: string) => void;
}

export function SystemAdminDashboard({ onNavigate }: SystemAdminDashboardProps) {
  const platformStats = [
    {
      title: 'Total Platform Revenue',
      value: formatCurrency(2847500000), // $28,475,000
      icon: DollarSign,
      change: '+18.2%',
      trend: 'up',
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      title: 'Active Companies',
      value: '247',
      icon: Building2,
      change: '+12 this month',
      trend: 'up',
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      title: 'Total Users',
      value: '3,842',
      icon: Users,
      change: '+156 this month',
      trend: 'up',
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
    {
      title: 'Platform Health',
      value: '99.8%',
      icon: Activity,
      change: 'Uptime',
      trend: 'stable',
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-100',
    },
  ];

  const recentCompanies = [
    { id: '1', name: 'Comfort Climate HVAC', status: 'active', users: 12, mrr: 29900, joined: '2 days ago' },
    { id: '2', name: 'Peak Performance Plumbing', status: 'trial', users: 5, mrr: 0, joined: '4 days ago' },
    { id: '3', name: 'Elite Electrical Services', status: 'active', users: 8, mrr: 19900, joined: '1 week ago' },
    { id: '4', name: 'Superior Heating & Cooling', status: 'active', users: 15, mrr: 39900, joined: '1 week ago' },
    { id: '5', name: 'Total Home Services LLC', status: 'pending', users: 0, mrr: 0, joined: '2 weeks ago' },
  ];

  const supportTickets = [
    { id: '1', company: 'Comfort Climate HVAC', subject: 'Billing question about invoice #1234', priority: 'medium', status: 'open', time: '2 hours ago' },
    { id: '2', company: 'Peak Performance Plumbing', subject: 'Cannot access AI Receptionist settings', priority: 'high', status: 'in_progress', time: '3 hours ago' },
    { id: '3', company: 'Elite Electrical Services', subject: 'Request for additional user licenses', priority: 'low', status: 'open', time: '5 hours ago' },
    { id: '4', company: 'Superior Heating & Cooling', subject: 'Integration help needed', priority: 'medium', status: 'open', time: '1 day ago' },
  ];

  const handleQuickAction = (page: string) => {
    if (onNavigate) {
      onNavigate(page);
    }
  };

  return (
    <div className="space-y-6 h-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-slate-900 mb-1">System Admin Dashboard</h2>
          <p className="text-slate-600">Platform-wide overview and monitoring</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button size="sm" onClick={() => handleQuickAction('companies')}>
            <Building2 className="h-4 w-4 mr-2" />
            Manage Companies
          </Button>
          <Button size="sm" variant="outline" onClick={() => handleQuickAction('support-tickets')}>
            <AlertCircle className="h-4 w-4 mr-2" />
            Support Queue
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {platformStats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title}>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-2">
                  <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                    <Icon className={`h-5 w-5 ${stat.color}`} />
                  </div>
                  {stat.trend === 'up' && (
                    <ArrowUpRight className="h-4 w-4 text-green-600" />
                  )}
                  {stat.trend === 'down' && (
                    <ArrowDownRight className="h-4 w-4 text-red-600" />
                  )}
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-slate-600">{stat.title}</p>
                  <p className="text-2xl text-slate-900">{stat.value}</p>
                  <p className={`text-xs ${stat.trend === 'up' ? 'text-green-600' : stat.trend === 'down' ? 'text-red-600' : 'text-slate-600'}`}>
                    {stat.change}
                  </p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Companies */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle>Recent Companies</CardTitle>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => handleQuickAction('companies')}
            >
              View All
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentCompanies.map((company) => (
                <div
                  key={company.id}
                  className="flex items-center justify-between p-3 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-medium text-slate-900 truncate">{company.name}</p>
                      <Badge 
                        variant={
                          company.status === 'active' ? 'default' : 
                          company.status === 'trial' ? 'secondary' : 
                          'outline'
                        }
                        className="text-xs"
                      >
                        {company.status}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-slate-600">
                      <span>{company.users} users</span>
                      <span>•</span>
                      <span>{company.mrr > 0 ? formatCurrency(company.mrr) + '/mo' : 'No MRR'}</span>
                      <span>•</span>
                      <span>{company.joined}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Support Tickets */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle>Support Tickets</CardTitle>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => handleQuickAction('support-tickets')}
            >
              View All
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {supportTickets.map((ticket) => (
                <div
                  key={ticket.id}
                  className="p-3 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors cursor-pointer"
                  onClick={() => handleQuickAction('support-tickets')}
                >
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-900 truncate">
                        {ticket.subject}
                      </p>
                      <p className="text-xs text-slate-600 mt-1">{ticket.company}</p>
                    </div>
                    <Badge
                      variant={
                        ticket.priority === 'high' ? 'destructive' :
                        ticket.priority === 'medium' ? 'default' :
                        'secondary'
                      }
                      className="text-xs shrink-0"
                    >
                      {ticket.priority}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <Badge variant="outline" className="text-xs">
                      {ticket.status === 'in_progress' ? (
                        <>
                          <Clock className="h-3 w-3 mr-1" />
                          In Progress
                        </>
                      ) : (
                        <>
                          <AlertCircle className="h-3 w-3 mr-1" />
                          Open
                        </>
                      )}
                    </Badge>
                    <span className="text-slate-500">{ticket.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card 
          className="cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => handleQuickAction('platform-analytics')}
        >
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-lg bg-indigo-100">
                <TrendingUp className="h-6 w-6 text-indigo-600" />
              </div>
              <div>
                <p className="font-medium text-slate-900">Analytics</p>
                <p className="text-xs text-slate-600">Usage & metrics</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card 
          className="cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => handleQuickAction('platform-revenue')}
        >
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-lg bg-green-100">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="font-medium text-slate-900">Revenue</p>
                <p className="text-xs text-slate-600">Billing & invoices</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card 
          className="cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => handleQuickAction('platform-health')}
        >
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-lg bg-emerald-100">
                <Activity className="h-6 w-6 text-emerald-600" />
              </div>
              <div>
                <p className="font-medium text-slate-900">System Health</p>
                <p className="text-xs text-slate-600">Monitoring</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card 
          className="cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => handleQuickAction('support-tickets')}
        >
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-lg bg-orange-100">
                <AlertCircle className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <p className="font-medium text-slate-900">Support</p>
                <p className="text-xs text-slate-600">Tickets & help</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
