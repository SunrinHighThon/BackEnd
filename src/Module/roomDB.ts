import * as lowdb from "lowdb";
import * as FileSync from "lowdb/adapters/FileSync";
import * as fs from "fs";
fs.unlink("Room.json", function(err) {
  if (err) throw err;
  console.log("방 초기화");
});
const adapter = new FileSync("Room.json");
const Roomdb = lowdb(adapter);
function searchAll() {
  return Roomdb.get("RoomData").value();
}
function setting() {
  Roomdb.defaults({ RoomData: [] }).write();
}
function push(data) {
  Roomdb.get("RoomData")
    .push(data)
    .write();
}
function leave(data) {
  const Room = Roomdb.get("RoomData")
    .find({ _id: data._id })
    .value();
  const player = Room.player;
  if (player.length != 1 || data.master == true) {
    player[1].master = true;
  }
  const UpdatePlayer = player.filter(value => value.nickname != data.nickname);
  console.log("change", UpdatePlayer);
  const people = Room.connectedUsers - 1;
  Roomdb.get("RoomData")
    .find({ _id: data._id })
    .assign({ connectedUsers: people })
    .write();

  Roomdb.get("RoomData")
    .find({ _id: data._id })
    .assign({ player: UpdatePlayer })
    .write();
  return "방을 성공적으로 나갔습니다";
}
function start(data) {
  Roomdb.get("RoomData")
    .find({ _id: data._id })
    .assign({ progress: true })
    .write();
}
function score(data) {
  const Room = Roomdb.get("RoomData")
    .find({ _id: data[0] })
    .value();
  const RoomP = [];
  Room.player.forEach(element => {
    if (element.nickname == data[1]) {
      element.score = element.score + data[2];
    }
    RoomP.push(element);
  });
  console.log(RoomP);
  Room.player = RoomP;
  Roomdb.get("RoomData")
    .find({ _id: data[0] })
    .assign({ player: Roomdb.player })
    .write();
  const playerscore = [];
  RoomP.forEach(data => {
    playerscore.push([data.socre, data.nickname]);
  });
  console.log(playerscore.reverse());
  return playerscore.reverse();
}
function join(data) {
  console.log("joinjoin", data);
  const Room = Roomdb.get("RoomData")
    .find({ _id: data._id })
    .value();
  console.log(Room);
  if (!Room) {
    return "해당 방이 없습니다";
  }
  console.log(Room.password, data.password);
  if (Room.password != data.password) {
    return "비밀번호가 틀립니다";
  }
  const player = Room.player;
  player.push({
    nickname: data.nickname,
    master: false,
    userdata: data.userdata
  });
  const people = Room.connectedUsers + 1;
  Roomdb.get("RoomData")
    .find({ _id: data._id })
    .assign({ connectedUsers: people })
    .write();
  console.log("test1");
  Roomdb.get("RoomData")
    .find({ _id: data._id })
    .assign({ player: player })
    .write();
  console.log("test2");
  return "성공적으로 방에 입장하셨습니다";
}
function remove() {
  console.log("b");
}
export default { setting, push, remove, join, searchAll, leave, start, score };
