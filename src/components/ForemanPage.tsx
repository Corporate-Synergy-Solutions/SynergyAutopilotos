import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../lib/auth';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';
import { CompanySupportRequestDialog } from './CompanySupportRequestDialog';
import { Send, Mic, Settings, User, Bot, Briefcase, DollarSign, Wrench, AlertCircle } from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const quickActions = [
  { id: 'job-status', label: 'Check Job Status', icon: Briefcase },
  { id: 'customer-info', label: 'Pull Customer Info', icon: User },
  { id: 'invoice', label: 'Show Invoice', icon: DollarSign },
  { id: 'specs', label: 'Technical Specs', icon: Wrench },
];

const mockResponses: Record<string, string> = {
  'Check Job Status': 'Here are your active jobs for today:\n\n1. **JOB-001** - HVAC Emergency Repair\n   - Customer: Sarah Johnson\n   - Location: 123 Business Plaza, SF\n   - Status: In Progress\n   - Scheduled: 9:00 AM - 12:00 PM\n\n2. **JOB-002** - Routine Maintenance\n   - Customer: Michael Chen\n   - Location: Mount Sinai Hospital, NY\n   - Status: Scheduled\n   - Scheduled: 2:00 PM - 5:00 PM',
  
  'Pull Customer Info': 'Customer: **Sarah Johnson**\n- Phone: +1 (555) 234-5678\n- Email: sarah.j@email.com\n- Company: Tech Startup Inc.\n- Address: 123 Business Plaza, SF, CA 94102\n- Total Jobs: 8\n- Lifetime Value: $23,400\n- Last Service: Emergency HVAC Repair (In Progress)',
  
  'Show Invoice': '**Invoice #INV-2025-001**\n\nCustomer: Sarah Johnson\nJob: HVAC Emergency Repair\nDate: October 23, 2025\n\n**Services:**\n- Emergency Service Call: $150.00\n- Compressor Repair: $450.00\n- Refrigerant Refill (5 lbs): $250.00\n\n**Parts:**\n- Capacitor (HVAC-CAP-001): $35.00\n\nSubtotal: $885.00\nTax (8.5%): $75.23\n**Total: $960.23**',
  
  'Technical Specs': 'Here are common torque specifications:\n\n**HVAC Systems:**\n- Compressor mounting bolts: 25-30 ft-lbs\n- Condenser fan motor: 15-20 ft-lbs\n- Line set connections: 30-35 ft-lbs\n\n**Heat Pumps:**\n- Reversing valve: 20-25 ft-lbs\n- Service valve caps: Hand tight + 1/4 turn\n\nNeed specs for a specific model? Just ask!',
};

export function ForemanPage() {
  const { user } = useAuth();
  const isTechnician = user?.role === 'technician';
  const [supportDialogOpen, setSupportDialogOpen] = useState(false);
  
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: "👋 Hey there! I'm your AI Foreman. I can help you with job info, customer details, technical specs, and more. What do you need?",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);

    // Simulate AI response
    setTimeout(() => {
      const response = Object.entries(mockResponses).find(([key]) =>
        input.toLowerCase().includes(key.toLowerCase())
      )?.[1] || "I can help with job status, customer info, invoices, and technical specs. What would you like to know?";

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    }, 500);

    setInput('');
  };

  const handleQuickAction = (label: string) => {
    setInput(label);
    setTimeout(() => handleSend(), 100);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-slate-900 mb-1">AI Foreman</h2>
          <p className="text-slate-600">Your expert partner on every job</p>
        </div>
        {isTechnician ? (
          <Button variant="outline" onClick={() => setSupportDialogOpen(true)}>
            <AlertCircle className="h-4 w-4 mr-2" />
            Request Changes
          </Button>
        ) : (
          <Button variant="outline" onClick={() => (window as any).navigateToPage?.('foreman-settings')}>
            <Settings className="h-4 w-4 mr-2" />
            Configure
          </Button>
        )}
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <Button
                  key={action.id}
                  variant="outline"
                  className="justify-start"
                  onClick={() => handleQuickAction(action.label)}
                >
                  <Icon className="h-4 w-4 mr-2" />
                  {action.label}
                </Button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Chat Interface */}
      <Card className="h-[600px] flex flex-col">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bot className="h-5 w-5 text-blue-600" />
            Chat with AI Foreman
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col p-0">
          {/* Messages */}
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4" ref={scrollRef}>
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {message.role === 'assistant' && (
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                      <Bot className="h-4 w-4 text-blue-600" />
                    </div>
                  )}
                  <div
                    className={`max-w-[70%] rounded-lg p-3 ${
                      message.role === 'user'
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-100 text-slate-900'
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                    <p
                      className={`text-xs mt-1 ${
                        message.role === 'user' ? 'text-blue-100' : 'text-slate-500'
                      }`}
                    >
                      {message.timestamp.toLocaleTimeString('en-US', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                  {message.role === 'user' && (
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center">
                      <User className="h-4 w-4 text-slate-600" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </ScrollArea>

          {/* Input */}
          <div className="border-t p-4">
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setIsRecording(!isRecording)}
                className={isRecording ? 'bg-red-100 border-red-300' : ''}
              >
                <Mic className={`h-4 w-4 ${isRecording ? 'text-red-600' : ''}`} />
              </Button>
              <Input
                placeholder="Ask me anything... (e.g., 'Show me the invoice for JOB-001')"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
              />
              <Button onClick={handleSend}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
            {isRecording && (
              <div className="mt-2 flex items-center gap-2 text-sm text-red-600">
                <div className="w-2 h-2 bg-red-600 rounded-full animate-pulse" />
                Recording... Click mic to stop
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <CompanySupportRequestDialog 
        open={supportDialogOpen}
        onOpenChange={setSupportDialogOpen}
        agentName="AI Foreman"
      />
    </div>
  );
}
