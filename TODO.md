# NapStack.dev Multiplayer TODO List

This document outlines the necessary steps to upgrade NapStack.dev from a single-user, simulated-data application to a true multiplayer platform with user accounts and real-time features, as detailed in the roadmap.

---

## 🚀 Phase 1: Foundation & Authentication

**Goal:** Allow users to sign up, log in, and have their basic identity stored. This corresponds to the "Authentication & Sync" section of the roadmap.

### Backend & Database Setup (Supabase)
- [ ] **Set up Supabase Project:** Create a new project on [supabase.com](https://supabase.com).
- [ ] **Define Database Schema:** Create the necessary tables in the Supabase SQL editor.
  - `users`: To store profile information (id, name, avatar, auth provider id).
  - `user_stats`: To store daily stats (user_id, date, sessions, minutes, ships, streak).
  - `activity_events`: To store real-time events for the live feed (user_id, event_type, message).
- [ ] **Configure Environment Variables:** Add Supabase URL and API keys to the project's environment variables.

### User Authentication (NextAuth.js)
- [ ] **Install Dependencies:** Add `next-auth` and `@auth/supabase-adapter` to the project.
- [ ] **Set up OAuth Providers:** Create OAuth applications for GitHub and X/Twitter to get client IDs and secrets.
- [ ] **Create NextAuth API Route:** Implement the `app/api/auth/[...nextauth]/route.ts` file, configuring the Supabase adapter and providers.
- [ ] **Implement Login/Logout UI:** Add "Sign In" buttons and a "Sign Out" option, likely in the header.
- [ ] **Protect Dashboard:** Wrap the main dashboard page to require a user session, redirecting to a login page if not authenticated.
- [ ] **Display User Info:** Show the logged-in user's avatar and name in the UI.

---

## 🌐 Phase 2: Core Multiplayer & Stats Sync

**Goal:** Replace all simulated data with real, persistent, and real-time data from the backend. This covers "Real Multiplayer" and "Enhanced Stats".

### Stats Syncing
- [ ] **Migrate from `localStorage`:** Remove all `localStorage.getItem` and `localStorage.setItem` calls for stats.
- [ ] **Fetch Stats on Load:** When a user logs in, fetch their stats for the current day from the `user_stats` table.
- [ ] **Update Stats in Database:** On timer completion or "ship" clicks, send updates to the database via an API call or server action instead of updating local state directly.
- [ ] **Implement Real Streak Logic:** Create a server-side function to calculate the user's streak by checking their activity from the previous day.

### Real-time Activity Feed
- [ ] **Enable Supabase Realtime:** Turn on Realtime for the `activity_events` table in the Supabase dashboard.
- [ ] **Broadcast Events:** When a user performs an action (starts a timer, ships code, changes sounds), insert a new record into the `activity_events` table.
- [ ] **Subscribe to Events:** In the `LiveActivity` component, use the Supabase client to subscribe to new inserts in the `activity_events` table.
- [ ] **Update Feed in Real-time:** When a new event is received from the subscription, add it to the top of the live feed for all connected clients.
- [ ] **Display Real Usernames:** Replace "Someone..." with the actual username from the event data.

### User Presence
- [ ] **Implement Presence Channel:** Use Supabase Realtime's presence feature to track which users are currently online and active on the dashboard.
- [ ] **Replace Simulated Counter:** Update the "parents coding now" counter to show the actual number of users tracked by the presence channel.

---

## 🏆 Phase 3: Community & Advanced Features

**Goal:** Build out the community features that make the app more engaging and social. This covers the "Community Features" section of the roadmap.

### Leaderboards
- [ ] **Create API Endpoints:** Build server-side functions to query and rank users based on `total_minutes`, `sessions`, or `ships` for different time periods (daily, weekly).
- [ ] **Build Leaderboard UI:** Create a new component to display the leaderboard rankings.

### Achievements & Badges
- [ ] **Design Achievement System:** Define criteria for various achievements (e.g., "First Ship," "10-Day Streak," "Night Owl").
- [ ] **Create `user_achievements` Table:** A table to link users to the achievements they've earned.
- [ ] **Implement Awarding Logic:** Create server-side checks that run after certain actions to see if a user has earned a new achievement.
- [ ] **Display Badges:** Show earned achievement badges on a user's profile or in the main UI.

---

## ✨ Phase 4: Polish & Quality of Life

**Goal:** Add smaller but important features that improve the overall user experience.

- [ ] **Desktop Notifications:** Use the browser's Notification API to alert users when a timer completes.
- [ ] **Manual Theme Toggle:** Add a button to allow users to switch between dark and light mode, overriding the system preference.
- [ ] **Custom Timer Presets:** Allow users to create, save, and name their own timer presets, storing them in the database.
- [ ] **Data Export:** Create a feature to allow users to download their stats as a CSV file.
