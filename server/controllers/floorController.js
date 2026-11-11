import Floor from '../models/Floor.js';
import Booth from '../models/Booth.js';

export const getFloors = async (req, res, next) => {
  try {
    const { expoId } = req.query;
    let query = {};
    if (expoId) query.expoId = expoId;

    let floors = await Floor.find(query).sort({ level: 1 });
    // If no floors seeded, return default standard floors
    if (floors.length === 0) {
      floors = [
        { _id: 'floor-0', name: 'Ground Floor', level: 0, totalBooths: 50, sectors: ['A', 'B', 'C', 'D'], description: 'Main Exhibition Hall & Keynote Arena' },
        { _id: 'floor-1', name: '1st Floor', level: 1, totalBooths: 30, sectors: ['A', 'B'], description: 'Innovation Showcase & Startup Pavilion' },
        { _id: 'floor-2', name: '2nd Floor', level: 2, totalBooths: 20, sectors: ['C', 'D'], description: 'Executive Suites & B2B Matchmaking' },
        { _id: 'floor-vip', name: 'VIP Floor', level: 3, totalBooths: 10, sectors: ['VIP'], description: 'Private Investor Lounge & Press Center' }
      ];
    }
    res.json(floors);
  } catch (err) {
    next(err);
  }
};

export const createFloor = async (req, res, next) => {
  try {
    const floor = await Floor.create(req.body);
    res.status(201).json(floor);
  } catch (err) {
    next(err);
  }
};
