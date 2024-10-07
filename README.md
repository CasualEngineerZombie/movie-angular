# Angular Video Sharing Platform

A modern, responsive video sharing platform built with Angular, allowing users to upload, view, and interact with videos.

## Features

- 🎥 Video upload and playback
- 👤 User authentication and authorization
- 💬 Comment system
- 👍 Like/unlike functionality
- ✏️ Edit and delete videos (for video owners)
- 🎨 Responsive design using Tailwind CSS
- 🔔 Toast notifications for user feedback

## Technologies Used

- Angular 17+
- Tailwind CSS
- NgX-Toastr for notifications
- Angular Router for navigation

## Prerequisites

- Node.js (v18 or later)
- npm (v9 or later)
- Angular CLI (`npm install -g @angular/cli`)

## Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/CasualEngineerZombie/movie-angular.git
   cd movie-angular
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   ng serve
   ```

4. Open your browser and navigate to `http://localhost:4200`
 

## Key Components

### MovieDetailComponent

Handles the display and interaction of individual videos, including:
- Video playback
- Comments
- Likes
- Editing/deleting for video owners

## API Integration

The platform integrates with a backend API for:
- User authentication
- Video CRUD operations
- Comment management
 