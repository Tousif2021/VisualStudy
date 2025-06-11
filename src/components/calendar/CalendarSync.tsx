import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar, 
  Settings, 
  Sync, 
  CheckCircle, 
  AlertCircle, 
  ExternalLink,
  Download,
  Upload,
  Globe,
  Smartphone,
  Monitor,
  RefreshCw,
  Plus,
  X,
  Clock,
  MapPin,
  Users
} from 'lucide-react';
import { Button } from '../ui/Button';
import { Card, CardBody, CardHeader } from '../ui/Card';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { useAppStore } from '../../lib/store';

interface CalendarProvider {
  id: string;
  name: string;
  icon: React.ReactNode;
  color: string;
  connected: boolean;
  lastSync?: string;
  syncUrl?: string;
}

interface SyncSettings {
  autoSync: boolean;
  syncInterval: number; // in minutes
  includeCompleted: boolean;
  defaultCalendar: string;
  reminderTime: number; // minutes before
}

export const CalendarSync: React.FC = () => {
  const { tasks, courses, user } = useAppStore();
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'providers' | 'settings' | 'export'>('providers');
  const [syncing, setSyncing] = useState<string | null>(null);
  const [syncSettings, setSyncSettings] = useState<SyncSettings>({
    autoSync: true,
    syncInterval: 60,
    includeCompleted: false,
    defaultCalendar: 'google',
    reminderTime: 15
  });

  const [calendarProviders, setCalendarProviders] = useState<CalendarProvider[]>([
    {
      id: 'google',
      name: 'Google Calendar',
      icon: <Globe size={20} className="text-blue-600" />,
      color: 'from-blue-500 to-blue-600',
      connected: false,
      lastSync: undefined
    },
    {
      id: 'outlook',
      name: 'Microsoft Outlook',
      icon: <Monitor size={20} className="text-blue-700" />,
      color: 'from-blue-600 to-indigo-600',
      connected: false,
      lastSync: undefined
    },
    {
      id: 'apple',
      name: 'Apple Calendar',
      icon: <Smartphone size={20} className="text-gray-700" />,
      color: 'from-gray-500 to-gray-600',
      connected: false,
      lastSync: undefined
    },
    {
      id: 'ical',
      name: 'iCal/ICS Export',
      icon: <Download size={20} className="text-green-600" />,
      color: 'from-green-500 to-green-600',
      connected: true,
      lastSync: 'Always available'
    }
  ]);

  // Generate ICS calendar data
  const generateICSData = () => {
    const now = new Date();
    const formatDate = (date: Date) => {
      return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    };

    let icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//VisualStudy//StudyTasks//EN',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH',
      'X-WR-CALNAME:VisualStudy Tasks',
      'X-WR-CALDESC:Study tasks and assignments from VisualStudy'
    ];

    tasks.forEach(task => {
      const dueDate = new Date(task.due_date);
      const startDate = new Date(dueDate.getTime() - (60 * 60 * 1000)); // 1 hour before due
      const course = courses.find(c => c.id === task.course_id);
      
      icsContent.push(
        'BEGIN:VEVENT',
        `UID:${task.id}@visualstudy.app`,
        `DTSTART:${formatDate(startDate)}`,
        `DTEND:${formatDate(dueDate)}`,
        `SUMMARY:${task.title}`,
        `DESCRIPTION:${task.description}${course ? `\\n\\nCourse: ${course.name}` : ''}`,
        `PRIORITY:${task.priority === 'high' ? '1' : task.priority === 'medium' ? '5' : '9'}`,
        `STATUS:${task.status === 'completed' ? 'COMPLETED' : 'CONFIRMED'}`,
        `CATEGORIES:Study,${task.priority.toUpperCase()}${course ? `,${course.name}` : ''}`,
        `CREATED:${formatDate(new Date(task.created_at || now))}`,
        `LAST-MODIFIED:${formatDate(now)}`,
        'END:VEVENT'
      );
    });

    icsContent.push('END:VCALENDAR');
    return icsContent.join('\r\n');
  };

  // Download ICS file
  const downloadICS = () => {
    const icsData = generateICSData();
    const blob = new Blob([icsData], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'visualstudy-tasks.ics';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Generate webcal URL for subscription
  const generateWebcalURL = () => {
    // In a real implementation, this would be a server endpoint that generates the ICS feed
    return `webcal://api.visualstudy.app/calendar/${user?.id}/tasks.ics`;
  };

  // Copy webcal URL to clipboard
  const copyWebcalURL = async () => {
    const url = generateWebcalURL();
    try {
      await navigator.clipboard.writeText(url);
      alert('Calendar subscription URL copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy URL:', err);
    }
  };

  // Simulate calendar provider connection
  const connectProvider = async (providerId: string) => {
    setSyncing(providerId);
    
    // Simulate OAuth flow
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setCalendarProviders(prev => 
      prev.map(provider => 
        provider.id === providerId 
          ? { ...provider, connected: true, lastSync: new Date().toLocaleString() }
          : provider
      )
    );
    
    setSyncing(null);
  };

  // Disconnect provider
  const disconnectProvider = (providerId: string) => {
    setCalendarProviders(prev => 
      prev.map(provider => 
        provider.id === providerId 
          ? { ...provider, connected: false, lastSync: undefined }
          : provider
      )
    );
  };

  // Manual sync
  const manualSync = async (providerId: string) => {
    setSyncing(providerId);
    
    // Simulate sync process
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setCalendarProviders(prev => 
      prev.map(provider => 
        provider.id === providerId 
          ? { ...provider, lastSync: new Date().toLocaleString() }
          : provider
      )
    );
    
    setSyncing(null);
  };

  const syncIntervalOptions = [
    { value: '15', label: 'Every 15 minutes' },
    { value: '30', label: 'Every 30 minutes' },
    { value: '60', label: 'Every hour' },
    { value: '180', label: 'Every 3 hours' },
    { value: '360', label: 'Every 6 hours' },
    { value: '720', label: 'Every 12 hours' },
    { value: '1440', label: 'Daily' }
  ];

  const reminderOptions = [
    { value: '0', label: 'No reminder' },
    { value: '5', label: '5 minutes before' },
    { value: '15', label: '15 minutes before' },
    { value: '30', label: '30 minutes before' },
    { value: '60', label: '1 hour before' },
    { value: '120', label: '2 hours before' },
    { value: '1440', label: '1 day before' }
  ];

  return (
    <>
      {/* Calendar Sync Button */}
      <Button
        onClick={() => setIsOpen(true)}
        leftIcon={<Calendar size={16} />}
        variant="outline"
        className="border-purple-200 text-purple-600 hover:bg-purple-50"
      >
        Calendar Sync
      </Button>

      {/* Calendar Sync Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-4xl mx-4 max-h-[90vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <Card className="bg-white shadow-2xl">
                <CardHeader className="flex justify-between items-center border-b bg-gradient-to-r from-purple-50 to-blue-50">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center">
                      <Calendar size={20} className="text-white" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold">Calendar Integration</h2>
                      <p className="text-sm text-gray-600">Sync your study tasks with external calendars</p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsOpen(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X size={20} />
                  </Button>
                </CardHeader>

                <CardBody className="p-0">
                  {/* Tabs */}
                  <div className="flex border-b">
                    {[
                      { id: 'providers', label: 'Calendar Providers', icon: <Globe size={16} /> },
                      { id: 'settings', label: 'Sync Settings', icon: <Settings size={16} /> },
                      { id: 'export', label: 'Export & Subscribe', icon: <Download size={16} /> }
                    ].map(tab => (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors ${
                          activeTab === tab.id
                            ? 'text-purple-600 border-b-2 border-purple-600 bg-purple-50'
                            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                        }`}
                      >
                        {tab.icon}
                        {tab.label}
                      </button>
                    ))}
                  </div>

                  <div className="p-6 max-h-[60vh] overflow-y-auto">
                    {/* Calendar Providers Tab */}
                    {activeTab === 'providers' && (
                      <div className="space-y-4">
                        <div className="mb-6">
                          <h3 className="text-lg font-semibold mb-2">Connect Your Calendars</h3>
                          <p className="text-gray-600">Connect your favorite calendar applications to automatically sync your study tasks and deadlines.</p>
                        </div>

                        <div className="grid gap-4">
                          {calendarProviders.map(provider => (
                            <motion.div
                              key={provider.id}
                              layout
                              className={`p-4 rounded-xl border-2 transition-all ${
                                provider.connected
                                  ? 'border-green-300 bg-green-50'
                                  : 'border-gray-200 bg-gray-50 hover:border-gray-300'
                              }`}
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                  <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${provider.color} flex items-center justify-center shadow-lg`}>
                                    {provider.icon}
                                  </div>
                                  <div>
                                    <h4 className="font-semibold text-gray-900">{provider.name}</h4>
                                    <div className="flex items-center gap-2 mt-1">
                                      {provider.connected ? (
                                        <>
                                          <CheckCircle size={14} className="text-green-600" />
                                          <span className="text-sm text-green-600">Connected</span>
                                          {provider.lastSync && (
                                            <span className="text-xs text-gray-500">• Last sync: {provider.lastSync}</span>
                                          )}
                                        </>
                                      ) : (
                                        <>
                                          <AlertCircle size={14} className="text-gray-400" />
                                          <span className="text-sm text-gray-500">Not connected</span>
                                        </>
                                      )}
                                    </div>
                                  </div>
                                </div>

                                <div className="flex items-center gap-2">
                                  {provider.connected && provider.id !== 'ical' && (
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => manualSync(provider.id)}
                                      disabled={syncing === provider.id}
                                      leftIcon={
                                        syncing === provider.id ? (
                                          <RefreshCw className="animate-spin" size={14} />
                                        ) : (
                                          <Sync size={14} />
                                        )
                                      }
                                    >
                                      {syncing === provider.id ? 'Syncing...' : 'Sync Now'}
                                    </Button>
                                  )}
                                  
                                  {provider.id !== 'ical' && (
                                    <Button
                                      size="sm"
                                      variant={provider.connected ? 'outline' : 'primary'}
                                      onClick={() => 
                                        provider.connected 
                                          ? disconnectProvider(provider.id)
                                          : connectProvider(provider.id)
                                      }
                                      disabled={syncing === provider.id}
                                      className={provider.connected ? 'text-red-600 border-red-300 hover:bg-red-50' : ''}
                                    >
                                      {provider.connected ? 'Disconnect' : 'Connect'}
                                    </Button>
                                  )}
                                </div>
                              </div>

                              {provider.id === 'ical' && (
                                <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                                  <p className="text-sm text-blue-700">
                                    Export your tasks as an ICS file or subscribe to a live calendar feed that updates automatically.
                                  </p>
                                </div>
                              )}
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Sync Settings Tab */}
                    {activeTab === 'settings' && (
                      <div className="space-y-6">
                        <div>
                          <h3 className="text-lg font-semibold mb-2">Synchronization Settings</h3>
                          <p className="text-gray-600">Configure how your tasks are synced with external calendars.</p>
                        </div>

                        <div className="space-y-4">
                          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                            <div>
                              <h4 className="font-medium">Automatic Sync</h4>
                              <p className="text-sm text-gray-600">Automatically sync tasks at regular intervals</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                checked={syncSettings.autoSync}
                                onChange={(e) => setSyncSettings(prev => ({ ...prev, autoSync: e.target.checked }))}
                                className="sr-only peer"
                              />
                              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                            </label>
                          </div>

                          <Select
                            label="Sync Interval"
                            value={syncSettings.syncInterval.toString()}
                            onChange={(value) => setSyncSettings(prev => ({ ...prev, syncInterval: parseInt(value) }))}
                            options={syncIntervalOptions}
                            disabled={!syncSettings.autoSync}
                          />

                          <Select
                            label="Default Reminder Time"
                            value={syncSettings.reminderTime.toString()}
                            onChange={(value) => setSyncSettings(prev => ({ ...prev, reminderTime: parseInt(value) }))}
                            options={reminderOptions}
                          />

                          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                            <div>
                              <h4 className="font-medium">Include Completed Tasks</h4>
                              <p className="text-sm text-gray-600">Sync completed tasks to external calendars</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                checked={syncSettings.includeCompleted}
                                onChange={(e) => setSyncSettings(prev => ({ ...prev, includeCompleted: e.target.checked }))}
                                className="sr-only peer"
                              />
                              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                            </label>
                          </div>
                        </div>

                        <div className="pt-4 border-t">
                          <Button className="bg-gradient-to-r from-purple-600 to-blue-600">
                            Save Settings
                          </Button>
                        </div>
                      </div>
                    )}

                    {/* Export & Subscribe Tab */}
                    {activeTab === 'export' && (
                      <div className="space-y-6">
                        <div>
                          <h3 className="text-lg font-semibold mb-2">Export & Subscribe</h3>
                          <p className="text-gray-600">Download your tasks or subscribe to a live calendar feed.</p>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                          {/* One-time Export */}
                          <Card className="border-2 border-blue-200 bg-blue-50">
                            <CardBody className="p-6">
                              <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                                  <Download size={20} className="text-blue-600" />
                                </div>
                                <div>
                                  <h4 className="font-semibold">One-time Export</h4>
                                  <p className="text-sm text-gray-600">Download an ICS file with current tasks</p>
                                </div>
                              </div>
                              <div className="space-y-3">
                                <p className="text-sm text-gray-700">
                                  Export your current tasks as an ICS calendar file that you can import into any calendar application.
                                </p>
                                <Button
                                  onClick={downloadICS}
                                  leftIcon={<Download size={16} />}
                                  className="w-full bg-blue-600 hover:bg-blue-700"
                                >
                                  Download ICS File
                                </Button>
                              </div>
                            </CardBody>
                          </Card>

                          {/* Live Subscription */}
                          <Card className="border-2 border-green-200 bg-green-50">
                            <CardBody className="p-6">
                              <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                                  <RefreshCw size={20} className="text-green-600" />
                                </div>
                                <div>
                                  <h4 className="font-semibold">Live Subscription</h4>
                                  <p className="text-sm text-gray-600">Subscribe to auto-updating calendar feed</p>
                                </div>
                              </div>
                              <div className="space-y-3">
                                <p className="text-sm text-gray-700">
                                  Subscribe to a live calendar feed that automatically updates when you add or modify tasks.
                                </p>
                                <div className="space-y-2">
                                  <Button
                                    onClick={copyWebcalURL}
                                    leftIcon={<ExternalLink size={16} />}
                                    className="w-full bg-green-600 hover:bg-green-700"
                                  >
                                    Copy Subscription URL
                                  </Button>
                                  <div className="text-xs text-gray-600 bg-white p-2 rounded border">
                                    <code className="break-all">{generateWebcalURL()}</code>
                                  </div>
                                </div>
                              </div>
                            </CardBody>
                          </Card>
                        </div>

                        {/* Instructions */}
                        <Card className="bg-gray-50">
                          <CardBody className="p-6">
                            <h4 className="font-semibold mb-3">How to Add to Your Calendar</h4>
                            <div className="space-y-4 text-sm">
                              <div>
                                <h5 className="font-medium text-blue-600">Google Calendar:</h5>
                                <p className="text-gray-700">Settings → Add calendar → From URL → Paste the subscription URL</p>
                              </div>
                              <div>
                                <h5 className="font-medium text-blue-600">Apple Calendar:</h5>
                                <p className="text-gray-700">File → New Calendar Subscription → Paste the subscription URL</p>
                              </div>
                              <div>
                                <h5 className="font-medium text-blue-600">Outlook:</h5>
                                <p className="text-gray-700">Add calendar → Subscribe from web → Paste the subscription URL</p>
                              </div>
                            </div>
                          </CardBody>
                        </Card>
                      </div>
                    )}
                  </div>
                </CardBody>
              </Card>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};