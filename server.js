const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: { origin: "*" }
});

app.use(express.static('public'));

io.on('connection', (socket) => {
    console.log('🔗 تم اتصال جهاز جديد بجلسة التحكم:', socket.id);

    socket.on('join-room', (roomCode) => {
        socket.join(roomCode);
        console.log(`👤 جهاز انضم للغرفة رقم: ${roomCode}`);
        socket.to(roomCode).emit('peer-joined', socket.id);
    });

    socket.on('offer', (data) => {
        socket.to(data.room).emit('offer', data.offer);
    });

    socket.on('answer', (data) => {
        socket.to(data.room).emit('answer', data.answer);
    });

    socket.on('ice-candidate', (data) => {
        socket.to(data.room).emit('ice-candidate', data.candidate);
    });

    socket.on('disconnect', () => {
        console.log('❌ انقطع الاتصال مع الجهاز:', socket.id);
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`🚀 سيرفر بني سنتر للتحكم يعمل الآن على المنفذ: ${PORT}`);
});
