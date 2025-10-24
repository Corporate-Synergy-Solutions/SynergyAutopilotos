import { useState } from 'react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from './ui/dialog';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from './ui/sheet';
import { ScrollArea } from './ui/scroll-area';
import { mockJobs, mockCompanies, mockCustomers } from '../lib/mockData';
import { Briefcase, Search, Plus, MapPin, User, Calendar, Building2, Edit, DollarSign } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

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
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

interface JobFormData {
  title: string;
  description: string;
  company_id: string;
  customer_id: string;
  location: string;
  scheduled_date: string;
  estimated_value: string;
  assigned_to: string;
  status: string;
  priority: string;
}

export function JobsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<JobFormData>({
    title: '',
    description: '',
    company_id: '',
    customer_id: '',
    location: '',
    scheduled_date: '',
    estimated_value: '',
    assigned_to: '',
    status: 'quoted',
    priority: 'medium',
  });

  const filteredJobs = mockJobs.filter((job) => {
    const matchesSearch =
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.company_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.customer_name.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' || job.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'in_progress':
        return 'default';
      case 'scheduled':
        return 'secondary';
      case 'quoted':
        return 'outline';
      default:
        return 'outline';
    }
  };

  const getPriorityVariant = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'destructive';
      case 'medium':
        return 'default';
      case 'low':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  const handleCreateJob = () => {
    setIsEditing(false);
    setFormData({
      title: '',
      description: '',
      company_id: '',
      customer_id: '',
      location: '',
      scheduled_date: '',
      estimated_value: '',
      assigned_to: '',
      status: 'quoted',
      priority: 'medium',
    });
    setDialogOpen(true);
  };

  const handleSaveJob = () => {
    if (!formData.title || !formData.company_id || !formData.customer_id) {
      toast.error('Please fill in required fields');
      return;
    }
    if (isEditing) {
      toast.success('Job updated successfully');
    } else {
      toast.success('Job created successfully');
    }
    setDialogOpen(false);
  };

  const handleViewDetails = (job: any) => {
    setSelectedJob(job);
    setSheetOpen(true);
  };

  const handleEditJob = (job: any) => {
    setIsEditing(true);
    setFormData({
      title: job.title,
      description: job.description,
      company_id: job.company_id || '',
      customer_id: job.customer_id || '',
      location: job.location,
      scheduled_date: job.scheduled_date,
      estimated_value: job.estimated_value.toString(),
      assigned_to: job.assigned_to,
      status: job.status,
      priority: job.priority,
    });
    setSheetOpen(false);
    setDialogOpen(true);
  };

  return (
    <div className="space-y-6 h-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-slate-900 mb-1">Jobs</h2>
          <p className="text-slate-600">Track and manage all service jobs</p>
        </div>
        <Button onClick={handleCreateJob}>
          <Plus className="h-4 w-4 mr-2" />
          Create Job
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search jobs by title, company, or customer..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="scheduled">Scheduled</SelectItem>
                <SelectItem value="quoted">Quoted</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Jobs List */}
      <div className="space-y-4">
        {filteredJobs.map((job) => (
          <Card key={job.id} className="hover:shadow-md transition-shadow">
            <CardContent className="pt-6">
              <div className="flex flex-col lg:flex-row lg:items-start gap-4">
                {/* Left Section */}
                <div className="flex-1 space-y-3 min-w-0">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-blue-100 text-blue-600 mt-1 shrink-0">
                      <Briefcase className="h-5 w-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <h3 className="text-slate-900 truncate">{job.title}</h3>
                        <Badge variant={getStatusVariant(job.status)}>{job.status}</Badge>
                        <Badge variant={getPriorityVariant(job.priority)}>
                          {job.priority} priority
                        </Badge>
                      </div>
                      <p className="text-sm text-slate-600 mb-2 line-clamp-2">{job.description}</p>
                      <div className="flex flex-wrap gap-4 text-sm">
                        <div className="flex items-center gap-1 text-slate-600">
                          <Building2 className="h-4 w-4 shrink-0" />
                          <span className="truncate">{job.company_name}</span>
                        </div>
                        <div className="flex items-center gap-1 text-slate-600">
                          <User className="h-4 w-4 shrink-0" />
                          <span className="truncate">{job.customer_name}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-4 text-sm pl-11">
                    <div className="flex items-center gap-1 text-slate-600">
                      <MapPin className="h-4 w-4 shrink-0" />
                      <span className="truncate">{job.location}</span>
                    </div>
                    <div className="flex items-center gap-1 text-slate-600">
                      <Calendar className="h-4 w-4 shrink-0" />
                      {formatDate(job.scheduled_date)}
                    </div>
                  </div>
                </div>

                {/* Right Section */}
                <div className="lg:text-right space-y-2 shrink-0">
                  <p className="text-slate-900">{formatCurrency(job.estimated_value)}</p>
                  <p className="text-sm text-slate-600">Assigned to: {job.assigned_to}</p>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full lg:w-auto"
                    onClick={() => handleViewDetails(job)}
                  >
                    View Details
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredJobs.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <Briefcase className="h-12 w-12 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-600">No jobs found matching your criteria.</p>
          </CardContent>
        </Card>
      )}

      {/* Create Job Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{isEditing ? 'Edit Job' : 'Create New Job'}</DialogTitle>
            <DialogDescription>
              {isEditing ? 'Update the job details' : 'Enter the details for the new service job'}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">Job Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g., HVAC System Installation"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Enter job description"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="company">Company *</Label>
                <Select
                  value={formData.company_id}
                  onValueChange={(value) => setFormData({ ...formData, company_id: value })}
                >
                  <SelectTrigger id="company">
                    <SelectValue placeholder="Select company" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockCompanies.map((company) => (
                      <SelectItem key={company.id} value={company.id}>
                        {company.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="customer">Customer *</Label>
                <Select
                  value={formData.customer_id}
                  onValueChange={(value) => setFormData({ ...formData, customer_id: value })}
                >
                  <SelectTrigger id="customer">
                    <SelectValue placeholder="Select customer" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockCustomers.map((customer) => (
                      <SelectItem key={customer.id} value={customer.id}>
                        {customer.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="Job site address"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="scheduled_date">Scheduled Date</Label>
                <Input
                  id="scheduled_date"
                  type="datetime-local"
                  value={formData.scheduled_date}
                  onChange={(e) => setFormData({ ...formData, scheduled_date: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="estimated_value">Estimated Value ($)</Label>
                <Input
                  id="estimated_value"
                  type="number"
                  value={formData.estimated_value}
                  onChange={(e) => setFormData({ ...formData, estimated_value: e.target.value })}
                  placeholder="0.00"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="assigned_to">Assigned To</Label>
                <Input
                  id="assigned_to"
                  value={formData.assigned_to}
                  onChange={(e) => setFormData({ ...formData, assigned_to: e.target.value })}
                  placeholder="Technician name"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => setFormData({ ...formData, status: value })}
                >
                  <SelectTrigger id="status">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="quoted">Quoted</SelectItem>
                    <SelectItem value="scheduled">Scheduled</SelectItem>
                    <SelectItem value="in_progress">In Progress</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="priority">Priority</Label>
                <Select
                  value={formData.priority}
                  onValueChange={(value) => setFormData({ ...formData, priority: value })}
                >
                  <SelectTrigger id="priority">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveJob}>
              {isEditing ? 'Update Job' : 'Create Job'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Job Details Sheet */}
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent className="sm:max-w-[600px] w-full">
          {selectedJob && (
            <>
              <SheetHeader>
                <SheetTitle>{selectedJob.title}</SheetTitle>
                <SheetDescription>Job details and information</SheetDescription>
              </SheetHeader>

              <ScrollArea className="h-[calc(100vh-200px)] mt-6">
                <div className="space-y-6 px-6">
                  <div>
                    <h3 className="text-sm text-slate-600 mb-2">Status</h3>
                    <div className="flex gap-2">
                      <Badge variant={getStatusVariant(selectedJob.status)}>
                        {selectedJob.status}
                      </Badge>
                      <Badge variant={getPriorityVariant(selectedJob.priority)}>
                        {selectedJob.priority} priority
                      </Badge>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm text-slate-600 mb-2">Description</h3>
                    <p className="text-slate-900">{selectedJob.description}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h3 className="text-sm text-slate-600 mb-2">Company</h3>
                      <p className="text-slate-900">{selectedJob.company_name}</p>
                    </div>
                    <div>
                      <h3 className="text-sm text-slate-600 mb-2">Customer</h3>
                      <p className="text-slate-900">{selectedJob.customer_name}</p>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm text-slate-600 mb-2">Location</h3>
                    <p className="text-slate-900">{selectedJob.location}</p>
                  </div>

                  <div>
                    <h3 className="text-sm text-slate-600 mb-2">Scheduled Date</h3>
                    <p className="text-slate-900">{formatDate(selectedJob.scheduled_date)}</p>
                  </div>

                  <div>
                    <h3 className="text-sm text-slate-600 mb-2">Estimated Value</h3>
                    <p className="text-slate-900">{formatCurrency(selectedJob.estimated_value)}</p>
                  </div>

                  <div>
                    <h3 className="text-sm text-slate-600 mb-2">Assigned To</h3>
                    <p className="text-slate-900">{selectedJob.assigned_to}</p>
                  </div>

                  <div className="pt-4 border-t">
                    <Button className="w-full" onClick={() => handleEditJob(selectedJob)}>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit Job
                    </Button>
                  </div>
                </div>
              </ScrollArea>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
