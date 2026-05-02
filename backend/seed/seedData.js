import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import User    from '../models/User.js';
import Channel from '../models/Channel.js';
import Video   from '../models/Video.js';
import Comment from '../models/Comment.js';

dotenv.config();

const SAMPLE_VIDEOS = [
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/VolkswagenGTIReview.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WhatCarCanYouGetForAGrand.mp4',
];

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected to MongoDB');

  // ── Clear existing data ──────────────────────────────────────────
  await Promise.all([
    User.deleteMany({}),
    Channel.deleteMany({}),
    Video.deleteMany({}),
    Comment.deleteMany({}),
  ]);
  console.log('Cleared existing collections');

  // ── Demo user ────────────────────────────────────────────────────
  const hashedPassword = await bcrypt.hash('password123', 10);
  const demoUser = await User.create({
    username: 'CodeWithJohn',
    email:    'test@example.com',
    password: hashedPassword,
    avatarBg: '#4d96ff',
  });
  console.log(`Created user: ${demoUser.email}`);

  // ── Channels ─────────────────────────────────────────────────────
  const channelDefs = [
    {
      channelName: 'Code with John',
      handle:      '@codewithjohn',
      description: 'Full-stack development tutorials — React, Node.js, MongoDB, and more. New videos every week! We cover everything from beginner basics to advanced system design.',
      bannerUrl:   'https://picsum.photos/seed/ch01banner/1280/351',
      avatarBg:    '#4d96ff',
      initial:     'C',
      subscribers: 248000,
      links:       ['github.com/codewithjohn', 'codewithjohn.dev'],
      owner:       demoUser._id,
    },
    {
      channelName: 'JS Mastery',
      handle:      '@jsmastery',
      description: 'Master JavaScript and modern web development. Tutorials on React, Next.js, TypeScript, and all the latest JS features with practical, project-based learning.',
      bannerUrl:   'https://picsum.photos/seed/ch02banner/1280/351',
      avatarBg:    '#ffd93d',
      initial:     'J',
      subscribers: 892000,
      links:       ['jsmastery.pro'],
    },
    {
      channelName: 'AlgoPath',
      handle:      '@algopath',
      description: 'Data structures and algorithms explained clearly with visual animations and real code. Ace your technical interviews with us.',
      bannerUrl:   'https://picsum.photos/seed/ch03banner/1280/351',
      avatarBg:    '#6bcb77',
      initial:     'A',
      subscribers: 415000,
      links:       ['algopath.io'],
    },
    {
      channelName: 'ChillWave',
      handle:      '@chillwave',
      description: 'Non-stop lo-fi music streams for studying, working, and relaxing. New beats uploaded daily.',
      bannerUrl:   'https://picsum.photos/seed/ch04banner/1280/351',
      avatarBg:    '#c77dff',
      initial:     'W',
      subscribers: 3200000,
      links:       ['chillwave.fm'],
    },
    {
      channelName: 'GameZone',
      handle:      '@gamezone',
      description: 'Gaming news, reviews, setups, and entertainment. Top 10 lists, game guides, and the latest gaming industry coverage.',
      bannerUrl:   'https://picsum.photos/seed/ch05banner/1280/351',
      avatarBg:    '#ff6b6b',
      initial:     'G',
      subscribers: 1750000,
      links:       ['gamezone.gg'],
    },
    {
      channelName: 'TechBrief',
      handle:      '@techbrief',
      description: 'Your weekly dose of tech news — AI updates, product launches, startup stories, and the biggest stories in tech.',
      bannerUrl:   'https://picsum.photos/seed/ch06banner/1280/351',
      avatarBg:    '#00b4d8',
      initial:     'T',
      subscribers: 520000,
      links:       ['techbrief.io'],
    },
    {
      channelName: 'ITCertHub',
      handle:      '@itcerthub',
      description: 'CompTIA, Cisco, AWS, and Microsoft certification courses. Pass your IT certs with our free full-length study guides.',
      bannerUrl:   'https://picsum.photos/seed/ch07banner/1280/351',
      avatarBg:    '#ff9a3c',
      initial:     'I',
      subscribers: 680000,
      links:       ['itcerthub.com'],
    },
    {
      channelName: 'JavaGuides',
      handle:      '@javaguides',
      description: 'Spring Boot, Spring Security, Hibernate, Microservices and Java tutorials for developers at all levels.',
      bannerUrl:   'https://picsum.photos/seed/ch08banner/1280/351',
      avatarBg:    '#f72585',
      initial:     'J',
      subscribers: 1100000,
      links:       ['javaguides.net'],
    },
    {
      channelName: 'DevTheory',
      handle:      '@devtheory',
      description: 'Deep dives into software engineering concepts, patterns, and JavaScript mastery. Theory meets practice.',
      bannerUrl:   'https://picsum.photos/seed/ch09banner/1280/351',
      avatarBg:    '#6bcb77',
      initial:     'D',
      subscribers: 310000,
      links:       ['devtheory.io'],
    },
  ];

  const channels = await Channel.insertMany(channelDefs);
  // map name → channel doc for easy lookup
  const ch = {};
  channels.forEach(c => { ch[c.channelName] = c; });
  console.log(`Created ${channels.length} channels`);

  // Link demo user to their channel (Code with John)
  demoUser.channelId = ch['Code with John']._id;
  await demoUser.save();

  // ── Videos ───────────────────────────────────────────────────────
  const videoDefs = [
    {
      title: 'Build a Full Stack App with React 19 & Node.js — Complete Guide',
      thumbnailUrl: 'https://picsum.photos/seed/v01react/640/360',
      videoUrl: SAMPLE_VIDEOS[0],
      description: 'Complete full-stack tutorial using React 19, Node.js, Express, and MongoDB. Covers auth, CRUD operations, and deployment to production.',
      channelName: 'Code with John', duration: '1:24:32',
      views: 152000, category: 'Web Development', uploadDate: new Date('2026-04-15'),
    },
    {
      title: 'JavaScript ES2025 Features Every Developer Must Know',
      thumbnailUrl: 'https://picsum.photos/seed/v02js/640/360',
      videoUrl: SAMPLE_VIDEOS[1],
      description: 'All the exciting new JavaScript features in ES2025 with practical examples and use cases for real projects.',
      channelName: 'JS Mastery', duration: '18:42',
      views: 458000, category: 'JavaScript', uploadDate: new Date('2026-04-20'),
    },
    {
      title: 'Binary Search Trees: Complete Visual Guide with Code',
      thumbnailUrl: 'https://picsum.photos/seed/v03bst/640/360',
      videoUrl: SAMPLE_VIDEOS[2],
      description: 'Understand Binary Search Trees with clear animations and code examples in JavaScript and Python.',
      channelName: 'AlgoPath', duration: '35:10',
      views: 89000, category: 'Data Structures', uploadDate: new Date('2026-03-28'),
    },
    {
      title: 'Lo-Fi Hip Hop Radio 🎵 Beats to Study & Relax to',
      thumbnailUrl: 'https://picsum.photos/seed/v04lofi/640/360',
      videoUrl: SAMPLE_VIDEOS[3],
      description: 'Chill lo-fi beats to help you focus while studying or working. Non-stop music stream.',
      channelName: 'ChillWave', duration: '3:00:00',
      views: 5500000, category: 'Music', uploadDate: new Date('2025-11-10'),
    },
    {
      title: 'Top 10 Most Anticipated Games of 2026 — Complete Ranked List',
      thumbnailUrl: 'https://picsum.photos/seed/v05games/640/360',
      videoUrl: SAMPLE_VIDEOS[4],
      description: 'From AAA blockbusters to indie gems — here are the top 10 most anticipated games dropping in 2026.',
      channelName: 'GameZone', duration: '14:55',
      views: 2100000, category: 'Gaming', uploadDate: new Date('2026-01-05'),
    },
    {
      title: 'Tech Weekly: AI Updates, Apple Event & OpenAI News',
      thumbnailUrl: 'https://picsum.photos/seed/v06news/640/360',
      videoUrl: SAMPLE_VIDEOS[5],
      description: 'This week in tech: major AI announcements, product launches, and the biggest industry news.',
      channelName: 'TechBrief', duration: '22:18',
      views: 88000, category: 'News', uploadDate: new Date('2026-04-28'),
    },
    {
      title: '🔴 LIVE: Build a REST API with Node.js & Express from Scratch',
      thumbnailUrl: 'https://picsum.photos/seed/v07live/640/360',
      videoUrl: SAMPLE_VIDEOS[6],
      description: 'Live coding session — building a complete REST API with JWT auth, validation, and testing.',
      channelName: 'Code with John', duration: '2:15:44',
      views: 12400, category: 'Live', uploadDate: new Date('2026-04-30'),
    },
    {
      title: 'CompTIA Network+ Full Course 2026 — Pass in 30 Days',
      thumbnailUrl: 'https://picsum.photos/seed/v08network/640/360',
      videoUrl: SAMPLE_VIDEOS[7],
      description: 'Everything you need to pass CompTIA Network+ in 2026. Subnetting, OSI model, protocols, and exam tips.',
      channelName: 'ITCertHub', duration: '4:48:30',
      views: 320000, category: 'Information Technology', uploadDate: new Date('2026-02-14'),
    },
    {
      title: 'Spring Boot 3 Complete Tutorial — REST API + Security + JWT',
      thumbnailUrl: 'https://picsum.photos/seed/v09spring/640/360',
      videoUrl: SAMPLE_VIDEOS[8],
      description: 'Build a production-ready Spring Boot 3 app with REST APIs, Spring Security 6, and JWT authentication.',
      channelName: 'JavaGuides', duration: '2:30:15',
      views: 920000, category: 'Spring Framework', uploadDate: new Date('2026-03-10'),
    },
    {
      title: 'CSS Grid vs Flexbox: When to Use Each in 2026',
      thumbnailUrl: 'https://picsum.photos/seed/v10css/640/360',
      videoUrl: SAMPLE_VIDEOS[9],
      description: 'A practical comparison of CSS Grid and Flexbox with real-world layout examples from production sites.',
      channelName: 'JS Mastery', duration: '24:07',
      views: 345000, category: 'Web Development', uploadDate: new Date('2026-04-01'),
    },
    {
      title: 'Async/Await Deep Dive: Promises, Error Handling & Advanced Patterns',
      thumbnailUrl: 'https://picsum.photos/seed/v11async/640/360',
      videoUrl: SAMPLE_VIDEOS[10],
      description: 'Master async JavaScript — Promises, async/await, error handling patterns, and concurrent requests.',
      channelName: 'DevTheory', duration: '42:55',
      views: 178000, category: 'JavaScript', uploadDate: new Date('2026-03-22'),
    },
    {
      title: 'Dynamic Programming: 10 Patterns to Solve Any DP Problem',
      thumbnailUrl: 'https://picsum.photos/seed/v12dp/640/360',
      videoUrl: SAMPLE_VIDEOS[11],
      description: 'Master dynamic programming with 10 essential patterns. Includes LeetCode problems with full solutions.',
      channelName: 'AlgoPath', duration: '1:15:22',
      views: 560000, category: 'Data Structures', uploadDate: new Date('2026-02-28'),
    },
    {
      title: 'Best Gaming Setup on a Budget 2026 — Full Room Tour',
      thumbnailUrl: 'https://picsum.photos/seed/v13setup/640/360',
      videoUrl: SAMPLE_VIDEOS[0],
      description: 'Build an incredible gaming setup without breaking the bank. Monitor, PC build, peripherals, and desk tour.',
      channelName: 'GameZone', duration: '18:30',
      views: 1200000, category: 'Gaming', uploadDate: new Date('2025-12-20'),
    },
    {
      title: 'React 19 New Features: Server Actions, use() Hook & More',
      thumbnailUrl: 'https://picsum.photos/seed/v14react19/640/360',
      videoUrl: SAMPLE_VIDEOS[1],
      description: 'All the new React 19 features explained: server components, actions, use hook, and optimistic UI updates.',
      channelName: 'Code with John', duration: '28:44',
      views: 234000, category: 'Web Development', uploadDate: new Date('2026-04-10'),
    },
  ];

  const videoDocuments = videoDefs.map(v => {
    const channel = ch[v.channelName];
    return {
      title:           v.title,
      thumbnailUrl:    v.thumbnailUrl,
      videoUrl:        v.videoUrl,
      description:     v.description,
      duration:        v.duration,
      channelId:       channel._id,
      channelName:     channel.channelName,
      channelAvatarBg: channel.avatarBg,
      channelInitial:  channel.initial,
      uploader:        demoUser._id,
      views:           v.views,
      category:        v.category,
      uploadDate:      v.uploadDate,
    };
  });

  const videos = await Video.insertMany(videoDocuments);
  console.log(`Created ${videos.length} videos`);

  // Push video IDs into each channel's videos array
  for (const video of videos) {
    await Channel.findByIdAndUpdate(video.channelId, {
      $push: { videos: video._id },
    });
  }
  console.log('Linked videos to channels');

  // ── Sample comments ───────────────────────────────────────────────
  const firstVideo = videos[0];
  const secondVideo = videos[1];

  await Comment.insertMany([
    {
      videoId:  firstVideo._id,
      userId:   demoUser._id,
      username: demoUser.username,
      text:     'Great video! The full-stack walkthrough is incredibly detailed.',
    },
    {
      videoId:  firstVideo._id,
      userId:   demoUser._id,
      username: 'mountainexplorer',
      text:     'This is exactly what I needed. Subscribed immediately!',
    },
    {
      videoId:  firstVideo._id,
      userId:   demoUser._id,
      username: 'devguru2025',
      text:     'The MongoDB section at 45 minutes is pure gold. Bookmark this one.',
    },
    {
      videoId:  secondVideo._id,
      userId:   demoUser._id,
      username: demoUser.username,
      text:     'ES2025 features are mind-blowing. The pattern matching section especially.',
    },
    {
      videoId:  secondVideo._id,
      userId:   demoUser._id,
      username: 'naturelover99',
      text:     'Finally someone explaining temporal API properly. Thank you!',
    },
  ]);
  console.log('Created sample comments');

  console.log('\n✓ Seed complete!');
  console.log('─────────────────────────────────');
  console.log('  Login: test@example.com');
  console.log('  Password: password123');
  console.log('─────────────────────────────────');

  await mongoose.disconnect();
  process.exit(0);
}

seed().catch(err => {
  console.error('Seed failed:', err);
  process.exit(1);
});
