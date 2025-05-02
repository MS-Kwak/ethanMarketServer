// node server.js 커맨드 명령어 실행

import http from 'http';
// var http = require('http'); // node 내장 모듈 불러옴
const hostname = '127.0.0.1'; // localhost와 동일
const port = 3000;

const server = http.createServer((req, res) => {
  console.log('REQUEST: ', req);
  // http://localhost:3000/으로 접속하면 응답을 받을 수 있음
  res.end('Hello Client!'); // 서버에게 end명령어로 해당 스트링을 반환시켜줌
});

server.listen(port, hostname);

console.log('ethan market server on!!');
console.log('Server running at http://' + hostname + ':' + port);
