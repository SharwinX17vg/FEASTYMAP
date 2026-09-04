# FEASTYMAP

### Smart City Exploration and Outing Planning Platform
FEASTYMAP is a modern platform for discovering food and entertainment destinations, exploring locations through an interactive map, and creating personalized outing plans based on preferences, budget, duration, transportation, and group requirements.



## Tech Stack

| Technology | Purpose |
| --- | --- |
| Next.js 15 | Web application framework |
| React 19 | User interface |
| TypeScript | Type-safe development |
| Tailwind CSS | Responsive styling |
| Leaflet | Interactive maps |
| OpenStreetMap | Map data |
| Node.js | Runtime environment |
| Git & GitHub | Version control |



## Key Features

- **Interactive Map:** Explore restaurants, cafes, malls, parks, bars, dessert destinations, street food, and events with category filtering and time-based discovery.
- **Smart Outing Planner:** Build plans around group size, budget, duration, return time, cuisine, flavor preferences, and transportation method.
- **Group Planning:** Combine preferences from multiple people to create an outing plan suited to the group.
- **Personalized Itinerary:** Organize destinations, timings, travel information, estimated costs, and per-person expenses in one structured plan.
- **Budget Management:** Track estimated spending, transportation costs, remaining budget, category-wise expenses, and per-person cost.
- **Offers and Events:** Discover available offers and upcoming events while planning an outing.
- **Time-Based Discovery:** Find places relevant to the selected time of day.

## Screenshots

![FEASTYMAP Explore](./screenshots/explore.png)

![FEASTYMAP Interactive Map](./screenshots/interactive-map.png)

![FEASTYMAP Outing Planner](./screenshots/outing-planner.png)

![FEASTYMAP Group Planning](./screenshots/group-planning.png)

![FEASTYMAP Itinerary](./screenshots/itinerary.png)

## Architecture

FEASTYMAP uses the Next.js App Router and a component-based architecture. Page-level experiences are organized under `src/app`, reusable interface elements under `src/components`, shared data and utilities under `src/lib`, and global styling under `src/styles`.

```text
FEASTYMAP/
├── src/
│   ├── app/
│   │   ├── interactive-map/
│   │   └── outing-planner/
│   ├── components/
│   ├── lib/
│   └── styles/
├── public/
├── package.json
├── next.config.mjs
└── README.md
```

### Application Flow

```text
User Preferences
   ↓
Outing Planner
   ↓
Recommendation and Planning Logic
   ↓
Destination Selection
   ↓
Time, Budget and Transportation Analysis
   ↓
Personalized Itinerary
```

## Installation

### Prerequisites

- Node.js
- npm
- Git

### Clone Repository

```bash
git clone https://github.com/SharwinX17vg/FEASTYMAP.git
cd FEASTYMAP
```

### Install Dependencies

```bash
npm install
```

### Run Locally

```bash
npm run dev
```

Open [http://localhost:4028](http://localhost:4028) in your browser.

## Environment Variables

Place project-specific environment variables in a local `.env` file. Keep sensitive credentials private and do not commit them to the repository.

```env
NEXT_PUBLIC_API_URL=your_api_url
API_KEY=your_api_key
```

## Available Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the development server on port 4028 |
| `npm run build` | Create a production build |
| `npm run start` | Start the Next.js server on port 4028 |
| `npm run lint` | Run the project linter |
| `npm run format` | Format source and configuration files |

## Project Vision

FEASTYMAP aims to bring location discovery, food and entertainment exploration, events, offers, personalized planning, route considerations, and budget management into one unified outing-planning experience.

## Future Scope

- Advanced recommendation systems
- Real-time business and event information
- Route optimization
- User accounts and personalization
- Saved places and favorites
- Reviews and ratings
- Business and community features



