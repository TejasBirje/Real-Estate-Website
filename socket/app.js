import { Server } from "socket.io";

const io = new Server({
  cors: {
    origin: "http://localhost:5173",
  },
});

let onlineUser = [];

const addUser = (userId, socketId) => {
  const userExits = onlineUser.find((user) => user.userId === userId);
  if (!userExits) {
    onlineUser.push({ userId, socketId });
  }
};

const removeUser = (socketId) => {
  onlineUser = onlineUser.filter((user) => user.socketId !== socketId);
};

const getUser = (userId) => {
  return onlineUser.find((user) => user.userId === userId);
};

io.on("connection", (socket) => {
  socket.on("newUser", (userId) => {
    addUser(userId, socket.id);
    useEffect(() => {
        const read = async () => {
          try {
            await apiRequest.put("/chats/read/" + chat.id);
          } catch (err) {
            console.log(err);
          }
        };
    
        if (chat && socket) {
          socket.on("getMessage", (data) => {
            if (chat.id === data.chatId) {
              setChat((prev) => ({ ...prev, messages: [...prev.messages, data] }));
              read();
            }
          });
        }
        return () => {
          socket.off("getMessage");
        };
      }, [socket, chat]);
  });

  socket.on("sendMessage", ({ receiverId, data }) => {
    const receiver = getUser(receiverId);
    io.to(receiver.socketId).emit("getMessage", data);
  });

  socket.on("disconnect", () => {
    removeUser(socket.id);
  });
});

io.listen("4000");