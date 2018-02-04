module.exports = (sequelize, DataTypes) => {
   
    let achievements = sequelize.define('achievements', {
        desc: DataTypes.TEXT,
        photo_path: DataTypes.STRING
    }, {
        timestamps: false
    });
    return achievements;
};