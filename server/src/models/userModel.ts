import { DataTypes, Model} from "sequelize";
import sequelize from "../utils/db";


interface UserAttributes {
  id: number;
  usertelegramId: string;
  username: string | null;
  firstname: string | null;
  farmedPoints: number;
  walletAddress: string | null;
  profileImage: string | null;
  referralLink: string;
  completedTasks: string | null;
  numberofReferrals: string | null;
  migrationCode: string | null;
  mintedNft: string | null;
  email: string | null;
  dateCreated: Date;
  lastLogin: Date;
}

class User extends Model<UserAttributes> implements UserAttributes {
  public id!: number;
  public usertelegramId!: string;
  public username!: string | null;
  public firstname!: string | null;
  public farmedPoints!: number;
  public walletAddress!: string | null;
  public profileImage!: string | null;
  public referralLink!: string;
  public completedTasks!: string | null;
  public numberofReferrals!: string | null;
  public migrationCode!: string | null;
  public mintedNft!: string | null;
  public email!: string | null;
  public dateCreated!: Date;
  public lastLogin!: Date;
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: true,
      autoIncrement: true
    },
    usertelegramId: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true, // Make username field unique
    },
    firstname: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    farmedPoints: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    walletAddress: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    profileImage: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    referralLink: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    completedTasks: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    numberofReferrals: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    migrationCode: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    mintedNft: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    dateCreated: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    lastLogin: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    modelName: 'User', 
    tableName: "users",
    timestamps: false,
  }
);



export default User;
