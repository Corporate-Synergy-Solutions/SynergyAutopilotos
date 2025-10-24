import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from './ui/sheet';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from './ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  AlertCircle, 
  Clock, 
  CheckCircle2, 
  XCircle,
  Search,
  Filter,
  MessageSquare,
  Send
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface Ticket {
  id: string;
  company: string;
  companyId: string;
  subject: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  category: string;
  created_by: string;
  created_at: string;
  updated_at: string;
  assigned_to?: string;
  messages: Array<{
    id: string;
    sender: string;
    message: string;
    timestamp: string;
    isSupport: boolean;
  }>;
}

const mockTickets: Ticket[] = [
  {
    id: 'TKT-001',
    company: 'Comfort Climate HVAC',
    companyId: 'cmp_001',
    subject: 'Billing question about invoice #1234',
    description: 'We received invoice #1234 but the amount seems incorrect. We expected $199 but were charged $299. Can you please review this?',
    priority: 'medium',
    status: 'open',
    category: 'Billing',
    created_by: 'John Smith',
    created_at: '2025-01-23T10:30:00Z',
    updated_at: '2025-01-23T10:30:00Z',
    messages: [
      {
        id: 'msg_1',
        sender: 'John Smith',
        message: 'We received invoice #1234 but the amount seems incorrect. We expected $199 but were charged $299. Can you please review this?',
        timestamp: '2025-01-23T10:30:00Z',
        isSupport: false,
      },
    ],
  },
  {
    id: 'TKT-002',
    company: 'Peak Performance Plumbing',
    companyId: 'cmp_002',
    subject: 'Cannot access AI Receptionist settings',
    description: 'Getting a 403 error when trying to access the AI Receptionist configuration page. This is blocking our team from making important updates.',
    priority: 'high',
    status: 'in_progress',
    category: 'Technical',
    created_by: 'Sarah Johnson',
    created_at: '2025-01-23T08:15:00Z',
    updated_at: '2025-01-23T11:20:00Z',
    assigned_to: 'Support Agent',
    messages: [
      {
        id: 'msg_2',
        sender: 'Sarah Johnson',
        message: 'Getting a 403 error when trying to access the AI Receptionist configuration page. This is blocking our team from making important updates.',
        timestamp: '2025-01-23T08:15:00Z',
        isSupport: false,
      },
      {
        id: 'msg_3',
        sender: 'Support Team',
        message: 'Thank you for reporting this. We\'ve identified the issue - it\'s related to a recent permission update. Our engineering team is working on a fix.',
        timestamp: '2025-01-23T09:45:00Z',
        isSupport: true,
      },
    ],
  },
  {
    id: 'TKT-003',
    company: 'Elite Electrical Services',
    companyId: 'cmp_003',
    subject: 'Request for additional user licenses',
    description: 'We\'d like to add 5 more user licenses to our account. Please let us know the cost and how to proceed.',
    priority: 'low',
    status: 'resolved',
    category: 'Account',
    created_by: 'Mike Davis',
    created_at: '2025-01-22T14:00:00Z',
    updated_at: '2025-01-23T09:00:00Z',
    assigned_to: 'Sales Team',
    messages: [
      {
        id: 'msg_4',
        sender: 'Mike Davis',
        message: 'We\'d like to add 5 more user licenses to our account. Please let us know the cost and how to proceed.',
        timestamp: '2025-01-22T14:00:00Z',
        isSupport: false,
      },
      {
        id: 'msg_5',
        sender: 'Support Team',
        message: 'Great! Each additional user license is $15/month. I\'ve sent you an invoice for 5 licenses. Once payment is received, they will be activated immediately.',
        timestamp: '2025-01-22T15:30:00Z',
        isSupport: true,
      },
      {
        id: 'msg_6',
        sender: 'Mike Davis',
        message: 'Perfect, payment has been made. Thank you!',
        timestamp: '2025-01-23T09:00:00Z',
        isSupport: false,
      },
    ],
  },
  {
    id: 'TKT-004',
    company: 'Superior Heating & Cooling',
    companyId: 'cmp_004',
    subject: 'Integration help needed with QuickBooks',
    description: 'Need assistance setting up the QuickBooks integration. The connection keeps timing out.',
    priority: 'medium',
    status: 'open',
    category: 'Integration',
    created_by: 'Lisa Chen',
    created_at: '2025-01-22T09:00:00Z',
    updated_at: '2025-01-22T09:00:00Z',
    messages: [
      {
        id: 'msg_7',
        sender: 'Lisa Chen',
        message: 'Need assistance setting up the QuickBooks integration. The connection keeps timing out.',
        timestamp: '2025-01-22T09:00:00Z',
        isSupport: false,
      },
    ],
  },
  {
    id: 'TKT-005',
    company: 'Total Home Services LLC',
    companyId: 'cmp_005',
    subject: 'Feature request: Bulk job import',
    description: 'Would love to see a feature that allows bulk importing of jobs from CSV files.',
    priority: 'low',
    status: 'open',
    category: 'Feature Request',
    created_by: 'Robert Williams',
    created_at: '2025-01-21T16:30:00Z',
    updated_at: '2025-01-21T16:30:00Z',
    messages: [
      {
        id: 'msg_8',
        sender: 'Robert Williams',
        message: 'Would love to see a feature that allows bulk importing of jobs from CSV files. We have hundreds of historical jobs we\'d like to migrate.',
        timestamp: '2025-01-21T16:30:00Z',
        isSupport: false,
      },
    ],
  },
];

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
  
  if (diffInHours < 1) return 'Just now';
  if (diffInHours < 24) return `${diffInHours}h ago`;
  if (diffInHours < 48) return '1 day ago';
  return `${Math.floor(diffInHours / 24)} days ago`;
};

