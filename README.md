# Freelens

Freelens is a beautiful, easy-to-use analytics dashboard designed for creative freelancers like video editors, graphic designers, and animators. It helps you track your projects, clients, and monthly goals in one gorgeous, dark-themed interface.

---

## Key Features

* **Performance Dashboard**: See your monthly earnings, average project values, active clients count, and monthly target goal progress rings.
* **Inspect Month Selector**: Easily filter your entire dashboard and deliverables history by any month to check past progress.
* **Daily Creative Output**: A LeetCode-style activity heatmap tracking your daily project completions over the last 53 weeks.
* **Project Timeline**: A simple list view to log new projects, edit existing ones, assign categories, and update delivery statuses.
* **Client Leaderboard**: Automatically ranks your clients based on their total revenue contribution to help you see your strongest partnerships.
* **Freelens Wrapped**: A clean, cinematic slideshow that showcases your key milestones and achievements.
* **Mobile-Friendly**: Works smoothly on phone, tablet, and desktop viewports, with a mobile-optimized navigation menu.

---

## How to Get Started

### 1. Install Dependencies
Run the following command in your terminal to install the project dependencies:
```bash
npm install
```

### 2. Run the App Locally
Start the local development server:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser to view the platform.

### 3. Database Modes
* **Local Mode (Default)**: Freelens runs automatically using safe local memory storage and mock data. No setup required!
* **Cloud Mode (Optional)**: If you want to store your data on the web, you can create a `.env.local` file and connect your Supabase database keys (refer to `supabase_setup.md` for tables).
