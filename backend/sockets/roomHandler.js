import { v4 as uuidv4 } from 'uuid';

const activeRooms = new Map(); // Store room state in memory for now

export const registerRoomHandlers = (io, socket) => {
  // Create a new room
  socket.on('createRoom', ({ user, config }, callback) => {
    const roomId = uuidv4().substring(0, 8); // Short room code
    const roomState = {
      id: roomId,
      host: user,
      participants: [{ ...user, socketId: socket.id, score: 0 }],
      config: config || {},
      status: 'waiting', // waiting, in-progress, finished
      chat: []
    };
    
    activeRooms.set(roomId, roomState);
    socket.join(roomId);
    
    if (callback) callback({ success: true, roomId, roomState });
    
    // Broadcast to others in the room (none yet)
    io.to(roomId).emit('roomUpdated', roomState);
  });

  // Join an existing room
  socket.on('joinRoom', ({ roomId, user }, callback) => {
    const roomState = activeRooms.get(roomId);
    
    if (!roomState) {
      if (callback) callback({ success: false, message: 'Room not found' });
      return;
    }
    
    if (roomState.status !== 'waiting') {
      if (callback) callback({ success: false, message: 'Quiz already in progress' });
      return;
    }

    // Check if user is already in the room
    const existingUser = roomState.participants.find(p => p._id === user._id);
    if (!existingUser) {
      roomState.participants.push({ ...user, socketId: socket.id, score: 0 });
    } else {
      existingUser.socketId = socket.id; // Update socket ID on reconnect
    }

    socket.join(roomId);
    
    if (callback) callback({ success: true, roomState });
    io.to(roomId).emit('roomUpdated', roomState);
  });

  // Leave room
  socket.on('leaveRoom', (roomId) => {
    socket.leave(roomId);
    const roomState = activeRooms.get(roomId);
    
    if (roomState) {
      const participant = roomState.participants.find(p => p.socketId === socket.id);
      roomState.participants = roomState.participants.filter(p => p.socketId !== socket.id);
      
      // If room empty, delete it
      if (roomState.participants.length === 0) {
        activeRooms.delete(roomId);
      } else {
        // If host left, assign new host
        if (participant && roomState.host._id === participant._id) {
          roomState.host = roomState.participants[0];
        }
        io.to(roomId).emit('roomUpdated', roomState);
      }
    }
  });

  // Start Quiz
  socket.on('startQuiz', ({ roomId, questions }, callback) => {
    const roomState = activeRooms.get(roomId);
    const caller = roomState?.participants.find(p => p.socketId === socket.id);
    
    if (roomState && caller && roomState.host._id === caller._id) {
      roomState.status = 'in-progress';
      roomState.questions = questions;
      roomState.currentQuestionIndex = 0;
      roomState.answersCount = 0;
      
      io.to(roomId).emit('quizStarted', roomState);
      if (callback) callback({ success: true });
    } else {
      if (callback) callback({ success: false, message: 'Only host can start quiz' });
    }
  });

  // Submit Answer
  socket.on('submitAnswer', ({ roomId, userId, scoreDelta }) => {
    const roomState = activeRooms.get(roomId);
    if (roomState && roomState.status === 'in-progress') {
      const participant = roomState.participants.find(p => p._id === userId);
      if (participant) {
        participant.score += scoreDelta;
        roomState.answersCount += 1;
        
        io.to(roomId).emit('roomUpdated', roomState);
        
        // If everyone answered, proceed to next question after 3 seconds
        if (roomState.answersCount >= roomState.participants.length) {
          roomState.answersCount = 0;
          roomState.currentQuestionIndex += 1;
          
          setTimeout(() => {
            if (roomState.currentQuestionIndex < roomState.questions.length) {
              io.to(roomId).emit('nextQuestion', roomState);
            } else {
              roomState.status = 'finished';
              io.to(roomId).emit('quizFinished', roomState);
            }
          }, 3000);
        }
      }
    }
  });

  // Chat message
  socket.on('sendChatMessage', ({ roomId, user, text }) => {
    const roomState = activeRooms.get(roomId);
    if (roomState) {
      const message = {
        id: uuidv4(),
        user: { _id: user._id, name: user.name, avatar: user.avatar },
        text,
        timestamp: new Date()
      };
      roomState.chat.push(message);
      io.to(roomId).emit('newChatMessage', message);
    }
  });

  // Handle disconnect
  socket.on('disconnect', () => {
    activeRooms.forEach((roomState, roomId) => {
      const participant = roomState.participants.find(p => p.socketId === socket.id);
      if (participant) {
        roomState.participants = roomState.participants.filter(p => p.socketId !== socket.id);
        if (roomState.participants.length === 0) {
          activeRooms.delete(roomId);
        } else {
          if (roomState.host._id === participant._id) {
            roomState.host = roomState.participants[0];
          }
          io.to(roomId).emit('roomUpdated', roomState);
        }
      }
    });
  });
};
