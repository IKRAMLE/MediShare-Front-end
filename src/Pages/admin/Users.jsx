import AdminLayout from "../../layouts/AdminLayout";
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../Components/ui/card";
import { 
  Search, 
  UserPlus, 
  Check, 
  X, 
  Edit, 
  Trash, 
  Filter,
  Download,
  Loader2
} from "lucide-react";
import api from "../../utils/api";
import UserModal from "../../Components/UserModal";

const Users = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedRole, setSelectedRole] = useState('All');
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await api.get('/users');
      setUsers(response.data);
      setFilteredUsers(response.data);
    } catch (err) {
      if (err.response && err.response.status === 401) {
        setError('Authentication required. Please log in.');
      } else {
        setError('Failed to fetch users. Please try again later.');
      }
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    filterUsers(term, selectedStatus, selectedRole);
  };

  const handleStatusFilter = (status) => {
    setSelectedStatus(status);
    filterUsers(searchTerm, status, selectedRole);
  };

  const handleRoleFilter = (role) => {
    setSelectedRole(role);
    filterUsers(searchTerm, selectedStatus, role);
  };

  const filterUsers = (term, status, role) => {
    let filtered = users;
    
    // Filter by search term
    if (term.trim() !== '') {
      filtered = filtered.filter(user => 
        user.name.toLowerCase().includes(term.toLowerCase()) || 
        user.email.toLowerCase().includes(term.toLowerCase())
      );
    }
    
    // Filter by status
    if (status !== 'All') {
      filtered = filtered.filter(user => user.status === status);
    }
    
    // Filter by role
    if (role !== 'All') {
      filtered = filtered.filter(user => user.role === role);
    }
    
    setFilteredUsers(filtered);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await api.delete(`/users/${userId}`);
        fetchUsers(); // Refresh the users list
      } catch (err) {
        console.error('Error deleting user:', err);
        if (err.response && err.response.status === 401) {
          alert('Authentication required. Please log in.');
        } else {
          alert('Failed to delete user. Please try again.');
        }
      }
    }
  };

  const handleAddUser = () => {
    setIsEditing(false);
    setSelectedUser(null);
    setIsModalOpen(true);
  };

  const handleEditUser = (user) => {
    setIsEditing(true);
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleSaveUser = async (userData) => {
    try {
      if (isEditing) {
        // Update existing user
        await api.put(`/users/${selectedUser.id}`, userData);
      } else {
        // Create new user
        await api.post('/users', userData);
      }
      
      // Refresh the users list
      fetchUsers();
    } catch (err) {
      console.error('Error saving user:', err);
      throw err; // Re-throw to let the modal handle the error
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-[calc(100vh-200px)]">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-[calc(100vh-200px)]">
          <div className="text-red-600 text-center">
            <p className="text-lg font-semibold">{error}</p>
            <button 
              onClick={fetchUsers}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Try Again
            </button>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-[#084b88] dark:text-gray-100">Users Management</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-2">Manage all users and their permissions on the platform</p>
          </div>
          <button 
            onClick={handleAddUser}
            className="bg-blue-600 hover:bg-blue-700 inline-flex items-center px-4 py-2.5 text-sm font-medium text-white rounded-lg shadow-sm transition-colors"
          >
            <UserPlus className="mr-2 h-4 w-4" />
            Add New User
          </button>
        </div>
        
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          <div className="relative w-full md:max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
            <input
              type="search"
              placeholder="Search users by name or email..."
              className="pl-10 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg py-2.5 px-4 w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all shadow-sm"
              value={searchTerm}
              onChange={handleSearch}
            />
          </div>
          
          <div className="flex flex-wrap gap-2 w-full md:w-auto">
            <div className="flex items-center gap-2">
              <div className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg flex items-center shadow-sm">
                <Filter className="h-4 w-4 text-gray-500 ml-3" />
                <select 
                  className="bg-transparent py-2 pl-2 pr-8 appearance-none focus:outline-none"
                  value={selectedStatus}
                  onChange={(e) => handleStatusFilter(e.target.value)}
                >
                  <option value="All">All Status</option>
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                  <option value="Pending">Pending</option>
                </select>
              </div>
              
              <div className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg flex items-center shadow-sm">
                <Filter className="h-4 w-4 text-gray-500 ml-3" />
                <select 
                  className="bg-transparent py-2 pl-2 pr-8 appearance-none focus:outline-none"
                  value={selectedRole}
                  onChange={(e) => handleRoleFilter(e.target.value)}
                >
                  <option value="All">All Roles</option>
                  <option value="Admin">Admin</option>
                  <option value="User">User</option>
                </select>
              </div>
            </div>
            
            <button className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 shadow-sm">
              <Download className="mr-2 h-4 w-4" />
              Export
            </button>
          </div>
        </div>

        <Card className="shadow-md">
          <CardHeader className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
            <div className="flex justify-between items-center">
              <CardTitle className="text-lg font-semibold">Users</CardTitle>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Showing <span className="font-medium">{filteredUsers.length}</span> of <span className="font-medium">{users.length}</span> users
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
                    <th className="px-6 py-3.5 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3.5 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Email</th>
                    <th className="px-6 py-3.5 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Role</th>
                    <th className="px-6 py-3.5 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3.5 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Last Login</th>
                    <th className="px-6 py-3.5 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-900">
                  {filteredUsers.length > 0 ? (
                    filteredUsers.map(user => (
                      <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="font-medium text-gray-900 dark:text-white">{user.name}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{user.email}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                            user.role === 'Admin' 
                              ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200' 
                              : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                          }`}>
                            {user.role}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                            user.status === 'Active' 
                              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                              : user.status === 'Inactive'
                                ? 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                                : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                          }`}>
                            {user.status === 'Active' && <Check className="mr-1 h-3 w-3" />}
                            {user.status === 'Inactive' && <X className="mr-1 h-3 w-3" />}
                            {user.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{formatDate(user.lastLogin)}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-right space-x-2">
                          <button 
                            onClick={() => handleEditUser(user)}
                            className="inline-flex items-center justify-center h-8 w-8 text-gray-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900 dark:hover:text-blue-400 rounded-md transition-colors"
                          >
                            <Edit className="h-4 w-4" />
                            <span className="sr-only">Edit</span>
                          </button>
                          <button 
                            onClick={() => handleDeleteUser(user.id)}
                            className="inline-flex items-center justify-center h-8 w-8 text-gray-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900 dark:hover:text-red-400 rounded-md transition-colors"
                          >
                            <Trash className="h-4 w-4" />
                            <span className="sr-only">Delete</span>
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="px-6 py-8 text-center text-sm text-gray-500 dark:text-gray-400">
                        No users found matching your search criteria.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            
            {filteredUsers.length > 0 && (
              <div className="px-6 py-4 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    Showing <span className="font-medium">{filteredUsers.length}</span> users
                  </div>
                  <div className="flex space-x-1">
                    <button className="px-3 py-1 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50" disabled>
                      Previous
                    </button>
                    <button className="px-3 py-1 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700">
                      Next
                    </button>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* User Modal */}
      <UserModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveUser}
        user={selectedUser}
        isEditing={isEditing}
      />
    </AdminLayout>
  );
};

export default Users;