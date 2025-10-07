import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext({});

const mockUsers = [
  {
    id: 1,
    email: 'admin@company.com',
    password: 'admin123',
    role: 'admin',
    name: 'System Administrator',
    username: 'admin',
    isTemporary: false,
    assignedTrainer: null
  },
  {
    id: 2,
    email: 'trainer@company.com',
    password: 'trainer123',
    role: 'trainer',
    name: 'John Trainer',
    username: 'jtrainer',
    isTemporary: false,
    assignedTrainer: null
  },
  {
    id: 3,
    email: 'trainee@company.com',
    password: 'trainee123',
    role: 'trainee',
    name: 'Sarah Student',
    username: 'sstudent',
    isTemporary: false,
    assignedTrainer: 2
  }
];

const mockSessions = [
  {
    id: 1,
    title: 'React Fundamentals',
    description: 'Learn the basics of React development',
    trainer: 2,
    trainees: [3],
    startTime: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours from now
    duration: 120,
    status: 'scheduled',
    classLink: 'https://meet.google.com/abc-defg-hij',
    attendance: {}
  },
  {
    id: 2,
    title: 'JavaScript Advanced',
    description: 'Advanced JavaScript concepts and patterns',
    trainer: 2,
    trainees: [3],
    startTime: new Date(Date.now() - 24 * 60 * 60 * 1000), // Yesterday
    duration: 90,
    status: 'completed',
    classLink: 'https://meet.google.com/xyz-uvwx-yz',
    attendance: { 3: { present: true, joinedAt: new Date(Date.now() - 24 * 60 * 60 * 1000) } }
  }
];

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState(mockUsers);
  const [sessions, setSessions] = useState(mockSessions);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading delay
    const timer = setTimeout(() => {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // Check for upcoming sessions and create notifications
  useEffect(() => {
    const checkNotifications = () => {
      if (!user || user.role !== 'trainee') return;

      const now = new Date();
      const fiveMinutesFromNow = new Date(now.getTime() + 5 * 60 * 1000);

      const upcomingSessions = sessions.filter(session => {
        const sessionTime = new Date(session.startTime);
        return session.trainees.includes(user.id) &&
               session.status === 'scheduled' &&
               sessionTime > now &&
               sessionTime <= fiveMinutesFromNow;
      });

      const newNotifications = upcomingSessions.map(session => ({
        id: `session-${session.id}`,
        type: 'session-reminder',
        title: 'Session Starting Soon',
        message: `${session.title} starts in 5 minutes`,
        session,
        timestamp: new Date(),
        read: false
      }));

      setNotifications(prev => {
        const existing = prev.filter(n => n.type !== 'session-reminder');
        return [...existing, ...newNotifications];
      });
    };

    if (user) {
      checkNotifications();
      const interval = setInterval(checkNotifications, 60000); // Check every minute
      return () => clearInterval(interval);
    }
  }, [user, sessions]);

  const login = async (email, password) => {
    const foundUser = users.find(u => u.email === email && u.password === password);
    if (foundUser) {
      setUser(foundUser);
      localStorage.setItem('user', JSON.stringify(foundUser));
      return { success: true };
    }
    return { success: false, error: 'Invalid credentials' };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const updateUser = (updates) => {
    const updatedUser = { ...user, ...updates };
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
    
    setUsers(prev => prev.map(u => u.id === updatedUser.id ? updatedUser : u));
  };

  const createUser = (userData) => {
    const newUser = {
      ...userData,
      id: Math.max(...users.map(u => u.id)) + 1,
      isTemporary: true
    };
    setUsers(prev => [...prev, newUser]);
    return newUser;
  };

  const updateUserById = (id, updates) => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, ...updates } : u));
    if (user && user.id === id) {
      updateUser(updates);
    }
  };

  const deleteUser = (id) => {
    setUsers(prev => prev.filter(u => u.id !== id));
  };

  const createSession = (sessionData) => {
    const newSession = {
      ...sessionData,
      id: Math.max(...sessions.map(s => s.id)) + 1,
      trainer: user.id,
      status: 'scheduled',
      attendance: {}
    };
    setSessions(prev => [...prev, newSession]);
    return newSession;
  };

  const updateSession = (id, updates) => {
    setSessions(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s));
  };

  const deleteSession = (id) => {
    setSessions(prev => prev.filter(s => s.id !== id));
  };

  const markNotificationAsRead = (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const value = {
    user,
    users,
    sessions,
    notifications,
    loading,
    login,
    logout,
    updateUser,
    createUser,
    updateUserById,
    deleteUser,
    createSession,
    updateSession,
    deleteSession,
    markNotificationAsRead
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};