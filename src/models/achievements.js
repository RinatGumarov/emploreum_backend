module.exports = (sequelize, DataTypes) => {
    
    let achievements = sequelize.define('achievements', {
        desc: DataTypes.TEXT,
        photoPath: {
            type: DataTypes.STRING,
            field: "photo_path"
        }
    }, {
        timestamps: false
    });
    return achievements;
};