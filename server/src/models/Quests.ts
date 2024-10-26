import { DataTypes, Model } from "sequelize";
import sequelize from "../utils/db";
export interface QuestAttributes {
  id: number;
  title: string;
  status: number,
  link: string,
  point: number;
  image: string;
}

class Quests extends Model<QuestAttributes> implements QuestAttributes {
  public id!: number;
  public title!: string;
  public status!: number;
  public link!: string;
  public point!: number;
  public image!: string;
}

Quests.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    status: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
    },
    link: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    point: {
        type: DataTypes.INTEGER,
        defaultValue: 350,
    },
    image: {
        type: DataTypes.STRING,
        defaultValue: "../../assets/lightning-bolt-filled.svg"
    }
  },
  {
    sequelize,
    modelName: 'Quests',
    tableName: "quests",
    timestamps: true,
  }
);


export default Quests;
