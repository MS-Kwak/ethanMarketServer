import express from 'express';
import cors from 'cors';
// app.listen에 동기화 하는 과정을 진행할거에요~
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const models = require('./models');

const app = express();
const port = 3000;

app.use(express.json());
app.use(cors());

app.get('/product', (req, res) => {
  // res.send('업로드된 상품입니다');

  // 쿼리 (?key=value) 사용법 http://localhost:3000/product?id=1000&name=ethan
  const query = req.query;
  console.log('QUERY: ', query);
  // { id: '1000' }
  // { id: '1000', name: 'ethan' }

  res.send({
    products: [
      {
        id: 1,
        name: '농구공',
        price: 100000,
        seller: '샤일로',
        imageUrl: 'src/assets/basketball1.jpg',
      },
      {
        id: 2,
        name: '축구공',
        price: 200000,
        seller: '누벨',
        imageUrl: 'src/assets/soccerball1.jpg',
      },
      {
        id: 3,
        name: '키보드',
        price: 5000000,
        seller: '이든',
        imageUrl: 'src/assets/keyboard1.jpg',
      },
    ],
  });
});

// 클라이언트의 역할을 하는 서버를 POSTMAN으로 만들어줘야함.
app.post('/product', (req, res) => {
  // res.send('상품이 등록되었습니다');

  const body = req.body;
  res.send({
    // body: body 와같이 key와 value가 같으면 body라고 해도 됨.
    product: body,
  });
});

app.get('/product/:id/event/:eventId', (req, res) => {
  const params = req.params;
  // http://localhost:3000/product/100
  // http://localhost:3000/product/100/event/999
  res.send(`id는 ${params.id}와 ${params.eventId} 입니다`);
});

app.listen(port, () => {
  console.log('이든의 쇼핑몰 서버가 돌아가고 있습니다');

  models.sequelize
    .sync()
    .then(() => {
      console.log('DB 연결 성공!');
      // database.sqlite3 파일이 생성되고, 앞으로 DB가 들어갈꺼에요~
    })
    .catch((err) => {
      console.error(err);
      console.log('DB 연결 에러ㅠ');
      process.exit(); // DB연결 안되면 서버와의 연결을 종료!
    });
});
