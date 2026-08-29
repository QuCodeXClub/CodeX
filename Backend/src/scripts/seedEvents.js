import "dotenv/config";
import mongoose from "mongoose";
import connectDB from "../config/db.js";
import { Event } from "../models/event.model.js";

const sampleImages = [
  "https://res.cloudinary.com/fswmfdcp/image/upload/f_auto,q_auto/v1785170170/hackthon_ugz8gy.webp",
  "https://res.cloudinary.com/fswmfdcp/image/upload/f_auto,q_auto/v1785170030/contest_he2oqd.webp",
  "https://res.cloudinary.com/fswmfdcp/image/upload/f_auto,q_auto/v1785170227/webinar_ai3kg5.webp",
  "https://res.cloudinary.com/ddfwdj4jn/image/upload/f_auto,q_auto,w_1200/v1787475669/IMG_0627_rn1b2f.jpg",
  "https://res.cloudinary.com/ddfwdj4jn/image/upload/f_auto,q_auto,w_1200/v1787475195/3R5A5324_mlzhos.jpg",
  "https://res.cloudinary.com/ddfwdj4jn/image/upload/f_auto,q_auto,w_1200/v1787475669/IMG_0624_ixv8wd.jpg",
  "https://res.cloudinary.com/ddfwdj4jn/image/upload/f_auto,q_auto,w_800/v1787475669/IMG_6902_oyq9by.jpg",
  "https://res.cloudinary.com/ddfwdj4jn/image/upload/f_auto,q_auto,w_800/v1787475669/IMG_0619_migrdi.jpg",
];

const now = new Date();
const days = (n) => n * 24 * 60 * 60 * 1000;

