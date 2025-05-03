module.exports = function (sequelize, DataTypes) {
  // 테이블을 만드는데, 테이블 이름은 'Banner'
  const banner = sequelize.define('Banner', {
    imageUrl: {
      type: DataTypes.STRING(300),
      allowNull: true,
    },
    href: {
      type: DataTypes.STRING(200),
      allowNull: true,
    },
  });

  return banner;
};
