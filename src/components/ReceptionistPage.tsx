import { useState } from 'react';
import { useAuth } from '../lib/auth';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { CompanySupportRequestDialog } from './CompanySupportRequestDialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Switch } from './ui/switch';
import { Slider } from './ui/slider';
import { ScrollArea } from './ui/scroll-area';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import {
  Phone,
  Plus,
  Search,
  Sparkles,
  BookOpen,
  Wrench,
  Workflow,
  Mic,
  BarChart3,
  TestTube,
  Shield,
  Settings,
  Code2,
  Link2,
  FileText,
  Clock,
  Globe,
  Lock,
  Code,
  Play,
  Zap,
  AlertCircle
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';

const systemPrompt = `You are a friendly and professional virtual receptionist for [Company Name], a professional services company.

**Environment:** You are answering incoming calls and helping customers book appointments, answer questions, and get the help they need.

**Persona:** You are knowledgeable, helpful, and efficient. You speak naturally and conversationally, but always maintain professionalism.

**Tone:** Warm and welcoming, but concise. You don't ramble or provide unnecessary information.

**Goals:**
- Greet callers warmly and identify their needs
- Answer common questions about services, pricing, and availability
- Book appointments efficiently
- Transfer to human staff when necessary
- Capture important information for follow-up

**Guardrails:**
- Never promise specific pricing without human confirmation
- Don't make medical or technical diagnoses
- Always offer to transfer to a human if the caller seems frustrated
- Don't share company financial or proprietary information
- Maintain customer privacy at all times`;

const systemVariables = [
  'system_agent_id',
  'system_caller_id',
  'system_caller_name',
  'system_call_start_time',
  'system_company_name',
  'system_current_date',
  'system_current_time',
];

const timezones = [
  'UTC',
  'America/New_York - Eastern Time',
  'America/Chicago - Central Time',
  'America/Denver - Mountain Time',
  'America/Los_Angeles - Pacific Time',
  'Europe/London - London',
  'Europe/Paris - Paris',
  'Asia/Tokyo - Tokyo',
  'Asia/Dubai - Dubai',
  'Australia/Sydney - Sydney',
];

const llmModels = [
  { provider: 'OpenAI', name: 'gpt-4o', label: 'GPT-4 Omni' },
  { provider: 'OpenAI', name: 'gpt-4o-mini', label: 'GPT-4 Omni Mini' },
  { provider: 'OpenAI', name: 'gpt-4-turbo', label: 'GPT-4 Turbo' },
  { provider: 'OpenAI', name: 'gpt-3.5-turbo', label: 'GPT-3.5 Turbo' },
  { provider: 'Anthropic', name: 'claude-3-5-sonnet', label: 'Claude 3.5 Sonnet' },
  { provider: 'Anthropic', name: 'claude-3-opus', label: 'Claude 3 Opus' },
  { provider: 'Anthropic', name: 'claude-3-sonnet', label: 'Claude 3 Sonnet' },
  { provider: 'Anthropic', name: 'claude-3-haiku', label: 'Claude 3 Haiku' },
  { provider: 'Google', name: 'gemini-1.5-pro', label: 'Gemini 1.5 Pro' },
  { provider: 'Google', name: 'gemini-1.5-flash', label: 'Gemini 1.5 Flash' },
  { provider: 'Google', name: 'gemini-1.0-pro', label: 'Gemini 1.0 Pro' },
];

const builtInTools = [
  { id: 'end-call', name: 'End call', description: 'Allow agent to end the call when appropriate', enabled: true },
  { id: 'detect-language', name: 'Detect language', description: 'Automatically detect caller language', enabled: true },
  { id: 'transfer-to-number', name: 'Transfer to number', description: 'Transfer call to human staff', enabled: true },
  { id: 'book-appointment', name: 'Book appointment', description: 'Schedule appointments in calendar', enabled: true },
  { id: 'send-sms', name: 'Send SMS', description: 'Send text message confirmations', enabled: false },
];

const voices = [
  { id: 'eric', name: 'Eric', gender: 'Male', accent: 'American', description: 'Professional and warm' },
  { id: 'rachel', name: 'Rachel', gender: 'Female', accent: 'American', description: 'Friendly and clear' },
  { id: 'james', name: 'James', gender: 'Male', accent: 'British', description: 'Authoritative and calm' },
  { id: 'sophia', name: 'Sophia', gender: 'Female', accent: 'British', description: 'Elegant and professional' },
  { id: 'carlos', name: 'Carlos', gender: 'Male', accent: 'Spanish', description: 'Energetic and personable' },
];

export function ReceptionistPage() {
  const { user } = useAuth();
  const isTechnician = user?.role === 'technician';
  const [supportDialogOpen, setSupportDialogOpen] = useState(false);
  
  const [agentLanguage, setAgentLanguage] = useState('English');
  const [firstMessage, setFirstMessage] = useState("Hi, welcome to our resource library! What are you hoping to find today?");
  const [prompt, setPrompt] = useState(systemPrompt);
  const [selectedTimezone, setSelectedTimezone] = useState('America/New_York - Eastern Time');
  const [selectedLLM, setSelectedLLM] = useState('gpt-4o');
  const [temperature, setTemperature] = useState([0.7]);
  const [selectedVoice, setSelectedVoice] = useState('eric');
  const [stability, setStability] = useState([0.5]);
  const [speed, setSpeed] = useState([1.0]);
  const [similarity, setSimilarity] = useState([0.75]);
  const [useFlash, setUseFlash] = useState(true);
  const [tools, setTools] = useState(builtInTools);
  const [searchTimezone, setSearchTimezone] = useState('');
  const [showVariableDropdown, setShowVariableDropdown] = useState(false);
  
  // Advanced settings
  const [turnTimeout, setTurnTimeout] = useState('30');
  const [silenceTimeout, setSilenceTimeout] = useState('120');
  const [maxDuration, setMaxDuration] = useState('1800');
  const [recordCalls, setRecordCalls] = useState(true);
  
  // Security settings
  const [authEnabled, setAuthEnabled] = useState(false);
  const [allowClientOverride, setAllowClientOverride] = useState(false);

  const filteredTimezones = timezones.filter(tz => 
    tz.toLowerCase().includes(searchTimezone.toLowerCase())
  );

  const toggleTool = (id: string) => {
    setTools(tools.map(tool => 
      tool.id === id ? { ...tool, enabled: !tool.enabled } : tool
    ));
  };

  const temperaturePresets = [
    { label: 'Consistent', value: 0.3 },
    { label: 'Balanced', value: 0.7 },
    { label: 'More Creative', value: 1.0 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-slate-900 mb-1">
            {isTechnician ? 'AI Receptionist' : 'AI Receptionist Configuration'}
          </h2>
          <p className="text-slate-600">
            {isTechnician 
              ? 'Access your AI-powered receptionist for customer calls'
              : 'Configure your 24/7 AI receptionist agent'}
          </p>
        </div>
        <div className="flex gap-2">
          {isTechnician ? (
            <>
              <Button variant="outline" onClick={() => setSupportDialogOpen(true)}>
                <AlertCircle className="h-4 w-4 mr-2" />
                Request Changes
              </Button>
              <Button>
                <Phone className="h-4 w-4 mr-2" />
                Use Agent
              </Button>
            </>
          ) : (
            <>
              <Button variant="outline">
                <Play className="h-4 w-4 mr-2" />
                Test Agent
              </Button>
              <Button>
                <Zap className="h-4 w-4 mr-2" />
                Deploy
              </Button>
            </>
          )}
        </div>
      </div>

      {isTechnician ? (
        // Technician View - Usage Only
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Phone className="h-5 w-5" />
                AI Receptionist Overview
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 rounded-lg">
                  <p className="text-sm text-slate-600 mb-1">Status</p>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-green-100 text-green-700">Active</Badge>
                    <span className="text-sm text-slate-600">Available 24/7</span>
                  </div>
                </div>
                <div className="p-4 bg-slate-50 rounded-lg">
                  <p className="text-sm text-slate-600 mb-1">Language</p>
                  <p className="font-medium text-slate-900">{agentLanguage}</p>
                </div>
                <div className="p-4 bg-slate-50 rounded-lg">
                  <p className="text-sm text-slate-600 mb-1">Voice</p>
                  <p className="font-medium text-slate-900 capitalize">{selectedVoice}</p>
                </div>
                <div className="p-4 bg-slate-50 rounded-lg">
                  <p className="text-sm text-slate-600 mb-1">Timezone</p>
                  <p className="font-medium text-slate-900">{selectedTimezone.split(' - ')[1] || selectedTimezone}</p>
                </div>
              </div>

              <div className="pt-4 border-t">
                <p className="text-sm text-slate-600 mb-2">Greeting Message</p>
                <p className="text-slate-900 italic">"{firstMessage}"</p>
              </div>

              <div className="pt-4">
                <p className="text-sm text-slate-600 mb-2">Available Tools</p>
                <div className="flex flex-wrap gap-2">
                  {tools.filter(t => t.enabled).map(tool => (
                    <Badge key={tool.id} variant="secondary">
                      {tool.name}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full justify-start" variant="outline">
                <Phone className="h-4 w-4 mr-2" />
                Start Test Call
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <BarChart3 className="h-4 w-4 mr-2" />
                View Call History
              </Button>
              <Button 
                className="w-full justify-start" 
                variant="outline"
                onClick={() => setSupportDialogOpen(true)}
              >
                <AlertCircle className="h-4 w-4 mr-2" />
                Request Configuration Changes
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Instructions for Use
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ol className="space-y-3 list-decimal list-inside text-sm text-slate-700">
                <li>The AI Receptionist is always active and ready to handle incoming calls</li>
                <li>It can answer common questions, book appointments, and route calls to the right person</li>
                <li>All calls are automatically recorded and transcribed for your review</li>
                <li>If you need changes to the agent's configuration, use the "Request Changes" button above</li>
                <li>Your company admin will review and implement approved changes</li>
              </ol>
            </CardContent>
          </Card>
        </div>
      ) : (
        // Company Admin View - Full Configuration
        <Tabs defaultValue="agent" className="space-y-6">
          <TabsList className="grid w-full grid-cols-8">
            <TabsTrigger value="agent">Agent</TabsTrigger>
            <TabsTrigger value="workflow">Workflow</TabsTrigger>
            <TabsTrigger value="voice">Voice</TabsTrigger>
            <TabsTrigger value="analysis">Analysis</TabsTrigger>
            <TabsTrigger value="tests">Tests</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="advanced">Advanced</TabsTrigger>
            <TabsTrigger value="widget">
              <Code2 className="h-4 w-4 mr-2" />
              Widget
            </TabsTrigger>
          </TabsList>

        {/* AGENT TAB */}
        <TabsContent value="agent">
          <ScrollArea className="h-[600px] pr-4">
            <div className="space-y-6">
              {/* Agent Language */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Globe className="h-5 w-5" />
                    Agent Language
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Select value={agentLanguage} onValueChange={setAgentLanguage}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="English">English</SelectItem>
                      <SelectItem value="Spanish">Spanish</SelectItem>
                      <SelectItem value="French">French</SelectItem>
                      <SelectItem value="German">German</SelectItem>
                      <SelectItem value="Chinese">Chinese</SelectItem>
                    </SelectContent>
                  </Select>
                </CardContent>
              </Card>

              {/* First Message */}
              <Card>
                <CardHeader>
                  <CardTitle>First message</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Label>Greeting message when call starts</Label>
                  <Textarea
                    value={firstMessage}
                    onChange={(e) => setFirstMessage(e.target.value)}
                    rows={2}
                  />
                </CardContent>
              </Card>

              {/* System Prompt */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5" />
                    System prompt
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-slate-600">
                    Define your agent's persona, goals, and behavior guidelines.
                  </p>
                  <Textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    rows={15}
                    className="font-mono text-sm"
                  />
                </CardContent>
              </Card>

              {/* Dynamic Variables */}
              <Card>
                <CardHeader>
                  <CardTitle>Dynamic Variables</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-slate-600">
                    Use variables in your prompts with the format: {'{variable_name}'}
                  </p>
                  <DropdownMenu open={showVariableDropdown} onOpenChange={setShowVariableDropdown}>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Variable
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="w-[300px]">
                      <div className="p-2 border-b">
                        <p className="text-sm font-medium mb-2">System Variables</p>
                      </div>
                      {systemVariables.map((variable) => (
                        <DropdownMenuItem 
                          key={variable}
                          onClick={() => {
                            navigator.clipboard.writeText(`{${variable}}`);
                            toast.success(`Copied {${variable}} to clipboard`);
                          }}
                        >
                          <Code className="h-4 w-4 mr-2" />
                          {variable}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </CardContent>
              </Card>

              {/* Timezone */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    Timezone
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-slate-600">
                    Set the timezone for scheduling and time-based responses
                  </p>
                  <div className="space-y-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <Input
                        placeholder="Search timezones..."
                        value={searchTimezone}
                        onChange={(e) => setSearchTimezone(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                    <Select value={selectedTimezone} onValueChange={setSelectedTimezone}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {filteredTimezones.map((tz) => (
                          <SelectItem key={tz} value={tz}>
                            {tz}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              {/* LLM Selection */}
              <Card>
                <CardHeader>
                  <CardTitle>LLM (Large Language Model)</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-slate-600">
                    Choose the AI model that powers your agent
                  </p>
                  <Select value={selectedLLM} onValueChange={setSelectedLLM}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {llmModels.map((model) => (
                        <SelectItem key={model.name} value={model.name}>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-xs">
                              {model.provider}
                            </Badge>
                            {model.label}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </CardContent>
              </Card>

              {/* Temperature */}
              <Card>
                <CardHeader>
                  <CardTitle>Temperature</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-slate-600">
                    Control how creative or consistent the agent's responses are
                  </p>
                  <div className="space-y-4">
                    <div className="flex gap-2">
                      {temperaturePresets.map((preset) => (
                        <Button
                          key={preset.label}
                          variant={temperature[0] === preset.value ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => setTemperature([preset.value])}
                        >
                          {preset.label}
                        </Button>
                      ))}
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label>Value: {temperature[0].toFixed(1)}</Label>
                      </div>
                      <Slider
                        value={temperature}
                        onValueChange={setTemperature}
                        min={0}
                        max={2}
                        step={0.1}
                      />
                      <div className="flex justify-between text-xs text-slate-500">
                        <span>Consistent</span>
                        <span>Creative</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Knowledge Base */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5" />
                    Agent knowledge base
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-slate-600">
                    Upload documents to give your agent specific knowledge
                  </p>
                  <Button 
                    variant="outline"
                    onClick={() => (window as any).navigateToPage?.('knowledge-base')}
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    Add document
                  </Button>
                </CardContent>
              </Card>

              {/* Tools */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Wrench className="h-5 w-5" />
                    Tools
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm mb-3">Built-in tools</p>
                    <div className="space-y-3">
                      {tools.map((tool) => (
                        <div key={tool.id} className="flex items-start justify-between p-3 border rounded-lg">
                          <div className="flex-1">
                            <p className="text-sm text-slate-900 mb-1">{tool.name}</p>
                            <p className="text-xs text-slate-600">{tool.description}</p>
                          </div>
                          <Switch
                            checked={tool.enabled}
                            onCheckedChange={() => toggleTool(tool.id)}
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-3 border-t">
                    <p className="text-sm mb-3">Custom tools</p>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline">
                          <Plus className="h-4 w-4 mr-2" />
                          Add tool
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem onClick={() => toast.info('Webhook configuration coming soon')}>
                          <Link2 className="h-4 w-4 mr-2" />
                          Webhook
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => toast.info('Client tool configuration coming soon')}>
                          <Code className="h-4 w-4 mr-2" />
                          Client
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardContent>
              </Card>
            </div>
          </ScrollArea>
        </TabsContent>

        {/* WORKFLOW TAB */}
        <TabsContent value="workflow">
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="mb-6 p-4 rounded-full bg-purple-100">
                  <Workflow className="h-12 w-12 text-purple-600" />
                </div>
                <h3 className="text-slate-900 mb-2">Visual Workflow Editor</h3>
                <p className="text-slate-600 mb-6 max-w-md">
                  Create conversation flows with a drag-and-drop node-based editor
                </p>
                <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 bg-slate-50 w-full max-w-2xl">
                  <div className="flex items-center justify-center gap-4">
                    <div className="bg-white border-2 border-blue-500 rounded-lg px-4 py-2 shadow-sm">
                      <p className="text-sm text-slate-700">Start</p>
                    </div>
                    <div className="text-slate-400">→</div>
                    <Button variant="outline" size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Node
                    </Button>
                  </div>
                  <p className="text-sm text-slate-500 mt-4">
                    Click to add conversation nodes, conditions, and actions
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* VOICE TAB */}
        <TabsContent value="voice">
          <ScrollArea className="h-[600px] pr-4">
            <div className="space-y-6">
              {/* Voice Selection */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Mic className="h-5 w-5" />
                    Voice Selection
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {voices.map((voice) => (
                      <div
                        key={voice.id}
                        className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                          selectedVoice === voice.id
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-slate-200 hover:border-slate-300'
                        }`}
                        onClick={() => setSelectedVoice(voice.id)}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <p className="text-slate-900 mb-1">{voice.name}</p>
                            <p className="text-xs text-slate-600">
                              {voice.gender} • {voice.accent}
                            </p>
                          </div>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={(e) => {
                              e.stopPropagation();
                              toast.info(`Playing ${voice.name} preview...`);
                            }}
                          >
                            <Play className="h-4 w-4" />
                          </Button>
                        </div>
                        <p className="text-xs text-slate-500">{voice.description}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Latency Optimization */}
              <Card>
                <CardHeader>
                  <CardTitle>Latency Optimization</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-slate-900">Use Flash</p>
                      <p className="text-xs text-slate-600">Reduce response latency for real-time conversations</p>
                    </div>
                    <Switch checked={useFlash} onCheckedChange={setUseFlash} />
                  </div>
                </CardContent>
              </Card>

              {/* Voice Settings */}
              <Card>
                <CardHeader>
                  <CardTitle>Voice Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Stability */}
                  <div className="space-y-2">
                    <Label>Stability: {stability[0].toFixed(2)}</Label>
                    <Slider
                      value={stability}
                      onValueChange={setStability}
                      min={0}
                      max={1}
                      step={0.01}
                    />
                    <p className="text-xs text-slate-600">
                      Higher values make the voice more consistent and predictable
                    </p>
                  </div>

                  {/* Speed */}
                  <div className="space-y-2">
                    <Label>Speed: {speed[0].toFixed(2)}x</Label>
                    <Slider
                      value={speed}
                      onValueChange={setSpeed}
                      min={0.5}
                      max={2}
                      step={0.1}
                    />
                    <p className="text-xs text-slate-600">
                      Adjust how fast the agent speaks
                    </p>
                  </div>

                  {/* Similarity */}
                  <div className="space-y-2">
                    <Label>Similarity: {similarity[0].toFixed(2)}</Label>
                    <Slider
                      value={similarity}
                      onValueChange={setSimilarity}
                      min={0}
                      max={1}
                      step={0.01}
                    />
                    <p className="text-xs text-slate-600">
                      How closely the voice matches the selected profile
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </ScrollArea>
        </TabsContent>

        {/* ANALYSIS TAB */}
        <TabsContent value="analysis">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Call Analytics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="py-12 text-center">
                <p className="text-slate-600 mb-4">
                  View detailed analytics about your agent's performance
                </p>
                <Button onClick={() => toast.info('Analytics dashboard coming soon')}>
                  View Analytics
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* TESTS TAB */}
        <TabsContent value="tests">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TestTube className="h-5 w-5" />
                Agent Tests
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="py-12 text-center">
                <p className="text-slate-600 mb-4">No tests attached</p>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Test
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* SECURITY TAB */}
        <TabsContent value="security">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Authentication
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-900">Enable Authentication</p>
                    <p className="text-xs text-slate-600">Require API key for agent access</p>
                  </div>
                  <Switch checked={authEnabled} onCheckedChange={setAuthEnabled} />
                </div>
                {authEnabled && (
                  <div className="pt-3 border-t space-y-2">
                    <Label>API Key</Label>
                    <Input type="password" value="••••••••••••••••" readOnly />
                    <Button variant="outline" size="sm">
                      Regenerate Key
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Allowlist</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-slate-600">
                  Restrict agent access to specific domains or IP addresses
                </p>
                <Button variant="outline">
                  <Plus className="h-4 w-4 mr-2" />
                  Add to Allowlist
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Client Overrides</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-900">Allow Client Overrides</p>
                    <p className="text-xs text-slate-600">
                      Let clients override agent configuration via API
                    </p>
                  </div>
                  <Switch 
                    checked={allowClientOverride} 
                    onCheckedChange={setAllowClientOverride} 
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* ADVANCED TAB */}
        <TabsContent value="advanced">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Call Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Turn timeout (seconds)</Label>
                  <Input
                    type="number"
                    value={turnTimeout}
                    onChange={(e) => setTurnTimeout(e.target.value)}
                  />
                  <p className="text-xs text-slate-600">
                    How long to wait for caller response before prompting again
                  </p>
                </div>

                <div className="space-y-2">
                  <Label>Silence end call timeout (seconds)</Label>
                  <Input
                    type="number"
                    value={silenceTimeout}
                    onChange={(e) => setSilenceTimeout(e.target.value)}
                  />
                  <p className="text-xs text-slate-600">
                    End call after this many seconds of silence
                  </p>
                </div>

                <div className="space-y-2">
                  <Label>Max conversation duration (seconds)</Label>
                  <Input
                    type="number"
                    value={maxDuration}
                    onChange={(e) => setMaxDuration(e.target.value)}
                  />
                  <p className="text-xs text-slate-600">
                    Maximum length of a single call
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Privacy Settings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-900">Record Calls</p>
                    <p className="text-xs text-slate-600">
                      Save call recordings for quality assurance
                    </p>
                  </div>
                  <Switch checked={recordCalls} onCheckedChange={setRecordCalls} />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* WIDGET TAB */}
        <TabsContent value="widget">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Code2 className="h-5 w-5" />
                Website Widget
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-slate-600">
                Embed your AI receptionist on your website with a simple code snippet
              </p>
              <div className="bg-slate-900 rounded-lg p-4">
                <code className="text-sm text-green-400 font-mono">
                  {`<script src="https://cdn.autopilot.ai/widget.js"></script>
<script>
  AutopilotWidget.init({
    agentId: 'your-agent-id',
    position: 'bottom-right'
  });
</script>`}
                </code>
              </div>
              <Button variant="outline">
                <Code className="h-4 w-4 mr-2" />
                Copy Code
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      )}

      <CompanySupportRequestDialog 
        open={supportDialogOpen}
        onOpenChange={setSupportDialogOpen}
        agentName="AI Receptionist"
      />
    </div>
  );
}
