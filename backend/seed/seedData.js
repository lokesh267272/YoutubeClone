import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import User    from '../models/User.js';
import Channel from '../models/Channel.js';
import Video   from '../models/Video.js';
import Comment from '../models/Comment.js';

dotenv.config();

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
      channelName: 'Dan Martell',
      handle:      '@danmartell',
      description: "My #1 passion is teaching. #2 is building AI businesses. I've built and exited 3x tech companies. Invested in 100+ others. Spend 98.2% of my time building AI startups at Martell Ventures (AI Venture Studio) Wrote a WSJ best selling book https://www.BuyBackYourTime.com Play life full out (wake surfing, snowboarding, mountain biking) at the highest level.",
      bannerUrl:   'https://firebasestorage.googleapis.com/v0/b/globe-100k.firebasestorage.app/o/Dan%20Martell%2Fchannels4_banner%20(1).jpg?alt=media&token=26180bca-1726-4d06-9a3f-0e7725d48420',
      profileUrl:  'https://firebasestorage.googleapis.com/v0/b/globe-100k.firebasestorage.app/o/Dan%20Martell%2Fchannels4_profile.jpg?alt=media&token=614aa91f-228b-44d7-bcd8-0c2844611788',
      avatarBg:    '#ff6b35',
      initial:     'D',
      subscribers: 2600000,
      owner:       demoUser._id,
    },
    {
      channelName: 'Meru Brand Studios',
      handle:      '@merubrandstudios',
      description: '🌟 Welcome to Meru Brand Studios – Your Global Entertainment Hub! 🌟 🎬🎶 From the ❤️ of India 🇮🇳 and the USA 🇺🇸 to audiences around the world 🌍, Meru Brand Studios brings you non-stop entertainment that crosses cultures, languages, and borders!',
      bannerUrl:   'https://firebasestorage.googleapis.com/v0/b/globe-100k.firebasestorage.app/o/Meru%20Brand%20Studios%2Fchannels4_banner.jpg?alt=media&token=a854e7b8-4ef3-4e8e-ab5d-04db94bf8e91',
      profileUrl:  'https://firebasestorage.googleapis.com/v0/b/globe-100k.firebasestorage.app/o/Meru%20Brand%20Studios%2Fchannels4_profile%20(1).jpg?alt=media&token=201449bc-0541-4691-9188-1ef6cabc6ae6',
      avatarBg:    '#00b4d8',
      initial:     'M',
      subscribers: 10600,
    },
    {
      channelName: 'Claude',
      handle:      '@claude',
      description: 'The AI for problem solvers. Built by Anthropic to be safe, accurate, and secure. Talk to Claude on claude.ai or download the app on desktop & mobile.',
      bannerUrl:   'https://firebasestorage.googleapis.com/v0/b/globe-100k.firebasestorage.app/o/claude%2Fchannels4_banner.jpg?alt=media&token=245ef0da-93d9-41b2-86c8-2dea9eb768d0',
      profileUrl:  'https://firebasestorage.googleapis.com/v0/b/globe-100k.firebasestorage.app/o/claude%2Fchannels4_profile.jpg?alt=media&token=0ec4f58f-57b9-4f93-ba7d-2bfa098b413e',
      avatarBg:    '#cc785c',
      initial:     'C',
      subscribers: 222000,
    },
    {
      channelName: 'WION',
      handle:      '@wion',
      description: 'WION -The World is One News, examines global issues with in-depth analysis. We provide much more than the news of the day. Our aim to empower people to explore their world. With our Global headquarters in New Delhi, we bring you news on the hour, by the hour.',
      bannerUrl:   'https://firebasestorage.googleapis.com/v0/b/globe-100k.firebasestorage.app/o/WION%2Fchannels4_banner.jpg?alt=media&token=e28378c3-1975-4508-b6ac-5bfed6965cc0',
      profileUrl:  'https://firebasestorage.googleapis.com/v0/b/globe-100k.firebasestorage.app/o/WION%2Fchannels4_profile.jpg?alt=media&token=ce059b2a-677e-4896-9ab7-345bf000e4fb',
      avatarBg:    '#0077b6',
      initial:     'W',
      subscribers: 10400000,
    },
    {
      channelName: 'House of Highlights',
      handle:      '@houseofhighlights',
      description: '🔥 EVERYTHING YOU NEED TO SEE IN SPORTS 🔥',
      bannerUrl:   'https://firebasestorage.googleapis.com/v0/b/globe-100k.firebasestorage.app/o/House%20of%20Highlights%2Fchannels4_banner.jpg?alt=media&token=18eeb3f7-4911-422e-b06f-ced3901d60d5',
      profileUrl:  'https://firebasestorage.googleapis.com/v0/b/globe-100k.firebasestorage.app/o/House%20of%20Highlights%2Fchannels4_profile.jpg?alt=media&token=65ce8f12-1c34-492e-a3a5-569940787faf',
      avatarBg:    '#ff9a3c',
      initial:     'H',
      subscribers: 17500000,
    },
  ];

  const channels = await Channel.insertMany(channelDefs);
  const ch = {};
  channels.forEach(c => { ch[c.channelName] = c; });
  console.log(`Created ${channels.length} channels`);

  demoUser.channelId = ch['Dan Martell']._id;
  await demoUser.save();

  // ── Videos ───────────────────────────────────────────────────────
  const videoDefs = [
    // Dan Martell
    {
      title:       "Give me 58 sec..i'll DELETE your fear of rejection",
      thumbnailUrl: 'https://firebasestorage.googleapis.com/v0/b/globe-100k.firebasestorage.app/o/Dan%20Martell%2Fthumb%201.jpg?alt=media&token=7d79a0c4-3208-4900-84d6-953c61e8667f',
      videoUrl:    'https://firebasestorage.googleapis.com/v0/b/globe-100k.firebasestorage.app/o/Dan%20Martell%2FDan%20Martell%20video1.mp4?alt=media&token=bbd89b5f-14b4-4254-9d1a-0f903c7cc98e',
      description: "Rejection doesn't mean failure, it means you had the courage to try. Give me 58 sec..I'll DELETE your fear of rejection.",
      channelName: 'Dan Martell',
      duration:    '58s',
      views:       8526204,
      category:    'Education',
      uploadDate:  new Date('2025-05-09'),
    },
    {
      title:       'Give me 59 secs... I\'ll delete your fear of starting',
      thumbnailUrl: 'https://firebasestorage.googleapis.com/v0/b/globe-100k.firebasestorage.app/o/Dan%20Martell%2Fthumb%202.jpg?alt=media&token=ecde7319-9a48-4c1b-8d90-6dd7a3c1428d',
      videoUrl:    'https://firebasestorage.googleapis.com/v0/b/globe-100k.firebasestorage.app/o/Dan%20Martell%2FDan%20Martell%20video%202.mp4?alt=media&token=9264e8b5-ae15-454a-aabb-9cda4b9fd399',
      description: 'Struggling to start that thing you keep putting off? This video will shatter your fear of starting and show you how momentum, not motivation, is what really moves the needle.',
      channelName: 'Dan Martell',
      duration:    '59s',
      views:       1153420,
      category:    'Education',
      uploadDate:  new Date('2026-01-27'),
    },
    {
      title:       "Give me 99 seconds and I'll make you DANGEROUSLY good with AI",
      thumbnailUrl: 'https://firebasestorage.googleapis.com/v0/b/globe-100k.firebasestorage.app/o/Dan%20Martell%2Fvideo%203.jpg?alt=media&token=900c16c9-5e2f-49a6-8276-b7d9404a3e04',
      videoUrl:    'https://firebasestorage.googleapis.com/v0/b/globe-100k.firebasestorage.app/o/Dan%20Martell%2FDan%20Martell%20video%203.mp4?alt=media&token=d0fbbd7f-8fc6-417a-9205-829772d8d7c0',
      description: "Give me 99 seconds and I'll teach how to become an AI pro.",
      channelName: 'Dan Martell',
      duration:    '1m 39s',
      views:       111539,
      category:    'Education',
      uploadDate:  new Date('2025-12-09'),
    },

    // Meru Brand Studios
    {
      title:       'Peddi Mass Song Promo | Ram Charan l Samyuktha Menon 🔥 #SongTeaser #peddimovie',
      thumbnailUrl: 'https://firebasestorage.googleapis.com/v0/b/globe-100k.firebasestorage.app/o/Meru%20Brand%20Studios%2Fpeddi%20Mass%20thumb%201.jpg?alt=media&token=293b65d6-d139-4351-87c4-e96545603fcc',
      videoUrl:    'https://firebasestorage.googleapis.com/v0/b/globe-100k.firebasestorage.app/o/Meru%20Brand%20Studios%2FPeddi%20Mass%20Song%201.mp4?alt=media&token=04bc92d3-dbcf-411a-8a6e-e8f5f9d19380',
      description: 'PEDDI – Worldwide Release on JUNE, 2026 🔥 Ram Charan Mass Entry 🔥',
      channelName: 'Meru Brand Studios',
      duration:    '40s',
      views:       568724,
      category:    'Entertainment',
      uploadDate:  new Date('2026-04-21'),
    },
    {
      title:       'Mana Shankara Varaprasad Garu మొగల్తూరు | Chiranjeevi | Disco Pooja Hegde | Nayanthara | Venkatesh',
      thumbnailUrl: 'https://firebasestorage.googleapis.com/v0/b/globe-100k.firebasestorage.app/o/Meru%20Brand%20Studios%2FMana%20Shankara%20Varaprasad%20Garu%20thumb%202.jpg?alt=media&token=ba58b59b-29aa-4d45-8500-620fbbd9ff44',
      videoUrl:    'https://firebasestorage.googleapis.com/v0/b/globe-100k.firebasestorage.app/o/Meru%20Brand%20Studios%2FMana%20Shankara%20Varaprasad%20Garu%202.mp4?alt=media&token=4730c986-ebc1-4194-8790-e6a0c7677330',
      description: 'Get ready for the Mega Mass Disco Vibe! 🔥',
      channelName: 'Meru Brand Studios',
      duration:    '35s',
      views:       2165,
      category:    'Music',
      uploadDate:  new Date('2025-10-28'),
    },
    {
      title:       'PEDDI Mass Item Folk Song Kikku Ichaade | Ram Charan l Peddi | AR Rahman | Janhvi Kapoor | Mangli',
      thumbnailUrl: 'https://firebasestorage.googleapis.com/v0/b/globe-100k.firebasestorage.app/o/Meru%20Brand%20Studios%2FPeddi%20Mass%20thumb%202.jpg?alt=media&token=1c6d4728-7a39-419d-9093-a0bb0357e98b',
      videoUrl:    'https://firebasestorage.googleapis.com/v0/b/globe-100k.firebasestorage.app/o/Meru%20Brand%20Studios%2FPeddi%20Mass%20Song%201.mp4?alt=media&token=04bc92d3-dbcf-411a-8a6e-e8f5f9d19380',
      description: 'Kikku Ichaade Style Mass Item Folk Song for the upcoming new movie PEDDI.',
      channelName: 'Meru Brand Studios',
      duration:    '3m 22s',
      views:       1518398,
      category:    'Entertainment',
      uploadDate:  new Date('2026-04-24'),
    },

    // Claude
    {
      title:       'Find and fix security vulnerabilities with Claude',
      thumbnailUrl: 'https://firebasestorage.googleapis.com/v0/b/globe-100k.firebasestorage.app/o/claude%2Fclaude%20video%20thumb%201.jpg?alt=media&token=b3392446-ddaa-4bce-ada3-ab1418e976fb',
      videoUrl:    'https://firebasestorage.googleapis.com/v0/b/globe-100k.firebasestorage.app/o/claude%2FFind%20and%20fix%20security%201.mp4?alt=media&token=352074b4-5db3-4763-9763-dfc2aa2eff0e',
      description: 'Claude Security, now available in public beta, scans codebases for vulnerabilities and suggests targeted software patches for human review.',
      channelName: 'Claude',
      duration:    '50s',
      views:       41617,
      category:    'Science & Technology',
      uploadDate:  new Date('2026-04-30'),
    },
    {
      title:       'Claude now connects to Autodesk Fusion',
      thumbnailUrl: 'https://firebasestorage.googleapis.com/v0/b/globe-100k.firebasestorage.app/o/claude%2Fclaude%20video%20thumb%202.jpg?alt=media&token=1e31e313-e2c6-46a2-ab87-f970fe6c75d5',
      videoUrl:    'https://firebasestorage.googleapis.com/v0/b/globe-100k.firebasestorage.app/o/claude%2FClaude%20now%20connects%20to%202.mp4?alt=media&token=33515eca-0d66-4d3b-86b0-639ddae12103',
      description: 'With the Autodesk Fusion connector, designers and engineers can turn natural language into design actions and move faster from idea to manufacturable output.',
      channelName: 'Claude',
      duration:    '1m 14s',
      views:       166812,
      category:    'Science & Technology',
      uploadDate:  new Date('2026-04-28'),
    },
    {
      title:       'Introducing Claude Design by Anthropic Labs',
      thumbnailUrl: 'https://firebasestorage.googleapis.com/v0/b/globe-100k.firebasestorage.app/o/claude%2Fclaude%20video%20thumb%203.jpg?alt=media&token=2cf09394-197e-4c49-b8df-7ca937b49dd8',
      videoUrl:    'https://firebasestorage.googleapis.com/v0/b/globe-100k.firebasestorage.app/o/claude%2FIntroducing%20Claude%203.mp4?alt=media&token=400d509c-ed15-4be0-891e-492f04b8e00d',
      description: 'Claude Design is a new Anthropic Labs product that lets you collaborate with Claude to create polished visual work like prototypes, slides, and one-pagers.',
      channelName: 'Claude',
      duration:    '1m 22s',
      views:       738222,
      category:    'Science & Technology',
      uploadDate:  new Date('2026-04-17'),
    },

    // WION
    {
      title:       'Global Gas Markets Rocked By Major Supply Shock | WION World News',
      thumbnailUrl: 'https://firebasestorage.googleapis.com/v0/b/globe-100k.firebasestorage.app/o/WION%2FWion%20thumb%201.jpg?alt=media&token=4cdc93bb-3f51-4c60-8f47-3a80e2838d09',
      videoUrl:    'https://firebasestorage.googleapis.com/v0/b/globe-100k.firebasestorage.app/o/WION%2FGlobal%20Gas%20Markets%201.mp4?alt=media&token=6fa469ad-a1fe-4d7f-9f71-89fb92fa16f1',
      description: 'Global gas markets are facing a major supply shock amid rising geopolitical tensions. Disruptions in key export routes and production hubs have tightened supply. Prices are surging as countries scramble to secure energy needs.',
      channelName: 'WION',
      duration:    '1m 42s',
      views:       785,
      category:    'News & Politics',
      uploadDate:  new Date('2026-05-02'),
    },
    {
      title:       'US-EU Trade Tensions: Donald Trump To Hit EU With 25% Auto Tariffs | WION World News',
      thumbnailUrl: 'https://firebasestorage.googleapis.com/v0/b/globe-100k.firebasestorage.app/o/WION%2FWion%20thum%202.jpg?alt=media&token=31036f4c-ce73-4f47-9650-833bc8e889b0',
      videoUrl:    'https://firebasestorage.googleapis.com/v0/b/globe-100k.firebasestorage.app/o/WION%2FvidssaveTensions%20wion%202.mp4?alt=media&token=9dfcb03c-5c59-47dd-aa10-aa13352cdb23',
      description: 'Donald Trump plans to raise tariffs on European auto imports to 25%. He has accused the European Union of violating a trade agreement. The move could escalate tensions between the US and Europe.',
      channelName: 'WION',
      duration:    '1m 44s',
      views:       818,
      category:    'News & Politics',
      uploadDate:  new Date('2026-05-02'),
    },
    {
      title:       'US-Germany Tensions: Trump To Withdraw Troops From Germany | WION News',
      thumbnailUrl: 'https://firebasestorage.googleapis.com/v0/b/globe-100k.firebasestorage.app/o/WION%2FWion%20thub%203.jpg?alt=media&token=ed7c791f-c7f6-4342-9a0b-bc3e4b91d9c3',
      videoUrl:    'https://firebasestorage.googleapis.com/v0/b/globe-100k.firebasestorage.app/o/WION%2FvTensions_%20Trump3.mp4?alt=media&token=4d6e799c-09ef-49a7-b6f7-6af4a8fb337a',
      description: "Donald Trump has escalated tensions with Germany, threatening to reduce US troop presence while launching sharp criticism at Chancellor Friedrich Merz. Trump accused Berlin of failing to support Washington during the Iran conflict and warned that allies unwilling to stand with the US could face consequences.",
      channelName: 'WION',
      duration:    '1m 47s',
      views:       4509,
      category:    'News & Politics',
      uploadDate:  new Date('2026-05-02'),
    },

    // House of Highlights
    {
      title:       'WILD ENDING - Cavs vs Raptors Game 6 😱 2026 NBA Playoffs',
      thumbnailUrl: 'https://firebasestorage.googleapis.com/v0/b/globe-100k.firebasestorage.app/o/House%20of%20Highlights%2Fthumb%201.jpg?alt=media&token=71454879-ffe9-4753-93b0-a6ca420208ad',
      videoUrl:    'https://firebasestorage.googleapis.com/v0/b/globe-100k.firebasestorage.app/o/House%20of%20Highlights%2FWILD%20ENDING%201.mp4?alt=media&token=7462008f-7cd8-4fd6-ba60-a72f611910a6',
      description: 'SUB TO HOUSE OF HIGHLIGHTS FOR MORE',
      channelName: 'House of Highlights',
      duration:    '59s',
      views:       56451,
      category:    'Sports',
      uploadDate:  new Date('2026-05-02'),
    },
    {
      title:       'Kyle Tucker WALKS IT OFF for the Dodgers vs Marlins! 😱🔥',
      thumbnailUrl: 'https://firebasestorage.googleapis.com/v0/b/globe-100k.firebasestorage.app/o/House%20of%20Highlights%2Fthumb%202.jpg?alt=media&token=49625d6a-3397-4f52-881f-67600fe1448e',
      videoUrl:    'https://firebasestorage.googleapis.com/v0/b/globe-100k.firebasestorage.app/o/House%20of%20Highlights%2FKyle%20Tucker%20WALKS%202.mp4?alt=media&token=fd893a46-8222-4fb9-a9ca-a310e197c44a',
      description: 'Miami Marlins vs Los Angeles Dodgers full game highlights from April 27, 2026 MLB season.',
      channelName: 'House of Highlights',
      duration:    '1m 56s',
      views:       74564,
      category:    'Sports',
      uploadDate:  new Date('2026-04-28'),
    },
    {
      title:       'BATTLEGROUNDS MOBILE INDIA INTERNATIONAL CUP 2025 | Official Trailer',
      thumbnailUrl: 'https://firebasestorage.googleapis.com/v0/b/globe-100k.firebasestorage.app/o/House%20of%20Highlights%2Fthumb%203.jpg?alt=media&token=e9fcb78d-545b-46fc-8fcd-456b90047445',
      videoUrl:    'https://firebasestorage.googleapis.com/v0/b/globe-100k.firebasestorage.app/o/House%20of%20Highlights%2FBATTLEGROUNDS%201.mp4?alt=media&token=ad292d0c-4bb6-4f5c-8e0c-8be5bb546806',
      description: 'The wait is finally over! The battleground ignites with the Official Trailer of BMIC 2025. 3 nations, #1 Crown, and no room for mercy.',
      channelName: 'House of Highlights',
      duration:    '40s',
      views:       356872,
      category:    'Gaming',
      uploadDate:  new Date('2025-10-27'),
    },
  ];

  const videoDocuments = videoDefs.map(v => {
    const channel = ch[v.channelName];
    return {
      title:             v.title,
      thumbnailUrl:      v.thumbnailUrl,
      videoUrl:          v.videoUrl,
      description:       v.description,
      duration:          v.duration,
      channelId:         channel._id,
      channelName:       channel.channelName,
      channelAvatarBg:   channel.avatarBg,
      channelInitial:    channel.initial,
      channelProfileUrl: channel.profileUrl,
      uploader:          demoUser._id,
      views:             v.views,
      category:          v.category,
      uploadDate:        v.uploadDate,
    };
  });

  const videos = await Video.insertMany(videoDocuments);
  console.log(`Created ${videos.length} videos`);

  for (const video of videos) {
    await Channel.findByIdAndUpdate(video.channelId, {
      $push: { videos: video._id },
    });
  }
  console.log('Linked videos to channels');

  // ── Sample comments ───────────────────────────────────────────────
  const firstVideo = videos[0];
  await Comment.insertMany([
    {
      videoId:  firstVideo._id,
      userId:   demoUser._id,
      username: demoUser.username,
      text:     'This is exactly the mindset shift I needed. Thank you!',
    },
    {
      videoId:  firstVideo._id,
      userId:   demoUser._id,
      username: 'entrepreneur_2026',
      text:     'Dan always delivers. Sharing this with my whole team.',
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
