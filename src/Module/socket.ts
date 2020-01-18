import roomDB from './roomDB';
function socket(io){
    io.sockets.on('connection', socket => {
    	console.log("socket 서버 접속 완료 ");
    socket.on("SendServer",data=>{
            socket.emit("sendClient",data)
            console.log(data)
        })
	socket.on("Join",_id=>{
	    console.log("join",_id);
	    socket.join(_id);
	    let rooms = roomDB.searchAll();
            let room = rooms.filter(value=> value._id == _id)
	    console.log("room",room);
            io.sockets.in(_id).emit("RoomLoad",room[0]);
            //메인로드를 추가해야됨
            var MainLoad = [];
            roomDB.searchAll().forEach((data, index) => {
                MainLoad[index] = {
                    _id : data._id,
                    roomname: data.roomname,
                    personnel: data.personnel,
                    connectedUsers: data.connectedUsers,
                    passwordLock: data.passwordLock,
                    progress : data.progress
                };
            });
            socket.emit("sendMainRoom",MainLoad[0])     
        })
        socket.on("MainLoad",data=>{
            console.log("응답 성공");
            var MainLoad = [];
            roomDB.searchAll().forEach((data, index) => {
                MainLoad[index] = {
                    _id : data._id,
                    roomname: data.roomname,
                    personnel: data.personnel,
                    connectedUsers: data.player.length,
                    passwordLock: data.passwordLock,
                    progress : data.progress
                };
            });
	    socket.emit("sendMainRoom",{value:MainLoad})     
	})
	socket.on("sendMessage",data=>{
		const dataArray = data.split('/');
		console.log(dataArray);
		io.sockets.in(dataArray[0]).emit("getMessage",data)
	})
	socket.on("RoomLeave",data=>{
		console.log(data);
		const dataArray = data.split('/');
		io.sockets.in(dataArray[0]).emit("getLeaveMessage",dataArray[1]);
		socket.leave(dataArray[0]);
		const room = roomDB.searchAll().filter(value=>value._id == dataArray[0]);

		io.sockets.in(dataArray[0]).emit("RoomLoad",room[0]);
		var MainLoadAll = MainLoad();
		socket.emit("sendMainRoom",MainLoadAll);
	})
    })
 }
 function MainLoad(){
 	var MainLoad = [];
            roomDB.searchAll().forEach((data, index) => {
                MainLoad[index] = {
                    _id : data._id,
                    roomname: data.roomname,
                    personnel: data.personnel,
                    connectedUsers: data.connectedUsers,
                    passwordLock: data.passwordLock,
                    progress : data.progress
              };
	 });
	return MainLoad;
 }   
export default socket
