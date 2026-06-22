import FriendRequest from '../models/FriendRequest.js';
import Friendship from '../models/Friendship.js';
import User from '../models/User.js';

// @desc    Send a friend request
// @route   POST /api/friends/request
// @access  Private
export const sendFriendRequest = async (req, res) => {
  try {
    const { recipientId } = req.body;
    const requesterId = req.user._id;

    if (requesterId.toString() === recipientId) {
      return res.status(400).json({ message: 'You cannot send a friend request to yourself' });
    }

    const recipient = await User.findById(recipientId);
    if (!recipient) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if already friends
    const existingFriendship = await Friendship.findOne({
      $or: [
        { user1: requesterId, user2: recipientId },
        { user1: recipientId, user2: requesterId }
      ]
    });

    if (existingFriendship) {
      return res.status(400).json({ message: 'You are already friends' });
    }

    // Check if request already sent or pending
    const existingRequest = await FriendRequest.findOne({
      $or: [
        { requester: requesterId, recipient: recipientId },
        { requester: recipientId, recipient: requesterId }
      ],
      status: 'pending'
    });

    if (existingRequest) {
      return res.status(400).json({ message: 'A pending friend request already exists between you two' });
    }

    const friendRequest = await FriendRequest.create({
      requester: requesterId,
      recipient: recipientId
    });

    res.status(201).json(friendRequest);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Accept a friend request
// @route   POST /api/friends/request/:id/accept
// @access  Private
export const acceptFriendRequest = async (req, res) => {
  try {
    const request = await FriendRequest.findById(req.params.id);

    if (!request) {
      return res.status(404).json({ message: 'Friend request not found' });
    }

    if (request.recipient.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to accept this request' });
    }

    if (request.status !== 'pending') {
      return res.status(400).json({ message: 'Request is no longer pending' });
    }

    request.status = 'accepted';
    await request.save();

    const friendship = await Friendship.create({
      user1: request.requester,
      user2: request.recipient
    });

    res.status(201).json(friendship);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Reject a friend request
// @route   POST /api/friends/request/:id/reject
// @access  Private
export const rejectFriendRequest = async (req, res) => {
  try {
    const request = await FriendRequest.findById(req.params.id);

    if (!request) {
      return res.status(404).json({ message: 'Friend request not found' });
    }

    if (request.recipient.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to reject this request' });
    }

    request.status = 'rejected';
    await request.save();

    res.json({ message: 'Friend request rejected' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get pending friend requests for user
// @route   GET /api/friends/requests
// @access  Private
export const getPendingRequests = async (req, res) => {
  try {
    const requests = await FriendRequest.find({
      recipient: req.user._id,
      status: 'pending'
    }).populate('requester', 'name avatar xp level');

    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get friend list
// @route   GET /api/friends
// @access  Private
export const getFriends = async (req, res) => {
  try {
    const userId = req.user._id;
    const friendships = await Friendship.find({
      $or: [{ user1: userId }, { user2: userId }]
    }).populate('user1', 'name avatar xp level')
      .populate('user2', 'name avatar xp level');

    const friends = friendships.map(f => {
      if (f.user1._id.toString() === userId.toString()) return f.user2;
      return f.user1;
    });

    res.json(friends);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
