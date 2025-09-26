import express from 'express';
import User from '../models/User.js';
import Skill from '../models/Skill.js';
import Assessment from '../models/Assessment.js';
import PeerReview from '../models/PeerReview.js';

const router = express.Router();

// Clear all test users (for E2E testing)
router.delete('/clear-users', async (req, res) => {
  try {
    if (process.env.NODE_ENV !== 'test') {
      return res.status(403).json({ message: 'This endpoint is only available in test environment' });
    }

    // Clear all test data
    await User.deleteMany({});
    await Skill.deleteMany({});
    await Assessment.deleteMany({});
    await PeerReview.deleteMany({});

    res.status(200).json({ message: 'Test data cleared successfully' });
  } catch (error) {
    console.error('Error clearing test data:', error);
    res.status(500).json({ message: 'Error clearing test data', error: error.message });
  }
});

// Seed test data (for E2E testing)
router.post('/seed-data', async (req, res) => {
  try {
    if (process.env.NODE_ENV !== 'test') {
      return res.status(403).json({ message: 'This endpoint is only available in test environment' });
    }

    // Create test users
    const testUsers = [
      {
        name: 'Test Developer',
        email: 'dev@test.com',
        password: 'TestPassword123!',
        role: 'Developer',
        isEmailVerified: true
      },
      {
        name: 'Test Designer',
        email: 'designer@test.com',
        password: 'TestPassword123!',
        role: 'Designer',
        isEmailVerified: true
      },
      {
        name: 'Test Manager',
        email: 'manager@test.com',
        password: 'TestPassword123!',
        role: 'Manager',
        isEmailVerified: true
      }
    ];

    const createdUsers = [];
    for (const userData of testUsers) {
      const user = new User(userData);
      await user.save();
      createdUsers.push(user);
    }

    // Create test skills for the developer
    const testSkills = [
      {
        userId: createdUsers[0]._id,
        name: 'JavaScript',
        category: 'Programming',
        level: 'Advanced',
        description: 'Expert in modern JavaScript, ES6+, async/await',
        tags: ['frontend', 'backend', 'fullstack']
      },
      {
        userId: createdUsers[0]._id,
        name: 'React',
        category: 'Framework',
        level: 'Advanced',
        description: 'Expert in React hooks, context, and performance optimization',
        tags: ['frontend', 'ui', 'components']
      },
      {
        userId: createdUsers[0]._id,
        name: 'Node.js',
        category: 'Backend',
        level: 'Intermediate',
        description: 'Experience with Express, APIs, and server-side development',
        tags: ['backend', 'api', 'server']
      }
    ];

    for (const skillData of testSkills) {
      const skill = new Skill(skillData);
      await skill.save();
    }

    // Create test assessments
    const testAssessments = [
      {
        userId: createdUsers[0]._id,
        skillName: 'JavaScript',
        type: 'self',
        questions: [
          {
            question: 'What is a closure in JavaScript?',
            options: ['A function inside another function', 'A loop structure', 'A data type', 'An event handler'],
            correctAnswer: 0,
            userAnswer: 0
          },
          {
            question: 'What does async/await do?',
            options: ['Handles synchronous code', 'Handles asynchronous code', 'Creates loops', 'Defines variables'],
            correctAnswer: 1,
            userAnswer: 1
          }
        ],
        score: 100,
        level: 'Advanced',
        completedAt: new Date()
      }
    ];

    for (const assessmentData of testAssessments) {
      const assessment = new Assessment(assessmentData);
      await assessment.save();
    }

    res.status(200).json({ 
      message: 'Test data seeded successfully',
      users: createdUsers.length,
      skills: testSkills.length,
      assessments: testAssessments.length
    });
  } catch (error) {
    console.error('Error seeding test data:', error);
    res.status(500).json({ message: 'Error seeding test data', error: error.message });
  }
});

// Get test data statistics
router.get('/stats', async (req, res) => {
  try {
    if (process.env.NODE_ENV !== 'test') {
      return res.status(403).json({ message: 'This endpoint is only available in test environment' });
    }

    const userCount = await User.countDocuments();
    const skillCount = await Skill.countDocuments();
    const assessmentCount = await Assessment.countDocuments();
    const peerReviewCount = await PeerReview.countDocuments();

    res.status(200).json({
      users: userCount,
      skills: skillCount,
      assessments: assessmentCount,
      peerReviews: peerReviewCount
    });
  } catch (error) {
    console.error('Error getting test stats:', error);
    res.status(500).json({ message: 'Error getting test stats', error: error.message });
  }
});

export default router;