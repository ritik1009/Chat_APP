const io = require("socket.io")(8900,{
    cors:{
        origin:"http://localhost:3000",
    },
});

let users = [];

const addUser = (userId,socketId)=>{
    !users.some((user)=>user.userId===userId) && users.push({userId,socketId});
}

const removeUser = (socketId)=>{
    users = users.filter((user)=>user.socketId!==socketId);
}

const getUser = (userId)=>{
    return users.find((user)=>user.userId===userId)
}

io.on("connection",(socket)=>{
    // When Connect
    console.log("a user Connected.")
    // take userId and socketId from user
    socket.on("addUser",(userId)=>{
        addUser(userId,socket.id);
        io.emit("getUsers",users);
    });

    // Send and get message
    socket.on("sendMessage",({senderId,receiverId,text})=>{
        const reciver = getUser(receiverId);
        console.log("Recxiver",reciver);
        console.log("RecxiverSender",users);
        io.to(reciver.socketId).emit("getMessage",{
            senderId,
            text,
        })
        console.log("The message has been sent to"+reciver.socketId+" message - "+text)
    })

    // When Disconnect
    socket.on("disconnected",(socket)=>{
        console.log("The user is disconnected from the server");
        removeUser(socket.id);
        io.emit("getUsers",users);
    })
    

})
