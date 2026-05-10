import React from 'react';
import { createBrowserRouter, Navigate } from 'react-router';
import { MainLayout }     from './layouts/MainLayout';
import { Login }          from './pages/Login';
import { Dashboard }      from './pages/Dashboard';
import { MyTrips }        from './pages/MyTrips';
import { TripWorkspace }  from './pages/TripWorkspace';
import { Profile }        from './pages/Profile';
import { Community }      from './pages/Community';
import { PlanSelection }  from './pages/PlanSelection';
import { AIGenerator }    from './pages/AIGenerator';
import { CustomBuilder }  from './pages/CustomBuilder';
import { AIStudio }       from './pages/AIStudio';
import { Itinerary }      from './pages/Itinerary';
import { Budget }         from './pages/Budget';
import { Packing }        from './pages/Packing';
import { Notes }          from './pages/Notes';
import { Insights }       from './pages/Insights';
import { Tools }          from './pages/Tools';
import { Transport }      from './pages/Transport';
import { Discover }       from './pages/Discover';
import { LocalServices }  from './pages/LocalServices';

export const router = createBrowserRouter([
  // ── Auth (no layout) ──────────────────────────────────────────────────────
  {
    path: '/login',
    Component: Login,
  },

  // ── App (main layout) ─────────────────────────────────────────────────────
  {
    path: '/',
    Component: MainLayout,
    children: [
      { index: true,              Component: Dashboard       },

      // Core screens
      { path: 'plan',             Component: PlanSelection   },
      { path: 'plan/ai',          Component: AIGenerator     },
      { path: 'plan/custom',      Component: CustomBuilder   },
      { path: 'trips',            Component: MyTrips         },
      { path: 'trips/:id',        Component: TripWorkspace   },
      { path: 'community',        Component: Community       },
      { path: 'profile',          Component: Profile         },

      // Supporting tools (accessible via sidebar quick links)
      { path: 'itinerary',        Component: Itinerary       },
      { path: 'budget',           Component: Budget          },
      { path: 'packing',          Component: Packing         },
      { path: 'notes',            Component: Notes           },
      { path: 'ai-studio',        Component: AIStudio        },
      { path: 'insights',         Component: Insights        },
      { path: 'tools',            Component: Tools           },
      { path: 'transport',        Component: Transport       },
      { path: 'discover',         Component: Discover        },
      { path: 'local',            Component: LocalServices   },

      { path: '*',                Component: () => <Navigate to="/" replace /> },
    ],
  },
]);
