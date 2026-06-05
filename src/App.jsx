import { useState, useEffect, useRef } from 'react';
import { 
  Download, Maximize2, X, Plus, MessageSquare, AlertTriangle, 
  Moon, Sun, BarChart3, Trash2, RefreshCw, ChevronRight,
  ExternalLink
} from 'lucide-react';

// --- CONFIG ---
const STORAGE_KEY = 'execution_dashboard_v1';
const THEME_KEY = 'execution_dashboard_theme';
const PIN_KEY = 'execution_dashboard_pin';
const PIN_SKIPPED_KEY = 'execution_dashboard_pin_skipped';

const TAG_COLORS = {
  completed: 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300',
  'deep work': 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300',
  technical: 'bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300',
  'attention issue': 'bg-orange-100 text-orange-800 dark:bg-orange-900/40 dark:text-orange-300',
  missed: 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300',
  archived: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300',
  project: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900/40 dark:text-cyan-300',
  'review needed': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300',
  default: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400'
};

const OUTPUT_CATEGORIES = ['DSA', 'GATE', 'ML', 'Python', 'Project', 'Hardware', 'Communication', 'Internship', 'Other'];
const FREQUENCIES = [
  { value: 'daily', label: 'Every Day' },
  { value: 'weekdays', label: 'Weekdays (Mon–Fri)' },
  { value: 'weekends', label: 'Weekends (Sat–Sun)' },
  { value: 'custom', label: 'Custom Days' },
];
const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const DEFAULT_DATA = {
  habits: [],
  deepWork: [],
  oneThing: [],
  dsa: [],
  gate: [],
  ml: [],
  projects: [],
  antiDmn: [],
  someday: [],
  outputLog: [],
  pivotTimeline: [],
  realityCheck: [],
  completedOutputs: [],
  currentFocus: '',
  weeklyReset: { moved: '', friction: '', remove: '' }
};

const generateId = () => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID();
  return Math.random().toString(36).substring(2, 9) + Date.now().toString(36);
};

// --- UI PRIMITIVES ---

const Tag = ({ value, onChange, editable = false }) => {
  const safeValue = typeof value === 'string' ? value.toLowerCase() : 'default';
  const colorClass = TAG_COLORS[safeValue] || TAG_COLORS.default;
  
  if (!editable) {
    return <span className={`px-2.5 py-1 rounded-full text-xs font-semibold tracking-wide uppercase ${colorClass}`}>{value || 'none'}</span>;
  }
  return (
    <div className="relative inline-block">
      <select 
        value={safeValue} 
        onChange={(e) => onChange(e.target.value)}
        className={`px-2.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wide cursor-pointer appearance-none border-none outline-none focus:ring-2 focus:ring-blue-500/50 ${colorClass}`}
      >
        <option value="default" className="bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200">NONE</option>
        {Object.keys(TAG_COLORS).filter(k => k !== 'default').map(k => (
          <option key={k} value={k} className="bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200">{k.toUpperCase()}</option>
        ))}
      </select>
    </div>
  );
};

const EditableCell = ({ value, onChange, placeholder = "", type = "text", inputMode }) => (
  <input
    type={type}
    inputMode={inputMode}
    value={value || ""}
    onChange={(e) => onChange(e.target.value)}
    placeholder={placeholder}
    className="w-full bg-transparent border-b border-transparent hover:border-gray-200 dark:hover:border-gray-800 focus:border-blue-500 focus:bg-gray-50 dark:focus:bg-gray-900 outline-none rounded px-1.5 py-1 text-sm text-gray-800 dark:text-gray-100 transition-all duration-150"
  />
);

// --- MAIN APP ---

