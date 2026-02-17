import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { Report } from '../models/Report';
import { LiveReport } from '../models/LiveReport';

export const getAllReports = async (req: AuthRequest, res: Response) => {
  try {
    const { studentId, reportType, status } = req.query;

    const filter: any = {};
    if (studentId) filter.studentId = studentId;
    if (reportType) filter.reportType = reportType;
    if (status) filter.status = status;

    const reports = await Report.find(filter)
      .populate('studentId')
      .populate('createdBy', 'name email');

    res.json({ reports });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getReportById = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const report = await Report.findById(id)
      .populate('studentId')
      .populate('createdBy', 'name email')
      .populate('comments.userId', 'name email');

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

    const report = new Report({
      studentId,
      reportType,
      title,
      description,
      priority: priority || 'medium',
      createdBy: req.user.id
    });

    await report.save();
    await report.populate(['studentId', 'createdBy']);

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

    const report = await Report.findByIdAndUpdate(
      id,
      { title, description, priority, status },
      { new: true }
    ).populate(['studentId', 'createdBy']);

    if (!report) {
      return res.status(404).json({ error: 'Report not found' });
    }

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

    const report = await Report.findById(id);
    if (!report) {
      return res.status(404).json({ error: 'Report not found' });
    }

    report.comments?.push({
      userId: req.user.id as any,
      text,
      createdAt: new Date()
    });

    await report.save();
    await report.populate('comments.userId', 'name email');

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

    const report = await Report.findByIdAndDelete(id);
    if (!report) {
      return res.status(404).json({ error: 'Report not found' });
    }

    res.json({ message: 'Report deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Live Reports
export const getAllLiveReports = async (req: AuthRequest, res: Response) => {
  try {
    const { status, severity } = req.query;

    const filter: any = {};
    if (status) filter.status = status;
    if (severity) filter.severity = severity;

    const reports = await LiveReport.find(filter)
      .populate('studentId')
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 });

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

    const report = new LiveReport({
      studentId,
      reportType,
      title,
      description,
      severity,
      location,
      witnesses: witnesses || [],
      createdBy: req.user.id
    });

    await report.save();
    await report.populate(['studentId', 'createdBy']);

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

    const report = await LiveReport.findByIdAndUpdate(
      id,
      { status, description },
      { new: true }
    ).populate(['studentId', 'createdBy']);

    if (!report) {
      return res.status(404).json({ error: 'Live report not found' });
    }

    res.json({
      message: 'Live report updated successfully',
      report
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
