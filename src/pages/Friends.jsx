import React, { useEffect, useState, useContext } from 'react';
import { useAuth } from '../context/AuthContext';
import { SocketContext } from '../context/SocketContext';
import { Users, UserPlus, Check, X } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Friends() {
  const { user } = useAuth();
  const { socket } = useContext(SocketContext);
  const [friends, setFriends] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [newFriendId, setNewFriendId] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFriendsData();
  }, []);

  const fetchFriendsData = async () => {
    try {
      const token = localStorage.getItem('token');
      const [friendsRes, requestsRes] = await Promise.all([
        fetch('http://localhost:5000/api/friends', {
          headers: { Authorization: `Bearer ${token}` }
        }),
        fetch('http://localhost:5000/api/friends/requests', {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);

      if (friendsRes.ok) setFriends(await friendsRes.json());
      if (requestsRes.ok) setPendingRequests(await requestsRes.json());
    } catch (error) {
      console.error(error);
      toast.error('Failed to load friends');
    } finally {
      setLoading(false);
    }
  };

  const handleSendRequest = async (e) => {
    e.preventDefault();
    if (!newFriendId) return;

    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5000/api/friends/request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ recipientId: newFriendId })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      toast.success('Friend request sent!');
      setNewFriendId('');
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleAccept = async (requestId) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:5000/api/friends/request/${requestId}/accept`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!res.ok) throw new Error('Failed to accept request');
      
      toast.success('Friend request accepted!');
      fetchFriendsData();
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleReject = async (requestId) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:5000/api/friends/request/${requestId}/reject`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!res.ok) throw new Error('Failed to reject request');
      
      toast.success('Friend request rejected');
      fetchFriendsData();
    } catch (error) {
      toast.error(error.message);
    }
  };

  if (loading) return <div className="p-8 text-center">Loading friends...</div>;

  return (
    <div className="max-w-4xl mx-auto p-4 py-8 space-y-8">
      <div className="flex items-center gap-4 mb-8">
        <Users className="w-10 h-10 text-blue-500" />
        <h1 className="text-3xl font-bold">Friends System</h1>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Send Request Section */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700">
          <h2 className="text-xl font-bold flex items-center gap-2 mb-4">
            <UserPlus size={20} /> Add Friend
          </h2>
          <form onSubmit={handleSendRequest} className="flex gap-2">
            <input 
              type="text" 
              placeholder="Enter User ID..." 
              value={newFriendId}
              onChange={(e) => setNewFriendId(e.target.value)}
              className="flex-1 px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-transparent"
            />
            <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium">
              Send
            </button>
          </form>
        </div>

        {/* Pending Requests Section */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700">
          <h2 className="text-xl font-bold mb-4">Pending Requests ({pendingRequests.length})</h2>
          {pendingRequests.length === 0 ? (
            <p className="text-slate-500">No pending requests</p>
          ) : (
            <div className="space-y-3">
              {pendingRequests.map(req => (
                <div key={req._id} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                  <div>
                    <p className="font-semibold">{req.requester.name}</p>
                    <p className="text-sm text-slate-500">Level {req.requester.level}</p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => handleAccept(req._id)} className="p-2 bg-emerald-100 text-emerald-600 rounded-lg hover:bg-emerald-200">
                      <Check size={16} />
                    </button>
                    <button onClick={() => handleReject(req._id)} className="p-2 bg-rose-100 text-rose-600 rounded-lg hover:bg-rose-200">
                      <X size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Friends List */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700">
        <h2 className="text-xl font-bold mb-4">My Friends ({friends.length})</h2>
        {friends.length === 0 ? (
          <p className="text-slate-500">You haven't added any friends yet.</p>
        ) : (
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
            {friends.map(friend => (
              <div key={friend._id} className="flex items-center gap-3 p-4 border border-slate-200 dark:border-slate-700 rounded-xl">
                <div className="w-12 h-12 bg-slate-200 dark:bg-slate-700 rounded-full flex items-center justify-center font-bold text-lg">
                  {friend.name.charAt(0)}
                </div>
                <div>
                  <p className="font-bold">{friend.name}</p>
                  <p className="text-sm text-slate-500">Level {friend.level}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
