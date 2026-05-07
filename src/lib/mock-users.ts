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

<<<<<<< HEAD
// In-memory map of "email::role" -> profile
const userProfiles: Record<string, UserProfile> = {};

const getProfileKey = (email: string, role: 'citizen' | 'admin') =>
  `${email.toLowerCase()}::${role}`;

=======
// In-memory map of email -> profile
const userProfiles: Record<string, UserProfile> = {};

>>>>>>> fddd92937dd0f053060e403c1a98d375f5e3c0fc
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
<<<<<<< HEAD
  const key = getProfileKey(email, role);
  if (!userProfiles[key]) {
    userProfiles[key] = createDefaultProfile(email, role);
  }
}

function ensureProfile(email: string, role: 'citizen' | 'admin'): UserProfile {
  const key = getProfileKey(email, role);
  if (!userProfiles[key]) {
    userProfiles[key] = createDefaultProfile(email, role);
  }
  return userProfiles[key];
}

// Get user profile by email and role (role-aware to avoid collisions)
export function getUserProfile(email: string, role?: 'citizen' | 'admin'): UserProfile | undefined {
  const matchedUsers = users.filter((u) => u.email === email);
  if (matchedUsers.length === 0) return undefined;

  const effectiveRole = role ?? matchedUsers[0].role;
  return ensureProfile(email, effectiveRole);
}

// Update user profile by email and role
export function setUserProfile(email: string, profile: UserProfile, role?: 'citizen' | 'admin') {
  const effectiveRole = role ?? profile.role;
  const key = getProfileKey(email, effectiveRole);
  userProfiles[key] = { ...profile, role: effectiveRole };
=======
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
>>>>>>> fddd92937dd0f053060e403c1a98d375f5e3c0fc
}

export function findUser(email: string, password: string, role?: 'citizen' | 'admin') {
  return users.find(u => u.email === email && u.password === password && (!role || u.role === role));
}

export function userExists(email: string) {
  return users.some(u => u.email === email);
}
<<<<<<< HEAD

export function updateUserPassword(
  email: string,
  role: 'citizen' | 'admin',
  currentPassword: string,
  nextPassword: string
): { ok: boolean; message: string } {
  const user = users.find((u) => u.email === email && u.role === role);
  if (!user) return { ok: false, message: "User not found." };
  if (user.password !== currentPassword) {
    return { ok: false, message: "Current password is incorrect." };
  }
  if (nextPassword.length < 6) {
    return { ok: false, message: "New password must be at least 6 characters." };
  }
  user.password = nextPassword;
  return { ok: true, message: "Password updated successfully." };
}
=======
>>>>>>> fddd92937dd0f053060e403c1a98d375f5e3c0fc
