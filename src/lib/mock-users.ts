// Simple in-memory user database for demo purposes
export let users: { email: string; password: string; role: 'citizen' | 'admin' }[] = [
  { email: 'citizen@example.com', password: 'password', role: 'citizen' },
  { email: 'namansharma102938@gmail.com', password: '12345678', role: 'citizen' },
  { email: 'jainpoorva535@gmail.com', password: '12345678', role: 'citizen' },
  { email: 'admin@example.com', password: 'password', role: 'admin' },
  { email: 'namansharma102938@gmail.com', password: '12345678', role: 'admin' },
  { email: 'jainpoorva535@gmail.com', password: '12345678', role: 'admin' },
];

// Profile type for both citizen and admin
export type UserProfile = {
  email: string;
  role: 'citizen' | 'admin';
  displayName: string;
  photoURL?: string;
  createdAt: Date;
  phone?: string;
  location?: string;
  bio?: string;
  // Citizen-specific
  reportsSubmitted?: number;
  reportsResolved?: number;
  commentsMade?: number;
  badges?: string[];
  // Admin-specific
  issuesManaged?: number;
  issuesResolvedThisMonth?: number;
};

// In-memory map of email -> profile
const userProfiles: Record<string, UserProfile> = {};

// Helper to create a default profile for a new user
export function createDefaultProfile(email: string, role: 'citizen' | 'admin'): UserProfile {
  const now = new Date();
  if (role === 'citizen') {
    return {
      email,
      role,
      displayName: email.split('@')[0],
      photoURL: `https://picsum.photos/seed/${encodeURIComponent(email)}/100/100`,
      createdAt: now,
      phone: '',
      location: '',
      bio: '',
      reportsSubmitted: 0,
      reportsResolved: 0,
      commentsMade: 0,
      badges: ['New Member'],
    };
  } else {
    return {
      email,
      role,
      displayName: email.split('@')[0],
      photoURL: `https://picsum.photos/seed/${encodeURIComponent(email)}/100/100`,
      createdAt: now,
      phone: '',
      location: '',
      bio: '',
      issuesManaged: 0,
      issuesResolvedThisMonth: 0,
    };
  }
}

// Add user and create profile
export function addUser(email: string, password: string, role: 'citizen' | 'admin') {
  users.push({ email, password, role });
  if (!userProfiles[email]) {
    userProfiles[email] = createDefaultProfile(email, role);
  }
}

// Get user profile by email
export function getUserProfile(email: string): UserProfile | undefined {
  return userProfiles[email];
}

// Update user profile by email
export function setUserProfile(email: string, profile: UserProfile) {
  userProfiles[email] = profile;
}

export function findUser(email: string, password: string, role?: 'citizen' | 'admin') {
  return users.find(u => u.email === email && u.password === password && (!role || u.role === role));
}

export function userExists(email: string) {
  return users.some(u => u.email === email);
}
