
import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";

// Import Models
import User from "./models/User.js";
import Expo from "./models/Expo.js";
import Attendee from "./models/Attendee.js";
import Exhibitor from "./models/Exhibitor.js";
import Booth from "./models/Booth.js";
import Speaker from "./models/Speaker.js";
import Session from "./models/Session.js";
import Facility from "./models/Facility.js";
import Floor from "./models/Floor.js";
import Registration from "./models/Registration.js";
import Favorite from "./models/Favorite.js";
import Feedback from "./models/Feedback.js";
import Itinerary from "./models/Itinerary.js";
import Meeting from "./models/Meeting.js";
import Message from "./models/Message.js";
import Notification from "./models/Notification.js";

dotenv.config();

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB Atlas Connected!");

    // WARNING: Uncomment only if you want to clear existing data.
    // await Promise.all([
    //   User, Expo, Attendee, Exhibitor, Booth, Speaker,
    //   Session, Facility, Floor, Registration, Favorite,
    //   Feedback, Itinerary, Meeting, Message, Notification
    // ].map(Model => Model.deleteMany({})));

    // 1. USERS
    const password = await bcrypt.hash("123456", 10);

    const users = await User.insertMany(
      Array.from({ length: 10 }, (_, i) => ({
        name: `User ${i + 1}`,
        username: `user${i + 1}`,
        email: `user${i + 1}@example.com`,
        password,
        phone: `0300123456${i}`,
        role: i === 0 ? "admin" : i < 4 ? "exhibitor" : "attendee",
        bio: `Bio information for user ${i + 1}`,
        company: `Company ${i + 1}`
      }))
    );

    const admin = users[0];
    const exhibitorUsers = users.slice(1, 4);
    const attendeeUsers = users.slice(4);

    // 2. EXPOS
    const expos = await Expo.insertMany([
      {
        title: "Pakistan Tech Expo 2026",
        slug: "pakistan-tech-expo-2026",
        description: "A major technology and innovation exhibition.",
        theme: "Technology & Innovation",
        location: "Karachi Expo Centre",
        startDate: new Date("2026-12-10"),
        endDate: new Date("2026-12-12"),
        organizer: admin._id,
        status: "published",
        capacity: 5000,
        category: "Technology"
      },
      {
        title: "Future Business Summit 2027",
        slug: "future-business-summit-2027",
        description: "Business networking and startup exhibition.",
        theme: "Business & Entrepreneurship",
        location: "Lahore Expo Centre",
        startDate: new Date("2027-03-15"),
        endDate: new Date("2027-03-17"),
        organizer: admin._id,
        status: "published",
        capacity: 3000,
        category: "Business"
      }
    ]);

    // 3. SPEAKERS
    const speakers = await Speaker.insertMany(
      Array.from({ length: 10 }, (_, i) => ({
        name: `Speaker ${i + 1}`,
        title: ["Software Engineer", "AI Specialist", "Business Consultant"][i % 3],
        company: `Tech Company ${i + 1}`,
        bio: `Experienced professional sharing knowledge in technology and business. Speaker number ${i + 1}.`,
        email: `speaker${i + 1}@example.com`,
        topic: ["Artificial Intelligence", "Web Development", "Cloud Computing"][i % 3]
      }))
    );

    // 4. FLOORS
    const floors = await Floor.insertMany(
      expos.flatMap(expo =>
        ["Ground Floor", "First Floor"].map((name, i) => ({
          expoId: expo._id,
          name,
          level: i,
          description: `${name} exhibition area`,
          totalBooths: 30,
          sectors: ["A", "B", "C", "D"],
          isActive: true
        }))
      )
    );

    // 5. EXHIBITORS
    const exhibitors = await Exhibitor.insertMany(
      Array.from({ length: 10 }, (_, i) => ({
        userId: exhibitorUsers[i % 3]._id,
        expoId: expos[i % 2]._id,
        companyName: `Tech Solutions ${i + 1}`,
        description: `Innovative technology solutions by company ${i + 1}.`,
        category: ["Software", "Hardware", "AI", "Cloud", "IT Services"][i % 5],
        website: `https://company${i + 1}.example.com`,
        contactEmail: `company${i + 1}@example.com`,
        contactPhone: `0300123400${i}`,
        products: [
          {
            name: `Product ${i + 1}`,
            description: "Latest technology product",
            image: ""
          }
        ],
        services: [
          {
            name: "Consulting",
            description: "Professional technology consulting"
          }
        ],
        boothNumber: `A-${101 + i}`,
        staff: [
          {
            name: `Staff ${i + 1}`,
            role: "Sales Manager",
            email: `staff${i + 1}@example.com`
          }
        ],
        status: "approved"
      }))
    );

    // 6. BOOTHS
    const booths = await Booth.insertMany(
      Array.from({ length: 30 }, (_, i) => {
        const exhibitor = i < 10 ? exhibitors[i] : null;
        return {
          boothNumber: `B-${101 + i}`,
          expoId: expos[i % 2]._id,
          exhibitorId: exhibitor?._id || null,
          category: ["Technology", "Software", "Hardware"][i % 3],
          sector: ["A", "B", "C", "D"][i % 4],
          floor: i % 2 === 0 ? "Ground Floor" : "First Floor",
          dimensions: "20 x 20 ft",
          size: { width: 5, height: 3.5, depth: 4.5 },
          position: { x: i * 5, y: 0, z: i * 3 },
          rotation: 0,
          status: exhibitor ? "OCCUPIED" : "AVAILABLE",
          companyName: exhibitor?.companyName || "",
          description: `Exhibition booth number ${i + 1}`,
          products: [`Product ${i + 1}`],
          staff: [`Staff ${i + 1}`],
          trafficScore: 40 + (i % 60)
        };
      })
    );

    // 7. UPDATE EXHIBITOR BOOTH REFERENCES
    await Promise.all(
      exhibitors.map((exhibitor, i) =>
        Exhibitor.findByIdAndUpdate(exhibitor._id, {
          boothId: booths[i]._id,
          boothNumber: booths[i].boothNumber
        })
      )
    );

    // 8. SESSIONS
    const sessions = await Session.insertMany(
      Array.from({ length: 20 }, (_, i) => ({
        title: [
          "Introduction to AI",
          "Modern Web Development",
          "Cloud Computing",
          "Cyber Security",
          "Future of Technology"
        ][i % 5],
        description: `Detailed discussion about technology session ${i + 1}.`,
        speakerId: speakers[i % speakers.length]._id,
        speakerName: speakers[i % speakers.length].name,
        expoId: expos[i % 2]._id,
        category: ["Technology", "AI", "Development", "Business"][i % 4],
        date: "2026-12-10",
        startTime: `${9 + (i % 8)}:00 AM`,
        endTime: `${10 + (i % 8)}:00 AM`,
        location: `Hall ${["A", "B", "C"][i % 3]}`,
        capacity: 200,
        attendees: [attendeeUsers[i % attendeeUsers.length]._id]
      }))
    );

    // 9. ATTENDEES
    const attendees = await Attendee.insertMany(
      attendeeUsers.map((user, i) => ({
        userId: user._id,
        bio: `Technology enthusiast ${i + 1}`,
        company: `Attendee Company ${i + 1}`,
        jobTitle: "Software Developer",
        interests: ["Web Development", "AI", "Technology"],
        registeredExpos: [expos[i % 2]._id],
        savedSessions: [sessions[i]._id],
        favoriteExhibitors: [exhibitors[i % exhibitors.length]._id]
      }))
    );

    // 10. FACILITIES
    const facilities = await Facility.insertMany(
      expos.flatMap(expo =>
        [
          ["Food Court", "Food & Cafes"],
          ["Restroom", "Restrooms"],
          ["Main Entrance", "Entrances"],
          ["Emergency Exit", "Emergency Exits"],
          ["Medical Center", "Medical"],
          ["Parking Area", "Parking"],
          ["Information Desk", "Information Desks"],
          ["Meeting Room", "Meeting Rooms"]
        ].map(([name, type], i) => ({
          expoId: expo._id,
          name,
          type,
          floor: "Ground Floor",
          locationName: "Main Hall",
          position: { x: i * 10, y: 0, z: i * 5 },
          icon: "Info",
          description: `${name} facility`,
          capacity: 100,
          availableSpaces: 80,
          status: "Open"
        }))
      )
    );

    // 11. REGISTRATIONS
    const registrations = await Registration.insertMany(
      attendeeUsers.map((user, i) => ({
        userId: user._id,
        expoId: expos[i % 2]._id,
        ticketType: ["Standard Pass", "VIP Pass", "Press Pass"][i % 3],
        ticketCode: `EXPO-2026-${1000 + i}`,
        status: "active",
        qrCodeData: `EXPO-2026-${1000 + i}`
      }))
    );

    // 12. FAVORITES
    const favorites = await Favorite.insertMany(
      attendeeUsers.map((user, i) => ({
        userId: user._id,
        itemType: "exhibitor",
        itemId: exhibitors[i % exhibitors.length]._id.toString(),
        title: exhibitors[i % exhibitors.length].companyName,
        subtitle: exhibitors[i % exhibitors.length].category,
        location: "Main Hall",
        category: "Technology",
        metadata: { expo: "Pakistan Tech Expo 2026" }
      }))
    );

    // 13. FEEDBACK
    const feedback = await Feedback.insertMany(
      attendeeUsers.map((user, i) => ({
        userId: user._id,
        expoId: expos[i % 2]._id,
        rating: (i % 5) + 1,
        comment: `Great exhibition experience! Feedback ${i + 1}.`
      }))
    );

    // 14. ITINERARIES
    const itineraries = await Itinerary.insertMany(
      attendeeUsers.map((user, i) => ({
        userId: user._id,
        expoId: expos[i % 2]._id,
        time: "10:00 AM",
        title: "Attend Technology Session",
        location: "Hall A",
        category: "Technology",
        type: "session",
        notes: "Attend the scheduled session.",
        orderIndex: i,
        completed: false
      }))
    );

    // 15. MEETINGS
    const meetings = await Meeting.insertMany(
      attendeeUsers.map((user, i) => ({
        attendeeId: user._id,
        exhibitorId: exhibitors[i % exhibitors.length]._id,
        expoId: expos[i % 2]._id,
        date: "2026-12-10",
        time: "11:00 AM",
        purpose: "Discuss products and services",
        boothNumber: booths[i]._id ? booths[i].boothNumber : "",
        location: "Exhibitor Booth",
        status: "pending",
        notes: "Business networking meeting"
      }))
    );

    // 16. MESSAGES
    const messages = await Message.insertMany(
      attendeeUsers.map((user, i) => ({
        senderId: user._id,
        receiverId: admin._id,
        expoId: expos[i % 2]._id,
        content: `Hello, I have a query about the expo. Message ${i + 1}.`,
        read: false
      }))
    );

    // 17. NOTIFICATIONS
    const notifications = await Notification.insertMany(
      attendeeUsers.flatMap((user, i) => [
        {
          userId: user._id,
          title: "Registration Successful",
          message: "Your expo registration has been confirmed.",
          type: "success",
          read: false
        },
        {
          userId: user._id,
          title: "Upcoming Session",
          message: "You have an upcoming technology session.",
          type: "info",
          read: false
        }
      ])
    );

    console.log("\n========== SEED SUMMARY ==========");
    console.log("Users:", users.length);
    console.log("Expos:", expos.length);
    console.log("Speakers:", speakers.length);
    console.log("Floors:", floors.length);
    console.log("Exhibitors:", exhibitors.length);
    console.log("Booths:", booths.length);
    console.log("Sessions:", sessions.length);
    console.log("Attendees:", attendees.length);
    console.log("Facilities:", facilities.length);
    console.log("Registrations:", registrations.length);
    console.log("Favorites:", favorites.length);
    console.log("Feedback:", feedback.length);
    console.log("Itineraries:", itineraries.length);
    console.log("Meetings:", meetings.length);
    console.log("Messages:", messages.length);
    console.log("Notifications:", notifications.length);

    console.log("\nAll data inserted successfully!");

  } catch (error) {
    console.error("Seeding Error:", error);
  } finally {
    await mongoose.disconnect();
    console.log("MongoDB Disconnected!");
  }
};

seedDatabase();
