import React, { useState, useEffect, useRef } from 'react';
import { useSocket } from '../context/SocketContext';
import { ChatInfoModal } from './Modals';
import { Send, ArrowLeft, MoreVertical, Trash2, Info, Loader2, Check, CheckCheck } from 'lucide-react';

const AVATAR_DEFAULT = "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg";

export default function ChatBox({
  activeChatId,
  messages,
  chatDetails,
  currentUser,
  onSendMessage,
  onClearHistory,
  onBack,
  onlineStatuses,
  typingStates,
  onGroupPhotoUpdated,
  onDeleteMessage,
  onShowMessageInfo,
}) {
  const [inputText, setInputText] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [modalInfo, setModalInfo] = useState(false);
  const [sending, setSending] = useState(false);

  const { socket } = useSocket();
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  // Scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Handle typing state triggers
  const handleInputChange = (e) => {
    setInputText(e.target.value);

    if (!chatDetails || chatDetails.isGroupChat || !socket) return;

    const recipientId = chatDetails.receiverId;
    socket.emit('startTyping', { recieverId: recipientId });

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      socket.emit('stopTyping', { recieverId: recipientId });
    }, 1000);
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    setSending(true);
    const text = inputText;
    setInputText('');

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
      if (socket && chatDetails && !chatDetails.isGroupChat) {
        socket.emit('stopTyping', { recieverId: chatDetails.receiverId });
      }
    }

    try {
      await onSendMessage(text);
    } catch (err) {
      console.error(err);
      setInputText(text); // Restore text on failure
    } finally {
      setSending(false);
    }
  };

  // Convert ISO string to custom visual format
  const formatTime = (isoString, status = false) => {
    if (!isoString) return '';
    const date = new Date(isoString);
    const today = new Date();
    const options = { hour: 'numeric', minute: 'numeric', hour12: true };

    if (status) {
      if (date.toDateString() === today.toDateString()) {
        return "last seen today at " + date.toLocaleTimeString('en-US', options);
      } else {
        return "last seen " + date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) + " at " + date.toLocaleTimeString('en-US', options);
      }
    }

    if (date.toDateString() === today.toDateString()) {
      return date.toLocaleTimeString('en-US', options);
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) + ", " + date.toLocaleTimeString('en-US', options);
    }
  };

  if (!chatDetails) {
    return (
      <div className="hidden md:flex flex-1 flex-col items-center justify-center bg-slate-950/20 text-slate-500">
        <div className="max-w-md text-center p-6 space-y-3">
          <div className="w-16 h-16 bg-slate-800/40 rounded-3xl mx-auto flex items-center justify-center text-indigo-400">
            <svg viewBox="0 0 24 24" className="w-8 h-8 fill-none stroke-current" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 0 1-.92 1.608 1.849 1.849 0 0 0 1.25.597 4.195 4.195 0 0 0 2.457-.847c.552-.375 1.167-.478 1.778-.23a9.06 9.06 0 0 0 3.576.732Z" />
            </svg>
          </div>
          <h3 className="text-lg font-bold text-slate-350">Let's Talk Chat</h3>
          <p className="text-sm text-slate-500">
            Select a conversation from the sidebar list or create a new chat/group to start exchanging messages.
          </p>
        </div>
      </div>
    );
  }

  const isGroup = chatDetails.isGroupChat;
  const chatTitle = isGroup ? chatDetails.chatName : chatDetails.receiverName;
  const chatPic = isGroup ? chatDetails.profilePicture : chatDetails.receiverPicture;

  // Determine user status
  let statusText = '';
  const isTyping = !isGroup && typingStates[chatDetails.receiverId];
  if (isTyping) {
    statusText = 'typing...';
  } else if (!isGroup) {
    const status = onlineStatuses[chatDetails.receiverId];
    if (status === 'Online') {
      statusText = 'Online';
    } else if (status) {
      statusText = formatTime(status, true);
    }
  }

  return (
    <div className="flex-1 h-full bg-slate-950/20 flex flex-col overflow-hidden animate-fade-in">
      {/* Header */}
      <div className="h-16 px-4 bg-slate-900 border-b border-slate-800 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={onBack}
            className="md:hidden p-1.5 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-slate-200 transition"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          
          <img
            src={chatPic ? `http://localhost:4500/files/${chatPic}` : AVATAR_DEFAULT}
            alt={chatTitle}
            className="w-10 h-10 rounded-full object-cover border border-slate-850"
          />

          <div className="min-w-0">
            <h3 className="text-sm font-semibold text-slate-200 truncate">{chatTitle}</h3>
            {statusText && (
              <p className={`text-xs truncate ${isTyping ? 'text-indigo-400 font-medium' : 'text-slate-500'}`}>
                {statusText}
              </p>
            )}
          </div>
        </div>

        {/* Dropdown Menu */}
        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="p-2 text-slate-400 hover:text-slate-100 hover:bg-slate-800 rounded-xl transition"
          >
            <MoreVertical className="w-5 h-5" />
          </button>

          {dropdownOpen && (
            <>
              <div onClick={() => setDropdownOpen(false)} className="fixed inset-0 z-30" />
              <div className="absolute right-0 mt-2 w-48 bg-slate-800 border border-slate-700 rounded-xl shadow-2xl z-40 py-1.5 animate-scale-in">
                <button
                  onClick={() => { setDropdownOpen(false); setModalInfo(true); }}
                  className="w-full text-left px-4 py-2 text-xs font-semibold text-slate-350 hover:bg-slate-700 hover:text-white flex items-center gap-2"
                >
                  <Info className="w-4 h-4 text-indigo-400" />
                  {isGroup ? 'Group Details' : 'Contact Info'}
                </button>
                <button
                  onClick={() => {
                    setDropdownOpen(false);
                    if (confirm('Clear chat history? This cannot be undone.')) {
                      onClearHistory();
                    }
                  }}
                  className="w-full text-left px-4 py-2 text-xs font-semibold text-rose-400 hover:bg-rose-500/10 flex items-center gap-2"
                >
                  <Trash2 className="w-4 h-4 text-rose-400" />
                  Clear Chat
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Messages Feed */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-950/10">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-slate-650 italic text-sm">
            No messages yet. Send a message to start talking.
          </div>
        ) : (
          messages.map(m => {
            const isMe = m.senderId === currentUser.userId;
            
            // For groups, find sender name
            let senderName = '';
            if (isGroup && !isMe) {
              const sender = chatDetails.Users?.find(u => u.id === m.senderId);
              senderName = sender ? sender.userName : 'User';
            }

            return (
              <div
                key={m.id}
                className={`flex w-full group items-center gap-1.5 ${isMe ? 'justify-end' : 'justify-start'}`}
              >
                {isMe && (
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-1 shrink-0">
                    {isGroup && (
                      <button
                        onClick={() => onShowMessageInfo(m.id)}
                        className="p-1 bg-slate-900 hover:bg-indigo-500/20 hover:text-indigo-400 rounded-lg text-slate-500 cursor-pointer shadow border border-slate-800"
                        title="Message info"
                      >
                        <Info className="w-3.5 h-3.5" />
                      </button>
                    )}
                    <button
                      onClick={() => onDeleteMessage(m.id)}
                      className="p-1 bg-slate-900 hover:bg-red-500/20 hover:text-red-400 rounded-lg text-slate-500 cursor-pointer shadow border border-slate-800"
                      title="Delete message"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
                <div
                  className={`max-w-[75%] rounded-2xl px-4 py-2.5 shadow-md flex flex-col gap-1 ${isMe ? 'bg-indigo-100 text-slate-950 rounded-br-none' : 'bg-slate-900 text-slate-200 rounded-bl-none border border-slate-850'}`}
                >
                  {isGroup && !isMe && (
                    <span className="text-[10px] font-bold text-indigo-400 mb-0.5">
                      {senderName}
                    </span>
                  )}
                  <p className="text-sm whitespace-pre-wrap leading-relaxed select-text text-left w-full">{m.content}</p>
                  <div className="flex items-center gap-1 self-end mt-0.5 font-medium">
                    <span className="text-[9px] text-slate-500">
                      {formatTime(m.updatedAt)}
                    </span>
                    {isMe && (
                      <span className="inline-flex shrink-0">
                        {!isGroup && (
                          <>
                            {(!m.status || m.status === 'sent') && (
                              <Check className="w-3.5 h-3.5 text-slate-400" />
                            )}
                            {m.status === 'delivered' && (
                              <CheckCheck className="w-3.5 h-3.5 text-slate-500" />
                            )}
                            {m.status === 'read' && (
                              <CheckCheck className="w-3.5 h-3.5 text-indigo-650" />
                            )}
                          </>
                        )}
                        {isGroup && (
                          <>
                            {m.status === 'read' ? (
                              <CheckCheck className="w-3.5 h-3.5 text-indigo-650" />
                            ) : (
                              <Check className="w-3.5 h-3.5 text-slate-400" />
                            )}
                          </>
                        )}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Footer */}
      <div className="p-3 bg-slate-900 border-t border-slate-800 shrink-0">
        <form onSubmit={handleSend} className="flex gap-2">
          <input
            type="text"
            placeholder="Type a message..."
            value={inputText}
            onChange={handleInputChange}
            className="flex-1 bg-slate-950/60 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500/50 text-sm transition"
          />
          <button
            type="submit"
            disabled={sending || !inputText.trim()}
            className="p-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition disabled:opacity-50 shrink-0 shadow-lg shadow-indigo-600/15"
          >
            {sending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
          </button>
        </form>
      </div>

      {/* Chat Details Modal Overlay */}
      <ChatInfoModal
        isOpen={modalInfo}
        onClose={() => setModalInfo(false)}
        chatDetails={chatDetails}
        onGroupPhotoUpdated={onGroupPhotoUpdated}
        onGroupDetailsUpdated={onGroupPhotoUpdated}
        currentUser={currentUser}
      />
    </div>
  );
}