const sampleEvents = [
  // --- 1. Upcoming with Registration OPEN (6 Events) ---
  {
    eventName: "CodeX Hackathon 2026: NextGen AI & Cloud",
    date: new Date(now.getTime() + days(14)), // 14 days in future
    registrationCloseDate: new Date(now.getTime() + days(10)), // Closes in 10 days
    locationType: "Offline",
    location: "Main Auditorium, Quantum Tech Hub, New Delhi",
    registrationLink: "https://unstop.com/hackathons/codex-hackathon-2026",
    tags: ["Hackathon", "AI", "Cloud", "FullStack"],
    coverImage: sampleImages[0],
    description: `
      <h2>Welcome to CodeX Hackathon 2026</h2>
      <p>Join 500+ builders, creators, and innovators for a 36-hour sprint creating cutting-edge artificial intelligence and cloud applications.</p>
      <h3>Highlights:</h3>
      <ul>
        <li>Over ₹1,00,000 in cash prizes and swags</li>
        <li>1-on-1 mentorship from industry architects</li>
        <li>Direct interview opportunities with top tech companies</li>
      </ul>
      <blockquote>Build the future of technology with us!</blockquote>
    `,
  },
  {
    eventName: "Full-Stack Web3 & Smart Contracts Masterclass",
    date: new Date(now.getTime() + days(20)),
    registrationCloseDate: new Date(now.getTime() + days(18)),
    locationType: "Online",
    location: "Google Meet / Discord Stage",
    registrationLink: "https://codex.community/web3-masterclass",
    tags: ["Web3", "Ethereum", "Solidity", "Workshops"],
    coverImage: sampleImages[1],
    description: `
      <h2>Master Solidity & Decentralized Applications</h2>
      <p>Deep dive into Ethereum architecture, ERC standards, smart contract security, and full-stack dApp development with ethers.js and React.</p>
      <h3>Prerequisites:</h3>
      <p>Basic knowledge of JavaScript and modern frontend workflows.</p>
    `,
  },
  {
    eventName: "DevOps & Kubernetes Bootcamp 2026",
    date: new Date(now.getTime() + days(28)),
    registrationCloseDate: new Date(now.getTime() + days(25)),
    locationType: "Online",
    location: "Zoom Interactive Webinar",
    registrationLink: "https://codex.community/devops-bootcamp",
    tags: ["DevOps", "Kubernetes", "Docker", "CI/CD"],
    coverImage: sampleImages[2],
    description: `
      <h2>Production Grade Infrastructure from Zero to Scale</h2>
      <p>Learn CI/CD automation with GitHub Actions, container orchestration with Kubernetes, and monitoring using Prometheus and Grafana.</p>
    `,
  },
  {
    eventName: "UI/UX & Design Systems Sprint",
    date: new Date(now.getTime() + days(35)),
    registrationCloseDate: new Date(now.getTime() + days(30)),
    locationType: "Offline",
    location: "Innovation Lab 402, Campus Tech Block",
    registrationLink: "https://unstop.com/workshops/ui-ux-sprint",
    tags: ["Design", "Figma", "UI/UX", "Frontend"],
    coverImage: sampleImages[3],
    description: `
      <h2>Crafting High-Converting & Delightful Digital Experiences</h2>
      <p>Hands-on design prototyping, micro-interactions, responsive typography, and accessibility best practices in Figma.</p>
    `,
  },
  {
    eventName: "Global Competitive Coding Challenge: Round 1",
    date: new Date(now.getTime() + days(42)),
    registrationCloseDate: new Date(now.getTime() + days(40)),
    locationType: "Online",
    location: "CodeX Contest Arena / CodeChef",
    registrationLink: "https://codechef.com/codex-round-1",
    tags: ["Competitive Programming", "Algorithms", "Data Structures"],
    coverImage: sampleImages[4],
    description: `
      <h2>2.5 Hour Speed Coding Contest</h2>
      <p>Test your algorithmic skills with curated dynamic programming, graph theory, and mathematical optimization problems.</p>
    `,
  },
  {
    eventName: "Cybersecurity & Ethical Hacking Summit",
    date: new Date(now.getTime() + days(50)),
    registrationCloseDate: new Date(now.getTime() + days(45)),
    locationType: "Offline",
    location: "Cyber Defense Center, Tech Park Wing B",
    registrationLink: "https://codex.community/cyber-summit",
    tags: ["CyberSecurity", "Ethical Hacking", "Bug Bounty"],
    coverImage: sampleImages[5],
    description: `
      <h2>Defending Modern Cloud Architectures and Networks</h2>
      <p>Interactive CTF challenges, web penetration testing, network packet analysis, and security auditing fundamentals.</p>
    `,
  },

  // --- 2. Upcoming with Registration CLOSED (4 Events) ---
  {
    eventName: "National AI Research Summit 2026",
    date: new Date(now.getTime() + days(7)), // Happens in 7 days
    registrationCloseDate: new Date(now.getTime() - days(2)), // Closed 2 days ago!
    locationType: "Offline",
    location: "Convention Hall A, State Tech University",
    registrationLink: "https://unstop.com/events/ai-summit-2026",
    tags: ["AI", "Research", "Deep Learning", "LLMs"],
    coverImage: sampleImages[6],
    description: `
      <h2>State of Generative AI & Foundation Models</h2>
      <p>Keynotes from AI research scientists, paper presentations on diffusion models and RAG architectures.</p>
      <p><strong>Note:</strong> Registrations for this event have officially closed. Selected attendees will receive passes via email.</p>
    `,
  },
  {
    eventName: "Open Source Contributor Day: Spring Edition",
    date: new Date(now.getTime() + days(12)),
    registrationCloseDate: new Date(now.getTime() - days(1)), // Closed 1 day ago!
    locationType: "Online",
    location: "GitHub Classroom & Discord",
    registrationLink: "https://codex.community/os-day",
    tags: ["Open Source", "Git", "Collaboration"],
    coverImage: sampleImages[7],
    description: `
      <h2>Contribute to Real-World Production Projects</h2>
      <p>Mentored contribution day for first-time and experienced open source developers.</p>
    `,
  },
  {
    eventName: "Data Engineering with Apache Spark & Kafka",
    date: new Date(now.getTime() + days(16)),
    registrationCloseDate: new Date(now.getTime() - days(3)), // Closed 3 days ago!
    locationType: "Online",
    location: "StreamYard Live Broadcast",
    registrationLink: "https://codex.community/spark-kafka",
    tags: ["Big Data", "Kafka", "Spark", "Python"],
    coverImage: sampleImages[0],
    description: `
      <h2>Real-Time Streaming Pipelines at Scale</h2>
      <p>Architecting distributed data pipelines, streaming ETL, and handling petabyte-scale data stores.</p>
    `,
  },
  {
    eventName: "Mobile App Development with Flutter & React Native",
    date: new Date(now.getTime() + days(22)),
    registrationCloseDate: new Date(now.getTime() - days(4)), // Closed 4 days ago!
    locationType: "Offline",
    location: "Seminar Hall 2, Innovation Building",
    registrationLink: "https://codex.community/mobile-dev",
    tags: ["Mobile", "Flutter", "React Native", "iOS", "Android"],
    coverImage: sampleImages[1],
    description: `
      <h2>Building Cross-Platform Mobile Applications</h2>
      <p>Learn state management, native bridges, push notifications, and app store deployment.</p>
    `,
  },

  // --- 3. Past Completed Events (5 Events) ---
  {
    eventName: "CodeX Winter Hackathon 2025",
    date: new Date(now.getTime() - days(45)), // 45 days ago
    registrationCloseDate: new Date(now.getTime() - days(60)),
    locationType: "Offline",
    location: "Main Auditorium, Campus Ground Floor",
    registrationLink: "",
    tags: ["Hackathon", "Innovation", "Cash Prizes"],
    coverImage: sampleImages[2],
    description: `
      <h2>Flagship Winter Hackathon 2025</h2>
      <p>Over 800 participants built 120+ innovative projects across FinTech, HealthTech, and EdTech tracks.</p>
    `,
  },
  {
    eventName: "Cloud Computing & AWS Architecture Workshop",
    date: new Date(now.getTime() - days(70)),
    registrationCloseDate: new Date(now.getTime() - days(80)),
    locationType: "Online",
    location: "Zoom Virtual Classroom",
    registrationLink: "",
    tags: ["AWS", "Cloud", "Serverless"],
    coverImage: sampleImages[3],
    description: `
      <h2>Comprehensive AWS Solutions Architecture</h2>
      <p>Hands-on session on VPCs, EC2 auto-scaling, Lambda serverless functions, and S3 security configurations.</p>
    `,
  },
  {
    eventName: "Rust for Systems Programming Bootcamp",
    date: new Date(now.getTime() - days(100)),
    registrationCloseDate: new Date(now.getTime() - days(110)),
    locationType: "Online",
    location: "Google Meet Live",
    registrationLink: "",
    tags: ["Rust", "Systems", "Performance"],
    coverImage: sampleImages[4],
    description: `
      <h2>Memory Safety & High-Performance Concurrency</h2>
      <p>Understanding ownership, lifetimes, borrow checking, and writing blazingly fast CLI tools in Rust.</p>
    `,
  },
  {
    eventName: "Intro to Machine Learning with Python & PyTorch",
    date: new Date(now.getTime() - days(130)),
    registrationCloseDate: new Date(now.getTime() - days(140)),
    locationType: "Offline",
    location: "Computer Lab 3, Department of CS",
    registrationLink: "",
    tags: ["Machine Learning", "PyTorch", "Python", "Data Science"],
    coverImage: sampleImages[5],
    description: `
      <h2>Fundamentals of Neural Networks & Computer Vision</h2>
      <p>Trained convolutional neural networks from scratch using PyTorch and deployed on Google Colab.</p>
    `,
  },
  {
    eventName: "Campus CodeSprint & AlgoWars 2025",
    date: new Date(now.getTime() - days(160)),
    registrationCloseDate: new Date(now.getTime() - days(170)),
    locationType: "Offline",
    location: "Central Library Tech Wing",
    registrationLink: "",
    tags: ["Algorithms", "Contest", "Problem Solving"],
    coverImage: sampleImages[6],
    description: `
      <h2>Annual Campus Coding Championship</h2>
      <p>Congratulations to all winners who qualified for the regional ICPC preliminaries!</p>
    `,
  },
];

const seedEvents = async () => {
  try {
    await connectDB();
    console.log("Connected to MongoDB for seeding events...");

    // Insert 15 sample events
    const inserted = await Event.insertMany(sampleEvents);
    console.log(`Successfully seeded ${inserted.length} sample events!`);

    await mongoose.connection.close();
    console.log("Database connection closed.");
    process.exit(0);
  } catch (error) {
    console.error("Failed to seed events:", error);
    process.exit(1);
  }
};

seedEvents();
