import React from 'react';
import { RouterProvider } from 'react-router';
import { router } from './routes';
import { AuthProvider }  from './context/AuthContext';
import { TripProvider }  from './context/TripContext';
import { TripsProvider } from './context/TripsContext';
import { AIProvider }    from './context/AIContext';

export default function App() {
  return (
    <AuthProvider>
      <AIProvider>
        <TripsProvider>
          <TripProvider>
            <RouterProvider router={router} />
          </TripProvider>
        </TripsProvider>
      </AIProvider>
    </AuthProvider>
  );
}
