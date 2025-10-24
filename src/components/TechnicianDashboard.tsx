import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from './ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { mockJobs, mockInventory } from '../lib/mockData';
import { 
  Briefcase, 
  MapPin, 
  Clock, 
  AlertTriangle, 
  MessageSquare, 
  Send,
  Package,
  Navigation,
  PlayCircle,
  CheckCircle2,
  ShoppingCart
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });
};

export function TechnicianDashboard() {
  const [question, setQuestion] = useState('');
  const [checkInDialogOpen, setCheckInDialogOpen] = useState(false);
  const [completeDialogOpen, setCompleteDialogOpen] = useState(false);
  const [partsDialogOpen, setPartsDialogOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState<any>(null);
  const [jobNotes, setJobNotes] = useState('');
  const [partsUsed, setPartsUsed] = useState<any[]>([]);
  
  // Filter jobs for today (for demo, show first 2)
  const myJobsToday = mockJobs.slice(0, 2);
  
  // Low stock items (items at or below reorder level)
  const lowStockItems = mockInventory.filter(item => item.quantity <= item.reorder_level);

  const handleAskForeman = () => {
    if (question.trim()) {
      (window as any).navigateToPage?.('foreman');
    }
  };

  const handleCheckIn = (job: any) => {
    setSelectedJob(job);
    setCheckInDialogOpen(true);
  };

  const handleConfirmCheckIn = () => {
    toast.success(`Checked in to job: ${selectedJob?.title}`);
    setCheckInDialogOpen(false);
  };

  const handleCompleteJob = (job: any) => {
    setSelectedJob(job);
    setJobNotes('');
    setCompleteDialogOpen(true);
  };

  const handleConfirmComplete = () => {
    if (!jobNotes.trim()) {
      toast.error('Please add completion notes');
      return;
    }
    toast.success(`Job completed: ${selectedJob?.title}`);
    setCompleteDialogOpen(false);
  };

  const handleRequestParts = () => {
    setPartsDialogOpen(true);
  };

  const handleConfirmPartsRequest = () => {
    toast.success('Parts request sent to dispatch');
    setPartsDialogOpen(false);
  };

  const handleGetDirections = (location: string) => {
    toast.info(`Opening directions to ${location}`);
  };

  return (
    <div className="space-y-6 h-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-slate-900 mb-1">Tech Hub</h2>
          <p className="text-slate-600">Your jobs and tools for today</p>
        </div>
        <Button onClick={handleRequestParts}>
          <ShoppingCart className="h-4 w-4 mr-2" />
          Request Parts
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-100 text-blue-600 shrink-0">
                <Briefcase className="h-5 w-5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-slate-600">Jobs Today</p>
                <p className="text-slate-900">{myJobsToday.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-100 text-green-600 shrink-0">
                <Clock className="h-5 w-5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-slate-600">Next Appointment</p>
                <p className="text-slate-900 truncate">
                  {myJobsToday.length > 0 ? formatDate(myJobsToday[0].scheduled_date) : 'None'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-orange-100 text-orange-600 shrink-0">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-slate-600">Low Stock Alerts</p>
                <p className="text-slate-900">{lowStockItems.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* My Jobs Today */}
      <Card>
        <CardHeader>
          <CardTitle>My Jobs Today</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {myJobsToday.map((job) => (
            <div key={job.id} className="p-4 bg-slate-50 rounded-lg border">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-3 gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <h3 className="text-slate-900 truncate">{job.title}</h3>
                    <Badge
                      variant={job.status === 'in_progress' ? 'default' : 'secondary'}
                    >
                      {job.status}
                    </Badge>
                    {job.priority === 'high' && (
                      <Badge variant="destructive">High Priority</Badge>
                    )}
                  </div>
                  <p className="text-sm text-slate-600 truncate">{job.customer_name}</p>
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-slate-600">
                  <MapPin className="h-4 w-4 shrink-0" />
                  <span className="truncate">{job.location}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-600">
                  <Clock className="h-4 w-4 shrink-0" />
                  Scheduled: {formatDate(job.scheduled_date)}
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-2 mt-3">
                <Button 
                  size="sm" 
                  className="flex-1"
                  onClick={() => handleCheckIn(job)}
                >
                  <PlayCircle className="h-4 w-4 mr-2" />
                  Check In
                </Button>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => handleGetDirections(job.location)}
                >
                  <Navigation className="h-4 w-4 mr-2" />
                  Directions
                </Button>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => handleCompleteJob(job)}
                >
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  Complete
                </Button>
              </div>
            </div>
          ))}
          {myJobsToday.length === 0 && (
            <div className="text-center py-8 text-slate-500">
              No jobs scheduled for today
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Q&A with AI Foreman */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-blue-600" />
            Quick Q&A with AI Foreman
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <p className="text-sm text-slate-600">
              Ask me anything - job details, customer info, technical specs...
            </p>
            <div className="flex gap-2">
              <Input
                placeholder="e.g., 'What are the torque specs for a Carrier fan?'"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAskForeman()}
              />
              <Button onClick={handleAskForeman}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <Button variant="outline" size="sm" onClick={() => {
                setQuestion('Check job status');
                setTimeout(handleAskForeman, 100);
              }}>
                Check Job Status
              </Button>
              <Button variant="outline" size="sm" onClick={() => {
                setQuestion('Technical specs');
                setTimeout(handleAskForeman, 100);
              }}>
                Tech Specs
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Low Stock Items on Truck */}
      {lowStockItems.length > 0 && (
        <Card className="border-orange-200 bg-orange-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-orange-900">
              <AlertTriangle className="h-5 w-5" />
              Low Stock Items
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {lowStockItems.map((item) => (
              <div key={item.id} className="flex items-center justify-between p-3 bg-white rounded-lg">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <Package className="h-5 w-5 text-orange-600 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-slate-900 truncate">{item.name}</p>
                    <p className="text-xs text-slate-500 truncate">{item.part_number}</p>
                  </div>
                </div>
                <Badge variant="outline" className="text-orange-600 border-orange-600 shrink-0">
                  {item.quantity} left
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Check In Dialog */}
      <Dialog open={checkInDialogOpen} onOpenChange={setCheckInDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Check In to Job</DialogTitle>
            <DialogDescription>
              Confirm you've arrived at the job site
            </DialogDescription>
          </DialogHeader>

          <div className="py-4 space-y-3">
            <div className="bg-slate-50 p-4 rounded-lg space-y-2">
              <p className="text-sm text-slate-600">Job:</p>
              <p className="text-slate-900">{selectedJob?.title}</p>
            </div>
            <div className="bg-slate-50 p-4 rounded-lg space-y-2">
              <p className="text-sm text-slate-600">Location:</p>
              <p className="text-slate-900">{selectedJob?.location}</p>
            </div>
            <div className="bg-slate-50 p-4 rounded-lg space-y-2">
              <p className="text-sm text-slate-600">Customer:</p>
              <p className="text-slate-900">{selectedJob?.customer_name}</p>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setCheckInDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleConfirmCheckIn}>
              <PlayCircle className="h-4 w-4 mr-2" />
              Check In
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Complete Job Dialog */}
      <Dialog open={completeDialogOpen} onOpenChange={setCompleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Complete Job</DialogTitle>
            <DialogDescription>
              Add completion notes and finalize the job
            </DialogDescription>
          </DialogHeader>

          <div className="py-4 space-y-4">
            <div className="bg-slate-50 p-4 rounded-lg">
              <p className="text-sm text-slate-600 mb-1">Job:</p>
              <p className="text-slate-900">{selectedJob?.title}</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="completion-notes">Completion Notes *</Label>
              <Textarea
                id="completion-notes"
                value={jobNotes}
                onChange={(e) => setJobNotes(e.target.value)}
                placeholder="Describe work completed, parts used, any issues..."
                rows={4}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setCompleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleConfirmComplete}>
              <CheckCircle2 className="h-4 w-4 mr-2" />
              Complete Job
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Request Parts Dialog */}
      <Dialog open={partsDialogOpen} onOpenChange={setPartsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Request Parts</DialogTitle>
            <DialogDescription>
              Request parts to be delivered or picked up
            </DialogDescription>
          </DialogHeader>

          <div className="py-4 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="part-name">Part Name/Number</Label>
              <Input
                id="part-name"
                placeholder="e.g., HVAC Filter 16x20"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="quantity">Quantity</Label>
                <Input
                  id="quantity"
                  type="number"
                  placeholder="1"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="urgency">Urgency</Label>
                <Select defaultValue="normal">
                  <SelectTrigger id="urgency">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="normal">Normal</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="part-notes">Notes</Label>
              <Textarea
                id="part-notes"
                placeholder="Additional details or specific requirements"
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setPartsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleConfirmPartsRequest}>
              <ShoppingCart className="h-4 w-4 mr-2" />
              Send Request
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
