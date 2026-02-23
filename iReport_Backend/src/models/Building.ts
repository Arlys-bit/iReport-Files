import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

interface IRoomAttributes {
  id?: number;
  name: string;
  roomNumber: string;
  floor: number;
}

interface IBuildingAttributes {
  id: number;
  name: string;
  description?: string;
  location?: string;
  rooms?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

interface IBuildingCreationAttributes extends Optional<IBuildingAttributes, 'id'> {}

class Building extends Model<IBuildingAttributes, IBuildingCreationAttributes> implements IBuildingAttributes {
  public id!: number;
  public name!: string;
  public description?: string;
  public location?: string;
  public rooms?: string;
  public createdAt!: Date;
  public updatedAt!: Date;
}

Building.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
    },
    location: {
      type: DataTypes.STRING,
    },
    rooms: {
      type: DataTypes.TEXT,
      get() {
        const value = this.getDataValue('rooms');
        return value ? JSON.parse(value) : [];
      },
      set(value: IRoomAttributes[]) {
        this.setDataValue('rooms', JSON.stringify(value || []));
      },
    },
  },
  {
    sequelize,
    tableName: 'buildings',
    timestamps: true,
  },
);

export default Building;
