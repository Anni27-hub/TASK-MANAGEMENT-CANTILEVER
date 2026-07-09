import React, { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import { api } from '../services/api';
import './Dashboard.css';

// SVG Icons Definition to eliminate emoji symbols for a professional look

const HomeIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
    <polyline points="9 22 9 12 15 12 15 22"></polyline>
  </svg>
);

const LockIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
  </svg>
);

const RocketIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"></path>
    <path d="M12 15l-3-3m1.3-6.27a8 8 0 0 1 9.94 9.94L15 21H9l-3-3V12l6.27-6.27z"></path>
  </svg>
);

const PaletteIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 14.7255 3.09032 17.1962 4.85857 19C5.03442 19.1758 5.12234 19.2638 5.17604 19.3773C5.22974 19.4908 5.23467 19.6158 5.24451 19.8659L5.31758 21.7208C5.33405 22.1396 5.6791 22.476 6.09787 22.4828C6.34812 22.4869 6.47324 22.4889 6.58784 22.4347C6.70243 22.3804 6.78954 22.2906 6.96377 22.1109L8.43128 20.5968C8.5997 20.423 8.68392 20.3361 8.78442 20.2764C8.88492 20.2166 8.99539 20.1873 9.21634 20.1287C10.1172 19.8899 11.0457 19.75 12 19.75"></path>
    <circle cx="7.5" cy="10.5" r="1.5" fill="currentColor"></circle>
    <circle cx="11.5" cy="7.5" r="1.5" fill="currentColor"></circle>
    <circle cx="16.5" cy="9.5" r="1.5" fill="currentColor"></circle>
  </svg>
);

const ChatIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
  </svg>
);

const SettingsIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="3"></circle>
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
  </svg>
);

const HelpIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"></circle>
    <line x1="12" y1="16" x2="12" y2="12"></line>
    <line x1="12" y1="8" x2="12.01" y2="8"></line>
  </svg>
);

const LogoutIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
    <polyline points="16 17 21 12 16 7"></polyline>
    <line x1="21" y1="12" x2="9" y2="12"></line>
  </svg>
);

const FilterIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="4" y1="21" x2="4" y2="14"></line>
    <line x1="4" y1="10" x2="4" y2="3"></line>
    <line x1="12" y1="21" x2="12" y2="12"></line>
    <line x1="12" y1="8" x2="12" y2="3"></line>
    <line x1="20" y1="21" x2="20" y2="16"></line>
    <line x1="20" y1="12" x2="20" y2="3"></line>
    <line x1="1" y1="14" x2="7" y2="14"></line>
    <line x1="9" y1="8" x2="15" y2="8"></line>
    <line x1="17" y1="16" x2="23" y2="16"></line>
  </svg>
);

const TrashIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6"></polyline>
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
    <line x1="10" y1="11" x2="10" y2="17"></line>
    <line x1="14" y1="11" x2="14" y2="17"></line>
  </svg>
);

const FolderIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
  </svg>
);

const ClockIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"></circle>
    <polyline points="12 6 12 12 16 14"></polyline>
  </svg>
);

const CheckSquareIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 11 12 14 22 4"></polyline>
    <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
  </svg>
);

// Map categories to SVGs
const getCategorySvg = (label, stroke = "currentColor", size = 22) => {
  switch (label) {
    case 'Projects':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
          <circle cx="9" cy="7" r="4"></circle>
          <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
          <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
        </svg>
      );
    case 'Design':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"></path>
          <path d="M12 18V12H16"></path>
        </svg>
      );
    case 'Meeting':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
          <line x1="16" y1="2" x2="16" y2="6"></line>
          <line x1="8" y1="2" x2="8" y2="6"></line>
          <line x1="3" y1="10" x2="21" y2="10"></line>
        </svg>
      );
    default:
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
          <polyline points="14 2 14 8 20 8"></polyline>
          <line x1="16" y1="13" x2="8" y2="13"></line>
          <line x1="16" y1="17" x2="8" y2="17"></line>
          <line x1="10" y1="9" x2="8" y2="9"></line>
        </svg>
      );
  }
};

