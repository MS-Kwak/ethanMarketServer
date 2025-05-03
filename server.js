// import express from 'express';
// import cors from 'cors';
// app.listen에 동기화 하는 과정을 진행할거에요~
// import { createRequire } from 'module';
// const require = createRequire(import.meta.url);
// import db from './models/index.js';
const express = require('express');
const cors = require('cors');
const models = require('./models/index.js');
const products = require('./models/product.js');
const multer = require('multer');
const upload = multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname);
    },
  }),
}); // destination: uploads 폴더에 반환
const app = express();
const port = 3000;

app.use(express.json());
app.use(cors());
app.use('/uploads', express.static('uploads')); // 서버쪽에서 우리가 입력하는 경로랑 같게 보여주는 세팅

// 슬라이딩 배너 구현
// 테스트 http://localhost:3000/banners
app.get('/banners', (req, res) => {
  models.Banner.findAll({
    limit: 2,
  })
    .then((result) => {
      res.send({
        banners: result,
      });
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send('배너 생성에 에러가 발생했습니다.');
    });
});

app.get('/products', (req, res) => {
  // res.send('업로드된 상품입니다');

  // 쿼리 (?key=value) 사용법 http://localhost:3000/products?id=1000&name=ethan
  // { id: '1000' } { id: '1000', name: 'ethan' }
  // const query = req.query;
  // console.log('QUERY: ', query);

  // 복수개를 찾을때 findAll 메서드 사용
  // node server.js 커맨드 입력후, POSTMAN에서 send
  models.Product.findAll({
    // 상품이 몇만개이면 다 조회하면 큰일나겠죠!
    // limit: 1,
    order: [
      ['createdAt', 'DESC'], // 오름차순 (시간이 최신인것부터 조회)
    ],
    // 컬럼에서 어떤 정보들만 가져올건지 설정, 메인페이지에서는 description이 필요없으므로!
    // 필요없는 정보 노출 방지, 보안, 트래픽 낭비를 막기 위해
    attributes: ['id', 'name', 'price', 'createdAt', 'seller', 'imageUrl'],
  })
    .then((result) => {
      console.log('PRODUCTS: ', result);
      res.send({
        products: result,
      });
    })
    .catch((error) => {
      console.error(error);
      res.status(400).send('에러발생!!');
    });
});

// 클라이언트의 역할을 하는 서버를 POSTMAN으로 만들어줘야함.
app.post('/products', (req, res) => {
  // res.send('상품이 등록되었습니다');
  const body = req.body;
  const { name, description, price, seller, imageUrl } = body;
  // 방어로직
  if (!name || !description || !price || !seller || !imageUrl) {
    res.status(400).send('모든 필드를 입력해 주세요');
  }

  models.Product.create({
    name,
    description,
    seller,
    price,
    imageUrl,
  })
    .then((result) => {
      console.log('상품 생성 결과: ', result);
      res.send({
        products: result,
      });
    })
    .catch((error) => {
      console.error(error);
      res.status(400).send('상품 업로드에 문제가 발생했습니다.');
    });

  // res.send({
  //   // body: body 와같이 key와 value가 같으면 body라고 해도 됨.
  //   product: body,
  // });
});

app.get('/products/:id', (req, res) => {
  const params = req.params;
  // app.get('/products/:id/event/:eventId', (req, res) => {
  // http://localhost:3000/products/100
  // http://localhost:3000/products/100/event/999
  // res.send(`id는 ${params.id}와 ${params.eventId} 입니다`);

  // 한개를 찾을때 findOne 메서드 사용
  // 아래 코드 작성 후 node server.js 커맨드 입력, postman으로 GET send
  models.Product.findOne({
    where: {
      id: params.id,
    },
  })
    .then((result) => {
      console.log('PRODUCT: ', result);
      res.send({
        products: result,
      });
    })
    .catch((error) => {
      console.error(error);
      res.status(400).send('상품 조회에 에러가 발생했습니다.');
    });
});

// multer로 이미지 single 파일 하나 보냈을때 처리, image가 key
// 아래 작성 후, postman에서 이미지를 업로드 해볼꺼에요~
app.post('/src/assets', upload.single('image'), (req, res) => {
  const file = req.file; // 파일 정보중, 아래 path를 입력하면 이미지가 저장된 위치를 얻을 수 있음.
  console.log('file 정보: ', file);
  res.send({
    imageUrl: file.path,
  });
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
