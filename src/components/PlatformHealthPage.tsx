import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  Activity, 
  Server,
  Database,
  Zap,
  AlertTriangle,
  CheckCircle2,
  Clock,
  TrendingUp,
  Cpu,
  HardDrive,
  Globe,
  Shield
} from 'lucide-react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const uptimeData = [
  { time: '00:00', uptime: 100, responseTime: 145 },
  { time: '04:00', uptime: 100, responseTime: 152 },
  { time: '08:00', uptime: 99.8, responseTime: 168 },
  { time: '12:00', uptime: 100, responseTime: 142 },
  { time: '16:00', uptime: 100, responseTime: 139 },
  { time: '20:00', uptime: 100, responseTime: 148 },
];

const serverLoad = [
  { server: 'API-01', cpu: 42, memory: 68, requests: 12450 },
  { server: 'API-02', cpu: 38, memory: 65, requests: 11230 },
  { server: 'API-03', cpu: 45, memory: 72, requests: 13100 },
  { server: 'DB-01', cpu: 28, memory: 82, requests: 8900 },
  { server: 'DB-02', cpu: 31, memory: 79, requests: 9200 },
];

const systemEvents = [
  { id: '1', type: 'info', message: 'Automated backup completed successfully', timestamp: '2 hours ago', service: 'Database' },
  { id: '2', type: 'warning', message: 'High memory usage detected on API-03', timestamp: '3 hours ago', service: 'API Server' },
  { id: '3', type: 'success', message: 'Security patch deployed to all servers', timestamp: '5 hours ago', service: 'System' },
  { id: '4', type: 'info', message: 'SSL certificate renewed', timestamp: '1 day ago', service: 'Security' },
  { id: '5', type: 'warning', message: 'Unusual traffic spike detected', timestamp: '1 day ago', service: 'CDN' },
];

const apiEndpoints = [
  { name: 'Authentication API', status: 'operational', uptime: 99.99, avgResponse: 89 },
  { name: 'Jobs API', status: 'operational', uptime: 99.97, avgResponse: 124 },
  { name: 'Customers API', status: 'operational', uptime: 99.98, avgResponse: 112 },
  { name: 'AI Receptionist API', status: 'operational', uptime: 99.95, avgResponse: 245 },
  { name: 'AI Foreman API', status: 'operational', uptime: 99.93, avgResponse: 312 },
  { name: 'Inventory API', status: 'operational', uptime: 99.96, avgResponse: 156 },
  { name: 'Appointments API', status: 'degraded', uptime: 98.2, avgResponse: 428 },
  { name: 'Knowledge Base API', status: 'operational', uptime: 99.91, avgResponse: 198 },
];

