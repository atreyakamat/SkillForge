export const sampleUsers = [
  {
    name: 'Ava Patel', email: 'ava.frontend@example.com', industry: 'Technology', experienceLevel: 'mid', role: 'user',
    careerGoals: 'Become Senior Frontend Engineer focusing on performance and accessibility.',
    skills: [
      { name: 'JavaScript', selfRating: 8, peerRatings: [{ rating: 7, comment: 'Strong fundamentals' }], averagePeerRating: 7 },
      { name: 'React', selfRating: 7, peerRatings: [{ rating: 6, comment: 'Good hooks knowledge' }], averagePeerRating: 6 },
      { name: 'CSS', selfRating: 6, peerRatings: [{ rating: 6 }], averagePeerRating: 6 }
    ],
    timeline: [
      { title: 'Completed React performance course', date: '2025-06-12' },
      { title: 'Led UI refactor initiative', date: '2025-07-05' }
    ]
  },
  {
    name: 'Liam Chen', email: 'liam.ux@example.com', industry: 'Design', experienceLevel: 'mid', role: 'user',
    careerGoals: 'Transition to UX Lead with strong data-informed design.',
    skills: [
      { name: 'UX Research', selfRating: 7, peerRatings: [{ rating: 8, comment: 'Great interview skills' }], averagePeerRating: 8 },
      { name: 'UI Design', selfRating: 6, peerRatings: [{ rating: 6 }], averagePeerRating: 6 },
      { name: 'Prototyping', selfRating: 7 }
    ],
    timeline: [
      { title: 'Presented usability study findings', date: '2025-05-28' }
    ]
  },
  {
    name: 'Maya Rivera', email: 'maya.pm@example.com', industry: 'Product', experienceLevel: 'senior', role: 'user',
    careerGoals: 'Drive cross-functional growth initiatives and mentor PMs.',
    skills: [
      { name: 'Roadmapping', selfRating: 8, peerRatings: [{ rating: 8 }], averagePeerRating: 8 },
      { name: 'Stakeholder Management', selfRating: 7, peerRatings: [{ rating: 7 }], averagePeerRating: 7 },
      { name: 'Data Analysis', selfRating: 6 }
    ],
    timeline: [
      { title: 'Launched beta for analytics feature', date: '2025-04-14' }
    ]
  },
  {
    name: 'Noah Kim', email: 'noah.fullstack@example.com', industry: 'Technology', experienceLevel: 'junior', role: 'user',
    careerGoals: 'Strengthen backend skills and cloud fundamentals.',
    skills: [
      { name: 'Node.js', selfRating: 5, peerRatings: [{ rating: 5 }], averagePeerRating: 5 },
      { name: 'React', selfRating: 5 },
      { name: 'SQL', selfRating: 4 }
    ]
  }
]

export const taxonomy = {
  Programming: ['JavaScript', 'TypeScript', 'Python'],
  Frontend: ['React', 'CSS', 'HTML'],
  Backend: ['Node.js', 'Express'],
}


