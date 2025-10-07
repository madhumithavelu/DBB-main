import React from 'react';
import { Users, BookOpen, TrendingUp, Award } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell, LineChart, Line, ResponsiveContainer } from 'recharts';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {CreateSessionModal} from '../Sessions/CreateSessionModal'
import {CreateUserModal} from '../Users/CreateUserModal'
const COLORS = ['#10B981', '#3B82F6', '#F59E0B', '#EF4444'];

export function AdminDashboard() {
const { users, sessions } = useAuth()
  const userData = {
    name: "Admin User",
    email: "admin@dbb.com",
    role: "Administrator",
    avatar: "/api/placeholder/40/40"
  }

  const [showCreateUserModal,setShowCreateUserModal]=useState(false);
  const [showCreateSessionModal, setShowCreateSessionModal] = useState(false);
  const navigate=useNavigate();
  const handleGenerateReport=()=>{
    navigate('/analytics');
  }

  const stats = [
    {
      name: 'Total Users',
      value: users.length,
      icon: Users,
      color: 'bg-green-600',
      change: '+2.5%'
    },
    {
      name: 'Active Sessions',
      value: sessions.filter(s => s.status === 'scheduled').length,
      icon: BookOpen,
      color: 'bg-blue-600',
      change: '+4.1%'
    },
    {
      name: 'Completed Sessions',
      value: sessions.filter(s => s.status === 'completed').length,
      icon: Award,
      color: 'bg-amber-600',
      change: '+12.3%'
    },
    {
      name: 'Growth Rate',
      value: '87%',
      icon: TrendingUp,
      color: 'bg-purple-600',
      change: '+5.2%'
    }
  ];

  const userRoleData = [
    { name: 'Admins', value: users.filter(u => u.role === 'admin').length },
    { name: 'Trainers', value: users.filter(u => u.role === 'trainer').length },
    { name: 'Trainees', value: users.filter(u => u.role === 'trainee').length }
  ];

  const sessionData = [
    { name: 'Jan', sessions: 4, completed: 3 },
    { name: 'Feb', sessions: 6, completed: 5 },
    { name: 'Mar', sessions: 8, completed: 7 },
    { name: 'Apr', sessions: 5, completed: 4 },
    { name: 'May', sessions: 7, completed: 6 },
    { name: 'Jun', sessions: 9, completed: 8 }
  ];

  const engagementData = [
    { name: 'Week 1', engagement: 85 },
    { name: 'Week 2', engagement: 92 },
    { name: 'Week 3', engagement: 78 },
    { name: 'Week 4', engagement: 88 }
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
        <p className="mt-2 text-gray-400">Overview of system performance and metrics</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-gray-800 border border-gray-700 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm font-medium">{stat.name}</p>
                <p className="text-2xl font-bold text-white mt-2">{stat.value}</p>
                <p className="text-green-400 text-sm mt-1">{stat.change}</p>
              </div>
              <div className={`${stat.color} rounded-full p-3`}>
                <stat.icon className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* User Distribution */}
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-white mb-4">User Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={userRoleData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {userRoleData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Session Analytics */}
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Session Analytics</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={sessionData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="name" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1F2937', 
                  border: '1px solid #374151',
                  borderRadius: '0.375rem',
                  color: '#F9FAFB'
                }}
              />
              <Bar dataKey="sessions" fill="#10B981" name="Total Sessions" />
              <Bar dataKey="completed" fill="#3B82F6" name="Completed" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Engagement Trends */}
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-white mb-4">User Engagement</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={engagementData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="name" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1F2937', 
                  border: '1px solid #374151',
                  borderRadius: '0.375rem',
                  color: '#F9FAFB'
                }}
              />
              <Line 
                type="monotone" 
                dataKey="engagement" 
                stroke="#10B981" 
                strokeWidth={3}
                dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Recent Activity */}
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Recent Activity</h3>
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <p className="text-gray-300 text-sm">New trainee enrolled in React Fundamentals</p>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
              <p className="text-gray-300 text-sm">Session completed: JavaScript Advanced</p>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
              <p className="text-gray-300 text-sm">New trainer John Trainer added</p>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
              <p className="text-gray-300 text-sm">System backup completed</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button onClick={()=>setShowCreateUserModal(true)} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md transition-colors duration-200">
            Create New User name
          </button>
          <button onClick={()=>setShowCreateSessionModal(true)
          } className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors duration-200">
            Schedule Session
          </button>
          <button onClick={handleGenerateReport} className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-md transition-colors duration-200">
            Generate Report
          </button>
        </div>
      </div>
      {showCreateUserModal && (
        <CreateUserModal
          onClose={() => setShowCreateUserModal(false)}
          onSuccess={() => setShowCreateUserModal(false)}
        />
      )}
      {showCreateSessionModal && (
        <CreateSessionModal
          onClose={() => setShowCreateSessionModal(false)}
          onSuccess={() => setShowCreateSessionModal(false)}
        />
      )}
    </div>
  )};