const Dashboard = ({ user, onLogout }) => {
  const [tasks, setTasks] = useState([]);
  const [activeTab, setActiveTab] = useState('Your Content');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTask, setActiveTask] = useState(null);
  const [sortOrder, setSortOrder] = useState('desc');

  // Quick creation input
  const [quickTitle, setQuickTitle] = useState('');

  // Task details editing
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editPriority, setEditPriority] = useState('Medium');
  const [newSubTaskTitle, setNewSubTaskTitle] = useState('');

  // Category addition states
  const [categories, setCategories] = useState(['All', 'Projects', 'Meeting', 'Design']);
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');

  // Settings view fields
  const [profileName, setProfileName] = useState(user.name || '');
  const [profileEmail, setProfileEmail] = useState(user.email || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [settingsSuccess, setSettingsSuccess] = useState('');
  const [settingsError, setSettingsError] = useState('');

  // Help view fields
  const [supportSubject, setSupportSubject] = useState('');
  const [supportMessage, setSupportMessage] = useState('');
  const [supportSuccess, setSupportSuccess] = useState(false);
  const [faqOpen, setFaqOpen] = useState(null);

  // Real-time Chat & WebSockets states
  const [socket, setSocket] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');

  // Admin Chat Inbox states
  const [adminThreads, setAdminThreads] = useState([]);
  const [activeThreadUser, setActiveThreadUser] = useState(null);

  // 4. Campaigns module fields
  const [campaigns, setCampaigns] = useState([]);
  const [newCampName, setNewCampName] = useState('');
  const [newCampPlatform, setNewCampPlatform] = useState('Instagram');
  const [newCampBudget, setNewCampBudget] = useState('');

  // 5. Art Assets module fields
  const [artAssets, setArtAssets] = useState([]);
  const [newAssetTitle, setNewAssetTitle] = useState('');
  const [newAssetCategory, setNewAssetCategory] = useState('Logo');
  const [newAssetTheme, setNewAssetTheme] = useState('theme-purple');
  const [newAssetStatus, setNewAssetStatus] = useState('Draft');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const messagesEndRef = useRef(null);

  // Auto-scroll chat to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages]);

  // Connect to Socket.io server
  useEffect(() => {
    const socketUrl = window.location.origin.includes('localhost') 
      ? 'http://localhost:5000' 
      : (import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace(/\/api$/, '') : 'https://your-heroku-app.herokuapp.com');
    const newSocket = io(socketUrl);
    setSocket(newSocket);

    // Join room
    newSocket.emit('join', { userId: user.id, role: user.role });

    return () => {
      newSocket.close();
    };
  }, [user]);

  // Listen for real-time WebSocket messages
  useEffect(() => {
    if (!socket) return;

    const handleMessageReceived = (msg) => {
      // 1. Regular User logic: append if it is their thread
      if (user.role !== 'admin') {
        setChatMessages((prev) => {
          if (prev.some((m) => m._id === msg._id)) return prev;
          return [...prev, msg];
        });
      } 
      // 2. Admin logic:
      else {
        // If viewing this user's thread, append to display
        if (activeThreadUser && msg.user === activeThreadUser._id) {
          setChatMessages((prev) => {
            if (prev.some((m) => m._id === msg._id)) return prev;
            return [...prev, msg];
          });
        }
        // Refresh admin sidebar thread list
        fetchAdminThreads();
      }
    };

    socket.on('message', handleMessageReceived);

    return () => {
      socket.off('message', handleMessageReceived);
    };
  }, [socket, activeThreadUser, user]);

  // Fetch initial tasks
  const fetchTasks = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await api.tasks.getAll({ search: searchQuery, order: sortOrder });
      setTasks(response.tasks);
      
      if (activeTask) {
        const updated = response.tasks.find(t => t._id === activeTask._id);
        if (updated) {
          setActiveTask(updated);
        }
      } else if (response.tasks.length > 0 && !activeTask) {
        setActiveTask(response.tasks[0]);
      }
    } catch (err) {
      setError('Failed to fetch tasks.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [searchQuery, sortOrder]);

  // Sync edits when active task changes
  useEffect(() => {
    if (activeTask) {
      setEditTitle(activeTask.title);
      setEditDescription(activeTask.description || '');
      setEditPriority(activeTask.priority || 'Medium');
      setIsEditing(false);
    }
  }, [activeTask]);

  // Fetch chat history for regular users
  const fetchChatHistory = async () => {
    try {
      const response = await api.messages.getHistory();
      setChatMessages(response.messages);
    } catch (err) {
      console.error('Failed to load chat history.');
    }
  };

  // Fetch thread lists for Admins
  const fetchAdminThreads = async () => {
    try {
      const response = await api.messages.getAdminThreads();
      setAdminThreads(response.threads);
      if (response.threads.length > 0 && !activeThreadUser) {
        // Select first thread by default
        setActiveThreadUser(response.threads[0].user);
      }
    } catch (err) {
      console.error('Failed to fetch support threads.');
    }
  };

  // Fetch detail chat thread for selected user (Admins)
  const fetchAdminThreadDetails = async (targetUserId) => {
    try {
      const response = await api.messages.getAdminThreadDetails(targetUserId);
      setChatMessages(response.messages);
    } catch (err) {
      console.error('Failed to fetch thread details.');
    }
  };

  const fetchCampaigns = async () => {
    try {
      const response = await api.campaigns.getAll();
      setCampaigns(response.campaigns);
    } catch (err) {
      console.error('Failed to load campaigns:', err);
    }
  };

  const fetchArtAssets = async () => {
    try {
      const response = await api.art.getAll();
      setArtAssets(response.assets);
    } catch (err) {
      console.error('Failed to load art assets:', err);
    }
  };

  // Trigger loading chat/campaign/art data when tab switches
  useEffect(() => {
    if (activeTab === 'Chat') {
      if (user.role === 'admin') {
        fetchAdminThreads();
      } else {
        fetchChatHistory();
      }
    } else if (activeTab === 'Campaigns') {
      fetchCampaigns();
    } else if (activeTab === 'Art') {
      fetchArtAssets();
    }
  }, [activeTab]);

  // Load selected thread logs for admin
  useEffect(() => {
    if (activeThreadUser && user.role === 'admin' && activeTab === 'Chat') {
      fetchAdminThreadDetails(activeThreadUser._id);
    }
  }, [activeThreadUser, activeTab]);

  const getCategoryTheme = (title = '') => {
    const t = title.toLowerCase();
    if (t.includes('brief') || t.includes('project') || t.includes('salsile')) {
      return { label: 'Projects', colorClass: 'theme-purple' };
    } else if (t.includes('design') || t.includes('management') || t.includes('template')) {
      return { label: 'Design', colorClass: 'theme-yellow' };
    } else if (t.includes('meeting') || t.includes('sync') || t.includes('daily') || t.includes('due')) {
      return { label: 'Meeting', colorClass: 'theme-blue' };
    }
    return { label: 'General', colorClass: 'theme-grey' };
  };

  const getFilteredTasks = () => {
    return tasks.filter(task => {
      if (categoryFilter === 'All') return true;
      const theme = getCategoryTheme(task.title);
      return theme.label === categoryFilter;
    });
  };

  const handleQuickCreate = async (e) => {
    e.preventDefault();
    if (!quickTitle.trim()) return;

    try {
      let priority = 'Medium';
      if (categoryFilter === 'Projects') priority = 'High';

      const newTask = await api.tasks.create({
        title: quickTitle,
        description: `Quick task added inside category: "${categoryFilter}".`,
        priority: priority,
        status: 'Pending',
        dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)
      });

      setQuickTitle('');
      await fetchTasks();
      setActiveTask(newTask.task);
    } catch (err) {
      console.error('Failed to create task:', err);
    }
  };

  const handleSaveEdits = async () => {
    if (!activeTask) return;
    try {
      await api.tasks.update(activeTask._id, {
        title: editTitle,
        description: editDescription,
        priority: editPriority
      });
      setIsEditing(false);
      fetchTasks();
    } catch (err) {
      console.error('Failed to save task:', err);
    }
  };

  const handleDeleteTask = async () => {
    if (!activeTask) return;
    try {
      await api.tasks.delete(activeTask._id);
      const remaining = tasks.filter(t => t._id !== activeTask._id);
      setTasks(remaining);
      setActiveTask(remaining.length > 0 ? remaining[0] : null);
      setIsEditing(false);
    } catch (err) {
      console.error('Failed to delete task:', err);
    }
  };

  const handleAddSubTask = async (e) => {
    e.preventDefault();
    if (!newSubTaskTitle.trim() || !activeTask) return;

    const updatedSubTasks = [
      ...(activeTask.subTasks || []),
      { title: newSubTaskTitle, completed: false }
    ];

    try {
      await api.tasks.update(activeTask._id, {
        subTasks: updatedSubTasks
      });
      setNewSubTaskTitle('');
      fetchTasks();
    } catch (err) {
      console.error('Failed to add checklist item:', err);
    }
  };

  const handleToggleSubTask = async (subTaskId) => {
    if (!activeTask) return;

    const updatedSubTasks = activeTask.subTasks.map(item => {
      if (item._id === subTaskId) {
        return { ...item, completed: !item.completed };
      }
      return item;
    });

    try {
      await api.tasks.update(activeTask._id, {
        subTasks: updatedSubTasks
      });
      fetchTasks();
    } catch (err) {
      console.error('Failed to update checklist item:', err);
    }
  };

  const handleAddCategorySubmit = (e) => {
    e.preventDefault();
    const name = newCategoryName.trim();
    if (!name) return;
    
    const formattedName = name.charAt(0).toUpperCase() + name.slice(1);
    
    if (!categories.includes(formattedName)) {
      setCategories(prev => [...prev, formattedName]);
    }
    setCategoryFilter(formattedName);
    setActiveTab('Your Content');
    setNewCategoryName('');
    setIsAddingCategory(false);
  };

  // Profile Save
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSettingsSuccess('');
    setSettingsError('');
    
    if (newPassword && newPassword !== confirmPassword) {
      setSettingsError('New passwords do not match');
      return;
    }

    try {
      await api.auth.updateProfile({
        name: profileName,
        email: profileEmail,
        ...(newPassword && { password: newPassword, currentPassword })
      });
      
      setSettingsSuccess('Profile details saved successfully!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      
      user.name = profileName;
      user.email = profileEmail;
    } catch (err) {
      setSettingsError(err.message || 'Failed to save changes.');
    }
  };

  // Support Ticket Form Submit
  const handleSendTicket = (e) => {
    e.preventDefault();
    if (!supportSubject.trim() || !supportMessage.trim()) return;
    setSupportSuccess(true);
    setSupportSubject('');
    setSupportMessage('');
  };

  const formatReach = (num) => {
    if (num >= 1000000) return (num / 1000000).toFixed(2) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(0) + 'k';
    return num;
  };

  const handleCreateCampaign = async (e) => {
    e.preventDefault();
    if (!newCampName.trim() || !newCampBudget) return;
    
    try {
      const budgetVal = parseFloat(newCampBudget);
      const simulatedReach = Math.round(budgetVal * (45 + Math.random() * 20));
      
      let baseCtr = 5.0;
      if (newCampPlatform === 'Email') baseCtr = 11.5;
      else if (newCampPlatform === 'TikTok') baseCtr = 7.8;
      else if (newCampPlatform === 'Google Ads') baseCtr = 5.8;
      const simulatedCtr = parseFloat((baseCtr + (Math.random() * 2 - 1)).toFixed(1));

      await api.campaigns.create({
        name: newCampName,
        platform: newCampPlatform,
        budget: budgetVal,
        spent: 0,
        status: 'Active',
        reach: simulatedReach,
        ctr: simulatedCtr
      });

      setNewCampName('');
      setNewCampBudget('');
      fetchCampaigns();
    } catch (err) {
      console.error('Failed to save campaign:', err);
    }
  };

  const handleAddArtAsset = async (e) => {
    e.preventDefault();
    if (!newAssetTitle.trim()) return;
    
    try {
      await api.art.create({
        title: newAssetTitle,
        category: newAssetCategory,
        theme: newAssetTheme,
        status: newAssetStatus
      });

      setNewAssetTitle('');
      fetchArtAssets();
    } catch (err) {
      console.error('Failed to save art asset:', err);
    }
  };

  // WebSockets Send Message Flow
  const handleSendChatMessage = (e) => {
    e.preventDefault();
    if (!chatInput.trim() || !socket) return;

    const isUserAdmin = user.role === 'admin';
    const activeUserId = isUserAdmin ? activeThreadUser?._id : user.id;

    if (!activeUserId) {
      return;
    }

    // Emit event through Socket.io server
    socket.emit('sendMessage', {
      userId: activeUserId,
      senderId: user.id,
      senderName: user.name,
      text: chatInput,
      isAdminSender: isUserAdmin
    });

    setChatInput('');
  };

  const calculateEstTime = (task) => {
    const text = (task.title + ' ' + (task.description || '')).length;
    return Math.max(2, Math.ceil(text / 80));
  };

  const formatTaskDate = (dateStr) => {
    if (!dateStr) return '14-08-2023';
    const d = new Date(dateStr);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
  };

  return (
    <div className="paysphere-app">
      {/* 1. Left Sidebar */}
      <aside className="paysphere-sidebar">
        <div className="brand-logo-area">
          <div className="logo-circle">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#5c67f2" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
            </svg>
          </div>
          <span className="brand-name">TaskForge</span>
        </div>

        <ul className="sidebar-menu">
          <li 
            className={`menu-item ${activeTab === 'Dashboard' ? 'active' : ''}`}
            onClick={() => setActiveTab('Dashboard')}
          >
            <span className="menu-icon"><HomeIcon /></span> Dashboard
          </li>
          <li 
            className={`menu-item ${activeTab === 'Your Content' ? 'active' : ''}`}
            onClick={() => setActiveTab('Your Content')}
          >
            <span className="menu-icon"><LockIcon /></span> Your Content
          </li>
          <li 
            className={`menu-item ${activeTab === 'Campaigns' ? 'active' : ''}`}
            onClick={() => setActiveTab('Campaigns')}
          >
            <span className="menu-icon"><RocketIcon /></span> Campaigns
          </li>
          <li 
            className={`menu-item ${activeTab === 'Art' ? 'active' : ''}`}
            onClick={() => setActiveTab('Art')}
          >
            <span className="menu-icon"><PaletteIcon /></span> Art
          </li>
          <li 
            className={`menu-item ${activeTab === 'Chat' ? 'active' : ''}`}
            onClick={() => setActiveTab('Chat')}
          >
            <span className="menu-icon"><ChatIcon /></span> Chat
          </li>
        </ul>

        <div className="sidebar-divider"></div>

        <ul className="sidebar-menu footer-menu">
          <li 
            className={`menu-item ${activeTab === 'Settings' ? 'active' : ''}`} 
            onClick={() => setActiveTab('Settings')}
          >
            <span className="menu-icon"><SettingsIcon /></span> Settings
          </li>
          <li 
            className={`menu-item ${activeTab === 'Help' ? 'active' : ''}`} 
            onClick={() => setActiveTab('Help')}
          >
            <span className="menu-icon"><HelpIcon /></span> Help & Support
          </li>
          <li className="menu-item logout" onClick={onLogout}>
            <span className="menu-icon"><LogoutIcon /></span> Sign Out
          </li>
        </ul>
      </aside>

      {/* Main Container */}
      <div className="paysphere-main-container">
        
        {/* 2. Top Header */}
        <header className="paysphere-header saas-card">
          <div className="user-profile-summary">
            <div className="user-avatar">
              {profileName ? profileName.substring(0, 2).toUpperCase() : 'EJ'}
            </div>
            <span className="user-name-text">
              {profileName || 'Elene Janashvili'} {user.role === 'admin' && <span className="admin-pill-badge">Staff</span>}
            </span>
          </div>

          <div className="category-capsule-tabs">
            {categories.map((cat) => (
              <button
                key={cat}
                className={`tab-capsule ${categoryFilter === cat ? 'active' : ''}`}
                onClick={() => {
                  setCategoryFilter(cat);
                  setActiveTab('Your Content');
                }}
              >
                {cat}
              </button>
            ))}
            {isAddingCategory ? (
              <form onSubmit={handleAddCategorySubmit} style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', marginLeft: '6px' }}>
                <input
                  type="text"
                  placeholder="New..."
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  autoFocus
                  style={{
                    border: '1px solid var(--border-color)',
                    borderRadius: '20px',
                    padding: '6px 14px',
                    fontSize: '0.82rem',
                    outline: 'none',
                    background: '#ffffff',
                    fontFamily: 'var(--font-secondary)',
                    width: '90px'
                  }}
                />
                <button
                  type="submit"
                  style={{
                    border: 'none',
                    background: '#5c67f2',
                    color: '#ffffff',
                    width: '26px',
                    height: '26px',
                    borderRadius: '50%',
                    cursor: 'pointer',
                    fontWeight: 'bold',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.75rem'
                  }}
                >
                  ✓
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsAddingCategory(false);
                    setNewCategoryName('');
                  }}
                  style={{
                    border: 'none',
                    background: 'transparent',
                    color: 'var(--text-light)',
                    cursor: 'pointer',
                    fontSize: '0.95rem',
                    padding: '0 4px'
                  }}
                >
                  ×
                </button>
              </form>
            ) : (
              <button className="tab-capsule add-btn" onClick={() => setIsAddingCategory(true)}>+</button>
            )}
          </div>
        </header>

        {activeTab === 'Settings' ? (
          /* Settings view */
          <div className="settings-pane saas-card animate-fade-in">
            <h2>Account Settings</h2>
            <p className="pane-subtitle">Manage your profile details and security configurations.</p>

            {settingsSuccess && <div className="settings-alert-success">{settingsSuccess}</div>}
            {settingsError && <div className="settings-alert-danger">{settingsError}</div>}

            <form onSubmit={handleSaveProfile} className="settings-form">
              <div className="form-row">
                <div className="settings-form-group">
                  <label htmlFor="settings-name">Full Name</label>
                  <input
                    type="text"
                    id="settings-name"
                    value={profileName}
                    onChange={(e) => setProfileName(e.target.value)}
                    required
                  />
                </div>
                <div className="settings-form-group">
                  <label htmlFor="settings-email">Email Address</label>
                  <input
                    type="email"
                    id="settings-email"
                    value={profileEmail}
                    onChange={(e) => setProfileEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="settings-divider"></div>
              <h3>Change Password</h3>
              <p className="section-subtitle">To update password, fill in the fields below. Otherwise, leave blank.</p>

              <div className="settings-form-group">
                <label htmlFor="settings-current-pwd">Current Password</label>
                <input
                  type="password"
                  id="settings-current-pwd"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="••••••••"
                  required={newPassword.length > 0}
                />
              </div>

              <div className="form-row">
                <div className="settings-form-group">
                  <label htmlFor="settings-new-pwd">New Password</label>
                  <input
                    type="password"
                    id="settings-new-pwd"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Minimum 6 characters"
                    minLength={6}
                  />
                </div>
                <div className="settings-form-group">
                  <label htmlFor="settings-confirm-pwd">Confirm New Password</label>
                  <input
                    type="password"
                    id="settings-confirm-pwd"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Match new password"
                  />
                </div>
              </div>

              <button type="submit" className="settings-submit-btn blue-save-btn">Save Changes</button>
            </form>
          </div>
        ) : activeTab === 'Help' ? (
          /* Help & Support view */
          <div className="help-pane saas-card animate-fade-in">
            <h2>Help & Support</h2>
            <p className="pane-subtitle">Read instructions or submit support tickets to our managers.</p>

            <div className="help-sections-grid">
              
              {/* FAQ Section */}
              <div className="faq-panel">
                <h3>Frequently Asked Questions</h3>
                <div className="accordion-container">
                  {[
                    { q: "How do I create a task?", a: "Go to the 'Your Content' workspace. Use the quick input field labeled 'What do you want to create?' and click Create." },
                    { q: "How do I manage checklist items?", a: "Select any task from your list, and use the 'To-do list' panel in the right pane to add, complete, or review items." },
                    { q: "How do I edit my profile name?", a: "Click 'Settings' on the bottom left. Edit your 'Full Name' and click 'Save Changes'." }
                  ].map((item, idx) => (
                    <div key={idx} className="accordion-item">
                      <button 
                        className={`accordion-header ${faqOpen === idx ? 'open' : ''}`}
                        onClick={() => setFaqOpen(faqOpen === idx ? null : idx)}
                      >
                        {item.q}
                        <span className="accordion-arrow">{faqOpen === idx ? '▲' : '▼'}</span>
                      </button>
                      {faqOpen === idx && (
                        <div className="accordion-body animate-fade-in">
                          <p>{item.a}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Support Ticket Section */}
              <div className="ticket-panel">
                <h3>Submit a Ticket</h3>
                {supportSuccess ? (
                  <div className="ticket-success-message">
                    <div className="success-icon">✓</div>
                    <h4>Support Ticket Submitted</h4>
                    <p>We have received your ticket. Our agency team will contact you at your account email address within 24 hours.</p>
                    <button onClick={() => setSupportSuccess(false)} className="edit-outline-btn">Submit Another Ticket</button>
                  </div>
                ) : (
                  <form onSubmit={handleSendTicket} className="ticket-form">
                    <div className="ticket-form-group">
                      <label htmlFor="ticket-subject">Subject</label>
                      <input
                        type="text"
                        id="ticket-subject"
                        placeholder="e.g. Issue completing subtasks"
                        value={supportSubject}
                        onChange={(e) => setSupportSubject(e.target.value)}
                        required
                      />
                    </div>
                    <div className="ticket-form-group">
                      <label htmlFor="ticket-msg">Message details</label>
                      <textarea
                        id="ticket-msg"
                        placeholder="Write detailed explanations of what is wrong..."
                        rows={6}
                        value={supportMessage}
                        onChange={(e) => setSupportMessage(e.target.value)}
                        required
                      />
                    </div>
                    <button type="submit" className="blue-save-btn">Submit Ticket</button>
                  </form>
                )}
              </div>

            </div>
          </div>
        ) : activeTab === 'Chat' ? (
          /* 4. REAL-TIME CHAT PANEL (Admins get Support Inbox, Users get Support Chat Room) */
          user.role === 'admin' ? (
            /* Admin view: Real-time support dashboard threads list */
            <div className="two-column-workspace animate-fade-in">
              {/* Left support inbox threads */}
              <div className="left-workspace saas-card">
                <div className="workspace-column-header">
                  <div>
                    <h2>Support Inbox</h2>
                    <span className="subtitle-count">{adminThreads.length} Tickets</span>
                  </div>
                </div>
                
                <div className="tasks-vertical-list" style={{ marginTop: '12px' }}>
                  {adminThreads.map((thread) => {
                    const isThreadActive = activeThreadUser && activeThreadUser._id === thread.user?._id;
                    return (
                      <div
                        key={thread._id}
                        className={`task-row-card ${isThreadActive ? 'active' : ''}`}
                        onClick={() => setActiveThreadUser(thread.user)}
                      >
                        <div className="task-color-box theme-purple">
                          <span className="task-row-icon">👤</span>
                        </div>
                        <div className="task-row-details">
                          <h4>{thread.user?.name || 'Anonymous User'}</h4>
                          <p>{thread.lastMessage || 'Open thread...'}</p>
                          <div className="task-row-footer">
                            <span className="date-text">{new Date(thread.lastMessageTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  {adminThreads.length === 0 && (
                    <div className="empty-column-state">
                      <p>No support tickets received yet.</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Right support message board */}
              <div className="right-workspace">
                {activeThreadUser ? (
                  <div className="chat-pane saas-card">
                    <div className="chat-pane-header">
                      <div className="chat-agent-avatar">
                        {activeThreadUser.name ? activeThreadUser.name.substring(0, 2).toUpperCase() : 'US'}
                      </div>
                      <div>
                        <h3>Chatting with: {activeThreadUser.name}</h3>
                        <span className="online-indicator">{activeThreadUser.email}</span>
                      </div>
                    </div>

                    <div className="chat-messages-container">
                      {chatMessages.map((msg) => {
                        const isMsgFromMe = msg.isAdminSender;
                        return (
                          <div key={msg._id || msg.id} className={`chat-message-row ${isMsgFromMe ? 'user' : 'support'}`}>
                            <div className="chat-bubble">
                              {msg.text}
                            </div>
                          </div>
                        );
                      })}
                      <div ref={messagesEndRef} />
                    </div>

                    <form onSubmit={handleSendChatMessage} className="chat-input-bar">
                      <input
                        type="text"
                        placeholder={`Reply to ${activeThreadUser.name}...`}
                        value={chatInput}
                        onChange={(e) => setChatInput(e.target.value)}
                        required
                      />
                      <button type="submit" className="chat-send-btn">Send</button>
                    </form>
                  </div>
                ) : (
                  <div className="no-active-task saas-card">
                    <h3>No active ticket selected</h3>
                    <p>Select a user thread from the Support Inbox to start chatting.</p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* User view: Real-time chat with support assistant */
            <div className="chat-pane saas-card animate-fade-in" style={{ maxWidth: '800px', margin: '0 auto', width: '100%' }}>
              <div className="chat-pane-header">
                <div className="chat-agent-avatar">TF</div>
                <div>
                  <h3>TaskForge Support Assistant</h3>
                  <span className="online-indicator"><span className="green-dot"></span> Online</span>
                </div>
              </div>

              <div className="chat-messages-container">
                {chatMessages.length === 0 && (
                  <div className="chat-message-row support">
                    <div className="chat-bubble">
                      Hello! Welcome to TaskForge Support. Send a message to chat with our staff in real-time.
                    </div>
                  </div>
                )}
                {chatMessages.map((msg) => {
                  const isMsgFromMe = !msg.isAdminSender;
                  return (
                    <div key={msg._id || msg.id} className={`chat-message-row ${isMsgFromMe ? 'user' : 'support'}`}>
                      <div className="chat-bubble">
                        {msg.text}
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              <form onSubmit={handleSendChatMessage} className="chat-input-bar">
                <input
                  type="text"
                  placeholder="Type a message to support staff..."
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  required
                />
                <button type="submit" className="chat-send-btn">Send</button>
              </form>
            </div>
          )
        ) : activeTab === 'Campaigns' ? (
          /* Campaigns View */
          <div className="campaigns-pane animate-fade-in">
            <div className="analytics-metrics" style={{ marginBottom: '24px' }}>
              <div className="metric-box saas-card">
                <span className="metric-emoji" style={{ color: '#5c67f2', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="12 2 2 22 22 22 12 2"></polygon>
                  </svg>
                </span>
                <div>
                  <h4>{(campaigns.reduce((acc, c) => acc + c.budget, 0)).toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })}</h4>
                  <p>Total Marketing Budget</p>
                </div>
              </div>
              <div className="metric-box saas-card">
                <span className="metric-emoji" style={{ color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
                    <polyline points="17 6 23 6 23 12"></polyline>
                  </svg>
                </span>
                <div>
                  <h4>{formatReach(campaigns.reduce((acc, c) => acc + c.reach, 0))}</h4>
                  <p>Aggregate Campaign Reach</p>
                </div>
              </div>
              <div className="metric-box saas-card">
                <span className="metric-emoji" style={{ color: '#f59e0b', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
                  </svg>
                </span>
                <div>
                  <h4>{(campaigns.reduce((acc, c) => acc + c.ctr, 0) / campaigns.length).toFixed(1)}%</h4>
                  <p>Average Conversion Rate</p>
                </div>
              </div>
            </div>

            <div className="two-column-workspace">
              {/* Left Column: Create Campaign Form */}
              <div className="left-workspace saas-card" style={{ flex: '0 0 350px' }}>
                <div className="workspace-column-header">
                  <h2>Launch Campaign</h2>
                </div>
                <form onSubmit={handleCreateCampaign} className="settings-form" style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div className="settings-form-group">
                    <label htmlFor="camp-name">Campaign Name</label>
                    <input
                      type="text"
                      id="camp-name"
                      placeholder="e.g. Autumn Clothing Promo"
                      value={newCampName}
                      onChange={(e) => setNewCampName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="settings-form-group">
                    <label htmlFor="camp-platform">Platform</label>
                    <select
                      id="camp-platform"
                      value={newCampPlatform}
                      onChange={(e) => setNewCampPlatform(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '12px',
                        background: '#f9fafb',
                        border: '1px solid var(--border-color)',
                        borderRadius: 'var(--border-radius-sm)',
                        color: 'var(--text-main)',
                        fontSize: '0.95rem',
                        outline: 'none',
                        cursor: 'pointer'
                      }}
                    >
                      <option value="Instagram">Instagram</option>
                      <option value="Google Ads">Google Ads</option>
                      <option value="TikTok">TikTok</option>
                      <option value="Email">Email Marketing</option>
                      <option value="Facebook">Facebook</option>
                    </select>
                  </div>
                  <div className="settings-form-group">
                    <label htmlFor="camp-budget">Budget Allocation ($)</label>
                    <input
                      type="number"
                      id="camp-budget"
                      placeholder="e.g. 5000"
                      value={newCampBudget}
                      onChange={(e) => setNewCampBudget(e.target.value)}
                      required
                      min="1"
                    />
                  </div>
                  <button type="submit" className="blue-save-btn" style={{ width: '100%' }}>Launch Campaign</button>
                </form>
              </div>

              {/* Right Column: Campaigns List Grid */}
              <div className="right-workspace saas-card" style={{ flex: 1, padding: '24px' }}>
                <div className="workspace-column-header">
                  <h2>Active Campaigns ({campaigns.length})</h2>
                </div>
                
                <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {campaigns.map((camp) => {
                    const pctSpent = Math.min(100, Math.round((camp.spent / camp.budget) * 100));
                    return (
                      <div key={camp._id || camp.id} style={{
                        padding: '16px',
                        border: '1px solid var(--border-color)',
                        borderRadius: 'var(--border-radius-sm)',
                        background: '#f9fafb',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '12px'
                      }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <div>
                            <h4 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-main)' }}>{camp.name}</h4>
                            <span style={{ fontSize: '0.8rem', color: 'var(--text-light)', fontWeight: 600 }}>Platform: {camp.platform}</span>
                          </div>
                          <span className={`pill-badge ${camp.status === 'Active' ? 'status-completed-badge' : 'status-pending-badge'}`}>
                            {camp.status}
                          </span>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                          <span>Reach: <strong>{formatReach(camp.reach)}</strong></span>
                          <span>CTR: <strong>{camp.ctr}%</strong></span>
                          <span>Budget: <strong>${camp.spent} / ${camp.budget}</strong></span>
                        </div>

                        <div style={{ width: '100%', height: '8px', background: '#e5e7eb', borderRadius: '4px', overflow: 'hidden' }}>
                          <div style={{ width: `${pctSpent}%`, height: '100%', background: '#5c67f2', borderRadius: '4px', transition: 'width 0.4s ease' }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        ) : activeTab === 'Art' ? (
          /* Art View */
          <div className="art-pane animate-fade-in">
            <div className="two-column-workspace">
              
              {/* Left Column: Asset registry form */}
              <div className="left-workspace saas-card" style={{ flex: '0 0 350px' }}>
                <div className="workspace-column-header">
                  <h2>Register Art Asset</h2>
                </div>
                <form onSubmit={handleAddArtAsset} className="settings-form" style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div className="settings-form-group">
                    <label htmlFor="art-title">Asset Name / Title</label>
                    <input
                      type="text"
                      id="art-title"
                      placeholder="e.g. Salsile Landing Banner"
                      value={newAssetTitle}
                      onChange={(e) => setNewAssetTitle(e.target.value)}
                      required
                    />
                  </div>
                  <div className="settings-form-group">
                    <label htmlFor="art-category">Category</label>
                    <select
                      id="art-category"
                      value={newAssetCategory}
                      onChange={(e) => setNewAssetCategory(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '12px',
                        background: '#f9fafb',
                        border: '1px solid var(--border-color)',
                        borderRadius: 'var(--border-radius-sm)',
                        color: 'var(--text-main)',
                        fontSize: '0.95rem',
                        outline: 'none',
                        cursor: 'pointer'
                      }}
                    >
                      <option value="Logo">Logo & Identity</option>
                      <option value="Banner">Advertising Banner</option>
                      <option value="Illustration">Illustration / Vector</option>
                      <option value="UI/UX">UI Wireframe / Screen</option>
                    </select>
                  </div>
                  <div className="settings-form-group">
                    <label htmlFor="art-theme">Accent Theme Gradient</label>
                    <select
                      id="art-theme"
                      value={newAssetTheme}
                      onChange={(e) => setNewAssetTheme(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '12px',
                        background: '#f9fafb',
                        border: '1px solid var(--border-color)',
                        borderRadius: 'var(--border-radius-sm)',
                        color: 'var(--text-main)',
                        fontSize: '0.95rem',
                        outline: 'none',
                        cursor: 'pointer'
                      }}
                    >
                      <option value="theme-purple">Periwinkle Purple</option>
                      <option value="theme-blue">Ocean Blue</option>
                      <option value="theme-yellow">Amber Gold</option>
                      <option value="theme-grey">Minimalist Slate</option>
                    </select>
                  </div>
                  <div className="settings-form-group">
                    <label htmlFor="art-status">Status</label>
                    <select
                      id="art-status"
                      value={newAssetStatus}
                      onChange={(e) => setNewAssetStatus(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '12px',
                        background: '#f9fafb',
                        border: '1px solid var(--border-color)',
                        borderRadius: 'var(--border-radius-sm)',
                        color: 'var(--text-main)',
                        fontSize: '0.95rem',
                        outline: 'none',
                        cursor: 'pointer'
                      }}
                    >
                      <option value="Draft">Draft</option>
                      <option value="In Review">In Review</option>
                      <option value="Approved">Approved</option>
                    </select>
                  </div>
                  <button type="submit" className="blue-save-btn" style={{ width: '100%' }}>Register Creative Asset</button>
                </form>
              </div>

              {/* Right Column: Asset Masonry Grid */}
              <div className="right-workspace saas-card" style={{ flex: 1, padding: '24px' }}>
                <div className="workspace-column-header">
                  <h2>Creative Library ({artAssets.length})</h2>
                </div>
                
                <div style={{
                  marginTop: '20px',
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                  gap: '16px'
                }}>
                  {artAssets.map((asset) => {
                    let grad = 'linear-gradient(135deg, #5c67f2, #818cf8)';
                    if (asset.theme === 'theme-blue') grad = 'linear-gradient(135deg, #3b82f6, #93c5fd)';
                    else if (asset.theme === 'theme-yellow') grad = 'linear-gradient(135deg, #f59e0b, #fde047)';
                    else if (asset.theme === 'theme-grey') grad = 'linear-gradient(135deg, #4b5563, #cbd5e1)';

                    return (
                      <div key={asset._id || asset.id} style={{
                        border: '1px solid var(--border-color)',
                        borderRadius: 'var(--border-radius-sm)',
                        overflow: 'hidden',
                        background: '#ffffff',
                        boxShadow: 'var(--shadow-sm)',
                        display: 'flex',
                        flexDirection: 'column'
                      }} className="art-card-item">
                        <div style={{
                          height: '110px',
                          background: grad,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#ffffff',
                          fontWeight: 800,
                          fontSize: '1.1rem',
                          textShadow: '0 2px 4px rgba(0,0,0,0.1)'
                        }}>
                          {asset.category.toUpperCase()}
                        </div>
                        <div style={{ padding: '12px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '8px' }}>
                          <div>
                            <h4 style={{ margin: 0, fontSize: '0.92rem', fontWeight: 700, color: 'var(--text-main)', lineHeight: '1.3' }}>{asset.title}</h4>
                            <span style={{ fontSize: '0.78rem', color: 'var(--text-light)', fontWeight: 600 }}>Date: {asset.createdAt ? formatTaskDate(asset.createdAt) : asset.date}</span>
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span className={`pill-badge ${asset.status === 'Approved' ? 'status-completed-badge' : asset.status === 'In Review' ? 'status-pending-badge' : 'status-draft-badge'}`}
                              style={{
                                padding: '2px 8px',
                                fontSize: '0.72rem',
                                background: asset.status === 'Approved' ? '#ecfdf5' : asset.status === 'In Review' ? '#eff6ff' : '#f3f4f6',
                                color: asset.status === 'Approved' ? '#10b981' : asset.status === 'In Review' ? '#3b82f6' : '#9ca3af',
                                border: '1px solid currentColor'
                              }}
                            >
                              {asset.status}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        ) : activeTab !== 'Your Content' && activeTab !== 'Dashboard' ? (
          /* Other modules placeholder */
          <div className="placeholder-pane saas-card animate-fade-in">
            <div className="placeholder-icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#5c67f2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"></path>
                <path d="M12 15l-3-3m1.3-6.27a8 8 0 0 1 9.94 9.94L15 21H9l-3-3V12l6.27-6.27z"></path>
              </svg>
            </div>
            <h2>{activeTab} Module</h2>
            <p>This module is currently in development under the TaskForge portal.</p>
            <button className="back-btn glow-btn-primary" onClick={() => setActiveTab('Your Content')}>
              Back to Your Content
            </button>
          </div>
        ) : activeTab === 'Dashboard' ? (
          /* Dashboard Analytics Tab */
          <div className="dashboard-analytics-pane animate-fade-in">
            <div className="analytics-metrics">
              <div className="metric-box saas-card">
                <span className="metric-emoji"><FolderIcon /></span>
                <div>
                  <h4>{tasks.length}</h4>
                  <p>Total Assets</p>
                </div>
              </div>
              <div className="metric-box saas-card">
                <span className="metric-emoji"><ClockIcon /></span>
                <div>
                  <h4>{tasks.filter(t => t.status === 'Pending').length}</h4>
                  <p>Pending Review</p>
                </div>
              </div>
              <div className="metric-box saas-card">
                <span className="metric-emoji"><CheckSquareIcon /></span>
                <div>
                  <h4>{tasks.filter(t => t.status === 'Completed' || t.status === 'In Progress').length}</h4>
                  <p>In Progress / Done</p>
                </div>
              </div>
            </div>

            <div className="recent-content-table saas-card">
              <div className="table-header-row">
                <h3>Recent Content</h3>
                <button className="table-action-btn" onClick={() => setActiveTab('Your Content')}>Manage All</button>
              </div>
              <table className="analytics-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Campaign</th>
                    <th>Created By</th>
                    <th>Last Modified</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {tasks.slice(0, 5).map(task => {
                    const theme = getCategoryTheme(task.title);
                    return (
                      <tr key={task._id} onClick={() => { setActiveTab('Your Content'); setActiveTask(task); }}>
                        <td className="task-title-cell">
                          <span className="table-task-icon" style={{ display: 'inline-flex', marginRight: '6px' }}>
                            {getCategorySvg(theme.label, '#4b5563', 18)}
                          </span>
                          {task.title}
                        </td>
                        <td>{theme.label}</td>
                        <td>{user.name.split(' ')[0]}</td>
                        <td>{formatTaskDate(task.updatedAt)}</td>
                        <td>
                          <span className="status-pill-green">In Progress</span>
                        </td>
                      </tr>
                    );
                  })}
                  {tasks.length === 0 && (
                    <tr>
                      <td colSpan={5} style={{ textAlign: 'center', padding: '24px', color: 'var(--text-muted)' }}>
                        No content tasks created yet. Go to "Your Content" to add some!
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          /* 3. Double-Column note/task board */
          <div className="two-column-workspace animate-fade-in">
            
            {/* Left Column: All Tasks List */}
            <div className="left-workspace saas-card">
              <div className="workspace-column-header">
                <div>
                  <h2>All Notes</h2>
                  <span className="subtitle-count">{getFilteredTasks().length} Notes</span>
                </div>
                <div className="header-action-icons">
                  <button 
                    className="icon-only-btn" 
                    onClick={() => {
                      const nextOrder = sortOrder === 'desc' ? 'asc' : 'desc';
                      setSortOrder(nextOrder);
                    }} 
                    title="Toggle Sort Order"
                  >
                    <FilterIcon />
                  </button>
                </div>
              </div>

              {/* Quick Task Creation bar */}
              <form onSubmit={handleQuickCreate} className="quick-task-bar">
                <h3>What do you want to create?</h3>
                <div className="quick-input-row">
                  <input
                    type="text"
                    placeholder="Specify a writing task"
                    value={quickTitle}
                    onChange={(e) => setQuickTitle(e.target.value)}
                  />
                  <button type="submit" className="create-submit-btn">Create</button>
                </div>
              </form>

              {/* Tasks List */}
              <div className="tasks-vertical-list">
                {getFilteredTasks().map((task) => {
                  const theme = getCategoryTheme(task.title);
                  const isActive = activeTask && activeTask._id === task._id;
                  
                  return (
                    <div 
                      key={task._id} 
                      className={`task-row-card ${isActive ? 'active' : ''}`}
                      onClick={() => setActiveTask(task)}
                    >
                      <div className={`task-color-box ${theme.colorClass}`}>
                        <span className="task-row-icon">
                          {getCategorySvg(theme.label, 'currentColor', 20)}
                        </span>
                      </div>
                      <div className="task-row-details">
                        <h4>{task.title}</h4>
                        <p>{task.description || 'No description provided.'}</p>
                        <div className="task-row-footer">
                          <span className="time-pill">{calculateEstTime(task)} mins</span>
                          <span className="date-text">{formatTaskDate(task.createdAt)}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}

                {getFilteredTasks().length === 0 && (
                  <div className="empty-column-state">
                    <div style={{ marginBottom: '12px' }}>
                      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                      </svg>
                    </div>
                    <p>No tasks found in category "{categoryFilter}".</p>
                  </div>
                )}
              </div>
            </div>

            {/* Right Column: Active Task Editor & To-do Subtask Checklist */}
            <div className="right-workspace">
              {activeTask ? (
                <>
                  {/* Task Editor Pane */}
                  <div className="task-editor-pane saas-card">
                    <div className="editor-header">
                      <div className="editor-title-area">
                        <div className={`editor-logo-box ${getCategoryTheme(activeTask.title).colorClass}`}>
                          {getCategorySvg(getCategoryTheme(activeTask.title).label, 'currentColor', 18)}
                        </div>
                        {isEditing ? (
                          <input 
                            type="text" 
                            className="editor-title-input"
                            value={editTitle}
                            onChange={(e) => setEditTitle(e.target.value)}
                          />
                        ) : (
                          <h2>{activeTask.title}</h2>
                        )}
                      </div>
                      <div className="editor-action-buttons">
                        {isEditing ? (
                          <button onClick={handleSaveEdits} className="blue-save-btn">Save</button>
                        ) : (
                          <button onClick={() => setIsEditing(true)} className="edit-outline-btn">Edit</button>
                        )}
                        <button onClick={handleDeleteTask} className="delete-trash-btn" title="Delete Task">
                          <TrashIcon />
                        </button>
                      </div>
                    </div>

                    <div className="editor-meta-info">
                      <span className="time-pill">{calculateEstTime(activeTask)} mins</span>
                    </div>

                    <div className="editor-body">
                      {isEditing ? (
                        <textarea
                          className="editor-textarea"
                          value={editDescription}
                          onChange={(e) => setEditDescription(e.target.value)}
                          rows={8}
                        />
                      ) : (
                        <div className="editor-rendered-text">
                          {activeTask.description || 'No description added. Click "Edit" to write details.'}
                        </div>
                      )}
                    </div>

                    {/* Editor Toolbar */}
                    <div className="editor-format-toolbar">
                      <div className="toolbar-left" style={{ fontFamily: 'var(--font-secondary)', fontWeight: 600 }}>
                        <span className="toolbar-item text-size" style={{ marginRight: '12px' }}>T</span>
                        <span className="toolbar-item italic-style" style={{ fontStyle: 'italic', marginRight: '12px' }}>I</span>
                        <span className="toolbar-item bold-style" style={{ fontWeight: 'bold', marginRight: '12px' }}>B</span>
                        <span className="toolbar-item list-style">L</span>
                      </div>
                      {isEditing && (
                        <div className="priority-select-area">
                          <label>Priority: </label>
                          <select value={editPriority} onChange={(e) => setEditPriority(e.target.value)}>
                            <option value="Low">Low</option>
                            <option value="Medium">Medium</option>
                            <option value="High">High</option>
                          </select>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* To-do List Pane */}
                  <div className="subtasks-checklist-pane saas-card">
                    <div className="checklist-header">
                      <h3>To-do list</h3>
                    </div>

                    {/* Subtasks Checklist */}
                    <div className="checklist-items">
                      {activeTask.subTasks && activeTask.subTasks.map((sub) => (
                        <div key={sub._id} className="checklist-item-row">
                          <label className="checkbox-container">
                            <input
                              type="checkbox"
                              checked={sub.completed}
                              onChange={() => handleToggleSubTask(sub._id)}
                            />
                            <span className="checkmark"></span>
                            <span className={`checklist-title ${sub.completed ? 'strike' : ''}`}>
                              {sub.title}
                            </span>
                          </label>
                          <span className={`pill-badge ${sub.completed ? 'status-completed-badge' : 'status-pending-badge'}`}>
                            {sub.completed ? 'Completed' : 'Pending'}
                          </span>
                        </div>
                      ))}

                      {(!activeTask.subTasks || activeTask.subTasks.length === 0) && (
                        <div className="empty-subtasks-state">
                          <p>No checklist items added for this task.</p>
                        </div>
                      )}
                    </div>

                    {/* Add Subtask Inline Form */}
                    <form onSubmit={handleAddSubTask} className="add-subtask-form">
                      <input
                        type="text"
                        placeholder="Add new checklist item..."
                        value={newSubTaskTitle}
                        onChange={(e) => setNewSubTaskTitle(e.target.value)}
                        required
                      />
                      <button type="submit" className="add-subtask-btn">+</button>
                    </form>
                  </div>
                </>
              ) : (
                <div className="no-active-task saas-card">
                  <div style={{ marginBottom: '12px' }}>
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                      <polyline points="14 2 14 8 20 8"></polyline>
                    </svg>
                  </div>
                  <h3>No task selected</h3>
                  <p>Select a task from the list or create a new one to begin editing.</p>
                </div>
              )}
            </div>

          </div>
        )}

      </div>
    </div>
  );
};

export default Dashboard;
