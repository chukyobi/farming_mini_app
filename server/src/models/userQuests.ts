import { DataTypes, Model } from "sequelize";
import sequelize from "../utils/db";
import User from "./userModel"; 
import Quests from "./Quests";

export interface UserQuestsAttributes {
  id?: number;
  user: number;
  quest: number;
  status: number;
}

class UserQuests extends Model<UserQuestsAttributes> implements UserQuestsAttributes {
  public id!: number;
  public user!: number;
  public quest!: number;
  public status!: number;
}

UserQuests.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    user: {
      type: DataTypes.INTEGER,
      allowNull: false,
      // references: {
      //   model: User,
      //   key: 'id',
      // },
    },
    quest: {
      type: DataTypes.INTEGER,
      allowNull: false,
      // references: {
      //   model: Quests,
      //   key: 'id'
      // }
    },
    status: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1 //completed
    },
  },
  {
    sequelize,
    modelName: 'userQuests',
    tableName: "user_quests",
    timestamps: false,
  }
);

// Define the associations

User.hasMany(UserQuests, {
  foreignKey: 'id',
});
UserQuests.hasMany(Quests,{
    foreignKey: 'id'
});
UserQuests.belongsTo(User, {
  foreignKey: 'id',
});

export default UserQuests;
