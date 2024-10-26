import { DataTypes, Model } from "sequelize";
import sequelize from "../utils/db";
import User from "./userModel"; 

export interface EarnedPointsAttributes {
  id: number;
  username: string;
  earnedFarmPoints: number;
  earnedQuestPoints: number;
}

class EarnedPoints extends Model<EarnedPointsAttributes> implements EarnedPointsAttributes {
  public id!: number;
  public username!: string;
  public earnedFarmPoints!: number;
  public earnedQuestPoints!: number;
}

EarnedPoints.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: User,
        key: 'username', // This references the username field in the User model
      },
    },
    earnedFarmPoints: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    earnedQuestPoints: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'EarnedPoints',
    tableName: "earnedPoints",
    timestamps: false,
  }
);

// Define the association between User and EarnedPoints
User.hasMany(EarnedPoints, {
  foreignKey: 'username',
});
EarnedPoints.belongsTo(User, {
  foreignKey: 'username',
});

export default EarnedPoints;
