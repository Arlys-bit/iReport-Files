import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import Student from '../models/Student';
import User from '../models/User';

export const getAllStudents = async (req: AuthRequest, res: Response) => {
  try {
    const students = await Student.findAll({
      include: [{ model: User, attributes: ['id', 'name', 'email', 'phone', 'profileImage'] }]
    });
    res.json({ students });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getStudentById = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const student = await Student.findByPk(id, {
      include: [{ model: User, attributes: ['id', 'name', 'email', 'phone', 'profileImage'] }]
    });

    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }

    res.json({ student });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const createStudent = async (req: AuthRequest, res: Response) => {
  try {
    const { name, email, password, studentId, class: className, section, parentEmail, parentPhone } = req.body;

    if (!name || !email || !password || !studentId || !className || !section) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const user = await User.create({
      name,
      email,
      password,
      role: 'student'
    });

    const student = await Student.create({
      userId: user.id,
      studentId,
      class: className,
      section,
      parentEmail,
      parentPhone
    });

    res.status(201).json({
      message: 'Student created successfully',
      student: {
        id: student.id,
        userId: user.id,
        name: user.name,
        email: user.email,
        studentId,
        class: className,
        section,
        parentEmail,
        parentPhone
      }
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const updateStudent = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { name, phone, class: className, section, parentEmail, parentPhone, address } = req.body;

    const student = await Student.findByPk(id);
    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }

    const updateData: any = {};
    if (name) updateData.name = name;
    if (phone) updateData.phone = phone;

    if (Object.keys(updateData).length > 0) {
      await User.update(updateData, { where: { id: student.userId } });
    }

    const studentUpdateData: any = {};
    if (className) studentUpdateData.class = className;
    if (section) studentUpdateData.section = section;
    if (parentEmail) studentUpdateData.parentEmail = parentEmail;
    if (parentPhone) studentUpdateData.parentPhone = parentPhone;
    if (address) studentUpdateData.address = address;

    if (Object.keys(studentUpdateData).length > 0) {
      await student.update(studentUpdateData);
    }

    const updatedStudent = await Student.findByPk(id, {
      include: [{ model: User, attributes: ['id', 'name', 'email', 'phone', 'profileImage'] }]
    });

    res.json({
      message: 'Student updated successfully',
      student: updatedStudent
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteStudent = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const student = await Student.findByPk(id);
    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }

    await User.destroy({ where: { id: student.userId } });
    await student.destroy();

    res.json({ message: 'Student deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getStudentsByClass = async (req: AuthRequest, res: Response) => {
  try {
    const { className } = req.params;

    const students = await Student.findAll({
      where: { class: className },
      include: [{ model: User, attributes: ['id', 'name', 'email', 'phone', 'profileImage'] }]
    });

    res.json({ students });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
