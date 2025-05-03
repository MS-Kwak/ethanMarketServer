'use strict';

// import { createRequire } from 'module';
// import { fileURLToPath } from 'url';
// const require = createRequire(import.meta.url);

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const process = require('process');
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.json')[env];
const db = {};

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

fs.readdirSync(__dirname)
  .filter((file) => {
    return (
      file.indexOf('.') !== 0 &&
      file !== basename &&
      file.slice(-3) === '.js' &&
      file.indexOf('.test.js') === -1
    );
  })
  .forEach((file) => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });

// 비동기로 파일 추가
// (async () => {
//   // files변수에 .js 파일로 된 파일들의 경로를 담은 배열 담기
//   const files = fs.readdirSync(__dirname).filter((file) => {
//     return file.indexOf('.') !== 0 && file !== basename && file.includes('.js');
//   });

//   console.log(files); // ['경로/user.js','경로/edit.js','경로/test.js']

//   files.map(async (file) => {
//     const module = await import(path.join(__dirname, file));
//     module.default(); // default()를 해주어야 해당 모듈이 실행된다.
//   });
// })();

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
// export default db;
