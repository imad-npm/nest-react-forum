// Assuming User is already defined in a shared types file or needs to be defined here.
// For now, let's include a minimal User type if not already globally available.

import type { UserResponseDto } from "../user/types";


export interface Profile {
  id: number;
  displayName: string;
  bio: string | null;
  picture: string | null; // URL to the profile picture
  user: UserResponseDto; // The associated user object
  
}

export interface UpdateProfilePayload {
  username?: string;
  bio?: string | null;
  picture?: string | null;
}

export interface CreateProfilePayload {
  username: string;
  bio?: string | null;
  picture?: string | null;
}