export function PlatformHealthPage() {
  const [timeRange, setTimeRange] = useState('24h');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'operational': return 'default';
      case 'degraded': return 'secondary';
      case 'down': return 'destructive';
      default: return 'outline';
    }
  };

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'success': return <CheckCircle2 className="h-4 w-4 text-green-600" />;
      case 'warning': return <AlertTriangle className="h-4 w-4 text-orange-600" />;
      case 'error': return <AlertTriangle className="h-4 w-4 text-red-600" />;
      default: return <Activity className="h-4 w-4 text-blue-600" />;
    }
  };

  return (
    <div className="space-y-6 h-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-slate-900 mb-1">Platform Health</h2>
          <p className="text-slate-600">System monitoring and performance metrics</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant={timeRange === '1h' ? 'default' : 'outline'}
            onClick={() => setTimeRange('1h')}
          >
            1 Hour
          </Button>
          <Button
            size="sm"
            variant={timeRange === '24h' ? 'default' : 'outline'}
            onClick={() => setTimeRange('24h')}
          >
            24 Hours
          </Button>
          <Button
            size="sm"
            variant={timeRange === '7d' ? 'default' : 'outline'}
            onClick={() => setTimeRange('7d')}
          >
            7 Days
          </Button>
        </div>
      </div>

      {/* System Status Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <div className="p-2 rounded-lg bg-green-100">
                <Activity className="h-5 w-5 text-green-600" />
              </div>
              <Badge className="bg-green-100 text-green-700">Operational</Badge>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-slate-600">System Uptime</p>
              <p className="text-2xl text-slate-900">99.8%</p>
              <p className="text-xs text-slate-600">Last 30 days</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <div className="p-2 rounded-lg bg-blue-100">
                <Zap className="h-5 w-5 text-blue-600" />
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-slate-600">Avg Response Time</p>
              <p className="text-2xl text-slate-900">156ms</p>
              <p className="text-xs text-green-600">-12ms improvement</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <div className="p-2 rounded-lg bg-purple-100">
                <Server className="h-5 w-5 text-purple-600" />
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-slate-600">Active Servers</p>
              <p className="text-2xl text-slate-900">12 / 12</p>
              <p className="text-xs text-slate-600">All healthy</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <div className="p-2 rounded-lg bg-orange-100">
                <AlertTriangle className="h-5 w-5 text-orange-600" />
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-slate-600">Active Incidents</p>
              <p className="text-2xl text-slate-900">1</p>
              <p className="text-xs text-orange-600">1 degraded service</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="servers">Servers</TabsTrigger>
          <TabsTrigger value="apis">APIs</TabsTrigger>
          <TabsTrigger value="events">Events</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Uptime & Response Time</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={uptimeData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis yAxisId="left" domain={[99, 100]} />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip />
                    <Legend />
                    <Line
                      yAxisId="left"
                      type="monotone"
                      dataKey="uptime"
                      stroke="#10b981"
                      strokeWidth={2}
                      name="Uptime %"
                    />
                    <Line
                      yAxisId="right"
                      type="monotone"
                      dataKey="responseTime"
                      stroke="#3b82f6"
                      strokeWidth={2}
                      name="Response Time (ms)"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent System Events</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {systemEvents.map((event) => (
                    <div
                      key={event.id}
                      className="flex items-start gap-3 p-3 border border-slate-200 rounded-lg"
                    >
                      <div className="mt-0.5">{getEventIcon(event.type)}</div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-slate-900 mb-1">{event.message}</p>
                        <div className="flex items-center gap-2 text-xs text-slate-600">
                          <Badge variant="outline" className="text-xs">
                            {event.service}
                          </Badge>
                          <span>•</span>
                          <span>{event.timestamp}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 rounded-lg bg-blue-100">
                    <Database className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-600">Database</p>
                    <p className="text-xl text-slate-900">Healthy</p>
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Storage Used</span>
                    <span className="font-medium">2.3 TB / 5 TB</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Connections</span>
                    <span className="font-medium">342 / 1000</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 rounded-lg bg-purple-100">
                    <Globe className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-600">CDN</p>
                    <p className="text-xl text-slate-900">Healthy</p>
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Requests/min</span>
                    <span className="font-medium">12.4k</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Cache Hit Rate</span>
                    <span className="font-medium">94.2%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 rounded-lg bg-green-100">
                    <Shield className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-600">Security</p>
                    <p className="text-xl text-slate-900">Secured</p>
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Threats Blocked</span>
                    <span className="font-medium">1,245</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">SSL Grade</span>
                    <span className="font-medium">A+</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="servers" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Server Load Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={serverLoad}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="server" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="cpu" fill="#3b82f6" name="CPU %" />
                  <Bar dataKey="memory" fill="#8b5cf6" name="Memory %" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 gap-3">
            {serverLoad.map((server) => (
              <Card key={server.server}>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="p-3 rounded-lg bg-blue-100">
                        <Server className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium text-slate-900">{server.server}</p>
                        <p className="text-sm text-slate-600">
                          {server.requests.toLocaleString()} requests/hour
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="text-center">
                        <p className="text-xs text-slate-600 mb-1">CPU</p>
                        <div className="flex items-center gap-2">
                          <Cpu className="h-4 w-4 text-slate-400" />
                          <span className={`font-medium ${server.cpu > 60 ? 'text-orange-600' : 'text-slate-900'}`}>
                            {server.cpu}%
                          </span>
                        </div>
                      </div>
                      <div className="text-center">
                        <p className="text-xs text-slate-600 mb-1">Memory</p>
                        <div className="flex items-center gap-2">
                          <HardDrive className="h-4 w-4 text-slate-400" />
                          <span className={`font-medium ${server.memory > 75 ? 'text-orange-600' : 'text-slate-900'}`}>
                            {server.memory}%
                          </span>
                        </div>
                      </div>
                      <Badge className="bg-green-100 text-green-700">Healthy</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="apis" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>API Endpoint Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {apiEndpoints.map((api) => (
                  <div
                    key={api.name}
                    className="flex items-center justify-between p-4 border border-slate-200 rounded-lg"
                  >
                    <div className="flex-1">
                      <p className="font-medium text-slate-900 mb-1">{api.name}</p>
                      <div className="flex items-center gap-4 text-sm text-slate-600">
                        <span>Uptime: {api.uptime}%</span>
                        <span>•</span>
                        <span>Avg Response: {api.avgResponse}ms</span>
                      </div>
                    </div>
                    <Badge variant={getStatusColor(api.status)}>
                      {api.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-sm text-slate-600 mb-2">Total API Calls</p>
                  <p className="text-3xl text-slate-900 mb-1">542k</p>
                  <p className="text-xs text-slate-600">last 24 hours</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-sm text-slate-600 mb-2">Success Rate</p>
                  <p className="text-3xl text-slate-900 mb-1">99.88%</p>
                  <p className="text-xs text-green-600">+0.02% improvement</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-sm text-slate-600 mb-2">Error Rate</p>
                  <p className="text-3xl text-slate-900 mb-1">0.12%</p>
                  <p className="text-xs text-green-600">-0.03% improvement</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="events" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>System Event Log</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {systemEvents.map((event) => (
                  <div
                    key={event.id}
                    className={`p-4 rounded-lg border ${
                      event.type === 'error' ? 'bg-red-50 border-red-200' :
                      event.type === 'warning' ? 'bg-orange-50 border-orange-200' :
                      event.type === 'success' ? 'bg-green-50 border-green-200' :
                      'bg-blue-50 border-blue-200'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      {getEventIcon(event.type)}
                      <div className="flex-1">
                        <p className="font-medium text-slate-900 mb-1">{event.message}</p>
                        <div className="flex items-center gap-2 text-sm text-slate-600">
                          <Badge variant="outline">{event.service}</Badge>
                          <span>•</span>
                          <Clock className="h-3 w-3" />
                          <span>{event.timestamp}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
