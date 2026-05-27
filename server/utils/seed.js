/**
 * Database Seeder
 * Creates sample data for development/demo purposes
 */

require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const Post = require("../models/Post");
const Comment = require("../models/Comment");
const connectDB = require("../config/database");

// Sample Unsplash image URLs for different categories
const sampleImages = {
  Nature: [
    "https://images.unsplash.com/photo-1501854140801-50d01698950b?w=800",
    "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800",
    "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800",
    "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=800",
  ],
  Architecture: [
    "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=800",
    "https://images.unsplash.com/photo-1518005020951-eccb494ad742?w=800",
    "https://images.unsplash.com/photo-1460317442991-0ec209397118?w=800",
  ],
  Food: [
    "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800",
    "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800",
    "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=800",
  ],
  Travel: [
    "https://images.unsplash.com/photo-1488085061387-422e29b40080?w=800",
    "https://images.unsplash.com/photo-1503220317375-aaad61436b1b?w=800",
    "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800",
  ],
  Fashion: [
    "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800",
    "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800",
    "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800",
  ],
  Art: [
    "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=800",
    "https://images.unsplash.com/photo-1541367777708-7905fe3296c0?w=800",
    "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=800",
  ],
  Photography: [
    "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800",
    "https://images.unsplash.com/photo-1554048612-b6a482bc67e5?w=800",
    "https://images.unsplash.com/photo-1568607689150-17e625c1586e?w=800",
  ],
  Interior: [
    "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800",
    "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800",
    "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=800",
  ],
};

// Sample users data
const sampleUsers = [
  {
    username: "alex_creates",
    email: "alex@pinvault.com",
    password: "password123",
    displayName: "Alex Creates",
    bio: "Visual storyteller & digital artist. Capturing beauty in everyday moments ✨",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&fit=crop&crop=face",
    website: "https://alexcreates.com",
    location: "New York, USA",
  },
  {
    username: "sarah_design",
    email: "sarah@pinvault.com",
    password: "password123",
    displayName: "Sarah Design",
    bio: "Interior designer & lifestyle blogger. Making spaces beautiful 🏠",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&fit=crop&crop=face",
    website: "https://sarahdesign.co",
    location: "London, UK",
  },
  {
    username: "jake_wanders",
    email: "jake@pinvault.com",
    password: "password123",
    displayName: "Jake Wanders",
    bio: "Travel photographer & adventure seeker. 50 countries and counting 🌍",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&fit=crop&crop=face",
    website: "https://jakewanders.travel",
    location: "Amsterdam, Netherlands",
  },
  {
    username: "mia_cooks",
    email: "mia@pinvault.com",
    password: "password123",
    displayName: "Mia Cooks",
    bio: "Food photographer & culinary artist. Everything tastes better with good lighting 🍜",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&fit=crop&crop=face",
    location: "Paris, France",
  },
];

// Sample posts data
const samplePostsData = [
  {
    title: "Morning Mist in the Mountains",
    description: "There's something magical about watching the sun rise over misty mountain peaks. This shot was taken at 5am after a 3-hour hike.",
    category: "Nature",
    tags: ["mountains", "sunrise", "mist", "hiking", "nature"],
    imageIndex: 0,
  },
  {
    title: "Brutalist Architecture Beauty",
    description: "Brutalism gets a bad rap, but there's undeniable beauty in raw concrete and bold geometric forms.",
    category: "Architecture",
    tags: ["architecture", "brutalism", "concrete", "design", "urban"],
    imageIndex: 0,
  },
  {
    title: "Rainbow Bowl Heaven",
    description: "A nutritious and colorful breakfast bowl that's as beautiful as it is delicious. Recipe in my bio!",
    category: "Food",
    tags: ["food", "healthy", "bowl", "breakfast", "colorful"],
    imageIndex: 0,
  },
  {
    title: "Lost in Santorini",
    description: "Blue domes, white walls, and endless ocean views. Santorini never disappoints.",
    category: "Travel",
    tags: ["santorini", "greece", "travel", "blue", "mediterranean"],
    imageIndex: 0,
  },
  {
    title: "Autumn Forest Walk",
    description: "The golden light filtering through autumn leaves creates nature's own cathedral.",
    category: "Nature",
    tags: ["autumn", "forest", "golden", "leaves", "peaceful"],
    imageIndex: 1,
  },
  {
    title: "Minimal Living Space",
    description: "My dream living room aesthetic - clean lines, warm tones, and intentional design.",
    category: "Interior",
    tags: ["interior", "minimal", "living", "design", "cozy"],
    imageIndex: 0,
  },
  {
    title: "Street Photography in Tokyo",
    description: "Neon lights and rain-slicked streets. Tokyo at night is endlessly photogenic.",
    category: "Photography",
    tags: ["tokyo", "street", "photography", "neon", "night"],
    imageIndex: 0,
  },
  {
    title: "Abstract Watercolor Dreamscape",
    description: "Playing with watercolors to create soft, dreamy landscapes that exist only in imagination.",
    category: "Art",
    tags: ["art", "watercolor", "abstract", "painting", "dreamy"],
    imageIndex: 0,
  },
  {
    title: "Pasta Carbonara Perfection",
    description: "The secret to the creamiest carbonara? No cream! Just eggs, pecorino, guanciale, and plenty of pepper.",
    category: "Food",
    tags: ["pasta", "italian", "carbonara", "cooking", "recipe"],
    imageIndex: 1,
  },
  {
    title: "Minimalist Fashion Flatlay",
    description: "Less is more. Building a capsule wardrobe with quality over quantity.",
    category: "Fashion",
    tags: ["fashion", "minimal", "capsule", "wardrobe", "style"],
    imageIndex: 0,
  },
  {
    title: "Skyscrapers at Dusk",
    description: "That magical hour when the city lights start to compete with the fading sky.",
    category: "Architecture",
    tags: ["skyscraper", "cityscape", "dusk", "urban", "modern"],
    imageIndex: 1,
  },
  {
    title: "Backpacking Through Patagonia",
    description: "Wind, rain, and breathtaking vistas. Patagonia tests your limits and rewards your soul.",
    category: "Travel",
    tags: ["patagonia", "backpacking", "mountains", "adventure", "south-america"],
    imageIndex: 1,
  },
  {
    title: "Golden Hour Portrait",
    description: "Natural light is the best light. Chasing golden hour for the perfect portrait.",
    category: "Photography",
    tags: ["portrait", "golden-hour", "photography", "natural-light"],
    imageIndex: 1,
  },
  {
    title: "Bohemian Living Room Vibes",
    description: "Warm textures, plants, and fairy lights make any space feel like home.",
    category: "Interior",
    tags: ["bohemian", "interior", "plants", "cozy", "warm"],
    imageIndex: 1,
  },
  {
    title: "Acrylic Pour Painting Process",
    description: "The unpredictability of acrylic pouring is what makes each piece uniquely beautiful.",
    category: "Art",
    tags: ["acrylic", "pour", "painting", "process", "art"],
    imageIndex: 1,
  },
  {
    title: "Wild Coastline Waves",
    description: "Standing at the edge of land where the ocean's power is humbling and awe-inspiring.",
    category: "Nature",
    tags: ["ocean", "waves", "coast", "power", "nature"],
    imageIndex: 2,
  },
];

