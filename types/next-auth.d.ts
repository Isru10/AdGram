// types/next-auth.d.ts

import 'next-auth';
import 'next-auth/jwt';

declare module 'next-auth' {
  /**
   * The shape of the user object in the session.
   * Extends the default session user to include your custom properties.
   */
  interface Session {
    user: {
      id: string; // <-- THE ID YOU FORGOT
      role: string;
    } & DefaultSession['user']; // <-- This keeps the default properties (name, email, image)
  }

  /**
   * The shape of the user object returned from the authorize callback.
   */
  interface User {
    role: string;
  }
}

declare module 'next-auth/jwt' {
  /**
   * The shape of the JWT token.
   */
  interface JWT {
    id: string; // <-- THE ID YOU FORGOT HERE TOO
    role: string;
  }
}