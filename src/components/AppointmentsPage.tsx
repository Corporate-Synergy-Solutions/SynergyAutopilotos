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
import { mockAppointments, mockCustomers } from '../lib/mockData';
import { Calendar, Clock, User, Plus, Edit, X } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

const formatTime = (dateString: string) => {
  return new Date(dateString).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });
};

const getTimeRange = (start: string, end: string) => {
  return `${formatTime(start)} - ${formatTime(end)}`;
};

interface AppointmentFormData {
  title: string;
  customer_id: string;
  service_type: string;
  start_time: string;
  end_time: string;
  technician: string;
  notes: string;
  status: string;
}

export function AppointmentsPage() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<any>(null);
  const [formData, setFormData] = useState<AppointmentFormData>({
    title: '',
    customer_id: '',
    service_type: '',
    start_time: '',
    end_time: '',
    technician: '',
    notes: '',
    status: 'scheduled',
  });

  const handleScheduleAppointment = () => {
    setFormData({
      title: '',
      customer_id: '',
      service_type: '',
      start_time: '',
      end_time: '',
      technician: '',
      notes: '',
      status: 'scheduled',
    });
    setDialogOpen(true);
  };

  const handleSaveAppointment = () => {
    if (!formData.title || !formData.customer_id || !formData.start_time) {
      toast.error('Please fill in required fields');
      return;
    }
    toast.success('Appointment scheduled successfully');
    setDialogOpen(false);
  };

  const handleViewDetails = (appointment: any) => {
    setSelectedAppointment(appointment);
    setSheetOpen(true);
  };

  const handleCancelAppointment = () => {
    toast.success('Appointment cancelled');
    setSheetOpen(false);
  };

  const handleReschedule = () => {
    if (selectedAppointment) {
      setFormData({
        title: selectedAppointment.title,
        customer_id: selectedAppointment.customer_id || '',
        service_type: selectedAppointment.service_type,
        start_time: selectedAppointment.start_time,
        end_time: selectedAppointment.end_time,
        technician: selectedAppointment.technician_name || '',
        notes: selectedAppointment.notes || '',
        status: selectedAppointment.status,
      });
      setSheetOpen(false);
      setDialogOpen(true);
    }
  };

  return (
    <div className="space-y-6 h-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-slate-900 mb-1">Appointments</h2>
          <p className="text-slate-600">Manage scheduled service appointments</p>
        </div>
        <Button onClick={handleScheduleAppointment}>
          <Plus className="h-4 w-4 mr-2" />
          Schedule Appointment
        </Button>
      </div>

      {/* Calendar View Placeholder */}
      <Card>
        <CardContent className="py-8 text-center bg-gradient-to-br from-slate-50 to-white">
          <Calendar className="h-12 w-12 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-600 mb-2">Calendar View</p>
          <p className="text-sm text-slate-500">
            Full calendar integration would be implemented here with date navigation
          </p>
        </CardContent>
      </Card>

      {/* Appointments List */}
      <div className="space-y-3">
        {mockAppointments.map((apt) => {
          const isPast = new Date(apt.end_time) < new Date();
          return (
            <Card key={apt.id} className="hover:shadow-md transition-shadow">
              <CardContent className="pt-6">
                <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                  <div className="p-3 rounded-lg bg-blue-100 text-blue-600 shrink-0">
                    <Calendar className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <h3 className="text-slate-900 truncate">{apt.title}</h3>
                      <Badge
                        variant={
                          apt.status === 'confirmed'
                            ? 'default'
                            : apt.status === 'scheduled'
                            ? 'secondary'
                            : 'outline'
                        }
                      >
                        {apt.status}
                      </Badge>
                      {isPast && <Badge variant="outline">Past</Badge>}
                    </div>
                    <p className="text-sm text-slate-600 mb-3">{apt.customer_name}</p>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {formatDate(apt.start_time)}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {getTimeRange(apt.start_time, apt.end_time)}
                      </div>
                      <div className="flex items-center gap-1">
                        <User className="h-4 w-4" />
                        {apt.technician_name}
                      </div>
                    </div>
                  </div>
                  <div className="flex sm:flex-col gap-2 shrink-0">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 sm:flex-none"
                      onClick={() => handleViewDetails(apt)}
                    >
                      View Details
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Schedule Appointment Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Schedule New Appointment</DialogTitle>
            <DialogDescription>
              Create a new service appointment for a customer
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">Appointment Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g., Annual HVAC Maintenance"
              />
            </div>

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
                <Label htmlFor="service_type">Service Type</Label>
                <Select
                  value={formData.service_type}
                  onValueChange={(value) => setFormData({ ...formData, service_type: value })}
                >
                  <SelectTrigger id="service_type">
                    <SelectValue placeholder="Select service type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="maintenance">Maintenance</SelectItem>
                    <SelectItem value="repair">Repair</SelectItem>
                    <SelectItem value="installation">Installation</SelectItem>
                    <SelectItem value="inspection">Inspection</SelectItem>
                    <SelectItem value="emergency">Emergency</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="start_time">Start Time *</Label>
                <Input
                  id="start_time"
                  type="datetime-local"
                  value={formData.start_time}
                  onChange={(e) => setFormData({ ...formData, start_time: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="end_time">End Time</Label>
                <Input
                  id="end_time"
                  type="datetime-local"
                  value={formData.end_time}
                  onChange={(e) => setFormData({ ...formData, end_time: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="technician">Assigned Technician</Label>
                <Input
                  id="technician"
                  value={formData.technician}
                  onChange={(e) => setFormData({ ...formData, technician: e.target.value })}
                  placeholder="Technician name"
                />
              </div>

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
                    <SelectItem value="scheduled">Scheduled</SelectItem>
                    <SelectItem value="confirmed">Confirmed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Additional notes or special instructions"
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveAppointment}>Schedule Appointment</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Appointment Details Sheet */}
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent className="sm:max-w-[600px] w-full">
          {selectedAppointment && (
            <>
              <SheetHeader>
                <SheetTitle>{selectedAppointment.title}</SheetTitle>
                <SheetDescription>Appointment details and actions</SheetDescription>
              </SheetHeader>

              <ScrollArea className="h-[calc(100vh-200px)] mt-6">
                <div className="space-y-6 px-6">
                  <div>
                    <h3 className="text-sm text-slate-600 mb-2">Status</h3>
                    <Badge
                      variant={
                        selectedAppointment.status === 'confirmed'
                          ? 'default'
                          : selectedAppointment.status === 'scheduled'
                          ? 'secondary'
                          : 'outline'
                      }
                    >
                      {selectedAppointment.status}
                    </Badge>
                  </div>

                  <div>
                    <h3 className="text-sm text-slate-600 mb-2">Customer</h3>
                    <p className="text-slate-900">{selectedAppointment.customer_name}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h3 className="text-sm text-slate-600 mb-2">Date</h3>
                      <p className="text-slate-900">{formatDate(selectedAppointment.start_time)}</p>
                    </div>
                    <div>
                      <h3 className="text-sm text-slate-600 mb-2">Time</h3>
                      <p className="text-slate-900">
                        {getTimeRange(selectedAppointment.start_time, selectedAppointment.end_time)}
                      </p>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm text-slate-600 mb-2">Technician</h3>
                    <p className="text-slate-900">{selectedAppointment.technician_name}</p>
                  </div>

                  {selectedAppointment.notes && (
                    <div>
                      <h3 className="text-sm text-slate-600 mb-2">Notes</h3>
                      <p className="text-slate-700">{selectedAppointment.notes}</p>
                    </div>
                  )}

                  <div className="pt-4 border-t space-y-2">
                    <Button className="w-full" onClick={handleReschedule}>
                      <Edit className="h-4 w-4 mr-2" />
                      Reschedule
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full text-red-600 hover:text-red-700"
                      onClick={handleCancelAppointment}
                    >
                      <X className="h-4 w-4 mr-2" />
                      Cancel Appointment
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
