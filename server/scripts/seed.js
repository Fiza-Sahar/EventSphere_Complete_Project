import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import Expo from '../models/Expo.js';
import Exhibitor from '../models/Exhibitor.js';
import Booth from '../models/Booth.js';
import Speaker from '../models/Speaker.js';
import Session from '../models/Session.js';
import Attendee from '../models/Attendee.js';
import Registration from '../models/Registration.js';

dotenv.config();

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/eventsphere');
    console.log('[Seed] Connected to MongoDB');

    // Clear existing collections
    await User.deleteMany({});
    await Expo.deleteMany({});
    await Exhibitor.deleteMany({});
    await Booth.deleteMany({});
    await Speaker.deleteMany({});
    await Session.deleteMany({});
    await Attendee.deleteMany({});
    await Registration.deleteMany({});

    console.log('[Seed] Cleared existing data');

    // 1. Create Users
    // Admin user
    const adminUser = await User.create({
      name: 'EventSphere Global Director',
      username: 'admin',
      email: 'admin@eventsphere.com',
      password: 'password123',
      role: 'admin',
      company: 'EventSphere Convention Center'
    });

    // Prestigious Real Tech Exhibitors (20)
    const realCompanies = [
      {
        name: "NVIDIA Corporation",
        category: "Artificial Intelligence",
        logo: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=300",
        desc: "Pioneering accelerated computing, GPU architecture, Blackwell AI chips, and the Omniverse industrial digital twin ecosystem.",
        site: "https://nvidia.com",
        prod1: "Blackwell Ultra B200 AI Superchip",
        prod1Img: "https://images.unsplash.com/photo-1591488320449-011701bb6704?w=600",
        prod2: "Omniverse Digital Twin Enterprise Suite",
        prod2Img: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=600"
      },
      {
        name: "OpenAI",
        category: "Artificial Intelligence",
        logo: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=300",
        desc: "Developing autonomous artificial general intelligence (AGI) designed to benefit all of humanity with GPT-5, Sora, and reasoning models.",
        site: "https://openai.com",
        prod1: "GPT-5 Enterprise Autonomous Engine",
        prod1Img: "https://images.unsplash.com/photo-1677442136019-21780efad99a?w=600",
        prod2: "Sora Real-Time Neural Video Simulator",
        prod2Img: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600"
      },
      {
        name: "Microsoft Cloud & AI",
        category: "Cloud Computing",
        logo: "https://images.unsplash.com/photo-1633419461186-7d40a38105ec?w=300",
        desc: "Empowering every organization on the planet with Azure Cloud, Copilot Studio, Quantum computing, and cybersecurity.",
        site: "https://microsoft.com",
        prod1: "Azure Hyper-Scale Quantum Cloud",
        prod1Img: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600",
        prod2: "Copilot Studio Autonomous Workspace",
        prod2Img: "https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=600"
      },
      {
        name: "Google DeepMind & Cloud",
        category: "Artificial Intelligence",
        logo: "https://images.unsplash.com/photo-1572021335469-31706a17aaef?w=300",
        desc: "Solving intelligence to advance science and benefit humanity with Gemini multimodal models and TPU v6 accelerators.",
        site: "https://deepmind.google",
        prod1: "Gemini 2.0 Ultra Multimodal Suite",
        prod1Img: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600",
        prod2: "TPU v6 Trillium Cloud Fabric",
        prod2Img: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600"
      },
      {
        name: "Tesla Energy & Robotics",
        category: "Robotics",
        logo: "https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=300",
        desc: "Accelerating the world's transition to sustainable energy with Optimus Gen-3 Humanoid Robots and Megapack utility grid batteries.",
        site: "https://tesla.com",
        prod1: "Optimus Gen-3 Autonomous Humanoid",
        prod1Img: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=600",
        prod2: "Megapack 3XL Utility Energy Storage",
        prod2Img: "https://images.unsplash.com/photo-1509391365360-2e959784a276?w=600"
      },
      {
        name: "Boston Dynamics",
        category: "Robotics",
        logo: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=300",
        desc: "Creating advanced mobile robotics that enrich people's lives including electric Atlas, Spot enterprise, and Stretch warehouse automation.",
        site: "https://bostondynamics.com",
        prod1: "Atlas All-Electric Industrial Biped",
        prod1Img: "https://images.unsplash.com/photo-1546776310-eef45dd6d63c?w=600",
        prod2: "Spot Enterprise Thermal & Inspection Suite",
        prod2Img: "https://images.unsplash.com/photo-1563770660941-20978e870e26?w=600"
      },
      {
        name: "Amazon Web Services (AWS)",
        category: "Cloud Computing",
        logo: "https://images.unsplash.com/photo-1523474253246-7c9803874c43?w=300",
        desc: "The world’s most comprehensive and broadly adopted cloud platform with Bedrock generative AI and Trainium accelerators.",
        site: "https://aws.amazon.com",
        prod1: "AWS Bedrock Enterprise Model Mesh",
        prod1Img: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=600",
        prod2: "Trainium3 Custom ML Superclusters",
        prod2Img: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=600"
      },
      {
        name: "CrowdStrike Security",
        category: "Cybersecurity",
        logo: "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=300",
        desc: "Leading cloud-native cybersecurity platform delivering AI-driven Falcon endpoint protection and automated breach prevention.",
        site: "https://crowdstrike.com",
        prod1: "Falcon XDR Autonomous Breach Shield",
        prod1Img: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=600",
        prod2: "Charlotte AI Security Operations Co-Pilot",
        prod2Img: "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=600"
      },
      {
        name: "Siemens Digital Industries",
        category: "Industrial IoT",
        logo: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=300",
        desc: "Transforming the everyday with industrial automation, industrial metaverse digital twins, and sustainable smart manufacturing.",
        site: "https://siemens.com",
        prod1: "Industrial Metaverse Real-Time Twin",
        prod1Img: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=600",
        prod2: "Simatic S7-1500 Virtual PLC Fabric",
        prod2Img: "https://images.unsplash.com/photo-1581092335397-9583fe92d232?w=600"
      },
      {
        name: "Apple Silicon & Vision",
        category: "Spatial Computing",
        logo: "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=300",
        desc: "Pioneering spatial computing with Apple Vision Pro, M4 Max silicon, and neural hardware engines.",
        site: "https://apple.com",
        prod1: "Apple Vision Pro Spatial Enterprise",
        prod1Img: "https://images.unsplash.com/photo-1592478411213-6153e4ebc07d?w=600",
        prod2: "M4 Ultra Unified Silicon Architecture",
        prod2Img: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600"
      },
      {
        name: "Sony Electronics & AI",
        category: "Virtual Reality",
        logo: "https://images.unsplash.com/photo-1526738549149-8e07eca6c147?w=300",
        desc: "Delivering world-class 8K spatial displays, immersive XR headsets, and high-speed CMOS computer vision sensors.",
        site: "https://sony.com",
        prod1: "Spatial Reality 8K Holographic Display",
        prod1Img: "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=600",
        prod2: "Airpeak Autonomous Drone Vision Unit",
        prod2Img: "https://images.unsplash.com/photo-1508614589041-895b88991e3e?w=600"
      },
      {
        name: "Samsung Semiconductor",
        category: "Hardware",
        logo: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=300",
        desc: "Manufacturing cutting-edge HBM3e high-bandwidth AI memory, 2nm gate-all-around chipsets, and micro-LED panels.",
        site: "https://samsung.com",
        prod1: "HBM3e 36GB High-Bandwidth Memory",
        prod1Img: "https://images.unsplash.com/photo-1591488320449-011701bb6704?w=600",
        prod2: "The Wall Micro-LED 8K Modular Display",
        prod2Img: "https://images.unsplash.com/photo-1593784991095-a205069470b6?w=600"
      },
      {
        name: "Intel Advanced Computing",
        category: "Hardware",
        logo: "https://images.unsplash.com/photo-1555680202-c86f0e12f086?w=300",
        desc: "Powering the AI PC era with Intel Core Ultra processors, Gaudi 3 AI accelerators, and silicon photonics.",
        site: "https://intel.com",
        prod1: "Gaudi 3 AI Deep Learning Accelerator",
        prod1Img: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=600",
        prod2: "Quantum Computing Spin-Qubit System",
        prod2Img: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600"
      },
      {
        name: "Meta Reality Labs",
        category: "Virtual Reality",
        logo: "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=300",
        desc: "Building the future of human connection with Quest 3 spatial headsets, Orion AR holographic glasses, and Llama 3 models.",
        site: "https://meta.com",
        prod1: "Orion Holographic AR Glasses",
        prod1Img: "https://images.unsplash.com/photo-1592478411213-6153e4ebc07d?w=600",
        prod2: "Llama 3.1 405B Open Intelligence",
        prod2Img: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600"
      },
      {
        name: "Stripe Fintech Infrastructure",
        category: "Fintech",
        logo: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=300",
        desc: "Financial infrastructure for the internet. Millions of companies use Stripe to accept payments and manage revenue.",
        site: "https://stripe.com",
        prod1: "Stripe Radar AI Fraud Detection",
        prod1Img: "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=600",
        prod2: "Global Multi-Currency Treasury Mesh",
        prod2Img: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=600"
      },
      {
        name: "Palantir Technologies",
        category: "Data & Analytics",
        logo: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=300",
        desc: "Foundational software for enterprise AI operations, Foundry data integration, and defense intelligence.",
        site: "https://palantir.com",
        prod1: "Palantir AIP (Artificial Intelligence Platform)",
        prod1Img: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600",
        prod2: "Foundry Enterprise Ontology Fabric",
        prod2Img: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600"
      },
      {
        name: "Snowflake Data Cloud",
        category: "Cloud Computing",
        logo: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=300",
        desc: "Mobilizing the world’s data with single global data cloud, Cortex AI, and zero-governance data sharing.",
        site: "https://snowflake.com",
        prod1: "Cortex AI Enterprise LLM Engine",
        prod1Img: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600",
        prod2: "Polaris Universal Data Catalog",
        prod2Img: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=600"
      },
      {
        name: "SpaceX Starlink Enterprise",
        category: "Telecommunications",
        logo: "https://images.unsplash.com/photo-1517976487502-5f694676116f?w=300",
        desc: "Providing high-speed, low-latency satellite broadband internet to enterprises and conventions worldwide.",
        site: "https://starlink.com",
        prod1: "Starlink Mobility High-Gain Terminal",
        prod1Img: "https://images.unsplash.com/photo-1517976487502-5f694676116f?w=600",
        prod2: "Direct-to-Cell Low-Earth Mesh",
        prod2Img: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600"
      },
      {
        name: "BioNTech Diagnostics",
        category: "BioTech",
        logo: "https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?w=300",
        desc: "Pioneering individualized cancer therapies, mRNA immunotherapies, and AI-assisted molecular protein design.",
        site: "https://biontech.com",
        prod1: "InstaDeep Protein Intelligence Model",
        prod1Img: "https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?w=600",
        prod2: "Automated mRNA Sequencing Platform",
        prod2Img: "https://images.unsplash.com/photo-1530497610245-94d3c16cda28?w=600"
      },
      {
        name: "ABB Robotics & Automation",
        category: "Robotics",
        logo: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=300",
        desc: "Global leader in industrial robotics, collaborative YuMi cobots, and automated manufacturing systems.",
        site: "https://abb.com",
        prod1: "YuMi Dual-Arm Collaborative Cobot",
        prod1Img: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=600",
        prod2: "OmniCore AI Ultra-High-Speed Controller",
        prod2Img: "https://images.unsplash.com/photo-1581092335397-9583fe92d232?w=600"
      }
    ];

    const exhibitorUsers = [];
    for (let i = 0; i < realCompanies.length; i++) {
      const co = realCompanies[i];
      const exUser = await User.create({
        name: `${co.name} VP Lead`,
        username: `exhibitor${i + 1}`,
        email: `contact@${co.name.toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 12)}.com`,
        password: 'password123',
        role: 'exhibitor',
        company: co.name
      });
      exhibitorUsers.push(exUser);
    }

    // Attendee users (100)
    const attendeeUsers = [];
    for (let i = 1; i <= 100; i++) {
      const attUser = await User.create({
        name: `VIP Delegate #${i}`,
        username: `attendee${i}`,
        email: `attendee${i}@gmail.com`,
        password: 'password123',
        role: 'attendee',
        company: i % 3 === 0 ? 'Silicon Tech Ventures' : i % 3 === 1 ? 'Global Innovation Capital' : 'NextGen Systems'
      });
      attendeeUsers.push(attUser);

      await Attendee.create({
        userId: attUser._id,
        bio: `Executive trade delegate & investor exploring AI & Robotics at EventSphere 2026.`,
        company: attUser.company,
        interests: ["Artificial Intelligence", "Robotics", "Cloud Computing", "Fintech"]
      });
    }

    console.log('[Seed] Created 121 Users (Admin, 20 World-Class Exhibitors, 100 Attendees)');

    // 2. Create Expos (3)
    const expos = await Expo.insertMany([
      {
        title: "Global Tech World Expo 2026",
        slug: "global-tech-world-expo-2026",
        description: "The premier international trade show highlighting cutting-edge AI, Autonomous Robotics, Cyber Defense, and Cloud Computing with Fortune 500 tech giants.",
        theme: "Intelligent Systems, Autonomous Mobility & Artificial General Intelligence",
        location: "Silicon Valley Convention Center, San Jose CA",
        startDate: new Date("2026-09-15"),
        endDate: new Date("2026-09-18"),
        image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200",
        organizer: adminUser._id,
        status: "published",
        capacity: 12000,
        category: "Technology"
      },
      {
        title: "Clean Energy & EcoTech Summit 2026",
        slug: "clean-energy-ecotech-summit-2026",
        description: "Showcasing next-generation solar gigafactories, green hydrogen power, smart grid micro-grids, and sustainable carbon capture tech.",
        theme: "Net Zero, Quantum Solar & Renewable Civilization",
        location: "Metro Exposition Center, Chicago IL",
        startDate: new Date("2026-10-10"),
        endDate: new Date("2026-10-12"),
        image: "https://images.unsplash.com/photo-1511578314322-379afb476865?w=1200",
        organizer: adminUser._id,
        status: "published",
        capacity: 8500,
        category: "Sustainability"
      },
      {
        title: "Fintech & Digital Banking Summit 2026",
        slug: "fintech-digital-banking-summit-2026",
        description: "Discover the revolution in AI fraud prevention, decentralized liquidity networks, autonomous treasury management, and global payment rails.",
        theme: "The Future of Global Capital & Autonomous Financial Systems",
        location: "Financial District Expo Arena, New York NY",
        startDate: new Date("2026-11-05"),
        endDate: new Date("2026-11-07"),
        image: "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=1200",
        organizer: adminUser._id,
        status: "published",
        capacity: 7000,
        category: "Fintech"
      }
    ]);

    const mainExpo = expos[0];
    console.log('[Seed] Created 3 Expos');

    // 3. Create 50 Booths across the Expo Hall
    const boothsData = [];
    const gridCols = 10;
    const gridRows = 5;
    const spacingX = 6;
    const spacingZ = 6;
    const startX = -((gridCols - 1) * spacingX) / 2;
    const startZ = -((gridRows - 1) * spacingZ) / 2;

    let boothIndex = 1;
    for (let r = 0; r < gridRows; r++) {
      for (let c = 0; c < gridCols; c++) {
        const sectorLetter = String.fromCharCode(65 + r);
        const numberStr = (c + 1 < 10 ? '0' : '') + (c + 1);
        const boothNumber = `${sectorLetter}${numberStr}`;

        let status = 'AVAILABLE';
        let companyName = '';
        let description = `Prime ${sectorLetter} sector exhibition booth with dedicated 5G fiber and 3D display pedestal. Available for instant reservation.`;
        let category = realCompanies[(r + c) % realCompanies.length].category;

        if (boothIndex <= 20) {
          status = 'OCCUPIED';
          companyName = realCompanies[boothIndex - 1].name;
          description = realCompanies[boothIndex - 1].desc;
        } else if (boothIndex <= 28) {
          status = 'RESERVED';
          companyName = `Reserved Innovation Entity ${boothIndex - 20}`;
          description = `Booth ${boothNumber} is currently under registration review by enterprise delegate.`;
        }

        boothsData.push({
          boothNumber,
          expoId: mainExpo._id,
          category,
          size: { width: 5, height: 3.4, depth: 4.5 },
          position: {
            x: startX + c * spacingX,
            y: 0,
            z: startZ + r * spacingZ
          },
          rotation: 0,
          status,
          companyName,
          description,
          products: status === 'OCCUPIED' ? [realCompanies[boothIndex - 1].prod1, realCompanies[boothIndex - 1].prod2] : [],
          staff: status === 'OCCUPIED' ? [`Lead Technical Solutions Architect`, `VP of Global Enterprise`] : []
        });

        boothIndex++;
      }
    }

    const createdBooths = await Booth.insertMany(boothsData);
    console.log(`[Seed] Created ${createdBooths.length} Booths (20 OCCUPIED, 8 RESERVED, 22 AVAILABLE)`);

    // 4. Create Exhibitor Profiles (20) & link to Booths
    for (let i = 0; i < realCompanies.length; i++) {
      const co = realCompanies[i];
      const exUser = exhibitorUsers[i];
      const assignedBooth = createdBooths[i];

      await Exhibitor.create({
        userId: exUser._id,
        expoId: mainExpo._id,
        companyName: co.name,
        logo: co.logo,
        description: co.desc,
        category: co.category,
        website: co.site,
        contactEmail: exUser.email,
        contactPhone: `+1 (408) 555-01${i < 10 ? '0' + i : i}`,
        boothId: assignedBooth._id,
        boothNumber: assignedBooth.boothNumber,
        status: 'approved',
        products: [
          { name: co.prod1, description: `Flagship enterprise release for next-generation performance.`, image: co.prod1Img },
          { name: co.prod2, description: `Industrial software & intelligence ecosystem platform.`, image: co.prod2Img }
        ],
        services: [
          { name: 'Enterprise Architecture Consultation', description: 'Deep technical roadmap and AI workload assessment.' },
          { name: 'Hardware Integration & Live Lab Demos', description: 'Hands-on interactive demonstration at Booth ' + assignedBooth.boothNumber }
        ]
      });
    }

    console.log('[Seed] Created 20 Real Tech Exhibitor Profiles with Products & Services');

    // 5. Create Keynote Speakers (10)
    const speakerData = [
      {
        name: "Jensen Huang",
        title: "Founder & CEO, NVIDIA",
        bio: "Visionary leader driving accelerated computing, Blackwell architectures, and the global AI industrial revolution.",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300",
        company: "NVIDIA",
        socialLinks: { twitter: "https://twitter.com", linkedin: "https://linkedin.com" }
      },
      {
        name: "Sam Altman",
        title: "CEO, OpenAI",
        bio: "Guiding the research and deployment of safe Artificial General Intelligence (AGI) to benefit all of humanity.",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300",
        company: "OpenAI",
        socialLinks: { twitter: "https://twitter.com", linkedin: "https://linkedin.com" }
      },
      {
        name: "Dr. Demis Hassabis",
        title: "CEO, Google DeepMind",
        bio: "Nobel Laureate and pioneer of AlphaFold, Gemini models, and neuroscience-inspired artificial intelligence.",
        avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300",
        company: "Google DeepMind",
        socialLinks: { twitter: "https://twitter.com", linkedin: "https://linkedin.com" }
      },
      {
        name: "Dr. Fei-Fei Li",
        title: "Co-Director, Stanford Human-Centered AI",
        bio: "Inventor of ImageNet, pioneer in spatial intelligence, computer vision, and ethical AI development.",
        avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300",
        company: "Stanford HAI",
        socialLinks: { twitter: "https://twitter.com", linkedin: "https://linkedin.com" }
      },
      {
        name: "Satya Nadella",
        title: "Chairman & CEO, Microsoft",
        bio: "Transforming the global computing landscape across cloud infrastructure, developer tools, and Copilot AI.",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300",
        company: "Microsoft",
        socialLinks: { twitter: "https://twitter.com", linkedin: "https://linkedin.com" }
      },
      {
        name: "Marc Raibert",
        title: "Founder, Boston Dynamics & AI Institute",
        bio: "Pioneering the world of dynamic balance robotics, quadruped systems, and athletic intelligence.",
        avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=300",
        company: "Boston Dynamics",
        socialLinks: { twitter: "https://twitter.com", linkedin: "https://linkedin.com" }
      },
      {
        name: "Mira Murati",
        title: "Chief Technology Officer & AI Pioneer",
        bio: "Leading the development of frontier multimodal models, reasoning engines, and safety alignment.",
        avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=300",
        company: "Frontier AI Labs",
        socialLinks: { twitter: "https://twitter.com", linkedin: "https://linkedin.com" }
      },
      {
        name: "George Kurtz",
        title: "Founder & CEO, CrowdStrike",
        bio: "Security visionary revolutionizing cloud-native endpoint defense, threat telemetry, and automated incident response.",
        avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=300",
        company: "CrowdStrike",
        socialLinks: { twitter: "https://twitter.com", linkedin: "https://linkedin.com" }
      }
    ];

    const createdSpeakers = await Speaker.insertMany(speakerData);
    console.log(`[Seed] Created ${createdSpeakers.length} World-Class Keynote Speakers`);

    // 6. Create Sessions & Keynote Agenda (8)
    const sessionsData = [
      {
        expoId: mainExpo._id,
        title: "The Industrial AI Revolution: Blackwell, Quantum & Beyond",
        description: "Explore the exponential leap in accelerated computing, neural network architectures, and multi-trillion parameter model training.",
        speakerId: createdSpeakers[0]._id,
        speakerName: createdSpeakers[0].name,
        date: new Date("2026-09-15"),
        startTime: "10:00 AM",
        endTime: "11:30 AM",
        location: "Main Keynote Arena Stage",
        category: "Artificial Intelligence",
        capacity: 3500
      },
      {
        expoId: mainExpo._id,
        title: "Frontiers of Artificial General Intelligence & Reasoning Systems",
        description: "A deep dive into recursive self-improving reasoning models, agentic workflows, and the roadmap toward safe AGI.",
        speakerId: createdSpeakers[1]._id,
        speakerName: createdSpeakers[1].name,
        date: new Date("2026-09-15"),
        startTime: "01:30 PM",
        endTime: "03:00 PM",
        location: "Main Keynote Arena Stage",
        category: "Artificial Intelligence",
        capacity: 3500
      },
      {
        expoId: mainExpo._id,
        title: "Spatial Intelligence: Bridging 3D Vision and Physical Robotics",
        description: "How 3D computer vision and world models are enabling machines to understand, navigate, and manipulate the physical world.",
        speakerId: createdSpeakers[3]._id,
        speakerName: createdSpeakers[3].name,
        date: new Date("2026-09-16"),
        startTime: "10:30 AM",
        endTime: "12:00 PM",
        location: "Innovation Stage 2 (Level 1)",
        category: "Robotics",
        capacity: 1800
      },
      {
        expoId: mainExpo._id,
        title: "Autonomous Robotics in Extreme Industrial Environments",
        description: "Real-world deployment of bipedal and quadruped robots across automotive gigafactories, nuclear facilities, and deep-sea exploration.",
        speakerId: createdSpeakers[5]._id,
        speakerName: createdSpeakers[5].name,
        date: new Date("2026-09-16"),
        startTime: "02:00 PM",
        endTime: "03:30 PM",
        location: "Innovation Stage 2 (Level 1)",
        category: "Robotics",
        capacity: 1800
      },
      {
        expoId: mainExpo._id,
        title: "Autonomous Cloud Infrastructure & Global Multi-Tenant Security",
        description: "Engineering fault-tolerant global data fabrics and defending enterprise pipelines with autonomous threat hunting.",
        speakerId: createdSpeakers[4]._id,
        speakerName: createdSpeakers[4].name,
        date: new Date("2026-09-17"),
        startTime: "11:00 AM",
        endTime: "12:30 PM",
        location: "Main Keynote Arena Stage",
        category: "Cloud Computing",
        capacity: 3500
      }
    ];

    await Session.insertMany(sessionsData);
    console.log(`[Seed] Created Keynote Sessions linked to Speakers`);

    // 7. Registrations
    for (let i = 0; i < 50; i++) {
      await Registration.create({
        expoId: mainExpo._id,
        userId: attendeeUsers[i]._id,
        ticketType: i % 2 === 0 ? 'VIP Pass' : 'Standard Pass',
        ticketCode: `EVT-2026-${100000 + i}`,
        status: 'active',
        qrCodeData: `https://eventsphere.com/verify/EVT-2026-${100000 + i}`
      });
    }

    console.log('[Seed] Created 50 Verified Registrations with Hologram QR Passes');

    console.log(`
=============================================================
✅ EVENTSPHERE WORLD-CLASS DATABASE SEED COMPLETED!
-------------------------------------------------------------
DEMO ACCOUNTS:
  👑 Admin User     : admin@eventsphere.com / password123
  🏪 Exhibitor User : contact@nvidiacorporation.com / password123
  👥 Attendee User  : attendee1@gmail.com / password123
=============================================================
`);

    process.exit(0);
  } catch (error) {
    console.error('[Seed Error]:', error);
    process.exit(1);
  }
};

seedDB();
