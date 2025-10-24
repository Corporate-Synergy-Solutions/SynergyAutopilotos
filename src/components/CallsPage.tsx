import { useState } from 'react';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
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
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from './ui/sheet';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { ScrollArea } from './ui/scroll-area';
import { mockCalls, mockCustomers } from '../lib/mockData';
import { Phone, PhoneIncoming, PhoneOutgoing, Clock, Plus, Play } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

const formatDuration = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${minutes}:${secs.toString().padStart(2, '0')}`;
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

interface CallFormData {
  customer_id: string;
  type: 'inbound' | 'outbound';
  purpose: string;
  notes: string;
  outcome: string;
}

export function CallsPage() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [selectedCall, setSelectedCall] = useState<any>(null);
  const [formData, setFormData] = useState<CallFormData>({
    customer_id: '',
    type: 'inbound',
    purpose: '',
    notes: '',
    outcome: '',
  });

  const handleLogCall = () => {
    setFormData({
      customer_id: '',
      type: 'inbound',
      purpose: '',
      notes: '',
      outcome: '',
    });
    setDialogOpen(true);
  };

  const handleSaveCall = () => {
    if (!formData.customer_id || !formData.purpose) {
      toast.error('Please fill in required fields');
      return;
    }
    toast.success('Call logged successfully');
    setDialogOpen(false);
  };

  const handleViewDetails = (call: any) => {
    setSelectedCall(call);
    setSheetOpen(true);
  };

  const handlePlayRecording = () => {
    toast.info('Playing call recording...');
  };

  const handleScheduleFollowup = () => {
    setSheetOpen(false);
    toast.success('Opening appointment scheduler...');
    (window as any).navigateToPage?.('appointments');
  };

  return (
    <div className="space-y-6 h-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-slate-900 mb-1">Call History</h2>
          <p className="text-slate-600">Track customer communications</p>
        </div>
        <Button onClick={handleLogCall}>
          <Plus className="h-4 w-4 mr-2" />
          Log Call
        </Button>
      </div>

      {/* Calls List */}
      <div className="space-y-3">
        {mockCalls.map((call) => (
          <Card key={call.id} className="hover:shadow-md transition-shadow">
            <CardContent className="pt-6">
              <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                <div
                  className={`p-3 rounded-lg shrink-0 ${
                    call.type === 'inbound' ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'
                  }`}
                >
                  {call.type === 'inbound' ? (
                    <PhoneIncoming className="h-5 w-5" />
                  ) : (
                    <PhoneOutgoing className="h-5 w-5" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <h3 className="text-slate-900 truncate">{call.customer_name}</h3>
                    <Badge variant={call.status === 'completed' ? 'default' : 'secondary'}>
                      {call.status}
                    </Badge>
                    <Badge variant="outline">
                      {call.type === 'inbound' ? 'Inbound' : 'Outbound'}
                    </Badge>
                  </div>
                  <p className="text-sm text-slate-600 mb-3">{call.purpose}</p>
                  <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500">
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {formatDate(call.timestamp)}
                    </div>
                    <div className="flex items-center gap-1">
                      <span>Duration: {formatDuration(call.duration)}</span>
                    </div>
                    {call.recording_url && (
                      <Badge variant="outline" className="text-xs">
                        <Play className="h-3 w-3 mr-1" />
                        Recording
                      </Badge>
                    )}
                  </div>
                </div>
                <div className="flex sm:flex-col gap-2 shrink-0">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 sm:flex-none"
                    onClick={() => handleViewDetails(call)}
                  >
                    View Details
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Log Call Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Log New Call</DialogTitle>
            <DialogDescription>
              Record details of a customer call
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

              <div className="space-y-2">
                <Label htmlFor="type">Call Type *</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value: any) => setFormData({ ...formData, type: value })}
                >
                  <SelectTrigger id="type">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="inbound">Inbound</SelectItem>
                    <SelectItem value="outbound">Outbound</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="purpose">Purpose *</Label>
              <Input
                id="purpose"
                value={formData.purpose}
                onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
                placeholder="e.g., Service inquiry, Follow-up, Emergency"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="outcome">Outcome</Label>
              <Select
                value={formData.outcome}
                onValueChange={(value) => setFormData({ ...formData, outcome: value })}
              >
                <SelectTrigger id="outcome">
                  <SelectValue placeholder="Select outcome" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="appointment_scheduled">Appointment Scheduled</SelectItem>
                  <SelectItem value="question_answered">Question Answered</SelectItem>
                  <SelectItem value="quote_requested">Quote Requested</SelectItem>
                  <SelectItem value="complaint">Complaint</SelectItem>
                  <SelectItem value="follow_up_needed">Follow-up Needed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Call Notes</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Enter detailed notes about the call"
                rows={4}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveCall}>Log Call</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Call Details Sheet */}
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent className="sm:max-w-[600px] w-full">
          {selectedCall && (
            <>
              <SheetHeader>
                <SheetTitle>{selectedCall.customer_name}</SheetTitle>
                <SheetDescription>Call details and recording</SheetDescription>
              </SheetHeader>

              <ScrollArea className="h-[calc(100vh-200px)] mt-6">
                <div className="space-y-6 px-6">
                  <div>
                    <h3 className="text-sm text-slate-600 mb-2">Call Type</h3>
                    <div className="flex gap-2">
                      <Badge variant={selectedCall.status === 'completed' ? 'default' : 'secondary'}>
                        {selectedCall.status}
                      </Badge>
                      <Badge variant="outline">
                        {selectedCall.type === 'inbound' ? 'Inbound' : 'Outbound'}
                      </Badge>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm text-slate-600 mb-2">Purpose</h3>
                    <p className="text-slate-900">{selectedCall.purpose}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h3 className="text-sm text-slate-600 mb-2">Date & Time</h3>
                      <p className="text-slate-900">{formatDate(selectedCall.timestamp)}</p>
                    </div>
                    <div>
                      <h3 className="text-sm text-slate-600 mb-2">Duration</h3>
                      <p className="text-slate-900">{formatDuration(selectedCall.duration)}</p>
                    </div>
                  </div>

                  {selectedCall.notes && (
                    <div>
                      <h3 className="text-sm text-slate-600 mb-2">Notes</h3>
                      <div className="bg-slate-50 p-4 rounded-lg">
                        <p className="text-sm text-slate-700">{selectedCall.notes}</p>
                      </div>
                    </div>
                  )}

                  {selectedCall.recording_url && (
                    <div>
                      <h3 className="text-sm text-slate-600 mb-2">Recording</h3>
                      <Button className="w-full" onClick={handlePlayRecording}>
                        <Play className="h-4 w-4 mr-2" />
                        Play Recording
                      </Button>
                    </div>
                  )}

                  <div className="pt-4 border-t">
                    <Button variant="outline" className="w-full" onClick={handleScheduleFollowup}>
                      <Plus className="h-4 w-4 mr-2" />
                      Schedule Follow-up
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
