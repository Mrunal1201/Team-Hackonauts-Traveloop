Traveloop – “My Trips” Feature Master Prompt

Build a modern, responsive, AI-powered travel planning web application module called Traveloop – My Trips Experience.

The design should be premium, minimal, immersive, and startup-grade, inspired by Airbnb, Notion, Google Travel, and Apple-level UX.

Use:

Next.js + React + TypeScript
Tailwind CSS
Framer Motion
ShadCN UI
PostgreSQL
JWT Authentication
Fully responsive mobile-first layout
MODULE STRUCTURE

The application should contain the following major sections:

Login / Signup
Overall Dashboard
Plan Trip
My Trips (Detailed Trip Workspace)
1. LOGIN / SIGNUP SCREEN

Create a beautiful authentication experience.

Features
Login
Signup
Forgot Password
Email + Password Authentication
Social Login placeholders (Google, Apple)
Validation & error handling
Remember me option
UI Requirements
Full-screen travel-themed background
Glassmorphism card
Smooth page transitions
Animated travel illustrations
Dark/light mode support
Sections
Login Form
Email
Password
Login button
Forgot password link
Signup redirect
Signup Form
Full name
Email
Password
Confirm password
Create account button
2. OVERALL DASHBOARD SCREEN

Build a premium dashboard homepage after login.

The dashboard should act as a travel command center.

TOP SUMMARY CARDS

Display analytics cards for:

Total Trips
Number of trips created
Countries Travelled
Count of unique countries visited
Total Budget
Total combined spending/planned budget
Average Trip Rating
Average user trip experience rating
Live Trip Weather

Show:

Current city/region weather
Temperature
Weather icon
Live conditions
Upcoming forecast
DASHBOARD SECTIONS
Upcoming Trips

Display:

Destination image
Date range
Budget
Countdown timer
Quick open button
Recent Trips
Previously completed trips
Ratings
Memories/photos preview
AI Recommendations

Show:

Recommended destinations
Budget-friendly suggestions
Seasonal recommendations
Trending regions
Budget Insights

Show:

Spending trends
Budget usage graph
Highest expense categories
Quick Actions

Buttons:

Plan New Trip
Continue Editing
Generate AI Trip
View Saved Trips
3. PLAN TRIP SCREEN

This section should allow users to create trips in two ways:

OPTION 1 – CUSTOMIZED TRIP PLANNER

Users manually create trips.

Features
Trip Name
Destination/Country
Multiple cities/stops
Start & end dates
Budget input
Travel type
Number of travelers
Interests selection
Cover image upload
Travel Types
Solo
Family
Friends
Couple
Business
Interests
Adventure
Food
Nature
Luxury
Nightlife
Historical
Shopping
OPTION 2 – AI GENERATED TRIP

Build an AI-powered itinerary generator.

User Inputs
Budget
Destination preference
Number of days
Travel style
Interests
Weather preference
Luxury level
AI Should Generate
Complete itinerary
Suggested cities
Activities
Hotels placeholders
Budget estimates
Transport suggestions
Daily schedules
Packing suggestions
UI REQUIREMENTS

Use:

Multi-step trip creation wizard
Interactive map
Drag-and-drop itinerary builder
Calendar picker
Animated transitions
Timeline visualization

Include:

Save Draft
Publish Trip
Share Trip
Export PDF
4. MY TRIPS SCREEN

All trips created in “Plan Trip” should automatically appear in “My Trips”.

MY TRIPS OVERVIEW

Display trips in:

Grid view
List view
Timeline view

Each trip card should include:

Cover image
Destination
Duration
Budget
Status
Weather
Rating
Quick actions

Actions:

Open
Edit
Delete
Duplicate
Share

Add:

Search
Sorting
Filtering
INSIDE EACH TRIP (TRIP WORKSPACE)

When user opens a trip, create a complete travel workspace with tabs/sidebar navigation.

INNER SECTIONS OF EACH TRIP
1. Budget Section

Display:

Total budget
Remaining budget
Daily expenses
Expense categories

Categories:

Stay
Food
Activities
Shopping
Transport

Visuals:

Pie chart
Bar graph
Spending analytics

Include:

Budget alerts
Overspending warnings
Currency converter
2. Itinerary Section

Create an advanced itinerary planner.

Features:

Day-wise schedule
Timeline mode
Calendar mode
Activities
Notes
Hotel placeholders
Restaurant placeholders
Travel routes

Include:

Drag-and-drop activities
Time slots
Map integration
Estimated travel durations
3. Packing Section

Build a smart packing checklist.

Features:

Add/remove items
Mark packed/unpacked
Progress tracker

Categories:

Clothes
Electronics
Documents
Essentials
Toiletries

AI Suggestions:

Weather-based packing
Region-based recommendations
4. Transport Section

Display transport information for that trip region.

Include:

Flights placeholder
Train options
Metro/subway details
Bus routes
Cab suggestions
Local transport guides

Features:

Estimated travel cost
Travel durations
Route maps
5. Discover Region Section

Create a discovery/explore section for the trip destination.

Display:

Tourist attractions
Famous restaurants
Hidden gems
Cultural places
Adventure activities
Local events

Include:

Photos
Ratings
Save-to-trip button
Interactive maps
6. Safety Details Section

Provide travel safety information.

Display:

Emergency numbers
Safe/unsafe zones
Weather alerts
Travel advisories
Health precautions
Scam alerts
Local rules/tips

Include:

Safety score
Real-time alerts placeholder
7. Insights Section

Create AI-powered travel insights.

Show:

Best time to visit
Budget optimization tips
Crowd prediction
Weather insights
Food recommendations
Local customs
Currency insights
Trip analytics

AI should provide:

Smart recommendations
Suggested improvements
Personalized travel tips
DATABASE REQUIREMENTS

Use PostgreSQL relational database.

Tables:

Users
Trips
Trip Stops
Budgets
Activities
Packing Items
Transport Info
Safety Data
Notes
Insights
Ratings

Use proper relationships and normalization.

UI/UX REQUIREMENTS

The entire application should:

Be fully responsive
Work on desktop/tablet/mobile
Use smooth animations
Have modern SaaS-style dashboards
Include loading skeletons
Use elegant typography
Have sticky navigation
Support dark/light mode
PERFORMANCE REQUIREMENTS

Optimize for:

Fast loading
SEO
Accessibility
Mobile performance
Lazy loading
Image optimization