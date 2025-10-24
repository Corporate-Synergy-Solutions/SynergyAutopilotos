import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { CompanySupportRequestDialog } from './CompanySupportRequestDialog';
import { 
  AlertCircle, 
  Plus,
  Search,
  Clock,
  CheckCircle2,
  MessageSquare
} from 'lucide-react';

interface SupportRequest {
  id: string;
  subject: string;
  category: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  created_at: string;
  agent_name?: string;
  response?: string;
}

const mockRequests: SupportRequest[] = [
  {
    id: 'REQ-001',
    subject: 'Update AI Receptionist greeting message',
    category: 'AI Agent Configuration',
    priority: 'medium',
    status: 'resolved',
    created_at: '2025-01-20T10:00:00Z',
    agent_name: 'AI Receptionist',
    response: 'Greeting message has been updated as requested. The new message is now live.',
  },
  {
    id: 'REQ-002',
    subject: 'Add HVAC troubleshooting guide to knowledge base',
    category: 'Knowledge Base Update',
    priority: 'high',
    status: 'in_progress',
    created_at: '2025-01-22T14:30:00Z',
    agent_name: 'AI Foreman',
  },
  {
    id: 'REQ-003',
    subject: 'AI Foreman needs better understanding of new equipment',
    category: 'AI Agent Configuration',
    priority: 'high',
    status: 'open',
    created_at: '2025-01-23T09:15:00Z',
    agent_name: 'AI Foreman',
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

export function TechnicianSupportPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);

  const filteredRequests = mockRequests.filter(
    (req) =>
      req.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const openRequests = mockRequests.filter(r => r.status === 'open').length;
  const inProgressRequests = mockRequests.filter(r => r.status === 'in_progress').length;
  const resolvedRequests = mockRequests.filter(r => r.status === 'resolved').length;

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
      case 'closed': return <CheckCircle2 className="h-4 w-4" />;
      default: return <AlertCircle className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6 h-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-slate-900 mb-1">Support Requests</h2>
          <p className="text-slate-600">View and manage your requests to company admin</p>
        </div>
        <Button onClick={() => setDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          New Request
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm text-slate-600 mb-1">Open</p>
              <p className="text-3xl text-slate-900">{openRequests}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm text-slate-600 mb-1">In Progress</p>
              <p className="text-3xl text-slate-900">{inProgressRequests}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm text-slate-600 mb-1">Resolved</p>
              <p className="text-3xl text-slate-900">{resolvedRequests}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Search requests..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Requests List */}
      <div className="space-y-3">
        {filteredRequests.map((request) => (
          <Card key={request.id} className="hover:shadow-md transition-shadow">
            <CardContent className="pt-6">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="outline" className="text-xs">
                      {request.id}
                    </Badge>
                    <Badge variant={getPriorityColor(request.priority)} className="text-xs">
                      {request.priority}
                    </Badge>
                    <Badge variant="secondary" className="text-xs">
                      {request.category}
                    </Badge>
                    {request.agent_name && (
                      <Badge variant="outline" className="text-xs">
                        {request.agent_name}
                      </Badge>
                    )}
                  </div>
                  <h3 className="font-medium text-slate-900 mb-2">{request.subject}</h3>
                  {request.response && (
                    <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-start gap-2">
                        <MessageSquare className="h-4 w-4 text-green-600 mt-0.5 shrink-0" />
                        <div>
                          <p className="text-sm font-medium text-green-900 mb-1">Admin Response:</p>
                          <p className="text-sm text-green-800">{request.response}</p>
                        </div>
                      </div>
                    </div>
                  )}
                  <p className="text-xs text-slate-500 mt-2">
                    Submitted {formatDate(request.created_at)}
                  </p>
                </div>
                <Badge
                  variant={
                    request.status === 'resolved' ? 'default' :
                    request.status === 'in_progress' ? 'secondary' :
                    'outline'
                  }
                  className="shrink-0"
                >
                  <span className="flex items-center gap-1">
                    {getStatusIcon(request.status)}
                    {request.status.replace('_', ' ')}
                  </span>
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredRequests.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <AlertCircle className="h-12 w-12 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-600 mb-4">No support requests found.</p>
            <Button onClick={() => setDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create Your First Request
            </Button>
          </CardContent>
        </Card>
      )}

      <CompanySupportRequestDialog 
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />
    </div>
  );
}
