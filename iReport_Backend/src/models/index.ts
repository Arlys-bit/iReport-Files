import User from './User';
import Student from './Student';
import Report from './Report';
import LiveReport from './LiveReport';
import Building from './Building';

export const initializeAssociations = () => {
  // Student associations
  Student.belongsTo(User, { foreignKey: 'userId' });
  User.hasMany(Student, { foreignKey: 'userId' });

  // Report associations
  Report.belongsTo(Student, { foreignKey: 'studentId' });
  Report.belongsTo(User, { foreignKey: 'createdBy', as: 'createdBy' });
  Student.hasMany(Report, { foreignKey: 'studentId' });
  User.hasMany(Report, { foreignKey: 'createdBy' });

  // LiveReport associations
  LiveReport.belongsTo(Student, { foreignKey: 'studentId' });
  LiveReport.belongsTo(User, { foreignKey: 'createdBy', as: 'createdBy' });
  Student.hasMany(LiveReport, { foreignKey: 'studentId' });
  User.hasMany(LiveReport, { foreignKey: 'createdBy' });
};

export { User, Student, Report, LiveReport, Building };
