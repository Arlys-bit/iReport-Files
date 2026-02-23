import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';
import { hashPassword, comparePassword } from '../utils/password';

interface IUserAttributes {
  id: number;
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'teacher' | 'student' | 'staff';
  phone?: string;
  profileImage?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

interface IUserCreationAttributes extends Optional<IUserAttributes, 'id'> {}

class User extends Model<IUserAttributes, IUserCreationAttributes> implements IUserAttributes {
  public id!: number;
  public name!: string;
  public email!: string;
  public password!: string;
  public role!: 'admin' | 'teacher' | 'student' | 'staff';
  public phone?: string;
  public profileImage?: string;
  public createdAt!: Date;
  public updatedAt!: Date;

  async comparePassword(password: string): Promise<boolean> {
    return comparePassword(password, this.password);
  }
}

User.init(
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
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM('admin', 'teacher', 'student', 'staff'),
      defaultValue: 'student',
      allowNull: false,
    },
    phone: {
      type: DataTypes.STRING,
    },
    profileImage: {
      type: DataTypes.STRING,
    },
  },
  {
    sequelize,
    tableName: 'users',
    timestamps: true,
    hooks: {
      beforeCreate: async (user) => {
        user.password = await hashPassword(user.password);
      },
      beforeUpdate: async (user) => {
        if (user.changed('password')) {
          user.password = await hashPassword(user.password);
        }
      },
    },
  },
);

export default User;
  next();
});

userSchema.methods.comparePassword = async function(password: string) {
  return comparePassword(password, this.password);
};

export const User = mongoose.model<IUser>('User', userSchema);