export function SupportTicketsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [replyMessage, setReplyMessage] = useState('');
  const [assignDialogOpen, setAssignDialogOpen] = useState(false);

  const filteredTickets = mockTickets.filter((ticket) => {
    const matchesSearch = 
      ticket.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || ticket.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || ticket.priority === priorityFilter;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const openTickets = mockTickets.filter(t => t.status === 'open').length;
  const inProgressTickets = mockTickets.filter(t => t.status === 'in_progress').length;
  const resolvedTickets = mockTickets.filter(t => t.status === 'resolved').length;
  const urgentTickets = mockTickets.filter(t => t.priority === 'urgent').length;

  const handleViewTicket = (ticket: Ticket) => {
    setSelectedTicket(ticket);
    setSheetOpen(true);
  };

  const handleSendReply = () => {
    if (!replyMessage.trim()) {
      toast.error('Please enter a message');
      return;
    }
    toast.success('Reply sent successfully');
    setReplyMessage('');
  };

  const handleUpdateStatus = (status: string) => {
    toast.success(`Ticket status updated to ${status}`);
  };

  const handleAssignTicket = () => {
    toast.success('Ticket assigned successfully');
    setAssignDialogOpen(false);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'destructive';
      case 'high': return 'destructive';
      case 'medium': return 'default';
      case 'low': return 'secondary';
      default: return 'secondary';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'open': return <AlertCircle className="h-4 w-4" />;
      case 'in_progress': return <Clock className="h-4 w-4" />;
      case 'resolved': return <CheckCircle2 className="h-4 w-4" />;
      case 'closed': return <XCircle className="h-4 w-4" />;
      default: return <AlertCircle className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6 h-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-slate-900 mb-1">Support Tickets</h2>
          <p className="text-slate-600">Manage and respond to customer support requests</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm text-slate-600 mb-1">Open</p>
              <p className="text-3xl text-slate-900">{openTickets}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm text-slate-600 mb-1">In Progress</p>
              <p className="text-3xl text-slate-900">{inProgressTickets}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm text-slate-600 mb-1">Resolved</p>
              <p className="text-3xl text-slate-900">{resolvedTickets}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm text-slate-600 mb-1">Urgent</p>
              <p className="text-3xl text-orange-600">{urgentTickets}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search tickets..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="open">Open</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
              </SelectContent>
            </Select>
            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priorities</SelectItem>
                <SelectItem value="urgent">Urgent</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Tickets List */}
      <div className="space-y-3">
        {filteredTickets.map((ticket) => (
          <Card
            key={ticket.id}
            className="cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => handleViewTicket(ticket)}
          >
            <CardContent className="pt-6">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="outline" className="text-xs">
                      {ticket.id}
                    </Badge>
                    <Badge variant={getPriorityColor(ticket.priority)} className="text-xs">
                      {ticket.priority}
                    </Badge>
                    <Badge variant="secondary" className="text-xs">
                      {ticket.category}
                    </Badge>
                  </div>
                  <h3 className="font-medium text-slate-900 mb-1">{ticket.subject}</h3>
                  <p className="text-sm text-slate-600 mb-2 line-clamp-1">{ticket.description}</p>
                  <div className="flex items-center gap-3 text-xs text-slate-500">
                    <span className="font-medium">{ticket.company}</span>
                    <span>•</span>
                    <span>{ticket.created_by}</span>
                    <span>•</span>
                    <span>{formatDate(ticket.created_at)}</span>
                    {ticket.messages.length > 1 && (
                      <>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <MessageSquare className="h-3 w-3" />
                          {ticket.messages.length}
                        </span>
                      </>
                    )}
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2 shrink-0">
                  <Badge
                    variant={
                      ticket.status === 'resolved' ? 'default' :
                      ticket.status === 'in_progress' ? 'secondary' :
                      'outline'
                    }
                  >
                    <span className="flex items-center gap-1">
                      {getStatusIcon(ticket.status)}
                      {ticket.status.replace('_', ' ')}
                    </span>
                  </Badge>
                  {ticket.assigned_to && (
                    <span className="text-xs text-slate-600">→ {ticket.assigned_to}</span>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredTickets.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <AlertCircle className="h-12 w-12 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-600">No tickets found matching your filters.</p>
          </CardContent>
        </Card>
      )}

      {/* Ticket Detail Sheet */}
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent className="sm:max-w-[700px] w-full overflow-y-auto px-6">
          {selectedTicket && (
            <>
              <SheetHeader className="pb-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <SheetTitle className="mb-2">{selectedTicket.subject}</SheetTitle>
                    <SheetDescription>
                      Ticket {selectedTicket.id} • Created {formatDate(selectedTicket.created_at)}
                    </SheetDescription>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 mt-3">
                  <Badge variant={getPriorityColor(selectedTicket.priority)}>
                    {selectedTicket.priority}
                  </Badge>
                  <Badge variant="outline">{selectedTicket.category}</Badge>
                  <Badge variant="secondary">{selectedTicket.company}</Badge>
                </div>
              </SheetHeader>

              <div className="space-y-6 py-4">
                {/* Actions */}
                <div className="flex flex-wrap gap-2">
                  <Select
                    value={selectedTicket.status}
                    onValueChange={handleUpdateStatus}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Update status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="open">Open</SelectItem>
                      <SelectItem value="in_progress">In Progress</SelectItem>
                      <SelectItem value="resolved">Resolved</SelectItem>
                      <SelectItem value="closed">Closed</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setAssignDialogOpen(true)}
                  >
                    Assign Ticket
                  </Button>
                </div>

                {/* Messages */}
                <div className="space-y-4">
                  <h4 className="font-medium text-slate-900">Conversation</h4>
                  <div className="space-y-3">
                    {selectedTicket.messages.map((message) => (
                      <div
                        key={message.id}
                        className={`p-4 rounded-lg ${
                          message.isSupport
                            ? 'bg-blue-50 border border-blue-200'
                            : 'bg-slate-50 border border-slate-200'
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-medium text-sm">
                            {message.sender}
                          </span>
                          {message.isSupport && (
                            <Badge variant="secondary" className="text-xs">
                              Support
                            </Badge>
                          )}
                          <span className="text-xs text-slate-500">
                            {formatDate(message.timestamp)}
                          </span>
                        </div>
                        <p className="text-sm text-slate-700">{message.message}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Reply */}
                <div className="space-y-3 pt-4 border-t">
                  <Label>Reply to Customer</Label>
                  <Textarea
                    value={replyMessage}
                    onChange={(e) => setReplyMessage(e.target.value)}
                    placeholder="Type your response here..."
                    rows={4}
                  />
                  <Button onClick={handleSendReply} className="w-full">
                    <Send className="h-4 w-4 mr-2" />
                    Send Reply
                  </Button>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>

      {/* Assign Dialog */}
      <Dialog open={assignDialogOpen} onOpenChange={setAssignDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Assign Ticket</DialogTitle>
            <DialogDescription>
              Assign this ticket to a support team member
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Assign To</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select team member" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="agent1">Support Agent 1</SelectItem>
                  <SelectItem value="agent2">Support Agent 2</SelectItem>
                  <SelectItem value="tech">Technical Team</SelectItem>
                  <SelectItem value="sales">Sales Team</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAssignDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAssignTicket}>Assign Ticket</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
