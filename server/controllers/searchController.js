import Booth from '../models/Booth.js';
import Exhibitor from '../models/Exhibitor.js';
import Speaker from '../models/Speaker.js';
import Session from '../models/Session.js';
import Facility from '../models/Facility.js';

export const globalSearch = async (req, res, next) => {
  try {
    const { q } = req.query;
    if (!q || !q.trim()) {
      return res.json({ results: [] });
    }

    const regex = new RegExp(q.trim(), 'i');

    const [booths, exhibitors, speakers, sessions, facilities] = await Promise.all([
      Booth.find({
        $or: [
          { boothNumber: regex },
          { companyName: regex },
          { category: regex },
          { description: regex }
        ]
      }).limit(8),

      Exhibitor.find({
        $or: [
          { companyName: regex },
          { category: regex },
          { description: regex },
          { 'products.name': regex }
        ]
      }).limit(8),

      Speaker.find({
        $or: [
          { name: regex },
          { company: regex },
          { topic: regex },
          { bio: regex }
        ]
      }).limit(8),

      Session.find({
        $or: [
          { title: regex },
          { category: regex },
          { description: regex },
          { location: regex }
        ]
      }).limit(8),

      Facility.find({
        $or: [
          { name: regex },
          { type: regex },
          { description: regex },
          { locationName: regex }
        ]
      }).limit(8)
    ]);

    const results = [
      ...booths.map(b => ({
        type: 'booth',
        id: b._id,
        title: `Booth ${b.boothNumber}`,
        subtitle: b.companyName || 'Available Space',
        sector: b.sector || b.boothNumber.charAt(0),
        category: b.category,
        location: `Sector ${b.sector || b.boothNumber.charAt(0)} • (X: ${b.position.x}, Z: ${b.position.z})`,
        position: b.position,
        raw: b
      })),
      ...exhibitors.map(ex => ({
        type: 'exhibitor',
        id: ex._id,
        title: ex.companyName,
        subtitle: `Booth ${ex.boothNumber || 'Assigned'}`,
        sector: ex.boothNumber ? ex.boothNumber.charAt(0) : 'A',
        category: ex.category,
        location: `Booth ${ex.boothNumber}`,
        raw: ex
      })),
      ...speakers.map(sp => ({
        type: 'speaker',
        id: sp._id,
        title: sp.name,
        subtitle: `${sp.title} • ${sp.company}`,
        category: sp.topic,
        location: 'Arena Keynote Stage',
        raw: sp
      })),
      ...sessions.map(s => ({
        type: 'session',
        id: s._id,
        title: s.title,
        subtitle: `${s.date} • ${s.startTime} - ${s.endTime}`,
        category: s.category,
        location: s.location,
        raw: s
      })),
      ...facilities.map(f => ({
        type: 'facility',
        id: f._id,
        title: f.name,
        subtitle: f.type,
        category: f.type,
        location: f.locationName,
        position: f.position,
        raw: f
      }))
    ];

    res.json({ results });
  } catch (err) {
    next(err);
  }
};
