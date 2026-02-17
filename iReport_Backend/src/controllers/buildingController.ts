import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { Building } from '../models/Building';

export const getAllBuildings = async (req: AuthRequest, res: Response) => {
  try {
    const buildings = await Building.find();
    res.json({ buildings });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getBuildingById = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const building = await Building.findById(id);
    if (!building) {
      return res.status(404).json({ error: 'Building not found' });
    }

    res.json({ building });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const createBuilding = async (req: AuthRequest, res: Response) => {
  try {
    const { name, description, location, rooms } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Building name required' });
    }

    const building = new Building({
      name,
      description,
      location,
      rooms: rooms || []
    });

    await building.save();

    res.status(201).json({
      message: 'Building created successfully',
      building
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const updateBuilding = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { name, description, location, rooms } = req.body;

    const building = await Building.findByIdAndUpdate(
      id,
      { name, description, location, rooms },
      { new: true }
    );

    if (!building) {
      return res.status(404).json({ error: 'Building not found' });
    }

    res.json({
      message: 'Building updated successfully',
      building
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteBuilding = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const building = await Building.findByIdAndDelete(id);
    if (!building) {
      return res.status(404).json({ error: 'Building not found' });
    }

    res.json({ message: 'Building deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const addRoom = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { name, roomNumber, floor } = req.body;

    if (!name || !roomNumber || floor === undefined) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const building = await Building.findById(id);
    if (!building) {
      return res.status(404).json({ error: 'Building not found' });
    }

    building.rooms.push({ name, roomNumber, floor });
    await building.save();

    res.json({
      message: 'Room added successfully',
      building
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
