import Facility from '../models/Facility.js';

export const getFacilities = async (req, res, next) => {
  try {
    const { expoId, type, floor } = req.query;
    let query = {};
    if (expoId) query.expoId = expoId;
    if (type) query.type = type;
    if (floor) query.floor = floor;

    let facilities = await Facility.find(query);
    
    // Default facilities snapshot if database is empty
    if (facilities.length === 0) {
      facilities = [
        { _id: 'fac-1', name: 'Executive Cafe & Food Court', type: 'Food & Cafes', floor: 'Ground Floor', locationName: 'North East Wing', position: { x: 42, y: 0, z: -22 }, description: 'Artisan coffee, gourmet lunch buffets, and espresso bar' },
        { _id: 'fac-2', name: 'Arena Keynote Stage (Hall A)', type: 'Stages', floor: 'Ground Floor', locationName: 'North Center', position: { x: 0, y: 0, z: -40 }, description: 'Main auditorium for visionary keynote addresses & live streaming' },
        { _id: 'fac-3', name: 'Conference Breakout Hall 1 & 2', type: 'Meeting Rooms', floor: 'Ground Floor', locationName: 'South East Wing', position: { x: 40, y: 0, z: 24 }, description: 'Executive workshop rooms with AV presentation gear' },
        { _id: 'fac-4', name: 'VIP B2B Networking Suite', type: 'VIP Areas', floor: 'Ground Floor', locationName: 'South West Wing', position: { x: -40, y: 0, z: 24 }, description: 'Private investor meeting lounge with concierge service' },
        { _id: 'fac-5', name: 'AI & Robotics Live Demo Arena', type: 'Stages', floor: 'Ground Floor', locationName: 'North West Wing', position: { x: -42, y: 0, z: -22 }, description: 'Hands-on live hardware and AI prototype demonstration area' },
        { _id: 'fac-6', name: 'South Main Entrance & Registration', type: 'Entrances', floor: 'Ground Floor', locationName: 'South Portal', position: { x: 0, y: 0, z: 48 }, description: 'Badge scanning turnstiles, VIP pass pickup, security checkpoint' },
        { _id: 'fac-7', name: 'Emergency Evacuation Exit Gate A', type: 'Emergency Exits', floor: 'Ground Floor', locationName: 'North East Perimeter', position: { x: 52, y: 0, z: -42 }, description: 'Direct emergency exit to external assembly zone' },
        { _id: 'fac-8', name: 'Emergency Evacuation Exit Gate B', type: 'Emergency Exits', floor: 'Ground Floor', locationName: 'North West Perimeter', position: { x: -52, y: 0, z: -42 }, description: 'Direct emergency exit to parking concourse' },
        { _id: 'fac-9', name: 'Delegate Info & Help Desk', type: 'Information Desks', floor: 'Ground Floor', locationName: 'Center Concourse', position: { x: 0, y: 0, z: 36 }, description: 'General inquiries, multi-lingual concierge, lost & found' },
        { _id: 'fac-10', name: 'Restroom Suite North (Accessible)', type: 'Restrooms', floor: 'Ground Floor', locationName: 'North Corridor', position: { x: 48, y: 0, z: -10 }, description: 'Full amenities, water refill station, accessible restrooms' },
        { _id: 'fac-11', name: 'Rapid Solar Charging Station 1', type: 'Charging Stations', floor: 'Ground Floor', locationName: 'West Corridor', position: { x: -48, y: 0, z: 0 }, description: 'High-speed device charging lockers and wireless stations' },
        { _id: 'fac-12', name: 'First Aid & Medical Station', type: 'Medical', floor: 'Ground Floor', locationName: 'East Concourse', position: { x: 48, y: 0, z: 10 }, description: 'Trained medical paramedics & emergency response equipment' },
        { _id: 'fac-13', name: 'Convention Center Parking Garage P1', type: 'Parking', floor: 'Ground Floor', locationName: 'South Outer Plaza', position: { x: 0, y: 0, z: 65 }, capacity: 1200, availableSpaces: 430, description: 'Multi-level secure parking with EV charging spots' },
        { _id: 'fac-14', name: 'Central Escalator & Elevator Hub', type: 'Stairs & Elevators', floor: 'Ground Floor', locationName: 'Central Atrium', position: { x: -18, y: 0, z: 0 }, description: 'Access to 1st Floor, 2nd Floor, and VIP Terrace' }
      ];
    }

    res.json(facilities);
  } catch (err) {
    next(err);
  }
};

export const createFacility = async (req, res, next) => {
  try {
    const facility = await Facility.create(req.body);
    res.status(201).json(facility);
  } catch (err) {
    next(err);
  }
};