const seedDatabase = async () => {
  try {
    await connectDB();

    console.log("🌱 Starting database seeding...");

    // Clear existing data
    await User.deleteMany({});
    await Post.deleteMany({});
    await Comment.deleteMany({});
    console.log("✅ Cleared existing data");

    // Create users
    const createdUsers = [];
    for (const userData of sampleUsers) {
      const user = await User.create(userData);
      createdUsers.push(user);
      console.log(`✅ Created user: ${user.username}`);
    }

    // Create follow relationships
    await User.findByIdAndUpdate(createdUsers[0]._id, {
      following: [createdUsers[1]._id, createdUsers[2]._id],
      followers: [createdUsers[1]._id],
    });
    await User.findByIdAndUpdate(createdUsers[1]._id, {
      following: [createdUsers[0]._id, createdUsers[3]._id],
      followers: [createdUsers[0]._id, createdUsers[2]._id],
    });
    console.log("✅ Created follow relationships");

    // Create posts
    const categories = Object.keys(sampleImages);
    const createdPosts = [];

    for (let i = 0; i < samplePostsData.length; i++) {
      const postData = samplePostsData[i];
      const authorIndex = i % createdUsers.length;
      const category = postData.category;
      const images = sampleImages[category] || sampleImages.Nature;
      const imageUrl = images[postData.imageIndex % images.length];

      const post = await Post.create({
        title: postData.title,
        description: postData.description,
        image: { url: imageUrl, publicId: "" },
        category: postData.category,
        tags: postData.tags,
        author: createdUsers[authorIndex]._id,
        likes: [createdUsers[(authorIndex + 1) % createdUsers.length]._id],
        saves: [createdUsers[(authorIndex + 2) % createdUsers.length]._id],
        views: Math.floor(Math.random() * 1000) + 50,
      });

      createdPosts.push(post);
    }
    console.log(`✅ Created ${createdPosts.length} posts`);

    // Add sample comments
    const sampleComments = [
      "This is absolutely stunning! 😍",
      "Love the composition here!",
      "Incredible shot, where was this taken?",
      "This made my day ✨",
      "Goals! 🙌",
      "The colors are perfect",
    ];

    for (let i = 0; i < Math.min(10, createdPosts.length); i++) {
      const commentCount = Math.floor(Math.random() * 3) + 1;
      for (let j = 0; j < commentCount; j++) {
        const commentAuthor = createdUsers[Math.floor(Math.random() * createdUsers.length)];
        const comment = await Comment.create({
          content: sampleComments[Math.floor(Math.random() * sampleComments.length)],
          author: commentAuthor._id,
          post: createdPosts[i]._id,
        });
        await Post.findByIdAndUpdate(createdPosts[i]._id, {
          $addToSet: { comments: comment._id },
        });
      }
    }
    console.log("✅ Created sample comments");

    console.log("\n🎉 Database seeded successfully!");
    console.log("\n📋 Demo Accounts:");
    sampleUsers.forEach((u) => {
      console.log(`   Email: ${u.email} | Password: ${u.password}`);
    });

    process.exit(0);
  } catch (error) {
    console.error("❌ Seeding error:", error);
    process.exit(1);
  }
};

seedDatabase();
