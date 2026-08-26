import React, { useState } from 'react';
import { Search, LogOut, User, MessageSquarePlus, Users, MoreVertical, Trash2 } from 'lucide-react';
import { NewPrivateChatModal, NewGroupModal, ProfileModal } from './Modals';

const AVATAR_DEFAULT = "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg";

export default function Sidebar({
  chats,
  activeChatId,
  onSelectChat,
  currentUser,
  onLogout,
  onProfileUpdated,
  onNewChatCreated,
  onDeleteChat,
  onlineStatuses,
}) {
  const [search, setSearch] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const [modalNewChat, setModalNewChat] = useState(false);
  const [modalNewGroup, setModalNewGroup] = useState(false);
  const [modalProfile, setModalProfile] = useState(false);

  // Filter chats by name or contact name
  const filteredChats = chats.filter(c => {
    const name = c.isGroupChat ? c.chatName : c.receiverName;
    return name?.toLowerCase().includes(search.toLowerCase());
  });

  return (
    <div className="w-full md:w-80 h-full bg-slate-900 border-r border-slate-800 flex flex-col shrink-0">
      {/* Sidebar Header */}
      <div className="h-16 px-4 bg-slate-900 border-b border-slate-800 flex items-center justify-between shrink-0">
        <div className="relative">
          <button 
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex items-center focus:outline-none hover:opacity-85 transition"
          >
            <img
              src={currentUser?.profilePicture ? `http://localhost:4500/files/${currentUser.profilePicture}` : AVATAR_DEFAULT}
              alt="Profile"
              className="w-10 h-10 rounded-full object-cover border border-slate-800"
            />
          </button>

          {menuOpen && (
            <>
              <div onClick={() => setMenuOpen(false)} className="fixed inset-0 z-30" />
              <div className="absolute left-0 mt-2 w-48 bg-slate-800 border border-slate-700 rounded-xl shadow-2xl z-40 py-1.5 animate-scale-in">
                <button
                  onClick={() => { setMenuOpen(false); setModalProfile(true); }}
                  className="w-full text-left px-4 py-2 text-xs font-semibold text-slate-300 hover:bg-slate-700 hover:text-white flex items-center gap-2"
                >
                  <User className="w-4 h-4 text-indigo-400" />
                  My Profile
                </button>
                <button
                  onClick={() => { setMenuOpen(false); onLogout(); }}
                  className="w-full text-left px-4 py-2 text-xs font-semibold text-rose-400 hover:bg-rose-500/10 flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4 text-rose-400" />
                  Logout
                </button>
              </div>
            </>
          )}
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => setModalNewChat(true)}
            title="New Chat"
            className="p-2 text-slate-400 hover:text-slate-100 hover:bg-slate-800/80 rounded-xl transition"
          >
            <MessageSquarePlus className="w-5 h-5" />
          </button>
          <button
            onClick={() => setModalNewGroup(true)}
            title="New Group"
            className="p-2 text-slate-400 hover:text-slate-100 hover:bg-slate-800/80 rounded-xl transition"
          >
            <Users className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Search Box */}
      <div className="p-3 bg-slate-900 border-b border-slate-800 shrink-0">
        <div className="relative">
          <Search className="w-4.5 h-4.5 text-slate-500 absolute left-3 inset-y-0 my-auto" />
          <input
            type="text"
            placeholder="Search or start new chat"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-950/60 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500/50 text-sm transition"
          />
        </div>
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {filteredChats.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-40 text-slate-500">
            <p className="text-sm">No chats found</p>
          </div>
        ) : (
          filteredChats.map(c => {
            const isActive = c.id === activeChatId;
            const chatName = c.isGroupChat ? c.chatName : c.receiverName;
            const chatPic = c.isGroupChat 
              ? c.profilePicture 
              : c.receiverPicture;
            
            // Check online status if private chat
            const isOnline = !c.isGroupChat && onlineStatuses[c.receiverId] === 'Online';

            return (
              <div
                key={c.id}
                onClick={() => onSelectChat(c.id)}
                className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition select-none group relative ${isActive ? 'bg-slate-800 text-slate-100' : 'hover:bg-slate-800/40 text-slate-300'}`}
              >
                <div className="relative shrink-0">
                  <img
                    src={chatPic ? `http://localhost:4500/files/${chatPic}` : AVATAR_DEFAULT}
                    alt={chatName}
                    className="w-11 h-11 rounded-full object-cover border border-slate-850"
                  />
                  {isOnline && (
                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-slate-900 rounded-full" />
                  )}
                </div>

                <div className="flex-1 min-w-0 pr-6">
                  <div className="flex justify-between items-baseline mb-0.5">
                    <h4 className="text-sm font-semibold truncate pr-2">{chatName}</h4>
                  </div>
                  <p className="text-xs text-slate-450 truncate">
                    {c.lastMessage || <span className="italic text-slate-600">No messages yet</span>}
                  </p>
                </div>

                {/* Quick actions (Clear/Delete chat) */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (confirm('Are you sure you want to clear this chat history?')) {
                      onDeleteChat(c.id);
                    }
                  }}
                  className="absolute right-3 p-1.5 text-slate-600 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition md:opacity-0 md:group-hover:opacity-100"
                  title="Clear Chat History"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            );
          })
        )}
      </div>

      {/* Modals Container */}
      <NewPrivateChatModal
        isOpen={modalNewChat}
        onClose={() => setModalNewChat(false)}
        onChatCreated={onNewChatCreated}
      />
      <NewGroupModal
        isOpen={modalNewGroup}
        onClose={() => setModalNewGroup(false)}
        onGroupCreated={onNewChatCreated}
      />
      {currentUser && (
        <ProfileModal
          isOpen={modalProfile}
          onClose={() => setModalProfile(false)}
          currentUser={currentUser}
          onProfileUpdated={onProfileUpdated}
        />
      )}
    </div>
  );
}
