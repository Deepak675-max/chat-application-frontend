import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useSocket } from '../context/SocketContext';
import Sidebar from '../components/Sidebar';
import ChatBox from '../components/ChatBox';
import { MessageInfoModal } from '../components/Modals';
import { Loader2 } from 'lucide-react';

export default function ChatApp() {
  const [currentUser, setCurrentUser] = useState(null);
  const [chats, setChats] = useState([]);
  const [activeChatId, setActiveChatId] = useState(null);
  const [activeChatDetails, setActiveChatDetails] = useState(null);
  const [messages, setMessages] = useState([]);
  const [onlineStatuses, setOnlineStatuses] = useState({});
  const [typingStates, setTypingStates] = useState({});
  
  // Mobile responsive view: 'list' (shows sidebar) or 'chat' (shows chatbox)
  const [mobileActiveTab, setMobileActiveTab] = useState('list');
  const [loading, setLoading] = useState(true);
  const [messageInfoModalOpen, setMessageInfoModalOpen] = useState(false);
  const [messageInfoId, setMessageInfoId] = useState(null);

  const navigate = useNavigate();
  const { socket, connectSocket, disconnectSocket } = useSocket();

  // Load user profile & initial chat list
  useEffect(() => {
    const initApp = async () => {
      try {
        const userRes = await api.get('/auth/get-user');
        if (userRes.data.error) throw new Error();
        
        const userData = userRes.data.data.user;
        setCurrentUser(userData);

        // Connect socket for the user
        const userId = userData.userId || userData.id;
        connectSocket(userId);

        await fetchChats(userData);
      } catch (err) {
        console.error('Session expired or unauthorized:', err);
        localStorage.removeItem('token');
        navigate('/login');
      } finally {
        setLoading(false);
      }
    };
    initApp();
  }, [navigate]);

  // Fetch chats and resolve recipient profile details
  const fetchChats = async (user) => {
    try {
      const response = await api.get('/users/chats');
      const chatList = response.data.data.chats || [];
      const currUser = user || currentUser;
      const currUserId = currUser.userId || currUser.id;

      // Extract recipient info directly from the pre-populated Users list
      const resolvedChats = chatList.map((chat) => {
        if (!chat.isGroupChat && chat.Users) {
          const receiver = chat.Users.find(u => u.id !== currUserId);
          if (receiver) {
            return {
              ...chat,
              receiverId: receiver.id,
              receiverName: receiver.userName,
              receiverEmail: receiver.email,
              receiverPhone: receiver.phoneNumber,
              receiverPicture: receiver.profilePicture
            };
          }
        }
        return chat;
      });

      setChats(resolvedChats);
    } catch (err) {
      console.error('Error fetching chats:', err);
    }
  };

  // Re-fetch individual chat details (useful after group photo updates)
  const refetchActiveChatDetails = async () => {
    if (!activeChatId) return;
    try {
      const detailsRes = await api.get(`/users/chats/${activeChatId}`);
      const fullChat = detailsRes.data.data.chat;
      
      let receiverInfo = {};
      if (!fullChat.isGroupChat && currentUser) {
        const currUserId = currentUser.userId || currentUser.id;
        const receiver = fullChat.Users?.find(u => u.id !== currUserId);
        if (receiver) {
          let receiverPic = null;
          try {
            const picRes = await api.get(`/users/profile-picture/${receiver.id}`);
            receiverPic = picRes.data.data.profilePicture;
          } catch (e) {}
          
          receiverInfo = {
            receiverId: receiver.id,
            receiverName: receiver.userName,
            receiverEmail: receiver.email,
            receiverPhone: receiver.phoneNumber,
            receiverPicture: receiverPic
          };
        }
      }

      const mergedDetails = { ...fullChat, ...receiverInfo };
      setActiveChatDetails(mergedDetails);
      
      // Also update in chats list
      setChats(prev => prev.map(c => c.id === activeChatId ? { ...c, ...mergedDetails } : c));
    } catch (err) {
      console.error('Error refetching chat details:', err);
    }
  };

  // Select a chat thread
  const handleSelectChat = async (chatId) => {
    setActiveChatId(chatId);
    setMobileActiveTab('chat');
    try {
      const detailsRes = await api.get(`/users/chats/${chatId}`);
      const fullChat = detailsRes.data.data.chat;
      
      let receiverInfo = {};
      if (!fullChat.isGroupChat && currentUser) {
        const currUserId = currentUser.userId || currentUser.id;
        const receiver = fullChat.Users?.find(u => u.id !== currUserId);
        if (receiver) {
          let receiverPic = null;
          try {
            const picRes = await api.get(`/users/profile-picture/${receiver.id}`);
            receiverPic = picRes.data.data.profilePicture;
          } catch (e) {}
          
          receiverInfo = {
            receiverId: receiver.id,
            receiverName: receiver.userName,
            receiverEmail: receiver.email,
            receiverPhone: receiver.phoneNumber,
            receiverPicture: receiverPic
          };

          // Fetch receiver online status
          try {
            const actRes = await api.get(`/users/${receiver.id}/activity`);
            const activity = actRes.data.data.userActivity;
            if (activity) {
              setOnlineStatuses(prev => ({
                ...prev,
                [receiver.id]: activity.status === 'Online' ? 'Online' : activity.updatedAt
              }));
            }
          } catch (e) {}
        }
      }

      setActiveChatDetails({ ...fullChat, ...receiverInfo });

      // Fetch messages
      const msgRes = await api.get(`/chats/${chatId}/messages`);
      setMessages(msgRes.data.data.chatMessages || []);

      // Notify read messages
      socket?.emit('readMessages', { chatId });
    } catch (err) {
      console.error('Error loading chat details or messages:', err);
    }
  };

  // Send a message
  const handleSendMessage = async (content) => {
    if (!activeChatId || !currentUser) return;
    const currUserId = currentUser.userId || currentUser.id;
    
    try {
      const response = await api.post('/chats/message', {
        chatId: activeChatId,
        senderId: currUserId,
        content: content
      });

      // Get full saved message object from response
      const savedMessage = response.data.data.chatMessageDetails;

      // Append locally
      setMessages(prev => {
        if (prev.some(m => m.id === savedMessage.id)) return prev;
        return [...prev, savedMessage];
      });

      // Emit socket message passing full message object
      if (activeChatDetails && !activeChatDetails.isGroupChat) {
        socket?.emit('privateMessage', {
          userId: activeChatDetails.receiverId,
          message: savedMessage
        });
      } else if (activeChatDetails?.isGroupChat) {
        socket?.emit('groupMessage', {
          groupId: activeChatId,
          message: savedMessage
        });
      }

      // Update sidebar preview
      updateChatsPreview(activeChatId, content);
    } catch (error) {
      console.error('Failed to send message:', error);
      throw error;
    }
  };

  // Helper to update sidebar last message preview and move chat to top
  const updateChatsPreview = (chatId, lastMsg) => {
    setChats(prev => {
      const chatIndex = prev.findIndex(c => c.id === chatId);
      if (chatIndex === -1) return prev;
      
      const updatedChats = [...prev];
      const chatItem = { ...updatedChats[chatIndex], lastMessage: lastMsg };
      
      // Remove from current position and insert at top
      updatedChats.splice(chatIndex, 1);
      return [chatItem, ...updatedChats];
    });
  };

  // Delete chat and its history
  const handleClearHistory = async (chatId) => {
    const targetChatId = chatId || activeChatId;
    if (!targetChatId) return;
    try {
      await api.delete(`/chats/${targetChatId}/messages`);
      
      // Remove chat from the sidebar list in state
      setChats(prev => prev.filter(c => c.id !== targetChatId));
      
      // If we are deleting the active chat, reset messages and active chat state
      if (targetChatId === activeChatId) {
        setMessages([]);
        setActiveChatId(null);
        setActiveChatDetails(null);
      }
    } catch (error) {
      console.error('Error deleting chat:', error);
    }
  };

  // Delete a single message
  const handleDeleteMessage = async (messageId) => {
    if (!activeChatId) return;
    try {
      await api.delete(`/chats/messages/${messageId}`);
      setMessages(prev => prev.filter(m => m.id !== messageId));
      if (activeChatDetails) {
        socket?.emit('deleteMessage', {
          chatId: activeChatId,
          messageId,
          receiverId: activeChatDetails.receiverId,
          isGroup: activeChatDetails.isGroupChat
        });
      }
      fetchChats(currentUser);
    } catch (error) {
      console.error('Failed to delete message:', error);
    }
  };

  // Logout current user
  const handleLogout = async () => {
    try {
      await api.get('/auth/logout');
    } catch (error) {
      // Continue client cleanup anyway
    }
    localStorage.removeItem('token');
    disconnectSocket();
    navigate('/login');
  };

  // Handle new chat created from modals
  const handleNewChatCreated = async (newChat) => {
    await fetchChats();
    handleSelectChat(newChat.id);
  };

  // Register and handle WebSocket events
  useEffect(() => {
    if (!socket) return;

    // 1. Private messages
    const onPrivateMsg = ({ userId, message }) => {
      if (activeChatId == message.chatId) {
        setMessages(prev => {
          if (prev.some(m => m.id === message.id)) return prev;
          return [...prev, message];
        });
        
        // Mark as read immediately since the chat window is open
        socket.emit('readMessages', { chatId: message.chatId });
      }

      setChats(prevChats => {
        const matchingChat = prevChats.find(c => !c.isGroupChat && c.id === message.chatId);
        if (matchingChat) {
          // Update preview and float to top
          const chatIndex = prevChats.findIndex(c => c.id === matchingChat.id);
          const updated = [...prevChats];
          const item = { ...updated[chatIndex], lastMessage: message.content };
          updated.splice(chatIndex, 1);
          return [item, ...updated];
        }
        return prevChats;
      });
    };

    // 2. Group messages
    const onGroupMsg = ({ userId, message }) => {
      if (activeChatDetails?.isGroupChat && activeChatId == message.chatId) {
        setMessages(prev => {
          if (prev.some(m => m.id === message.id)) return prev;
          return [...prev, message];
        });
        // Mark as read immediately since the chat window is open
        socket.emit('readMessages', { chatId: message.chatId });
      }

      setChats(prevChats => {
        const matchingGroup = prevChats.find(c => c.isGroupChat && c.id === message.chatId);
        if (matchingGroup) {
          const chatIndex = prevChats.findIndex(c => c.id === matchingGroup.id);
          const updated = [...prevChats];
          const item = { ...updated[chatIndex], lastMessage: message.content };
          updated.splice(chatIndex, 1);
          return [item, ...updated];
        }
        return prevChats;
      });
    };

    // 3. User status changes
    const onUserStatus = ({ userId, status }) => {
      setOnlineStatuses(prev => ({
        ...prev,
        [userId]: status === 'Online' ? 'Online' : status
      }));
    };

    // 4. User typing status changes
    const onUserTyping = ({ userId, typing, status }) => {
      setTypingStates(prev => ({
        ...prev,
        [userId]: typing
      }));
      if (status) {
        setOnlineStatuses(prev => ({
          ...prev,
          [userId]: status === 'Online' ? 'Online' : status
        }));
      }
    };

    // 5. Individual message delivery status updates
    const onMessageStatusUpdated = ({ messageId, status, chatId }) => {
      if (activeChatId == chatId) {
        setMessages(prev => prev.map(m => {
          if (m.id === messageId) {
            // Prevent downgrading (read > delivered > sent)
            if (m.status === 'read') return m;
            if (m.status === 'delivered' && status === 'sent') return m;
            return { ...m, status };
          }
          return m;
        }));
      }
    };

    // 6. Bulk messages delivery updates (when recipient logs in)
    const onMessagesDelivered = ({ chatIds, recipientId, messageIds }) => {
      if (activeChatId && chatIds.some(id => id == activeChatId)) {
        setMessages(prev => prev.map(m => 
          m.senderId == (currentUser?.userId || currentUser?.id) && m.status === 'sent' && (!messageIds || messageIds.includes(m.id))
            ? { ...m, status: 'delivered' } 
            : m
        ));
      }
    };

    // 7. Bulk messages read updates (when recipient opens the chat)
    const onMessagesRead = ({ chatId, readerId }) => {
      if (activeChatId == chatId) {
        setMessages(prev => prev.map(m => 
          m.senderId == (currentUser?.userId || currentUser?.id) && m.status !== 'read' 
            ? { ...m, status: 'read' } 
            : m
        ));
      }
    };

    // 8. Single message deleted in real-time
    const onMessageDeleted = ({ chatId, messageId }) => {
      if (activeChatId == chatId) {
        setMessages(prev => prev.filter(m => m.id !== messageId));
      }
      fetchChats(currentUser);
    };

    // 9. Group message receipts update in real-time
    const onMessageReceiptUpdated = ({ chatId, messageId }) => {
      window.dispatchEvent(new CustomEvent('reloadReceipts', { detail: { messageId } }));
    };

    socket.on('privateMessage', onPrivateMsg);
    socket.on('groupMessage', onGroupMsg);
    socket.on('getUserActivityStatus', onUserStatus);
    socket.on('userTyping', onUserTyping);
    socket.on('messageStatusUpdated', onMessageStatusUpdated);
    socket.on('messagesDelivered', onMessagesDelivered);
    socket.on('messagesRead', onMessagesRead);
    socket.on('messageDeleted', onMessageDeleted);
    socket.on('messageReceiptUpdated', onMessageReceiptUpdated);

    return () => {
      socket.off('privateMessage', onPrivateMsg);
      socket.off('groupMessage', onGroupMsg);
      socket.off('getUserActivityStatus', onUserStatus);
      socket.off('userTyping', onUserTyping);
      socket.off('messageStatusUpdated', onMessageStatusUpdated);
      socket.off('messagesDelivered', onMessagesDelivered);
      socket.off('messagesRead', onMessagesRead);
      socket.off('messageDeleted', onMessageDeleted);
      socket.off('messageReceiptUpdated', onMessageReceiptUpdated);
    };
  }, [socket, activeChatId, activeChatDetails, currentUser]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-950 text-indigo-400">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-10 h-10 animate-spin" />
          <p className="text-sm text-slate-400 font-medium">Connecting to chat...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen w-screen bg-slate-950 overflow-hidden text-slate-100">
      <div className="flex h-full w-full max-w-7xl mx-auto border-x border-slate-900 shadow-2xl relative">
        {/* Sidebar: Show on list view on mobile, always show on desktop */}
        <div className={`h-full border-r border-slate-900 shrink-0 ${mobileActiveTab === 'list' ? 'flex w-full md:w-80' : 'hidden md:flex md:w-80'}`}>
          <Sidebar
            chats={chats}
            activeChatId={activeChatId}
            onSelectChat={handleSelectChat}
            currentUser={currentUser}
            onLogout={handleLogout}
            onProfileUpdated={() => fetchChats(currentUser)}
            onNewChatCreated={handleNewChatCreated}
            onDeleteChat={handleClearHistory}
            onlineStatuses={onlineStatuses}
          />
        </div>

        {/* Chat window: Show on chat view on mobile, always show on desktop */}
        <div className={`h-full flex-1 ${mobileActiveTab === 'chat' ? 'flex w-full' : 'hidden md:flex'}`}>
          <ChatBox
            activeChatId={activeChatId}
            messages={messages}
            chatDetails={activeChatDetails}
            currentUser={currentUser}
            onSendMessage={handleSendMessage}
            onClearHistory={handleClearHistory}
            onDeleteMessage={handleDeleteMessage}
            onShowMessageInfo={(messageId) => {
              setMessageInfoId(messageId);
              setMessageInfoModalOpen(true);
            }}
            onBack={() => {
              setMobileActiveTab('list');
              setActiveChatId(null);
              setActiveChatDetails(null);
            }}
            onlineStatuses={onlineStatuses}
            typingStates={typingStates}
            onGroupPhotoUpdated={refetchActiveChatDetails}
          />
        </div>
      </div>
      <MessageInfoModal
        isOpen={messageInfoModalOpen}
        onClose={() => {
          setMessageInfoModalOpen(false);
          setMessageInfoId(null);
        }}
        messageId={messageInfoId}
      />
    </div>
  );
}