export default function App() {
  const [isDark, setIsDark] = useState(() => {
    try {
      const saved = localStorage.getItem(THEME_KEY);
      return saved ? JSON.parse(saved) : true; // Default to dark mode for premium look
    } catch {
      return true;
    }
  });

  const [activeTab, setActiveTab] = useState('execution');
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [showWeeklyReset, setShowWeeklyReset] = useState(false);
  const [showImportConfirm, setShowImportConfirm] = useState(false);
  const [pendingImportData, setPendingImportData] = useState(null);
  const fileInputRef = useRef(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [calendarMonth, setCalendarMonth] = useState(new Date().getMonth());
  const [calendarYear, setCalendarYear] = useState(new Date().getFullYear());

  // PIN Lock: 'locked' = have PIN, need to unlock | 'unlocked' = app accessible | 'setup' = no PIN, prompt to set
  const [pinStatus, setPinStatus] = useState(() => {
    if (localStorage.getItem(PIN_KEY)) return 'locked';
    if (localStorage.getItem(PIN_SKIPPED_KEY)) return 'unlocked';
    return 'setup';
  });
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState(false);
  const [pinConfirm, setPinConfirm] = useState('');

  // New Habit Modal
  const [showNewHabit, setShowNewHabit] = useState(false);
  const [newHabitName, setNewHabitName] = useState('');
  const [newHabitFreq, setNewHabitFreq] = useState('daily');
  const [newHabitDays, setNewHabitDays] = useState([1, 2, 3, 4, 5]);
  const [newHabitStartDate, setNewHabitStartDate] = useState(() => {
    const d = new Date();
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  });
  const [newHabitEndDate, setNewHabitEndDate] = useState('');

  // Load Main Data
  const [data, setData] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (!saved) return DEFAULT_DATA;
      const parsed = JSON.parse(saved);
      const todayD = new Date();
      const todayStr = `${todayD.getFullYear()}-${String(todayD.getMonth() + 1).padStart(2, '0')}-${String(todayD.getDate()).padStart(2, '0')}`;
      if (Array.isArray(parsed.habits)) {
        parsed.habits = parsed.habits.map(h => {
          if (h.status !== undefined && !h.completions) {
            const completions = {};
            if (h.status === '✓' || h.status === '✗') completions[todayStr] = h.status;
            const rest = { ...h };
            delete rest.status;
            return { ...rest, completions };
          }
          return h;
        });
      }
      return parsed;
    } catch {
      return DEFAULT_DATA;
    }
  });

  // Persist Theme
  useEffect(() => {
    localStorage.setItem(THEME_KEY, JSON.stringify(isDark));
  }, [isDark]);

  // Persist Data (debounced 400ms — avoid stringify on every keystroke)
  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      } catch (err) {
        console.warn('Failed to persist dashboard data', err);
      }
    }, 400);
    return () => clearTimeout(timer);
  }, [data]);

  // Flush pending write on tab close so the latest edit isn't lost
  useEffect(() => {
    const flush = () => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      } catch {
        // Storage may be full or unavailable; nothing we can do on unload
      }
    };
    window.addEventListener('beforeunload', flush);
    window.addEventListener('pagehide', flush);
    return () => {
      window.removeEventListener('beforeunload', flush);
      window.removeEventListener('pagehide', flush);
    };
  }, [data]);

  // Exports
  const handleExportJSON = () => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `execution_dashboard_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setSelectedRecord(null);
        setShowResetConfirm(false);
        setShowWeeklyReset(false);
        setShowImportConfirm(false);
        setShowNewHabit(false);
        setPendingImportData(null);
      }
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'e') {
        e.preventDefault();
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `execution_dashboard_${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [data]);

  // PIN Lock helpers
  const simpleHash = (str) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash |= 0;
    }
    return 'pin_' + Math.abs(hash).toString(36);
  };

  const handleSetPin = () => {
    if (pinInput.length >= 4 && pinInput === pinConfirm) {
      localStorage.setItem(PIN_KEY, simpleHash(pinInput));
      localStorage.removeItem(PIN_SKIPPED_KEY);
      setPinStatus('unlocked');
      setPinInput('');
      setPinConfirm('');
      setPinError(false);
    } else {
      setPinError(true);
    }
  };

  const handleUnlock = () => {
    const stored = localStorage.getItem(PIN_KEY);
    if (stored === simpleHash(pinInput)) {
      setPinStatus('unlocked');
      setPinInput('');
      setPinError(false);
    } else {
      setPinError(true);
      setPinInput('');
    }
  };

  const handleSkipPin = () => {
    localStorage.setItem(PIN_SKIPPED_KEY, '1');
    setPinStatus('unlocked');
  };

  const handleForgotPin = () => {
    localStorage.removeItem(PIN_KEY);
    setPinStatus('unlocked');
  };

  const handlePinKeyDown = (e) => {
    if (e.key === 'Enter') {
      if (pinStatus === 'setup') {
        handleSetPin();
      } else if (pinStatus === 'locked') {
        handleUnlock();
      }
    }
  };

  // --- PIN LOCK SCREEN ---
  const renderLockScreen = () => {
    if (pinStatus === 'unlocked') return null;
    return (
      <div className="fixed inset-0 bg-[#060606] flex items-center justify-center z-[100] p-4">
        <div className="w-full max-w-sm text-center">
          <div className="mb-6">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gray-900 border border-gray-800 flex items-center justify-center">
              <span className="text-2xl">🔒</span>
            </div>
            <h1 className="text-xl font-black text-white tracking-tight">EXECUTION DASHBOARD</h1>
            <p className="text-xs text-gray-500 mt-1">
              {pinStatus === 'setup' ? 'Set a PIN to protect your data' : 'Enter PIN to unlock'}
            </p>
          </div>

          {pinStatus === 'setup' ? (
            <div className="space-y-3">
              <input
                type="password"
                inputMode="numeric"
                maxLength={8}
                value={pinInput}
                onChange={(e) => { setPinInput(e.target.value.replace(/\D/g, '')); setPinError(false); }}
                onKeyDown={handlePinKeyDown}
                placeholder="Set PIN (4+ digits)"
                autoFocus
                className="w-full p-3 bg-gray-900 border border-gray-800 focus:border-blue-500 rounded-xl outline-none text-center text-lg tracking-[0.3em] text-white placeholder-gray-600 transition-all"
              />
              <input
                type="password"
                inputMode="numeric"
                maxLength={8}
                value={pinConfirm}
                onChange={(e) => { setPinConfirm(e.target.value.replace(/\D/g, '')); setPinError(false); }}
                onKeyDown={handlePinKeyDown}
                placeholder="Confirm PIN"
                className="w-full p-3 bg-gray-900 border border-gray-800 focus:border-blue-500 rounded-xl outline-none text-center text-lg tracking-[0.3em] text-white placeholder-gray-600 transition-all"
              />
              {pinError && <p className="text-xs text-red-400">PINs don't match or too short (min 4 digits)</p>}
              <button
                onClick={handleSetPin}
                className="w-full p-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-sm transition-colors"
              >
                Set PIN & Enter
              </button>
              <button
                onClick={handleSkipPin}
                className="text-xs text-gray-600 hover:text-gray-400 transition-colors"
              >
                Skip — no PIN
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              <input
                type="password"
                inputMode="numeric"
                maxLength={8}
                value={pinInput}
                onChange={(e) => { setPinInput(e.target.value.replace(/\D/g, '')); setPinError(false); }}
                onKeyDown={handlePinKeyDown}
                placeholder="Enter PIN"
                autoFocus
                className="w-full p-3 bg-gray-900 border border-gray-800 focus:border-blue-500 rounded-xl outline-none text-center text-lg tracking-[0.3em] text-white placeholder-gray-600 transition-all"
              />
              {pinError && <p className="text-xs text-red-400">Wrong PIN</p>}
              <button
                onClick={handleUnlock}
                className="w-full p-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-sm transition-colors"
              >
                Unlock
              </button>
              <button
                onClick={handleForgotPin}
                className="text-xs text-gray-600 hover:text-gray-400 transition-colors"
              >
                Forgot PIN? Reset
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };

  // State helpers
  const updateItem = (section, id, field, value) => {
    setData(prev => ({
      ...prev,
      [section]: prev[section].map(item => item.id === id ? { ...item, [field]: value } : item)
    }));
  };

  const updateDetails = (section, id, field, value) => {
    setData(prev => ({
      ...prev,
      [section]: prev[section].map(item => 
        item.id === id ? { ...item, details: { ...(item.details || {}), [field]: value } } : item
      )
    }));
  };

  const addItem = (section, template) => {
    setData(prev => ({ 
      ...prev, 
      [section]: [...prev[section], { ...template, id: generateId() }] 
    }));
  };

  const deleteItem = (section, id) => {
    setData(prev => ({
      ...prev,
      [section]: prev[section].filter(item => item.id !== id)
    }));
  };

  const openNewHabitModal = () => {
    const today = new Date();
    setNewHabitName('');
    setNewHabitFreq('daily');
    setNewHabitDays([1, 2, 3, 4, 5]);
    setNewHabitStartDate(formatMonthDay(today.getFullYear(), today.getMonth(), today.getDate()));
    setNewHabitEndDate('');
    setShowNewHabit(true);
  };

  const handleCreateHabit = () => {
    const name = newHabitName.trim();
    if (!name) return;
    const freq = newHabitFreq;
    const days = freq === 'weekdays' ? [1, 2, 3, 4, 5]
      : freq === 'weekends' ? [0, 6]
      : freq === 'custom' ? newHabitDays
      : [0, 1, 2, 3, 4, 5, 6];
    addItem('habits', {
      habit: name,
      status: '-',
      tag: 'default',
      frequency: freq,
      days,
      startDate: newHabitStartDate,
      endDate: newHabitEndDate,
      details: {}
    });
    setShowNewHabit(false);
  };

  const cycleHabitStatus = (id) => {
    const today = todayISO();
    const nextMap = { '-': '✓', '✓': '✗', '✗': '-' };
    setData(prev => ({
      ...prev,
      habits: prev.habits.map(item => {
        if (item.id !== id) return item;
        const completions = { ...(item.completions || {}) };
        const cur = completions[today] || '-';
        const next = nextMap[cur] || '-';
        if (next === '-') delete completions[today];
        else completions[today] = next;
        return { ...item, completions };
      })
    }));
  };

  const updateWeeklyReset = (field, value) => {
    setData(prev => ({ ...prev, weeklyReset: { ...prev.weeklyReset, [field]: value } }));
  };

  const updateCurrentFocus = (value) => {
    setData(prev => ({ ...prev, currentFocus: value }));
  };

  const resetAllData = () => {
    setData(DEFAULT_DATA);
    setShowResetConfirm(false);
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelected = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const imported = JSON.parse(event.target.result);
        if (imported && typeof imported === 'object' && imported.habits) {
          setPendingImportData(imported);
          setShowImportConfirm(true);
        } else {
          alert('Invalid dashboard data file. Make sure it has the required sections.');
        }
      } catch {
        alert('Could not parse file. Please select a valid JSON export.');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const confirmImport = () => {
    if (pendingImportData) {
      setData(pendingImportData);
      setPendingImportData(null);
      setShowImportConfirm(false);
    }
  };

  const handleExportCSV = () => {
    let rows = [], headers = [], filename = '';
    
    if (activeTab === 'execution') {
      filename = 'daily_execution.csv';
      headers = ['Type', 'Item', 'Status/Value', 'Tag/Metric'];
      rows = [
        ...data.habits.map(h => ['Habit', h.habit, h.status, h.tag]),
        ...data.deepWork.map(d => ['DeepWork', `${d.date} | ${d.task}`, `Planned:${d.planned} Actual:${d.actual}`, `Focus:${d.focus}`]),
        ...data.oneThing.map(o => ['OneThing', o.date, o.moved, ''])
      ];
    } else if (activeTab === 'technical') {
      filename = 'technical_progression.csv';
      headers = ['Category', 'Item', 'Col1', 'Col2', 'Col3', 'Tag'];
      rows = [
        ...data.dsa.map(i => ['DSA', i.topic, i.problems, i.weakness, '', i.tag]),
        ...data.gate.map(i => ['GATE', i.subject, i.theory, i.pyq, i.confidence, i.tag]),
        ...data.ml.map(i => ['ML', i.topic, i.built, i.understood, '', i.tag]),
        ...data.projects.map(i => ['Project', i.project, i.status, '', '', i.tag])
      ];
    } else if (activeTab === 'antiDmn') {
      filename = 'anti_dmn.csv';
      headers = ['Trigger', 'What Happened', 'Recovery', 'Tag'];
      rows = [
        ...data.antiDmn.map(i => [i.trigger, i.happened, i.recovery, i.tag]),
        ...data.someday.map(i => ['SOMEDAY', i.idea, i.logged ? 'logged' : 'parked', ''])
      ];
    } else if (activeTab === 'review') {
      filename = 'weekly_review.csv';
      headers = ['Metric', 'Value'];
      const s = weeklyStats;
      rows = [
        ['DSA Problems Total', s.dsaTotal],
        ['GATE PYQs Total', s.pyqTotal],
        ['Habits Completed', s.habitsDone],
        ['Deep Work Minutes', s.deepWorkMins],
        ['Distractions Logged', s.distractions],
        ['Outputs Logged', data.outputLog.length],
        ...data.completedOutputs.map(o => ['Completed Output', `${o.title} (${o.type})`, o.url, o.date])
      ];
    } else if (activeTab === 'outputMomentum') {
      filename = 'output_momentum.csv';
      headers = ['Date', 'Category', 'Quantity', 'Evidence'];
      rows = [
        ...data.outputLog.map(o => [o.date, o.category, o.quantity, o.evidence]),
        ...data.pivotTimeline.map(p => [p.date, 'Pivot', p.decision, '']),
        ...data.realityCheck.map(r => [r.date, 'Reality', `Learned:${r.learned} Built:${r.built} Shipped:${r.shipped}`, '']),
      ];
    }
    
    const csv = '\ufeff' + [headers.join(','), ...rows.map(r => r.map(c => `"${String(c).replace(/"/g, '""')}"`).join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Calendar helpers
  const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  const DAYS = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

  const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();

  const formatMonthDay = (year, month, day) => {
    const date = new Date(year, month, day);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const toISODate = (year, month, day) => {
    return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  };

  const isoToYMD = (iso) => {
    const [y, m, d] = iso.split('-').map(Number);
    return { year: y, month: m - 1, day: d };
  };

  const formatDisplayDate = (iso) => {
    const { year, month, day } = isoToYMD(iso);
    return new Date(year, month, day).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const todayISO = () => {
    const d = new Date();
    return toISODate(d.getFullYear(), d.getMonth(), d.getDate());
  };

  const getDueHabitsForSelectedDate = () => {
    if (!selectedDate) return [];
    const { year, month, day } = isoToYMD(selectedDate);
    return data.habits.filter(h => isHabitDueOnDate(h, year, month, day));
  };

  const isHabitDueOnDate = (habit, year, month, day) => {
    if (!habit.frequency && !habit.days) return false;
    const date = new Date(year, month, day);
    const dow = date.getDay();
    if (habit.startDate && new Date(habit.startDate + ', ' + year) > date) return false;
    if (habit.endDate && new Date(habit.endDate + ', ' + year) < date) return false;
    const days = habit.days && habit.days.length > 0 ? habit.days : [0, 1, 2, 3, 4, 5, 6];
    return days.includes(dow);
  };

  const getEntriesForDate = (isoDate) => {
    const { year, month, day } = isoToYMD(isoDate);
    const textDate = formatMonthDay(year, month, day);
    const entries = [];
    data.deepWork.forEach(d => { if (d.date === textDate) entries.push({ type: 'Deep Work', text: d.task }); });
    data.oneThing.forEach(o => { if (o.date === textDate) entries.push({ type: 'Output', text: o.moved }); });
    data.outputLog.forEach(o => { if (o.date === textDate) entries.push({ type: 'Output Log', text: `${o.category}: ${o.quantity}` }); });
    data.antiDmn.forEach(a => { if (a.date === textDate) entries.push({ type: 'DMN', text: a.trigger }); });
    data.realityCheck.forEach(r => { if (r.date === textDate) entries.push({ type: 'Reality Check', text: `Learned: ${r.learned || '-'} | Built: ${r.built || '-'}` }); });
    data.habits.forEach(h => {
      if (h.completions && h.completions[isoDate]) {
        entries.push({ type: 'Habit', text: `${h.habit} (${h.completions[isoDate]})` });
      }
    });
    return entries;
  };

  const hasEntriesOnDay = (year, month, day) => {
    const isoDate = toISODate(year, month, day);
    if (getEntriesForDate(isoDate).length > 0) return true;
    return data.habits.some(h => isHabitDueOnDate(h, year, month, day));
  };

  // Weekly stats (depends on calendar helpers)
  const dsaTotal = data.dsa.reduce((sum, i) => sum + (parseInt(i.problems) || 0), 0);
  const pyqTotal = data.gate.reduce((sum, i) => sum + (parseInt(i.pyq) || 0), 0);
  const habitsDone = (() => {
    const todayStr = todayISO();
    return data.habits.filter(h => h.completions && h.completions[todayStr] === '✓').length;
  })();
  const deepWorkMins = data.deepWork.reduce((sum, i) => sum + (parseInt(i.actual) || 0), 0);
  const weeklyStats = {
    dsaTotal,
    pyqTotal,
    habitsDone,
    deepWorkMins,
    distractions: data.antiDmn.length,
    outputs: data.oneThing.length
  };

  // --- RENDERERS ---

  const renderExecution = () => (
    <div className="space-y-8 animate-fade-in">
      {/* System Warning briefing card */}
      <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-5 text-sm shadow-sm">
        <div className="flex flex-col md:flex-row gap-5 md:gap-8">
          <div className="flex-1">
            <h3 className="font-bold text-amber-800 dark:text-amber-400 flex items-center gap-2 mb-2 text-base">
              <AlertTriangle className="text-amber-500" size={18} /> OPERATIONAL GUIDELINES
            </h3>
            <p className="text-gray-700 dark:text-gray-300 mb-2 leading-relaxed">
              <strong className="text-amber-600 dark:text-amber-500">CRITICAL FOCUS:</strong> Prevent analytical paralysis. Track execution, feedback loops, and pure performance metrics.
            </p>
            <p className="text-gray-600 dark:text-gray-400 text-xs">
              Avoid log-bloat. Optimize for time-to-output over time-spent tracking.
            </p>
          </div>
          <div className="flex-1 md:border-l border-amber-500/10 md:pl-8">
            <h3 className="font-bold text-gray-800 dark:text-gray-200 mb-2 text-base">GLOSSARY</h3>
            <ul className="text-gray-600 dark:text-gray-300 space-y-2 text-xs leading-relaxed">
              <li><strong className="text-gray-800 dark:text-gray-100">One Thing Moved:</strong> The absolute single concrete artifact built today.</li>
              <li><strong className="text-gray-800 dark:text-gray-100">DMN Loop:</strong> High-arousal passive loops (e.g., social feed spirals, news drift).</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Daily Calendar */}
      <section className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800/80 rounded-xl p-4 sm:p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base sm:text-lg font-bold text-gray-800 dark:text-gray-100">Daily Calendar</h2>
          <div className="flex items-center gap-2">
            <button onClick={() => { setCalendarMonth(m => m === 0 ? 11 : m - 1); if (calendarMonth === 0) setCalendarYear(y => y - 1); }} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400 touch-target">
              <ChevronRight size={16} className="rotate-180" />
            </button>
            <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 min-w-[120px] text-center">{MONTHS[calendarMonth]} {calendarYear}</span>
            <button onClick={() => { setCalendarMonth(m => m === 11 ? 0 : m + 1); if (calendarMonth === 11) setCalendarYear(y => y + 1); }} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400 touch-target">
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
        <div className="grid grid-cols-7 gap-1 mb-2">
          {DAYS.map(d => (
            <div key={d} className="text-center text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase py-1">{d}</div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {Array.from({ length: getFirstDayOfMonth(calendarYear, calendarMonth) }).map((_, i) => (
            <div key={`empty-${i}`} className="aspect-square"></div>
          ))}
          {Array.from({ length: getDaysInMonth(calendarYear, calendarMonth) }).map((_, i) => {
            const day = i + 1;
            const isoDate = toISODate(calendarYear, calendarMonth, day);
            const hasEntries = hasEntriesOnDay(calendarYear, calendarMonth, day);
            const isSelected = selectedDate === isoDate;
            const isToday = new Date().getDate() === day && new Date().getMonth() === calendarMonth && new Date().getFullYear() === calendarYear;
            return (
              <button
                key={day}
                onClick={() => setSelectedDate(isSelected ? null : isoDate)}
                className={`aspect-square rounded-lg flex flex-col items-center justify-center text-sm relative transition-all touch-target ${
                  isSelected
                    ? 'bg-blue-500 text-white font-bold shadow-md shadow-blue-500/20'
                    : isToday
                    ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-semibold border border-blue-200 dark:border-blue-800'
                    : hasEntries
                    ? 'bg-green-50 dark:bg-green-900/20 text-gray-800 dark:text-gray-200 font-medium'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'
                }`}
              >
                {day}
                {hasEntries && !isSelected && (
                  <span className="w-1 h-1 rounded-full bg-green-500 absolute bottom-1"></span>
                )}
              </button>
            );
          })}
        </div>

        {/* Selected Date Entries */}
        {selectedDate && (
          <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800 animate-fade-in">
            <h3 className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Entries for {formatDisplayDate(selectedDate)}</h3>
            {getEntriesForDate(selectedDate).length === 0 && getDueHabitsForSelectedDate().length === 0 ? (
              <p className="text-xs text-gray-400 dark:text-gray-500 py-2">No entries logged for this day.</p>
            ) : (
              <div className="space-y-1.5">
                {getDueHabitsForSelectedDate().map((h, idx) => {
                  const completed = h.completions && h.completions[selectedDate];
                  return (
                    <div key={`due-${idx}`} className="flex items-start gap-2 text-xs">
                      <span className={`px-1.5 py-0.5 rounded font-medium shrink-0 ${
                        completed === '✓' ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                        : completed === '✗' ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
                        : 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400'
                      }`}>
                        {completed || 'Due'}
                      </span>
                      <span className="text-gray-700 dark:text-gray-300">{h.habit}</span>
                    </div>
                  );
                })}
                {getEntriesForDate(selectedDate).map((entry, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-xs">
                    <span className="px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 font-medium shrink-0">{entry.type}</span>
                    <span className="text-gray-700 dark:text-gray-300">{entry.text}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </section>

      {/* Habits */}
      <section className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800/80 rounded-xl p-4 sm:p-6 shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-base sm:text-base sm:text-lg font-bold text-gray-800 dark:text-gray-100">Section A — Daily Non-Negotiables</h2>
            <p className="text-[10px] sm:text-xs text-gray-400 dark:text-gray-500">
              <span className="font-semibold text-gray-500 dark:text-gray-400">Name + frequency are carried forward.</span>
              <span className="hidden sm:inline"> Status applies to <span className="font-semibold text-gray-600 dark:text-gray-300">today only</span> — each day is a fresh log.</span>
            </p>
          </div>
        </div>
        <div className="overflow-x-auto border border-gray-100 dark:border-gray-800 rounded-lg">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-gray-50/50 dark:bg-gray-950/50 border-b border-gray-100 dark:border-gray-800 text-xs text-gray-500 dark:text-gray-400 font-bold uppercase tracking-wider">
                <th className="p-3 min-w-[140px]">Habit</th>
                <th className="p-3 w-20 text-center">
                  <div>Today</div>
                  <div className="text-[8px] font-normal normal-case text-gray-400 mt-0.5">{new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</div>
                </th>
                <th className="p-3 w-20 hidden sm:table-cell">Tag</th>
                <th className="p-3 w-12 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800/50">
              {data.habits.map((h) => {
                const todayStr = todayISO();
                const todayStatus = h.completions?.[todayStr] || '-';
                const statusStyles = {
                  '✓': 'bg-green-500 hover:bg-green-600 text-white shadow-sm shadow-green-500/20',
                  '✗': 'bg-red-500 hover:bg-red-600 text-white shadow-sm shadow-red-500/20',
                  '-': 'bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300'
                };
                const weekDays = Array.from({ length: 7 }).map((_, i) => {
                  const d = new Date();
                  d.setDate(d.getDate() - (6 - i));
                  return d;
                });
                const weekStrip = weekDays.map(d => {
                  const iso = toISODate(d.getFullYear(), d.getMonth(), d.getDate());
                  return { d, iso, status: h.completions?.[iso] || null };
                });
                const weekDone = weekStrip.filter(s => s.status === '✓').length;
                const weekMissed = weekStrip.filter(s => s.status === '✗').length;
                return (
                  <tr key={h.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/20 transition-colors group">
                    <td className="p-3">
                      <EditableCell value={h.habit} onChange={(v) => updateItem('habits', h.id, 'habit', v)} />
                      {h.frequency && (
                        <div className="text-[10px] text-gray-400 dark:text-gray-500 mt-1 font-medium">
                          {h.frequency === 'daily' && 'Every day'}
                          {h.frequency === 'weekdays' && 'Mon–Fri'}
                          {h.frequency === 'weekends' && 'Sat–Sun'}
                          {h.frequency === 'custom' && (h.days || []).map(d => DAY_NAMES[d]).join(' ')}
                          {h.endDate ? ` · until ${h.endDate}` : (h.startDate ? ` · from ${h.startDate}` : '')}
                        </div>
                      )}
                      <div className="flex items-center gap-1 mt-2" title="Last 7 days (oldest → today)">
                        {weekStrip.map((s) => {
                          const isToday = s.iso === todayStr;
                          return (
                            <div
                              key={s.iso}
                              className={`flex flex-col items-center ${isToday ? 'opacity-100' : 'opacity-90'}`}
                              title={`${s.d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}: ${s.status || '—'}`}
                            >
                              <div className={`w-3 h-3 rounded-sm ${
                                s.status === '✓' ? 'bg-green-500'
                                : s.status === '✗' ? 'bg-red-500'
                                : 'bg-gray-200 dark:bg-gray-800'
                              } ${isToday ? 'ring-1 ring-blue-500 ring-offset-1 ring-offset-white dark:ring-offset-gray-900' : ''}`} />
                              <span className={`text-[8px] mt-0.5 font-medium ${isToday ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400'}`}>
                                {s.d.toLocaleDateString('en-US', { weekday: 'narrow' })}
                              </span>
                            </div>
                          );
                        })}
                        <span className="text-[10px] text-gray-500 dark:text-gray-400 ml-2 font-semibold">
                          {weekDone}
                          <span className="text-gray-400 dark:text-gray-600 font-normal">/7</span>
                          {weekMissed > 0 && <span className="text-red-500 dark:text-red-400 ml-1.5">·{weekMissed}✗</span>}
                        </span>
                      </div>
                    </td>
                    <td className="p-3 text-center">
                      <button
                        onClick={() => cycleHabitStatus(h.id)}
                        className={`inline-flex items-center justify-center w-9 h-9 sm:w-8 sm:h-8 rounded-lg font-bold transition-all duration-200 touch-target ${statusStyles[todayStatus]}`}
                        title={`Today (${todayStr}): tap to cycle status`}
                      >
                        {todayStatus}
                      </button>
                    </td>
                    <td className="p-3 hidden sm:table-cell">
                      <Tag value={h.tag} editable onChange={(v) => updateItem('habits', h.id, 'tag', v)} />
                    </td>
                    <td className="p-3 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => setSelectedRecord({ section: 'habits', data: h })}
                          className="p-1.5 text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 rounded-lg transition-colors"
                          title="View Comments & Links"
                        >
                          <Maximize2 size={15} />
                        </button>
                        <button
                          onClick={() => deleteItem('habits', h.id)}
                          className="p-1.5 text-gray-400 hover:text-red-500 dark:hover:text-red-400 rounded-lg transition-colors sm:opacity-0 sm:group-hover:opacity-100 opacity-100"
                          title="Delete"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <button
          onClick={openNewHabitModal}
          className="mt-3 w-full p-2.5 text-xs text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 border border-dashed border-gray-200 dark:border-gray-800 hover:border-blue-400 dark:hover:border-blue-500/50 rounded-lg flex items-center justify-center gap-1.5 transition-colors font-semibold"
        >
          <Plus size={14} /> Add Habit
        </button>
      </section>

      {/* Deep Work */}
      <section className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800/80 rounded-xl p-4 sm:p-6 shadow-sm">
        <div className="mb-4">
          <h2 className="text-base sm:text-lg font-bold text-gray-800 dark:text-gray-100">Section B — Deep Work Sessions</h2>
          <p className="text-xs text-gray-400 dark:text-gray-500">Quantifiable concentration blocks. Plan vs Actual in minutes.</p>
        </div>
        <div className="overflow-x-auto border border-gray-100 dark:border-gray-800 rounded-lg">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-gray-50/50 dark:bg-gray-950/50 border-b border-gray-100 dark:border-gray-800 text-xs text-gray-500 dark:text-gray-400 font-bold uppercase tracking-wider">
                <th className="p-3 w-2/12">Date</th>
                <th className="p-3 w-5/12">Task Description</th>
                <th className="p-3 w-1.5/12">Planned (m)</th>
                <th className="p-3 w-1.5/12">Actual (m)</th>
                <th className="p-3 w-1/12">Focus</th>
                <th className="p-3 w-1/12 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800/50">
              {data.deepWork.map((dw) => (
                <tr key={dw.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/20 group">
                  <td className="p-3"><EditableCell value={dw.date} placeholder="Date" onChange={(v) => updateItem('deepWork', dw.id, 'date', v)} /></td>
                  <td className="p-3"><EditableCell value={dw.task} placeholder="Focus Block Subject" onChange={(v) => updateItem('deepWork', dw.id, 'task', v)} /></td>
                  <td className="p-3"><EditableCell value={dw.planned} placeholder="Min" type="text" inputMode="numeric" onChange={(v) => updateItem('deepWork', dw.id, 'planned', v)} /></td>
                  <td className="p-3"><EditableCell value={dw.actual} placeholder="Min" type="text" inputMode="numeric" onChange={(v) => updateItem('deepWork', dw.id, 'actual', v)} /></td>
                  <td className="p-3"><EditableCell value={dw.focus} placeholder="x/10" onChange={(v) => updateItem('deepWork', dw.id, 'focus', v)} /></td>
                  <td className="p-3 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <button 
                        onClick={() => setSelectedRecord({ section: 'deepWork', data: dw })} 
                        className="p-1.5 text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 rounded-lg transition-colors"
                        title="Expand Details"
                      >
                        <Maximize2 size={15} />
                      </button>
                      <button 
                        onClick={() => deleteItem('deepWork', dw.id)} 
                        className="p-1.5 text-gray-400 hover:text-red-500 dark:hover:text-red-400 rounded-lg transition-colors sm:opacity-0 sm:group-hover:opacity-100 opacity-100"
                        title="Delete"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <button 
          onClick={() => addItem('deepWork', { date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }), task: '', planned: '90', actual: '', focus: '8/10', details: {} })} 
          className="mt-3 w-full p-2.5 text-xs text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 border border-dashed border-gray-200 dark:border-gray-800 hover:border-blue-400 dark:hover:border-blue-500/50 rounded-lg flex items-center justify-center gap-1.5 transition-colors font-semibold"
        >
          <Plus size={14} /> Add Deep Work Block
        </button>
      </section>

      {/* One Thing Moved */}
      <section className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800/80 rounded-xl p-4 sm:p-6 shadow-sm">
        <div className="mb-4">
          <h2 className="text-base sm:text-lg font-bold text-gray-800 dark:text-gray-100">Section C — "One Thing Moved" (Output Log)</h2>
          <p className="text-xs text-gray-400 dark:text-gray-500">Strict shipping list. Write down real outputs (commits, papers solved, code compiled), not concepts read.</p>
        </div>
        <div className="overflow-x-auto border border-gray-100 dark:border-gray-800 rounded-lg">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-gray-50/50 dark:bg-gray-950/50 border-b border-gray-100 dark:border-gray-800 text-xs text-gray-500 dark:text-gray-400 font-bold uppercase tracking-wider">
                <th className="p-3 w-2/12">Date</th>
                <th className="p-3 w-9/12">Completed Output / Artifact Produced</th>
                <th className="p-3 w-1/12 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800/50">
              {data.oneThing.map((ot) => (
                <tr key={ot.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/20 group">
                  <td className="p-3 align-top"><EditableCell value={ot.date} placeholder="Date" onChange={(v) => updateItem('oneThing', ot.id, 'date', v)} /></td>
                  <td className="p-3"><EditableCell value={ot.moved} placeholder="Write artifact delivered..." onChange={(v) => updateItem('oneThing', ot.id, 'moved', v)} /></td>
                  <td className="p-3 text-center align-top">
                    <div className="flex items-center justify-center gap-1 mt-1">
                      <button 
                        onClick={() => setSelectedRecord({ section: 'oneThing', data: ot })} 
                        className="p-1.5 text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 rounded-lg transition-colors"
                        title="Add Notes"
                      >
                        <MessageSquare size={15} />
                      </button>
                      <button 
                        onClick={() => deleteItem('oneThing', ot.id)} 
                        className="p-1.5 text-gray-400 hover:text-red-500 dark:hover:text-red-400 rounded-lg transition-colors sm:opacity-0 sm:group-hover:opacity-100 opacity-100"
                        title="Delete"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <button 
          onClick={() => addItem('oneThing', { date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }), moved: '', details: {} })} 
          className="mt-3 w-full p-2.5 text-xs text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 border border-dashed border-gray-200 dark:border-gray-800 hover:border-blue-400 dark:hover:border-blue-500/50 rounded-lg flex items-center justify-center gap-1.5 transition-colors font-semibold"
        >
          <Plus size={14} /> Log Another Output
        </button>
      </section>
    </div>
  );

  const renderTechnical = () => (
    <div className="space-y-8 animate-fade-in">
      {/* DSA Section */}
      <section className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800/80 rounded-xl p-4 sm:p-6 shadow-sm">
        <div className="mb-4">
          <h2 className="text-base sm:text-lg font-bold text-gray-800 dark:text-gray-100">DSA Subject Roadmap</h2>
          <p className="text-xs text-gray-400 dark:text-gray-500">Track algorithmic efficiency, optimization metrics, and weaknesses.</p>
        </div>
        <div className="overflow-x-auto border border-gray-100 dark:border-gray-800 rounded-lg">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-gray-50/50 dark:bg-gray-950/50 border-b border-gray-100 dark:border-gray-800 text-xs text-gray-500 dark:text-gray-400 font-bold uppercase tracking-wider">
                <th className="p-3">Topic / Pattern</th>
                <th className="p-3 w-24">Solved</th>
                <th className="p-3 w-1/3">Key Weakness</th>
                <th className="p-3 w-32">Status</th>
                <th className="p-3 w-1/12 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800/50">
              {data.dsa.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/20 group">
                  <td className="p-3"><EditableCell value={item.topic} placeholder="e.g. Graph BFS" onChange={(v) => updateItem('dsa', item.id, 'topic', v)} /></td>
                  <td className="p-3"><EditableCell value={item.problems} placeholder="Count" type="text" inputMode="numeric" onChange={(v) => updateItem('dsa', item.id, 'problems', v)} /></td>
                  <td className="p-3"><EditableCell value={item.weakness} placeholder="e.g. Backtracking base case" onChange={(v) => updateItem('dsa', item.id, 'weakness', v)} /></td>
                  <td className="p-3"><Tag value={item.tag} editable onChange={(v) => updateItem('dsa', item.id, 'tag', v)} /></td>
                  <td className="p-3 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <button 
                        onClick={() => setSelectedRecord({ section: 'dsa', data: item, title: item.topic })} 
                        className="p-1.5 text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 rounded-lg transition-colors"
                      >
                        <Maximize2 size={15} />
                      </button>
                      <button 
                        onClick={() => deleteItem('dsa', item.id)} 
                        className="p-1.5 text-gray-400 hover:text-red-500 dark:hover:text-red-400 rounded-lg transition-colors sm:opacity-0 sm:group-hover:opacity-100 opacity-100"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <button 
          onClick={() => addItem('dsa', { topic: '', problems: '', weakness: '', tag: 'default', details: {} })} 
          className="mt-3 w-full p-2.5 text-xs text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 border border-dashed border-gray-200 dark:border-gray-800 hover:border-blue-400 dark:hover:border-blue-500/50 rounded-lg flex items-center justify-center gap-1.5 transition-colors font-semibold"
        >
          <Plus size={14} /> Add Algorithmic Subject
        </button>
      </section>

      {/* GATE Section */}
      <section className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800/80 rounded-xl p-4 sm:p-6 shadow-sm">
        <div className="mb-4">
          <h2 className="text-base sm:text-lg font-bold text-gray-800 dark:text-gray-100">GATE Academic Track</h2>
          <p className="text-xs text-gray-400 dark:text-gray-500">Track syllabus completion & performance benchmark values.</p>
        </div>
        <div className="overflow-x-auto border border-gray-100 dark:border-gray-800 rounded-lg">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-gray-50/50 dark:bg-gray-950/50 border-b border-gray-100 dark:border-gray-800 text-xs text-gray-500 dark:text-gray-400 font-bold uppercase tracking-wider">
                <th className="p-3">Subject</th>
                <th className="p-3 w-24">Theory Coverage</th>
                <th className="p-3 w-24">PYQs Solved</th>
                <th className="p-3 w-24">Confidence</th>
                <th className="p-3 w-32">Status</th>
                <th className="p-3 w-1/12 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800/50">
              {data.gate.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/20 group">
                  <td className="p-3"><EditableCell value={item.subject} placeholder="e.g. Operating Systems" onChange={(v) => updateItem('gate', item.id, 'subject', v)} /></td>
                  <td className="p-3"><EditableCell value={item.theory} placeholder="e.g. 80%" onChange={(v) => updateItem('gate', item.id, 'theory', v)} /></td>
                  <td className="p-3"><EditableCell value={item.pyq} placeholder="Qty" type="text" inputMode="numeric" onChange={(v) => updateItem('gate', item.id, 'pyq', v)} /></td>
                  <td className="p-3"><EditableCell value={item.confidence} placeholder="x/10" onChange={(v) => updateItem('gate', item.id, 'confidence', v)} /></td>
                  <td className="p-3"><Tag value={item.tag} editable onChange={(v) => updateItem('gate', item.id, 'tag', v)} /></td>
                  <td className="p-3 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <button 
                        onClick={() => setSelectedRecord({ section: 'gate', data: item, title: item.subject })} 
                        className="p-1.5 text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 rounded-lg transition-colors"
                      >
                        <Maximize2 size={15} />
                      </button>
                      <button 
                        onClick={() => deleteItem('gate', item.id)} 
                        className="p-1.5 text-gray-400 hover:text-red-500 dark:hover:text-red-400 rounded-lg transition-colors sm:opacity-0 sm:group-hover:opacity-100 opacity-100"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <button 
          onClick={() => addItem('gate', { subject: '', theory: '', pyq: '', confidence: '', tag: 'default', details: {} })} 
          className="mt-3 w-full p-2.5 text-xs text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 border border-dashed border-gray-200 dark:border-gray-800 hover:border-blue-400 dark:hover:border-blue-500/50 rounded-lg flex items-center justify-center gap-1.5 transition-colors font-semibold"
        >
          <Plus size={14} /> Add Academic Topic
        </button>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* ML Frameworks */}
        <section className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800/80 rounded-xl p-4 sm:p-6 shadow-sm">
          <div className="mb-4">
            <h2 className="text-base sm:text-lg font-bold text-gray-800 dark:text-gray-100">AI / ML Applied Progression</h2>
            <p className="text-xs text-gray-400 dark:text-gray-500">Log algorithm construction and mathematical intuition.</p>
          </div>
          <div className="overflow-x-auto border border-gray-100 dark:border-gray-800 rounded-lg">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="bg-gray-50/50 dark:bg-gray-950/50 border-b border-gray-100 dark:border-gray-800 text-xs text-gray-500 dark:text-gray-400 font-bold uppercase tracking-wider">
                  <th className="p-3">Topic</th>
                  <th className="p-3 w-24">Built Model</th>
                  <th className="p-3 w-28">Math Clear</th>
                  <th className="p-3 w-1/12 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800/50">
                {data.ml.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/20 group">
                    <td className="p-3"><EditableCell value={item.topic} placeholder="e.g. Backprop" onChange={(v) => updateItem('ml', item.id, 'topic', v)} /></td>
                    <td className="p-3"><EditableCell value={item.built} placeholder="Yes/No/Partial" onChange={(v) => updateItem('ml', item.id, 'built', v)} /></td>
                    <td className="p-3"><EditableCell value={item.understood} placeholder="Yes/No" onChange={(v) => updateItem('ml', item.id, 'understood', v)} /></td>
                    <td className="p-3 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button 
                          onClick={() => setSelectedRecord({ section: 'ml', data: item, title: item.topic })} 
                          className="p-1.5 text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 rounded-lg transition-colors"
                        >
                          <Maximize2 size={15} />
                        </button>
                        <button 
                          onClick={() => deleteItem('ml', item.id)} 
                          className="p-1.5 text-gray-400 hover:text-red-500 dark:hover:text-red-400 rounded-lg transition-colors sm:opacity-0 sm:group-hover:opacity-100 opacity-100"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <button 
            onClick={() => addItem('ml', { topic: '', built: '', understood: '', details: {} })} 
            className="mt-3 w-full p-2.5 text-xs text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 border border-dashed border-gray-200 dark:border-gray-800 hover:border-blue-400 dark:hover:border-blue-500/50 rounded-lg flex items-center justify-center gap-1.5 transition-colors font-semibold"
          >
            <Plus size={14} /> Add ML Concept
          </button>
        </section>

        {/* Active Repos */}
        <section className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800/80 rounded-xl p-4 sm:p-6 shadow-sm">
          <div className="mb-4">
            <h2 className="text-base sm:text-lg font-bold text-gray-800 dark:text-gray-100">Active Repositories & Products</h2>
            <p className="text-xs text-gray-400 dark:text-gray-500">Track structural components and deliverable lifecycles.</p>
          </div>
          <div className="overflow-x-auto border border-gray-100 dark:border-gray-800 rounded-lg">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="bg-gray-50/50 dark:bg-gray-950/50 border-b border-gray-100 dark:border-gray-800 text-xs text-gray-500 dark:text-gray-400 font-bold uppercase tracking-wider">
                  <th className="p-3">Repository / Project</th>
                  <th className="p-3 w-28">Status</th>
                  <th className="p-3 w-1/12 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800/50">
                {data.projects.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/20 group">
                    <td className="p-3"><EditableCell value={item.project} placeholder="Project Name" onChange={(v) => updateItem('projects', item.id, 'project', v)} /></td>
                    <td className="p-3"><EditableCell value={item.status} placeholder="Phase" onChange={(v) => updateItem('projects', item.id, 'status', v)} /></td>
                    <td className="p-3 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button 
                          onClick={() => setSelectedRecord({ section: 'projects', data: item, title: item.project })} 
                          className="p-1.5 text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 rounded-lg transition-colors"
                        >
                          <Maximize2 size={15} />
                        </button>
                        <button 
                          onClick={() => deleteItem('projects', item.id)} 
                          className="p-1.5 text-gray-400 hover:text-red-500 dark:hover:text-red-400 rounded-lg transition-colors sm:opacity-0 sm:group-hover:opacity-100 opacity-100"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <button 
            onClick={() => addItem('projects', { project: '', status: '', details: {} })} 
            className="mt-3 w-full p-2.5 text-xs text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 border border-dashed border-gray-200 dark:border-gray-800 hover:border-blue-400 dark:hover:border-blue-500/50 rounded-lg flex items-center justify-center gap-1.5 transition-colors font-semibold"
          >
            <Plus size={14} /> Add Repository
          </button>
        </section>
      </div>
    </div>
  );

  const renderAntiDMN = () => (
    <div className="space-y-8 animate-fade-in">
      <div className="bg-orange-500/10 border border-orange-500/20 rounded-xl p-5 text-sm">
        <h3 className="font-bold text-orange-800 dark:text-orange-400 mb-1.5 text-base flex items-center gap-2">
          <AlertTriangle className="text-orange-500" size={18} /> DEFICIT MITIGATION PROTOCOL
        </h3>
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
          The goal is immediate disruption of DMN state patterns (aimless surfing, tab-bloat, hypothetical architectures). <strong>Identify triggers and execute clear recovery commands immediately.</strong>
        </p>
      </div>

      <section className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800/80 rounded-xl p-4 sm:p-6 shadow-sm">
        <div className="mb-4">
          <h2 className="text-base sm:text-lg font-bold text-gray-800 dark:text-gray-100">DMN Loop Interrupt Logs</h2>
          <p className="text-xs text-gray-400 dark:text-gray-500">Log escape sequences. Keep records objective and clear.</p>
        </div>
        <div className="overflow-x-auto border border-gray-100 dark:border-gray-800 rounded-lg">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-gray-50/50 dark:bg-gray-950/50 border-b border-gray-100 dark:border-gray-800 text-xs text-gray-500 dark:text-gray-400 font-bold uppercase tracking-wider">
                <th className="p-3 w-1/4">Observed Trigger</th>
                <th className="p-3 w-1/3">Incidental Behavior</th>
                <th className="p-3 w-1/4">Recovery Sequence (Executed)</th>
                <th className="p-3 w-32">Status Tag</th>
                <th className="p-3 w-1/12 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800/50">
              {data.antiDmn.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/20 group">
                  <td className="p-3 align-top"><EditableCell value={item.trigger} placeholder="e.g. Stuck on bug" onChange={(v) => updateItem('antiDmn', item.id, 'trigger', v)} /></td>
                  <td className="p-3 align-top"><EditableCell value={item.happened} placeholder="e.g. 5 tabs of Wikipedia" onChange={(v) => updateItem('antiDmn', item.id, 'happened', v)} /></td>
                  <td className="p-3 align-top"><EditableCell value={item.recovery} placeholder="e.g. 10 pushups + paper log" onChange={(v) => updateItem('antiDmn', item.id, 'recovery', v)} /></td>
                  <td className="p-3 align-top"><Tag value={item.tag} editable onChange={(v) => updateItem('antiDmn', item.id, 'tag', v)} /></td>
                  <td className="p-3 text-center align-top">
                    <div className="flex items-center justify-center gap-1 mt-1">
                      <button 
                        onClick={() => setSelectedRecord({ section: 'antiDmn', data: item })} 
                        className="p-1.5 text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 rounded-lg transition-colors"
                      >
                        <MessageSquare size={15} />
                      </button>
                      <button 
                        onClick={() => deleteItem('antiDmn', item.id)} 
                        className="p-1.5 text-gray-400 hover:text-red-500 dark:hover:text-red-400 rounded-lg transition-colors sm:opacity-0 sm:group-hover:opacity-100 opacity-100"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <button 
          onClick={() => addItem('antiDmn', { trigger: '', happened: '', recovery: '', tag: 'attention issue', details: {} })} 
          className="mt-3 w-full p-2.5 text-xs text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 border border-dashed border-gray-200 dark:border-gray-800 hover:border-blue-400 dark:hover:border-blue-500/50 rounded-lg flex items-center justify-center gap-1.5 transition-colors font-semibold"
        >
          <Plus size={14} /> Log Loop Interrupt
        </button>
      </section>

      {/* SOMEDAY.TXT */}
      <section className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800/80 rounded-xl p-4 sm:p-6 shadow-sm">
        <div className="mb-4">
          <div className="flex items-center gap-2">
            <h2 className="text-base sm:text-lg font-bold text-gray-800 dark:text-gray-100">SOMEDAY.TXT</h2>
            <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded-full">Novelty Capture</span>
          </div>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Capture ideas here instead of starting new projects. Prevents project spirals.</p>
        </div>
        <div className="overflow-x-auto border border-gray-100 dark:border-gray-800 rounded-lg">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="bg-gray-50/50 dark:bg-gray-950/50 border-b border-gray-100 dark:border-gray-800 text-xs text-gray-500 dark:text-gray-400 font-bold uppercase tracking-wider">
                <th className="p-3 w-10/12">Idea</th>
                <th className="p-3 w-1/12 text-center">Logged</th>
                <th className="p-3 w-1/12 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800/50">
              {data.someday.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/20 group">
                  <td className="p-3">
                    <EditableCell value={item.idea} placeholder="e.g. New project idea..." onChange={(v) => updateItem('someday', item.id, 'idea', v)} />
                  </td>
                  <td className="p-3 text-center">
                    <button
                      onClick={() => updateItem('someday', item.id, 'logged', !item.logged)}
                      className={`inline-flex items-center justify-center w-7 h-7 rounded-md text-xs font-bold transition-all ${
                        item.logged 
                          ? 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400' 
                          : 'bg-gray-100 text-gray-400 dark:bg-gray-800 dark:text-gray-600'
                      }`}
                    >
                      {item.logged ? '✓' : '○'}
                    </button>
                  </td>
                  <td className="p-3 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <button 
                        onClick={() => setSelectedRecord({ section: 'someday', data: item, title: item.idea || 'Parked Idea' })} 
                        className="p-1.5 text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 rounded-lg transition-colors"
                      >
                        <MessageSquare size={15} />
                      </button>
                      <button 
                        onClick={() => deleteItem('someday', item.id)} 
                        className="p-1.5 text-gray-400 hover:text-red-500 dark:hover:text-red-400 rounded-lg transition-colors sm:opacity-0 sm:group-hover:opacity-100 opacity-100"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <button 
          onClick={() => addItem('someday', { idea: '', logged: false, details: {} })} 
          className="mt-3 w-full p-2.5 text-xs text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 border border-dashed border-gray-200 dark:border-gray-800 hover:border-blue-400 dark:hover:border-blue-500/50 rounded-lg flex items-center justify-center gap-1.5 transition-colors font-semibold"
        >
          <Plus size={14} /> Park New Idea
        </button>
      </section>
    </div>
  );

  const renderOutputMomentum = () => {
    const totalOutputs = data.outputLog.length;

    const deepWorkMins = weeklyStats.deepWorkMins;
    const learningHours = Math.round(deepWorkMins / 60 * 10) / 10;
    const outputsPerHour = learningHours > 0
      ? Math.round((totalOutputs / learningHours) * 100) / 100
      : 0;

    const outputCountColor = totalOutputs >= 5
      ? 'text-green-600 dark:text-green-400'
      : totalOutputs >= 1
      ? 'text-amber-600 dark:text-amber-400'
      : 'text-red-600 dark:text-red-400';

    const warnings = [];
    if (learningHours > 10 && totalOutputs < 3) {
      warnings.push({ type: 'critical', text: 'High Consumption / Low Production', detail: `${learningHours}h learning but only ${totalOutputs} outputs logged` });
    }
    if (totalOutputs === 0) {
      warnings.push({ type: 'warning', text: 'No outputs logged yet', detail: 'Start logging outputs to track momentum' });
    }
    const dsaCount = data.dsa.reduce((s, i) => s + (parseInt(i.problems) || 0), 0);
    const gatePyqs = data.gate.reduce((s, i) => s + (parseInt(i.pyq) || 0), 0);
    const mlImplementations = data.ml.filter(m => m.built && m.built.toLowerCase() !== 'no').length;
    const projectFinished = data.projects.filter(p => p.status && !['partial', 'cleanup'].includes(p.status.toLowerCase())).length;

    return (
      <div className="space-y-8 animate-fade-in">
        <div className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800/80 rounded-xl p-5 shadow-sm">
          <h3 className="font-bold text-gray-800 dark:text-gray-100 mb-1 flex items-center gap-2 text-base">
            <BarChart3 className="text-blue-500" size={18} /> OUTPUT MOMENTUM SYSTEM
          </h3>
          <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
            Measure outputs, not intentions. Measure completion, not interest. Measure implementation, not exposure.
          </p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'DSA Problems', value: dsaCount, unit: 'solved', color: 'text-purple-600 dark:text-purple-400' },
            { label: 'GATE PYQs', value: gatePyqs, unit: 'done', color: 'text-indigo-600 dark:text-indigo-400' },
            { label: 'ML Implementations', value: mlImplementations, unit: 'built', color: 'text-cyan-600 dark:text-cyan-400' },
            { label: 'Total Outputs', value: totalOutputs, unit: 'logged', color: 'text-green-600 dark:text-green-400' },
          ].map((stat, idx) => (
            <div key={idx} className="border border-gray-100 dark:border-gray-800/80 rounded-xl p-4 bg-white dark:bg-gray-900 shadow-sm">
              <span className="text-xs text-gray-400 dark:text-gray-500 font-medium">{stat.label}</span>
              <div className="mt-2 flex items-baseline gap-1.5">
                <span className={`text-2xl font-bold tracking-tight ${stat.color}`}>{stat.value}</span>
                <span className="text-xs text-gray-400">{stat.unit}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Consumption vs Production Ratio */}
        <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800/80 rounded-xl p-4 sm:p-6 shadow-sm">
          <h2 className="text-base sm:text-lg font-bold text-gray-800 dark:text-gray-100 mb-3">Consumption vs Production</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="border border-gray-100 dark:border-gray-800 rounded-lg p-4 text-center">
              <span className="text-xs text-gray-400 font-medium block mb-1">Learning Hours</span>
              <span className="text-2xl font-bold text-orange-600 dark:text-orange-400">{learningHours}h</span>
            </div>
            <div className="border border-gray-100 dark:border-gray-800 rounded-lg p-4 text-center">
              <span className="text-xs text-gray-400 font-medium block mb-1">Total Outputs</span>
              <span className={`text-2xl font-bold ${outputCountColor}`}>{totalOutputs}</span>
              <span className="text-xs text-gray-400 block">{outputsPerHour} per hour</span>
            </div>
            <div className="border border-gray-100 dark:border-gray-800 rounded-lg p-4 text-center">
              <span className="text-xs text-gray-400 font-medium block mb-1">Projects Finished</span>
              <span className="text-2xl font-bold text-cyan-600 dark:text-cyan-400">{projectFinished}</span>
            </div>
          </div>
          {learningHours > 0 && totalOutputs > 0 && outputsPerHour < 0.5 && (
            <p className="mt-3 text-xs text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 p-2.5 rounded-lg">
              ⚠️ Learning outweighing implementation. Convert hours into outputs.
            </p>
          )}
        </div>

        {/* Warnings Engine */}
        {warnings.length > 0 && (
          <div className="space-y-2">
            {warnings.map((w, i) => (
              <div key={i} className={`p-4 rounded-xl text-sm flex items-start gap-3 ${
                w.type === 'critical' 
                  ? 'bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/40 text-red-700 dark:text-red-400' 
                  : 'bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40 text-amber-700 dark:text-amber-400'
              }`}>
                <AlertTriangle size={16} className="mt-0.5 shrink-0" />
                <div>
                  <span className="font-bold">{w.text}</span>
                  <p className="text-xs opacity-75 mt-0.5">{w.detail}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Output Log */}
        <section className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800/80 rounded-xl p-4 sm:p-6 shadow-sm">
          <div className="mb-4">
            <h2 className="text-base sm:text-lg font-bold text-gray-800 dark:text-gray-100">Output Log</h2>
            <p className="text-xs text-gray-400 dark:text-gray-500">Every output is evidence. Log what you built, solved, shipped.</p>
          </div>
          <div className="overflow-x-auto border border-gray-100 dark:border-gray-800 rounded-lg">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="bg-gray-50/50 dark:bg-gray-950/50 border-b border-gray-100 dark:border-gray-800 text-xs text-gray-500 dark:text-gray-400 font-bold uppercase tracking-wider">
                  <th className="p-3 w-16">Date</th>
                  <th className="p-3 w-28">Category</th>
                  <th className="p-3">Quantity / Description</th>
                  <th className="p-3">Evidence</th>
                  <th className="p-3 w-16 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800/50">
                {data.outputLog.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/20 group">
                    <td className="p-3"><EditableCell value={item.date} placeholder="Date" onChange={(v) => updateItem('outputLog', item.id, 'date', v)} /></td>
                    <td className="p-3">
                      <select
                        value={item.category || 'Other'}
                        onChange={(e) => updateItem('outputLog', item.id, 'category', e.target.value)}
                        className="w-full px-2 py-1 bg-transparent border-b border-transparent hover:border-gray-200 dark:hover:border-gray-800 focus:border-blue-500 outline-none text-sm text-gray-800 dark:text-gray-100 cursor-pointer rounded"
                      >
                        {OUTPUT_CATEGORIES.map(c => (
                          <option key={c} value={c} className="bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200">{c}</option>
                        ))}
                      </select>
                    </td>
                    <td className="p-3"><EditableCell value={item.quantity} placeholder="e.g. 3 Problems, Logistic Regression" onChange={(v) => updateItem('outputLog', item.id, 'quantity', v)} /></td>
                    <td className="p-3"><EditableCell value={item.evidence} placeholder="e.g. Git commit, LC link, notebook" onChange={(v) => updateItem('outputLog', item.id, 'evidence', v)} /></td>
                    <td className="p-3 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button onClick={() => setSelectedRecord({ section: 'outputLog', data: item, title: item.quantity || 'Output' })} className="p-1.5 text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 rounded-lg transition-colors">
                          <Maximize2 size={15} />
                        </button>
                        <button onClick={() => deleteItem('outputLog', item.id)} className="p-1.5 text-gray-400 hover:text-red-500 dark:hover:text-red-400 rounded-lg transition-colors sm:opacity-0 sm:group-hover:opacity-100 opacity-100">
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <button
            onClick={() => addItem('outputLog', { date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }), category: 'DSA', quantity: '', evidence: '', details: {} })}
            className="mt-3 w-full p-2.5 text-xs text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 border border-dashed border-gray-200 dark:border-gray-800 hover:border-blue-400 dark:hover:border-blue-500/50 rounded-lg flex items-center justify-center gap-1.5 transition-colors font-semibold"
          >
            <Plus size={14} /> Log Output
          </button>
        </section>

        {/* Pivot Timeline */}
        <section className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800/80 rounded-xl p-4 sm:p-6 shadow-sm">
          <div className="mb-4">
            <h2 className="text-base sm:text-lg font-bold text-gray-800 dark:text-gray-100">Pivot Timeline</h2>
            <p className="text-xs text-gray-400 dark:text-gray-500">Key decisions that changed trajectory. Mark them as they happen.</p>
          </div>
          <div className="space-y-3">
            {data.pivotTimeline.map((item, idx) => (
              <div key={item.id} className="flex items-start gap-3 group">
                <div className="flex flex-col items-center">
                  <div className="w-3 h-3 rounded-full bg-blue-500 border-2 border-white dark:border-gray-900 shadow-sm"></div>
                  {idx < data.pivotTimeline.length - 1 && <div className="w-0.5 h-6 bg-gray-200 dark:bg-gray-800"></div>}
                </div>
                <div className="flex-1 flex items-center gap-2">
                  <EditableCell value={item.date} placeholder="Date" onChange={(v) => updateItem('pivotTimeline', item.id, 'date', v)} />
                  <ChevronRight size={14} className="text-gray-300 dark:text-gray-700 shrink-0" />
                  <EditableCell value={item.decision} placeholder="e.g. Started DSA practice" onChange={(v) => updateItem('pivotTimeline', item.id, 'decision', v)} />
                  <button onClick={() => setSelectedRecord({ section: 'pivotTimeline', data: item, title: item.decision || 'Pivot Point' })} className="p-1 text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                    <Maximize2 size={13} />
                  </button>
                  <button onClick={() => deleteItem('pivotTimeline', item.id)} className="p-1 text-gray-400 hover:text-red-500 dark:hover:text-red-400 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            ))}
          </div>
          <button
            onClick={() => addItem('pivotTimeline', { date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }), decision: '', details: {} })}
            className="mt-3 w-full p-2.5 text-xs text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 border border-dashed border-gray-200 dark:border-gray-800 hover:border-blue-400 dark:hover:border-blue-500/50 rounded-lg flex items-center justify-center gap-1.5 transition-colors font-semibold"
          >
            <Plus size={14} /> Add Pivot Point
          </button>
        </section>

        {/* Reality Check Card */}
        <section className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800/80 rounded-xl p-4 sm:p-6 shadow-sm">
          <div className="mb-4">
            <h2 className="text-base sm:text-lg font-bold text-gray-800 dark:text-gray-100">Reality Check</h2>
            <p className="text-xs text-gray-400 dark:text-gray-500">Daily: What did I learn? What did I build? What did I finish?</p>
          </div>
          <div className="overflow-x-auto border border-gray-100 dark:border-gray-800 rounded-lg">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="bg-gray-50/50 dark:bg-gray-950/50 border-b border-gray-100 dark:border-gray-800 text-xs text-gray-500 dark:text-gray-400 font-bold uppercase tracking-wider">
                  <th className="p-3 w-20">Date</th>
                  <th className="p-3">Learned</th>
                  <th className="p-3">Built</th>
                  <th className="p-3">Shipped</th>
                  <th className="p-3 w-16 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800/50">
                {data.realityCheck.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/20 group">
                    <td className="p-3"><EditableCell value={item.date} placeholder="Date" onChange={(v) => updateItem('realityCheck', item.id, 'date', v)} /></td>
                    <td className="p-3"><EditableCell value={item.learned} placeholder="What did I learn?" onChange={(v) => updateItem('realityCheck', item.id, 'learned', v)} /></td>
                    <td className="p-3"><EditableCell value={item.built} placeholder="What did I build?" onChange={(v) => updateItem('realityCheck', item.id, 'built', v)} /></td>
                    <td className="p-3"><EditableCell value={item.shipped} placeholder="What did I finish?" onChange={(v) => updateItem('realityCheck', item.id, 'shipped', v)} /></td>
                    <td className="p-3 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button onClick={() => setSelectedRecord({ section: 'realityCheck', data: item, title: `Reality Check ${item.date}` })} className="p-1.5 text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 rounded-lg transition-colors">
                          <Maximize2 size={15} />
                        </button>
                        <button onClick={() => deleteItem('realityCheck', item.id)} className="p-1.5 text-gray-400 hover:text-red-500 dark:hover:text-red-400 rounded-lg transition-colors sm:opacity-0 sm:group-hover:opacity-100 opacity-100">
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <button
            onClick={() => addItem('realityCheck', { date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }), learned: '', built: '', shipped: '', details: {} })}
            className="mt-3 w-full p-2.5 text-xs text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 border border-dashed border-gray-200 dark:border-gray-800 hover:border-blue-400 dark:hover:border-blue-500/50 rounded-lg flex items-center justify-center gap-1.5 transition-colors font-semibold"
          >
            <Plus size={14} /> Add Reality Check
          </button>
        </section>

        <div className="p-5 border border-gray-100 dark:border-gray-800 rounded-xl text-sm leading-relaxed text-gray-600 dark:text-gray-300 bg-gray-50/50 dark:bg-gray-900/30">
          <h4 className="font-bold text-gray-800 dark:text-gray-100 mb-1.5 uppercase text-xs tracking-wider">OUTPUT PRINCIPLE:</h4>
          If you can't point to something you built, solved, or shipped today — the day was consumption, not production. That's fine occasionally, but not as a pattern.
        </div>
      </div>
    );
  };

  const renderReview = () => {
    const dwSessions = data.deepWork.length;
    const dwTotalActual = weeklyStats.deepWorkMins;

    const outputTypeIcons = {
      screenshot: '🖼',
      commit: '⎇',
      graph: '📈',
      pdf: '📄',
      deployment: '🚀'
    };

    return (
      <div className="space-y-8 animate-fade-in">
        <div className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800/80 rounded-xl p-5 shadow-sm">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="font-bold text-gray-800 dark:text-gray-100 mb-1 flex items-center gap-2 text-base">
                <BarChart3 className="text-blue-500" size={18} /> TRAJECTORY LOG
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                Raw data points. Watch direction, not scores. Compare this week to last week.
              </p>
            </div>
            <button
              onClick={() => setShowWeeklyReset(!showWeeklyReset)}
              className={`flex items-center gap-1.5 px-3 py-2 border rounded-lg text-xs font-bold transition-colors shrink-0 ${
                showWeeklyReset
                  ? 'bg-gray-900 text-white border-gray-900 dark:bg-white dark:text-gray-900 dark:border-white'
                  : 'bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
            >
              <RefreshCw size={13} /> Weekly Reset
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {[
            { label: 'Total Outputs', value: data.outputLog.length, unit: 'logged' },
            { label: 'DSA Problems', value: weeklyStats.dsaTotal, unit: 'solved' },
            { label: 'GATE PYQs', value: weeklyStats.pyqTotal, unit: 'done' },
            { label: 'Deep Work', value: `${dwTotalActual}m`, unit: `${dwSessions} sessions` },
            { label: 'Distractions', value: weeklyStats.distractions, unit: 'events' },
          ].map((stat, idx) => (
            <div key={idx} className="border border-gray-100 dark:border-gray-800/80 rounded-xl p-4 bg-white dark:bg-gray-900 shadow-sm">
              <span className="text-xs text-gray-400 dark:text-gray-500 font-medium">{stat.label}</span>
              <div className="mt-2 flex items-baseline gap-1.5">
                <span className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{stat.value}</span>
                <span className="text-xs text-gray-400">{stat.unit}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Completed Outputs Gallery */}
        <section className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800/80 rounded-xl p-4 sm:p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-gray-800 dark:text-gray-100">Completed Outputs</h2>
              <p className="text-xs text-gray-400 dark:text-gray-500">Visible proof of real work — commits, screenshots, graphs, PDFs, deployments.</p>
            </div>
          </div>
          {data.completedOutputs.length === 0 ? (
            <div className="text-center py-8 text-gray-400 dark:text-gray-600 text-sm border border-dashed border-gray-200 dark:border-gray-800 rounded-lg">
              No outputs logged yet. Add your first one.
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {data.completedOutputs.map((item) => (
                <div key={item.id} className="group relative border border-gray-100 dark:border-gray-800/80 rounded-lg p-3 bg-gray-50/50 dark:bg-gray-900/50 hover:border-gray-200 dark:hover:border-gray-700 transition-all">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-xs">{outputTypeIcons[item.type] || '📎'}</span>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500">{item.type || 'output'}</span>
                  </div>
                  <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 truncate">{item.title || 'untitled'}</p>
                  {item.url && (
                    <a href={item.url} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-500 hover:text-blue-600 dark:text-blue-400 flex items-center gap-1 mt-1 truncate">
                      <ExternalLink size={11} /> {item.url.replace(/^https?:\/\//, '').substring(0, 25)}...
                    </a>
                  )}
                  {item.date && <span className="text-[10px] text-gray-400 mt-1 block">{item.date}</span>}
                  <div className="absolute top-2 right-2 flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => setSelectedRecord({ section: 'completedOutputs', data: item, title: item.title || 'Output' })} className="p-1 text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 rounded">
                      <Maximize2 size={12} />
                    </button>
                    <button onClick={() => deleteItem('completedOutputs', item.id)} className="p-1 text-gray-400 hover:text-red-500 dark:hover:text-red-400 rounded">
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
          <button
            onClick={() => addItem('completedOutputs', { title: '', type: 'commit', url: '', date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }), details: {} })}
            className="mt-3 w-full p-2.5 text-xs text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 border border-dashed border-gray-200 dark:border-gray-800 hover:border-blue-400 dark:hover:border-blue-500/50 rounded-lg flex items-center justify-center gap-1.5 transition-colors font-semibold"
          >
            <Plus size={14} /> Add Completed Output
          </button>
        </section>

        {/* Weekly Reset */}
        {showWeeklyReset && (
          <section className="bg-white dark:bg-gray-900 border border-cyan-200 dark:border-cyan-900/40 rounded-xl p-4 sm:p-6 shadow-sm animate-fade-in">
            <h2 className="text-base sm:text-lg font-bold text-gray-800 dark:text-gray-100 mb-1">Weekly Reset Reflection</h2>
            <p className="text-xs text-gray-400 dark:text-gray-500 mb-5">Short, honest answers. No scoring — just recalibration.</p>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">What actually moved this week?</label>
                <textarea
                  value={data.weeklyReset.moved}
                  onChange={(e) => updateWeeklyReset('moved', e.target.value)}
                  placeholder="Real outputs shipped, problems solved..."
                  className="w-full h-20 p-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 focus:border-cyan-500 rounded-lg outline-none focus:ring-2 focus:ring-cyan-500/20 text-sm text-gray-800 dark:text-gray-200 resize-none transition-all"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">What caused the most friction?</label>
                <textarea
                  value={data.weeklyReset.friction}
                  onChange={(e) => updateWeeklyReset('friction', e.target.value)}
                  placeholder="Distractions, blockers, environment issues..."
                  className="w-full h-20 p-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 focus:border-cyan-500 rounded-lg outline-none focus:ring-2 focus:ring-cyan-500/20 text-sm text-gray-800 dark:text-gray-200 resize-none transition-all"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">What should be removed?</label>
                <textarea
                  value={data.weeklyReset.remove}
                  onChange={(e) => updateWeeklyReset('remove', e.target.value)}
                  placeholder="Tasks, tools, habits that aren't serving..."
                  className="w-full h-20 p-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 focus:border-cyan-500 rounded-lg outline-none focus:ring-2 focus:ring-cyan-500/20 text-sm text-gray-800 dark:text-gray-200 resize-none transition-all"
                />
              </div>
            </div>
          </section>
        )}

        <div className="p-5 border border-gray-100 dark:border-gray-800 rounded-xl text-sm leading-relaxed text-gray-600 dark:text-gray-300 bg-gray-50/50 dark:bg-gray-900/30">
          <h4 className="font-bold text-gray-800 dark:text-gray-100 mb-1.5 uppercase text-xs tracking-wider">DIRECTION CHECK:</h4>
          Are outputs growing week over week? Is deep work volume increasing? Are distractions trending down? Watch the deltas.
        </div>
      </div>
    );
  };

  // --- MODAL ---
  const renderModal = () => {
    if (!selectedRecord) return null;
    const { section, data: record, title } = selectedRecord;
    const details = record.details || {};

    const handleFieldChange = (field, value) => {
      updateItem(section, record.id, field, value);
      setSelectedRecord(prev => ({
        ...prev,
        data: { ...prev.data, [field]: value }
      }));
    };

    const handleDetailChange = (field, value) => {
      updateDetails(section, record.id, field, value);
      setSelectedRecord(prev => ({
        ...prev,
        data: { ...prev.data, details: { ...(prev.data.details || {}), [field]: value } }
      }));
    };

    const displayTitle = title || record.habit || record.task || record.moved || record.trigger || record.idea || 'Detailed Action Specs';

    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
        <div className="bg-white dark:bg-gray-950 rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden border border-gray-200 dark:border-gray-800 flex flex-col max-h-[90vh]">
          <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50">
            <h2 className="text-base font-bold text-gray-800 dark:text-gray-100 truncate pr-4 uppercase tracking-wide">{displayTitle}</h2>
            <button 
              onClick={() => setSelectedRecord(null)} 
              className="p-1.5 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-lg text-gray-500 dark:text-gray-400 transition-colors"
            >
              <X size={18} />
            </button>
          </div>
          
          <div className="p-6 overflow-y-auto space-y-5">
            <div>
              <label className="block text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2">Observations / Realized Notes</label>
              <textarea 
                value={details.notes || ''} 
                onChange={(e) => handleDetailChange('notes', e.target.value)}
                placeholder="Operational facts and triggers. Avoid logging subjective emotions."
                className="w-full h-32 p-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 focus:border-blue-500 rounded-lg outline-none focus:ring-2 focus:ring-blue-500/20 text-sm text-gray-800 dark:text-gray-200 resize-none transition-all duration-150"
              />
            </div>

            {section === 'completedOutputs' && (
              <div className="space-y-3 p-4 bg-gray-50/50 dark:bg-gray-900/50 rounded-lg border border-gray-100 dark:border-gray-800">
                <label className="block text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Output Details</label>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <span className="text-[10px] text-gray-400 block mb-0.5">Title</span>
                    <input type="text" value={record.title || ''} onChange={(e) => handleFieldChange('title', e.target.value)}
                      className="w-full p-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 focus:border-blue-500 rounded-lg outline-none text-sm text-gray-800 dark:text-gray-200" />
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-400 block mb-0.5">Type</span>
                    <select value={record.type || 'commit'} onChange={(e) => handleFieldChange('type', e.target.value)}
                      className="w-full p-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 focus:border-blue-500 rounded-lg outline-none text-sm text-gray-800 dark:text-gray-200 cursor-pointer">
                      {['screenshot', 'commit', 'graph', 'pdf', 'deployment'].map(t => (
                        <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>
                      ))}
                    </select>
                  </div>
                  <div className="col-span-2">
                    <span className="text-[10px] text-gray-400 block mb-0.5">URL</span>
                    <input type="text" value={record.url || ''} onChange={(e) => handleFieldChange('url', e.target.value)}
                      placeholder="https://github.com/..."
                      className="w-full p-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 focus:border-blue-500 rounded-lg outline-none text-sm text-gray-800 dark:text-gray-200" />
                  </div>
                  <div className="col-span-2">
                    <span className="text-[10px] text-gray-400 block mb-0.5">Date</span>
                    <input type="text" value={record.date || ''} onChange={(e) => handleFieldChange('date', e.target.value)}
                      placeholder="May 27"
                      className="w-full p-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 focus:border-blue-500 rounded-lg outline-none text-sm text-gray-800 dark:text-gray-200" />
                  </div>
                </div>
              </div>
            )}

            {(section === 'deepWork' || section === 'projects' || section === 'gate') && (
              <div>
                <label className="block text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2">Active Friction / Bottlenecks</label>
                <textarea 
                  value={details.blockers || ''} 
                  onChange={(e) => handleDetailChange('blockers', e.target.value)}
                  placeholder="Identify clear systemic friction parameters."
                  className="w-full h-24 p-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 focus:border-blue-500 rounded-lg outline-none focus:ring-2 focus:ring-blue-500/20 text-sm text-gray-800 dark:text-gray-200 resize-none transition-all duration-150"
                />
              </div>
            )}

            {(section === 'dsa' || section === 'ml') && (
              <div>
                <label className="block text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2">Failed Implementations / Precision Deficits</label>
                <textarea 
                  value={details.weakAreas || ''} 
                  onChange={(e) => handleDetailChange('weakAreas', e.target.value)}
                  placeholder="e.g. edge condition on heap index calculation"
                  className="w-full h-24 p-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 focus:border-blue-500 rounded-lg outline-none focus:ring-2 focus:ring-blue-500/20 text-sm text-gray-800 dark:text-gray-200 resize-none transition-all duration-150"
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2">Commit Hashes, URLs & Resources</label>
              <input 
                type="text"
                value={details.links || ''} 
                onChange={(e) => handleDetailChange('links', e.target.value)}
                placeholder="Commit hashes, LeetCode URLs, raw logs..."
                className="w-full p-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 focus:border-blue-500 rounded-lg outline-none focus:ring-2 focus:ring-blue-500/20 text-sm text-gray-800 dark:text-gray-200 transition-all duration-150"
              />
            </div>
          </div>

          <div className="p-4 border-t border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50 flex justify-end">
            <button 
              onClick={() => setSelectedRecord(null)} 
              className="px-5 py-2.5 bg-gray-900 hover:bg-gray-800 dark:bg-gray-800 dark:hover:bg-gray-700 text-white rounded-lg text-sm font-semibold tracking-wide transition-all"
            >
              Close & Save Records
            </button>
          </div>
        </div>
      </div>
    );
  };

  // --- CONFIRM RESET MODAL ---
  const renderResetConfirmModal = () => {
    if (!showResetConfirm) return null;
    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
        <div className="bg-white dark:bg-gray-950 rounded-xl shadow-2xl w-full max-w-md overflow-hidden border border-red-500/20 p-6 space-y-5">
          <div className="flex items-center gap-3 text-red-500">
            <AlertTriangle size={32} />
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">Reset System Storage?</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">This action is irreversible.</p>
            </div>
          </div>
          
          <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
            All your current progress, metrics, logged activities, and subjects will be completely wiped out and replaced with default configuration data.
          </p>

          <div className="flex justify-end gap-3 pt-2">
            <button 
              onClick={() => setShowResetConfirm(false)}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-semibold transition-colors"
            >
              Cancel
            </button>
            <button 
              onClick={resetAllData}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-semibold transition-colors shadow-lg shadow-red-500/20"
            >
              Reset Data
            </button>
          </div>
        </div>
      </div>
    );
  };

  // --- IMPORT CONFIRM MODAL ---
  const renderImportConfirmModal = () => {
    if (!showImportConfirm) return null;
    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
        <div className="bg-white dark:bg-gray-950 rounded-xl shadow-2xl w-full max-w-md overflow-hidden border border-blue-500/20 p-6 space-y-5">
          <div className="flex items-center gap-3 text-blue-500">
            <Download size={28} />
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">Import Dashboard Data?</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">This will replace all current data.</p>
            </div>
          </div>
          
          <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
            All your current progress, metrics, and logs will be overwritten with the data from the selected file. Make sure you've exported a backup first if you want to keep your current data.
          </p>

          <div className="flex justify-end gap-3 pt-2">
            <button 
              onClick={() => { setShowImportConfirm(false); setPendingImportData(null); }}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-semibold transition-colors"
            >
              Cancel
            </button>
            <button 
              onClick={confirmImport}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold transition-colors shadow-lg shadow-blue-500/20"
            >
              Replace & Import
            </button>
          </div>
        </div>
      </div>
    );
  };

  // --- NEW HABIT MODAL ---
  const renderNewHabitModal = () => {
    if (!showNewHabit) return null;
    const toggleDay = (d) => {
      setNewHabitDays(prev => prev.includes(d) ? prev.filter(x => x !== d) : [...prev, d].sort());
    };
    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
        <div className="bg-white dark:bg-gray-950 rounded-xl shadow-2xl w-full max-w-md overflow-hidden border border-blue-500/20 p-6 space-y-5">
          <div className="flex items-center gap-3 text-blue-500">
            <Plus size={28} />
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">New Habit</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">Define what, when, and how often.</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">Habit Name</label>
              <input
                type="text"
                value={newHabitName}
                onChange={(e) => setNewHabitName(e.target.value)}
                placeholder="e.g. Morning DSA, Gym, Read 30m"
                autoFocus
                className="w-full px-3 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg text-sm text-gray-800 dark:text-gray-100 outline-none focus:border-blue-500 focus:bg-white dark:focus:bg-gray-950"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">Frequency</label>
              <select
                value={newHabitFreq}
                onChange={(e) => setNewHabitFreq(e.target.value)}
                className="w-full px-3 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg text-sm text-gray-800 dark:text-gray-100 outline-none focus:border-blue-500"
              >
                {FREQUENCIES.map(f => (
                  <option key={f.value} value={f.value}>{f.label}</option>
                ))}
              </select>
            </div>

            {newHabitFreq === 'custom' && (
              <div>
                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">Custom Days</label>
                <div className="flex flex-wrap gap-2">
                  {DAY_NAMES.map((name, idx) => {
                    const active = newHabitDays.includes(idx);
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => toggleDay(idx)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${
                          active
                            ? 'bg-blue-500 text-white border-blue-500'
                            : 'bg-gray-50 dark:bg-gray-900 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-800'
                        }`}
                      >
                        {name}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">Start</label>
                <input
                  type="text"
                  value={newHabitStartDate}
                  onChange={(e) => setNewHabitStartDate(e.target.value)}
                  placeholder="Jan 1"
                  className="w-full px-3 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg text-sm text-gray-800 dark:text-gray-100 outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">End (opt)</label>
                <input
                  type="text"
                  value={newHabitEndDate}
                  onChange={(e) => setNewHabitEndDate(e.target.value)}
                  placeholder="Mar 31"
                  className="w-full px-3 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg text-sm text-gray-800 dark:text-gray-100 outline-none focus:border-blue-500"
                />
              </div>
            </div>
            <p className="text-[10px] text-gray-400 dark:text-gray-500 leading-relaxed">
              Format: "Mon D" (e.g. "Jan 5", "Mar 31"). Leave end blank for ongoing.
            </p>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              onClick={() => setShowNewHabit(false)}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-semibold transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleCreateHabit}
              disabled={!newHabitName.trim()}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 dark:disabled:bg-gray-800 disabled:text-gray-500 text-white rounded-lg text-sm font-semibold transition-colors shadow-lg shadow-blue-500/20 disabled:shadow-none"
            >
              Create Habit
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className={isDark ? 'dark' : ''}>
      <div className="min-h-screen bg-gray-50/50 dark:bg-[#060606] text-gray-900 dark:text-gray-100 font-sans p-3 sm:p-4 md:p-8 selection:bg-blue-500/10 selection:text-blue-500 transition-colors duration-200">
        <div className="max-w-5xl mx-auto">
          
          {/* Main App Header */}
          <header className="flex flex-col md:flex-row md:items-end justify-between border-b border-gray-100 dark:border-gray-800 pb-4 sm:pb-6 mb-6 sm:mb-8 gap-3 sm:gap-5">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse"></span>
                <span className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-blue-500 dark:text-blue-400">ACTIVE SESSION ENGINE</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black tracking-tight mt-1">EXECUTION DASHBOARD</h1>
              <div className="flex items-center gap-1.5 sm:gap-2 mt-1 flex-wrap">
                <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 hidden sm:block">Tactical execution & target-focused progression tracing.</p>
                <span className="text-gray-300 dark:text-gray-700 hidden sm:inline">|</span>
                <span className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse"></span>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-600 dark:text-cyan-400">Focus:</span>
                  <input
                    value={data.currentFocus}
                    onChange={(e) => updateCurrentFocus(e.target.value)}
                    className="text-xs font-semibold text-gray-700 dark:text-gray-300 bg-transparent border-b border-transparent hover:border-gray-300 dark:hover:border-gray-700 focus:border-cyan-500 outline-none rounded-none px-1 py-0 w-32 transition-all"
                    placeholder="Set focus subject..."
                  />
                </span>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2 items-center">
              <button 
                onClick={() => setIsDark(!isDark)} 
                className="p-2.5 border border-gray-200 dark:border-gray-800 rounded-lg bg-white dark:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-600 dark:text-gray-400"
                title="Toggle Theme"
              >
                {isDark ? <Sun size={15} /> : <Moon size={15} />}
              </button>
              <button 
                onClick={handleExportCSV} 
                className="flex items-center gap-1.5 px-3 py-2 border border-gray-200 dark:border-gray-800 rounded-lg bg-white dark:bg-gray-900 text-xs font-semibold hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                title="Export as CSV"
              >
                <Download size={13} /> Export CSV
              </button>
              <button 
                onClick={handleExportJSON} 
                className="flex items-center gap-1.5 px-3 py-2 border border-gray-200 dark:border-gray-800 rounded-lg bg-white dark:bg-gray-900 text-xs font-semibold hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                title="Export JSON backup"
              >
                <Download size={13} /> Export JSON
              </button>
              <button 
                onClick={handleImportClick} 
                className="flex items-center gap-1.5 px-3 py-2 border border-gray-200 dark:border-gray-800 rounded-lg bg-white dark:bg-gray-900 text-xs font-semibold hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                title="Import JSON backup"
              >
                <Download size={13} className="rotate-180" /> Import JSON
              </button>
              <button 
                onClick={() => setShowResetConfirm(true)} 
                className="flex items-center gap-1.5 px-3 py-2 border border-red-200 dark:border-red-900/40 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-lg text-xs font-bold transition-colors"
                title="Wipe data and reset"
              >
                <RefreshCw size={13} /> Clear Slate
              </button>
              <button
                onClick={() => { setPinStatus('locked'); setPinInput(''); }}
                className="flex items-center gap-1.5 px-3 py-2 border border-gray-200 dark:border-gray-800 rounded-lg bg-white dark:bg-gray-900 text-xs font-semibold hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                title="Lock dashboard"
              >
                🔒 Lock
              </button>
              {localStorage.getItem(PIN_KEY) && (
                <button
                  onClick={() => { localStorage.removeItem(PIN_KEY); setPinStatus('setup'); setPinInput(''); setPinConfirm(''); }}
                  className="flex items-center gap-1.5 px-3 py-2 border border-gray-200 dark:border-gray-800 rounded-lg bg-white dark:bg-gray-900 text-xs font-semibold hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  title="Change PIN"
                >
                  🔄 PIN
                </button>
              )}
            </div>
            <input type="file" accept=".json" ref={fileInputRef} onChange={handleFileSelected} className="hidden" />
          </header>

          {/* Navigation System */}
          <nav className="flex gap-3 sm:gap-4 mb-6 sm:mb-8 border-b border-gray-100 dark:border-gray-800/85 overflow-x-auto scrollbar-none pb-1">
            {[
              { id: 'execution', label: 'Layer 1: Daily Logs' },
              { id: 'technical', label: 'Layer 2: Hard Skills' },
              { id: 'antiDmn', label: 'Layer 3: Distraction Blocks' },
              { id: 'outputMomentum', label: 'Layer 5: Output Momentum' },
              { id: 'review', label: 'Layer 4: Aggregated Metrics' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`pb-3 text-sm font-semibold tracking-wide border-b-2 transition-all duration-150 whitespace-nowrap ${
                  activeTab === tab.id 
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400' 
                    : 'border-transparent text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>

          {/* Tab Pages */}
          <main className="pb-16">
            {activeTab === 'execution' && renderExecution()}
            {activeTab === 'technical' && renderTechnical()}
            {activeTab === 'antiDmn' && renderAntiDMN()}
            {activeTab === 'outputMomentum' && renderOutputMomentum()}
            {activeTab === 'review' && renderReview()}
          </main>

          {/* Custom Modals */}
          {renderModal()}
          {renderResetConfirmModal()}
          {renderImportConfirmModal()}
          {renderNewHabitModal()}
        </div>
      </div>
      {renderLockScreen()}
    </div>
  );
}