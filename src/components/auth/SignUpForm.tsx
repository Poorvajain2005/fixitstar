// src/components/auth/SignUpForm.tsx
'use client';

import { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useRouter } from 'next/navigation';

export default function SignUpForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  // In src/components/auth/LoginForm.tsx AND SignUpForm.tsx
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  try {
    await signInWithEmailAndPassword(auth, email, password);
    router.push('/'); // Changed from '/dashboard' to '/'
  } catch (error) {
    setError(error.message);
  }
};

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        required
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        required
      />
      <button type="submit">Sign Up</button>
      {error && <p className="error">{error}</p>}
    </form>
  );
}