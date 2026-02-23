import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import Report from '../models/Report';
import LiveReport from '../models/LiveReport';

export const getAllReports = async (req: AuthRequest, res: Response) => {
  try {
    const { studentId, reportType, status } = req.query;

    const where: any = {};
    if (studentId) where.studentId = studentId;
    if (reportType) where.reportType = reportType;
    if (status) where.status = status;

    const reports = await Report.findAll({
      where,
      include: ['studentId', 'createdBy']
    });

    res.json({ reports });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getReportById = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const report = await Report.findByPk(id, {
      include: ['studentId', 'createdBy']
    });

    if (!report) {
      return res.status(404).json({ error: 'Report not found' });
    }

    res.json({ report });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const createReport = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const { studentId, reportType, title, description, priority } = req.body;

    if (!studentId || !reportType || !title || !description) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const report = await Report.create({
      studentId,
      reportType,
      title,
      description,
      priority: priority || 'medium',
      createdBy: req.user.id
    });

    await report.reload({ include: ['studentId', 'createdBy'] });

    res.status(201).json({
      message: 'Report created successfully',
      report
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const updateReport = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { title, description, priority, status } = req.body;

    const report = await Report.findByPk(id);
    if (!report) {
      return res.status(404).json({ error: 'Report not found' });
    }

    await report.update({ title, description, priority, status });
    await report.reload({ include: ['studentId', 'createdBy'] });

    res.json({
      message: 'Report updated successfully',
      report
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const addComment = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const { id } = req.params;
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({ error: 'Comment text required' });
    }

    const report = await Report.findByPk(id);
    if (!report) {
      return res.status(404).json({ error: 'Report not found' });
    }

    const comments = report.comments || [];
    comments.push({
      userId: req.user.id,
      text,
      createdAt: new Date()
    });

    await report.update({ comments });
    await report.reload({ include: ['createdBy'] });

    res.json({
      message: 'Comment added successfully',
      report
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteReport = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const report = await Report.findByPk(id);
    if (!report) {
      return res.status(404).json({ error: 'Report not found' });
    }

    await report.destroy();

    res.json({ message: 'Report deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Live Reports
export const getAllLiveReports = async (req: AuthRequest, res: Response) => {
  try {
    const { status, severity } = req.query;

    const where: any = {};
    if (status) where.status = status;
    if (severity) where.severity = severity;

    const reports = await LiveReport.findAll({
      where,
      include: ['studentId', 'createdBy'],
      order: [['createdAt', 'DESC']]
    });

    res.json({ reports });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const createLiveReport = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const { studentId, reportType, title, description, severity, location, witnesses } = req.body;

    if (!studentId || !reportType || !title || !description || !severity) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const report = await LiveReport.create({
      studentId,
      reportType,
      title,
      description,
      severity,
      location,
      witnesses: witnesses || [],
      createdBy: req.user.id
    });

    await report.reload({ include: ['studentId', 'createdBy'] });

    res.status(201).json({
      message: 'Live report created successfully',
      report
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const updateLiveReport = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { status, description } = req.body;

    const report = await LiveReport.findByPk(id);
    if (!report) {
      return res.status(404).json({ error: 'Live report not found' });
    }

    await report.update({ status, description });
    await report.reload({ include: ['studentId', 'createdBy'] });

    res.json({
      message: 'Live report updated successfully',
      report
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
