import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { mockStats, mockJobs, mockAppointments } from '../lib/mockData';
import { Building2, Briefcase, Calendar, DollarSign, TrendingUp, CheckCircle2, Plus, ArrowRight } from 'lucide-react';

const formatCurrency = (cents: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(cents / 100);
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

interface DashboardProps {
  onNavigate?: (page: string) => void;
}

export function Dashboard({ onNavigate }: DashboardProps) {
  const stats = [
    {
      title: 'Total Revenue',
      value: formatCurrency(mockStats.total_revenue),
      icon: DollarSign,
      change: '+12.5%',
      color: 'text-green-600',
    },
    {
      title: 'Total Customers',
      value: '142',
      icon: Building2,
      change: '+8 this month',
      color: 'text-blue-600',
    },
    {
      title: 'Active Jobs',
      value: mockStats.active_jobs.toString(),
      icon: Briefcase,
      change: `${mockStats.jobs_this_month} this month`,
      color: 'text-purple-600',
    },
    {
      title: 'Pending Appointments',
      value: mockStats.pending_appointments.toString(),
      icon: Calendar,
      change: 'Next 7 days',
      color: 'text-orange-600',
    },
  ];

  const handleQuickAction = (action: string) => {
    if (onNavigate) {
      onNavigate(action);
    }
  };

  return (
    <div className="space-y-6 h-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-slate-900 mb-1">Command Center</h2>
          <p className="text-slate-600">Real-time overview of your operations and performance</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button size="sm" onClick={() => handleQuickAction('jobs')}>
            <Plus className="h-4 w-4 mr-2" />
            New Job
          </Button>
          <Button size="sm" variant="outline" onClick={() => handleQuickAction('appointments')}>
            <Calendar className="h-4 w-4 mr-2" />
            Schedule
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title} className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-slate-600 mb-1">{stat.title}</p>
                    <p className="text-slate-900 mb-2 truncate">{stat.value}</p>
                    <p className={`text-xs ${stat.color}`}>{stat.change}</p>
                  </div>
                  <div className={`p-2 rounded-lg bg-slate-100 ${stat.color} shrink-0`}>
                    <Icon className="h-5 w-5" />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-100 text-green-600 shrink-0">
                <CheckCircle2 className="h-5 w-5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-slate-600">Jobs Completed</p>
                <p className="text-slate-900">{mockStats.jobs_completed}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-100 text-blue-600 shrink-0">
                <TrendingUp className="h-5 w-5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-slate-600">Monthly Revenue</p>
                <p className="text-slate-900 truncate">{formatCurrency(mockStats.monthly_revenue)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-yellow-100 text-yellow-600 shrink-0">
                <span className="text-lg">⭐</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-slate-600">Avg. Satisfaction</p>
                <p className="text-slate-900">{mockStats.customer_satisfaction}/5.0</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Jobs */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Recent Jobs</CardTitle>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => handleQuickAction('jobs')}
          >
            View All
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockJobs.slice(0, 5).map((job) => (
              <div key={job.id} className="flex flex-col sm:flex-row sm:items-start justify-between py-3 border-b last:border-0 gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <p className="text-slate-900 truncate">{job.title}</p>
                    <Badge
                      variant={
                        job.status === 'in_progress'
                          ? 'default'
                          : job.status === 'scheduled'
                          ? 'secondary'
                          : 'outline'
                      }
                    >
                      {job.status}
                    </Badge>
                    {job.priority === 'high' && (
                      <Badge variant="destructive">High Priority</Badge>
                    )}
                  </div>
                  <p className="text-sm text-slate-600 mb-1 truncate">{job.company_name}</p>
                  <p className="text-sm text-slate-500">
                    Scheduled: {formatDate(job.scheduled_date)}
                  </p>
                </div>
                <div className="text-left sm:text-right shrink-0">
                  <p className="text-slate-900 mb-1">{formatCurrency(job.estimated_value)}</p>
                  <p className="text-sm text-slate-500">{job.assigned_to}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Upcoming Appointments */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Upcoming Appointments</CardTitle>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => handleQuickAction('appointments')}
          >
            View All
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {mockAppointments.slice(0, 4).map((apt) => (
              <div key={apt.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 bg-slate-50 rounded-lg gap-3">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="p-2 rounded-lg bg-white shrink-0">
                    <Calendar className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-slate-900 mb-1 truncate">{apt.title}</p>
                    <p className="text-sm text-slate-600 truncate">{apt.customer_name}</p>
                  </div>
                </div>
                <div className="text-left sm:text-right shrink-0">
                  <p className="text-sm text-slate-900 mb-1">{formatDate(apt.start_time)}</p>
                  <p className="text-sm text-slate-600">{apt.technician}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
