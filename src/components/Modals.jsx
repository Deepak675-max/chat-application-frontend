import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { X, Search, User, Users, Camera, Shield, CheckCircle, Loader2, Check, CheckCheck, Info } from 'lucide-react';

const AVATAR_DEFAULT = "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg";

export function NewPrivateChatModal({ isOpen, onClose, onChatCreated }) {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchUsers();
    }
  }, [isOpen]);

  const fetchUsers = async () => {
    try {
      const response = await api.get('/users');
      setUsers(response.data.data.users || []);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleCreateChat = async (recipientId) => {
    setLoading(recipientId);
    try {
      const response = await api.post('/users/private-chat', {
        users: [parseInt(recipientId)]
      });
      onChatCreated(response.data.data.chatDetails);
      onClose();
    } catch (error) {
      console.error('Error creating private chat:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const filteredUsers = users.filter(u => 
    u.userName?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 modal-backdrop">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl animate-scale-in">
        <div className="flex items-center justify-between p-5 border-b border-slate-800">
          <h3 className="text-lg font-semibold text-slate-100 flex items-center gap-2">
            <User className="w-5 h-5 text-indigo-400" />
            New Chat
          </h3>
          <button onClick={onClose} className="p-1 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-slate-200 transition">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-4">
          <div className="relative mb-4">
            <Search className="w-5 h-5 text-slate-500 absolute left-3 inset-y-0 my-auto" />
            <input
              type="text"
              placeholder="Search user..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-800/60 border border-slate-700/60 rounded-xl pl-10 pr-4 py-2 text-slate-200 focus:outline-none focus:border-indigo-500 text-sm transition"
            />
          </div>

          <div className="max-h-64 overflow-y-auto space-y-1">
            {filteredUsers.length === 0 ? (
              <p className="text-center text-slate-500 text-sm py-4">No users found</p>
            ) : (
              filteredUsers.map(u => (
                <button
                  key={u.id}
                  disabled={loading === u.id}
                  onClick={() => handleCreateChat(u.id)}
                  className="w-full flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-800/80 transition text-left disabled:opacity-50"
                >
                  <img
                    src={u.profilePicture ? `http://localhost:4500/files/${u.profilePicture}` : AVATAR_DEFAULT}
                    alt={u.userName}
                    className="w-10 h-10 rounded-full object-cover border border-slate-800"
                  />
                  <div className="flex-1">
                    <h4 className="text-sm font-semibold text-slate-200">{u.userName}</h4>
                    <p className="text-xs text-slate-500">{u.phoneNumber || 'No phone'}</p>
                  </div>
                  {loading === u.id && <Loader2 className="w-4 h-4 animate-spin text-indigo-400" />}
                </button>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export function NewGroupModal({ isOpen, onClose, onGroupCreated }) {
  const [users, setUsers] = useState([]);
  const [groupName, setGroupName] = useState('');
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [groupImage, setGroupImage] = useState(null);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchUsers();
      setGroupName('');
      setSelectedUsers([]);
      setGroupImage(null);
    }
  }, [isOpen]);

  const fetchUsers = async () => {
    try {
      const response = await api.get('/users');
      setUsers(response.data.data.users || []);
    } catch (error) {
      console.error(error);
    }
  };

  const handleToggleUser = (userId) => {
    const id = parseInt(userId);
    if (selectedUsers.includes(id)) {
      setSelectedUsers(selectedUsers.filter(uid => uid !== id));
    } else {
      setSelectedUsers([...selectedUsers, id]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!groupName) return;
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('chatName', groupName);
      formData.append('isGroupChat', true);
      if (groupImage) {
        formData.append('fileInput', groupImage);
      }
      selectedUsers.forEach(uid => {
        formData.append('users[]', uid);
      });

      const response = await api.post('/users/group-chat', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      onGroupCreated(response.data.data.chatDetails);
      onClose();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const filteredUsers = users.filter(u => 
    u.userName?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 modal-backdrop">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl animate-scale-in">
        <div className="flex items-center justify-between p-5 border-b border-slate-800">
          <h3 className="text-lg font-semibold text-slate-100 flex items-center gap-2">
            <Users className="w-5 h-5 text-indigo-400" />
            Create Group
          </h3>
          <button onClick={onClose} className="p-1 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-slate-200 transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Group Name</label>
            <input
              type="text"
              required
              placeholder="e.g. Project Buddies"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              className="w-full bg-slate-800/60 border border-slate-700/60 rounded-xl px-4 py-2.5 text-slate-200 focus:outline-none focus:border-indigo-500 text-sm transition"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Group Icon (Optional)</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setGroupImage(e.target.files[0])}
              className="w-full text-sm text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-indigo-600/10 file:text-indigo-400 hover:file:bg-indigo-600/20 cursor-pointer"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Select Members ({selectedUsers.length} selected)
            </label>
            <div className="relative mb-2">
              <Search className="w-4 h-4 text-slate-500 absolute left-3 inset-y-0 my-auto" />
              <input
                type="text"
                placeholder="Search..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-slate-800/60 border border-slate-700/60 rounded-xl pl-9 pr-4 py-1.5 text-slate-200 focus:outline-none focus:border-indigo-500 text-xs transition"
              />
            </div>

            <div className="max-h-40 overflow-y-auto space-y-1 border border-slate-800/80 rounded-xl p-2 bg-slate-950/40">
              {filteredUsers.length === 0 ? (
                <p className="text-center text-slate-500 text-xs py-4">No users found</p>
              ) : (
                filteredUsers.map(u => {
                  const isChecked = selectedUsers.includes(u.id);
                  return (
                    <div
                      key={u.id}
                      onClick={() => handleToggleUser(u.id)}
                      className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition select-none ${isChecked ? 'bg-indigo-500/10' : 'hover:bg-slate-800/60'}`}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        readOnly
                        className="rounded border-slate-700 text-indigo-600 focus:ring-indigo-500 bg-slate-800"
                      />
                      <img
                        src={u.profilePicture ? `http://localhost:4500/files/${u.profilePicture}` : AVATAR_DEFAULT}
                        alt={u.userName}
                        className="w-8 h-8 rounded-full object-cover border border-slate-800"
                      />
                      <span className="text-xs text-slate-200 font-medium">{u.userName}</span>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          <div className="flex gap-3 justify-end pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-700 text-slate-300 rounded-xl hover:bg-slate-800 transition text-sm font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || selectedUsers.length === 0}
              className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition text-sm font-semibold flex items-center gap-2 disabled:opacity-50"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export function ProfileModal({ isOpen, onClose, currentUser, onProfileUpdated }) {
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setImageFile(null);
    }
  }, [isOpen]);

  const handleUpdatePhoto = async (e) => {
    e.preventDefault();
    if (!imageFile) return;
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('fileId', currentUser.FileId);
      formData.append('userProfilePhoto', imageFile);

      await api.put('/users/update-profile-photo', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      onProfileUpdated();
      onClose();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 modal-backdrop">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl animate-scale-in">
        <div className="flex items-center justify-between p-5 border-b border-slate-800">
          <h3 className="text-lg font-semibold text-slate-100 flex items-center gap-2">
            <User className="w-5 h-5 text-indigo-400" />
            My Profile
          </h3>
          <button onClick={onClose} className="p-1 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-slate-200 transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 flex flex-col items-center">
          <div className="relative group mb-5">
            <img
              src={currentUser.profilePicture ? `http://localhost:4500/files/${currentUser.profilePicture}` : AVATAR_DEFAULT}
              alt={currentUser.userName}
              className="w-24 h-24 rounded-full object-cover border-2 border-indigo-500/20"
            />
            <label className="absolute inset-0 flex items-center justify-center bg-slate-950/60 rounded-full opacity-0 group-hover:opacity-100 cursor-pointer transition">
              <Camera className="w-6 h-6 text-slate-200" />
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setImageFile(e.target.files[0])}
                className="hidden"
              />
            </label>
          </div>

          {imageFile && (
            <div className="flex flex-col items-center gap-2 w-full mb-6">
              <p className="text-xs text-emerald-400 flex items-center gap-1">
                <CheckCircle className="w-3.5 h-3.5" />
                Selected: {imageFile.name}
              </p>
              <button
                disabled={loading}
                onClick={handleUpdatePhoto}
                className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition disabled:opacity-50"
              >
                {loading && <Loader2 className="w-3 h-3 animate-spin" />}
                Upload Photo
              </button>
            </div>
          )}

          <div className="w-full space-y-4 bg-slate-950/40 p-4 rounded-xl border border-slate-800">
            <div>
              <span className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Username</span>
              <span className="text-sm font-semibold text-slate-200">{currentUser.userName}</span>
            </div>
            <div>
              <span className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Email Address</span>
              <span className="text-sm font-semibold text-slate-200">{currentUser.email}</span>
            </div>
            <div>
              <span className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Phone Number</span>
              <span className="text-sm font-semibold text-slate-200">{currentUser.phoneNumber || 'N/A'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function ChatInfoModal({ isOpen, onClose, chatDetails, onGroupPhotoUpdated, onGroupDetailsUpdated, currentUser }) {
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [allUsers, setAllUsers] = useState([]);
  const [selectedUserIdToAdd, setSelectedUserIdToAdd] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setImageFile(null);
      setSelectedUserIdToAdd('');
      
      if (chatDetails?.isGroupChat) {
        api.get('/users')
          .then(res => {
            if (res.data?.data?.users) {
              setAllUsers(res.data.data.users);
            }
          })
          .catch(err => console.error("Error loading users list:", err));
      }
    }
  }, [isOpen, chatDetails]);

  if (!isOpen || !chatDetails) return null;

  const isGroup = chatDetails.isGroupChat;
  // Use groupAdminId to verify if current user is admin
  const isAdmin = isGroup && chatDetails.groupAdminId == currentUser?.userId;

  const handleUpdateGroupPhoto = async (e) => {
    e.preventDefault();
    if (!imageFile) return;
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('fileId', chatDetails.FileId);
      formData.append('userProfilePhoto', imageFile);

      await api.put('/users/update-profile-photo', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      onGroupPhotoUpdated();
      onClose();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddMember = async () => {
    if (!selectedUserIdToAdd) return;
    setActionLoading(true);
    try {
      await api.put(`/users/chats/${chatDetails.id}/members/add`, {
        userId: parseInt(selectedUserIdToAdd)
      });
      setSelectedUserIdToAdd('');
      if (onGroupDetailsUpdated) onGroupDetailsUpdated();
    } catch (err) {
      console.error("Error adding member:", err);
      alert(err.response?.data?.message || "Failed to add member");
    } finally {
      setActionLoading(false);
    }
  };

  const handleRemoveMember = async (targetUserId) => {
    if (!confirm("Are you sure you want to remove this member from the group?")) return;
    setActionLoading(true);
    try {
      await api.put(`/users/chats/${chatDetails.id}/members/remove`, {
        userId: parseInt(targetUserId)
      });
      if (onGroupDetailsUpdated) onGroupDetailsUpdated();
    } catch (err) {
      console.error("Error removing member:", err);
      alert(err.response?.data?.message || "Failed to remove member");
    } finally {
      setActionLoading(false);
    }
  };

  const handleMakeAdmin = async (targetUserId) => {
    if (!confirm("Are you sure you want to make this member the group admin?")) return;
    setActionLoading(true);
    try {
      await api.put(`/users/chats/${chatDetails.id}/admin`, {
        userId: parseInt(targetUserId)
      });
      if (onGroupDetailsUpdated) onGroupDetailsUpdated();
    } catch (err) {
      console.error("Error making admin:", err);
      alert(err.response?.data?.message || "Failed to transfer admin status");
    } finally {
      setActionLoading(false);
    }
  };

  // Filter out users who are already in the group
  const currentMemberIds = new Set(chatDetails.Users?.map(u => u.id) || []);
  const nonMembers = allUsers.filter(u => u.id !== currentUser?.userId && !currentMemberIds.has(u.id));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 modal-backdrop">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl animate-scale-in flex flex-col max-h-[85vh]">
        <div className="flex items-center justify-between p-5 border-b border-slate-800 shrink-0">
          <h3 className="text-lg font-semibold text-slate-100 flex items-center gap-2">
            {isGroup ? <Users className="w-5 h-5 text-indigo-400" /> : <User className="w-5 h-5 text-indigo-400" />}
            {isGroup ? 'Group Info' : 'Contact Info'}
          </h3>
          <button onClick={onClose} className="p-1 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-slate-200 transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 flex flex-col items-center overflow-y-auto flex-1">
          <div className="relative group mb-5 shrink-0">
            <img
              src={chatDetails.profilePicture ? `http://localhost:4500/files/${chatDetails.profilePicture}` : AVATAR_DEFAULT}
              alt={isGroup ? chatDetails.chatName : chatDetails.receiverName}
              className="w-24 h-24 rounded-full object-cover border-2 border-indigo-500/20"
            />
            {isGroup && (
              <label className="absolute inset-0 flex items-center justify-center bg-slate-950/60 rounded-full opacity-0 group-hover:opacity-100 cursor-pointer transition">
                <Camera className="w-6 h-6 text-slate-200" />
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImageFile(e.target.files[0])}
                  className="hidden"
                />
              </label>
            )}
          </div>

          {isGroup && imageFile && (
            <div className="flex flex-col items-center gap-2 w-full mb-6 shrink-0">
              <p className="text-xs text-emerald-400 flex items-center gap-1">
                <CheckCircle className="w-3.5 h-3.5" />
                Selected: {imageFile.name}
              </p>
              <button
                disabled={loading}
                onClick={handleUpdateGroupPhoto}
                className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition disabled:opacity-50"
              >
                {loading && <Loader2 className="w-3 h-3 animate-spin" />}
                Update Group Photo
              </button>
            </div>
          )}

          <div className="w-full space-y-4 bg-slate-950/40 p-4 rounded-xl border border-slate-800 text-left">
            {isGroup ? (
              <>
                <div>
                  <span className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Group Name</span>
                  <span className="text-sm font-semibold text-slate-200">{chatDetails.chatName}</span>
                </div>
                <div>
                  <span className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                    <Shield className="w-3 h-3 text-indigo-400" />
                    Group Admin
                  </span>
                  <span className="text-sm font-semibold text-slate-200">{isAdmin ? `You (${chatDetails.groupAdmin})` : (chatDetails.groupAdmin || 'N/A')}</span>
                </div>
                <div>
                  <span className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-2">
                    Members ({chatDetails.Users?.length || 0})
                  </span>
                  <div className="max-h-48 overflow-y-auto space-y-2 pr-1">
                    {chatDetails.Users?.map(user => {
                      const isUserAdmin = user.id == chatDetails.groupAdminId;
                      const displayName = user.id === currentUser?.userId ? `You (${user.userName})` : user.userName;
                      return (
                        <div key={user.id} className="flex items-center justify-between text-xs py-1.5 text-slate-300 border-b border-slate-800/40 last:border-b-0">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-slate-200">{displayName}</span>
                            {isUserAdmin && (
                              <span className="px-1.5 py-0.5 bg-indigo-500/10 text-indigo-400 rounded text-[9px] font-bold uppercase tracking-wide">Admin</span>
                            )}
                          </div>
                          
                          {/* Admin Controls */}
                          {isAdmin && !isUserAdmin && (
                            <div className="flex items-center gap-2">
                              <button
                                disabled={actionLoading}
                                onClick={() => handleMakeAdmin(user.id)}
                                className="px-2 py-0.5 bg-indigo-600/10 hover:bg-indigo-600 text-indigo-400 hover:text-white rounded text-[10px] font-semibold transition"
                                title="Make Admin"
                              >
                                Make Admin
                              </button>
                              <button
                                disabled={actionLoading}
                                onClick={() => handleRemoveMember(user.id)}
                                className="p-1 hover:bg-red-500/10 text-slate-500 hover:text-red-400 rounded transition"
                                title="Remove member"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Add member select dropdown for Admin */}
                {isAdmin && nonMembers.length > 0 && (
                  <div className="pt-3 border-t border-slate-800/60 mt-3 space-y-2">
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      Add Group Member
                    </label>
                    <div className="flex gap-2">
                      <select
                        value={selectedUserIdToAdd}
                        disabled={actionLoading}
                        onChange={(e) => setSelectedUserIdToAdd(e.target.value)}
                        className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 transition cursor-pointer"
                      >
                        <option value="">Select user...</option>
                        {nonMembers.map(u => (
                          <option key={u.id} value={u.id}>{u.userName} ({u.email})</option>
                        ))}
                      </select>
                      <button
                        type="button"
                        disabled={!selectedUserIdToAdd || actionLoading}
                        onClick={handleAddMember}
                        className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold transition disabled:opacity-50 flex items-center gap-1"
                      >
                        {actionLoading && <Loader2 className="w-3 h-3 animate-spin" />}
                        Add
                      </button>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <>
                <div>
                  <span className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Name</span>
                  <span className="text-sm font-semibold text-slate-200">{chatDetails.receiverName}</span>
                </div>
                <div>
                  <span className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Email Address</span>
                  <span className="text-sm font-semibold text-slate-200">{chatDetails.receiverEmail}</span>
                </div>
                <div>
                  <span className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Phone Number</span>
                  <span className="text-sm font-semibold text-slate-200">{chatDetails.receiverPhone || 'N/A'}</span>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export function MessageInfoModal({ isOpen, onClose, messageId }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchReceipts = async () => {
    if (!messageId) return;
    try {
      const res = await api.get(`/chats/messages/${messageId}/receipts`);
      setData(res.data.data);
    } catch (err) {
      console.error("Failed to load message receipts:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isOpen || !messageId) {
      setData(null);
      setLoading(true);
      return;
    }

    fetchReceipts();

    const handleReload = (e) => {
      if (e.detail?.messageId === messageId) {
        fetchReceipts();
      }
    };
    
    window.addEventListener('reloadReceipts', handleReload);
    return () => {
      window.removeEventListener('reloadReceipts', handleReload);
    };
  }, [isOpen, messageId]);

  if (!isOpen) return null;

  const formatReceiptTime = (isoString) => {
    if (!isoString) return '';
    const date = new Date(isoString);
    const today = new Date();
    const options = { hour: 'numeric', minute: 'numeric', hour12: true };

    if (date.toDateString() === today.toDateString()) {
      return "Today at " + date.toLocaleTimeString('en-US', options);
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) + " at " + date.toLocaleTimeString('en-US', options);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 modal-backdrop">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl animate-scale-in flex flex-col max-h-[85vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800 shrink-0">
          <h3 className="text-lg font-semibold text-slate-100 flex items-center gap-2">
            <Info className="w-5 h-5 text-indigo-400" />
            Message Info
          </h3>
          <button onClick={onClose} className="p-1 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-slate-200 transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-10 gap-2 text-indigo-400">
              <Loader2 className="w-8 h-8 animate-spin" />
              <span className="text-xs text-slate-500 font-medium">Loading receipts...</span>
            </div>
          ) : !data ? (
            <p className="text-center text-xs text-slate-500 py-10">No receipts details available</p>
          ) : (
            <>
              {/* Message Text Card */}
              <div className="bg-slate-950/60 border border-slate-850 rounded-xl p-4 flex flex-col gap-2">
                <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider">Your Message</span>
                <p className="text-sm text-slate-200 whitespace-pre-wrap leading-relaxed">{data.content}</p>
                <span className="text-[9px] text-slate-500 self-end mt-1 font-semibold">{formatReceiptTime(data.createdAt)}</span>
              </div>

              {/* Read By Section */}
              <div className="space-y-2">
                <span className="block text-[10px] font-bold text-indigo-400 uppercase tracking-wider">
                  Read By ({data.readBy?.length || 0})
                </span>
                <div className="space-y-2 max-h-48 overflow-y-auto bg-slate-950/30 rounded-xl p-2 border border-slate-850">
                  {data.readBy?.length === 0 ? (
                    <p className="text-center text-xs text-slate-500 py-4">No one has read this message yet</p>
                  ) : (
                    data.readBy.map(r => (
                      <div key={r.user.id} className="flex items-center justify-between p-2 hover:bg-slate-800/40 rounded-lg transition border-b border-slate-850/40 last:border-b-0">
                        <div className="flex items-center gap-3">
                          <img
                            src={r.user.profilePicture ? `http://localhost:4500/files/${r.user.profilePicture}` : AVATAR_DEFAULT}
                            alt={r.user.userName}
                            className="w-8 h-8 rounded-full object-cover border border-slate-800"
                          />
                          <div className="flex flex-col text-left">
                            <span className="text-xs font-semibold text-slate-200">{r.user.userName}</span>
                            <span className="text-[10px] text-slate-500">{formatReceiptTime(r.readAt)}</span>
                          </div>
                        </div>
                        <CheckCheck className="w-4 h-4 text-indigo-400 shrink-0" />
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Delivered / Unread Section */}
              <div className="space-y-2">
                <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Delivered To ({data.unreadBy?.length || 0})
                </span>
                <div className="space-y-2 max-h-48 overflow-y-auto bg-slate-950/30 rounded-xl p-2 border border-slate-850">
                  {data.unreadBy?.length === 0 ? (
                    <p className="text-center text-xs text-slate-500 py-4">All group members have read this message</p>
                  ) : (
                    data.unreadBy.map(u => (
                      <div key={u.user.id} className="flex items-center justify-between p-2 hover:bg-slate-800/40 rounded-lg transition border-b border-slate-850/40 last:border-b-0">
                        <div className="flex items-center gap-3">
                          <img
                            src={u.user.profilePicture ? `http://localhost:4500/files/${u.user.profilePicture}` : AVATAR_DEFAULT}
                            alt={u.user.userName}
                            className="w-8 h-8 rounded-full object-cover border border-slate-800"
                          />
                          <div className="flex flex-col text-left">
                            <span className="text-xs font-semibold text-slate-200">{u.user.userName}</span>
                            <span className="text-[10px] text-slate-500">Delivered</span>
                          </div>
                        </div>
                        <Check className="w-4 h-4 text-slate-500 shrink-0" />
                      </div>
                    ))
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
