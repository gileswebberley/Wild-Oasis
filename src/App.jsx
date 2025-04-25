import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
//now let's setup react-query, a bit like setup for Redux or ContextAPI
import {
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';
// import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import toast, { Toaster } from 'react-hot-toast';
import { lazy, Suspense } from 'react';
import { DarkModeProvider } from './context/DarkModeContext';

import GlobalStyles from './styles/GlobalStyles';
import GuestLayout from './ui/GuestLayout';
import SpinnerFullPage from './ui/SpinnerFullPage';
import Welcome from './pages/Welcome';
//Lazy load as much as possible to make performance better
//Frontend (public) components
const CreateGuest = lazy(() => import('./pages/CreateGuest'));
const ConfirmBooking = lazy(() => import('./pages/ConfirmBooking'));
const CabinDetails = lazy(() => import('./pages/CabinDetails'));
const CompleteBooking = lazy(() => import('./pages/CompleteBooking'));
const ProtectedRoute = lazy(() => import('./ui/ProtectedRoute'));
//Backend components
const AppLayout = lazy(() => import('./ui/AppLayout'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Account = lazy(() => import('./pages/Account'));
const Bookings = lazy(() => import('./pages/Bookings'));
const Cabins = lazy(() => import('./pages/Cabins'));
const Login = lazy(() => import('./pages/Login'));
const PageNotFound = lazy(() => import('./pages/PageNotFound'));
const Settings = lazy(() => import('./pages/Settings'));
const Users = lazy(() => import('./pages/Users'));
const Booking = lazy(() => import('./pages/Booking'));
const Checkin = lazy(() => import('./pages/Checkin'));

//now let's continue the setup of react-query
const queryClient = new QueryClient({
  //recommended error handling
  queryCache: new QueryCache({
    onError: (error, query) => {
      if (query.state.data !== undefined) {
        toast.error(
          `Something went wrong with data-fetching: ${error.message}`
        );
      }
    },
  }),
  defaultOptions: {
    queries: {
      //amount of time before data is refetched
      staleTime: 2000,
    },
  },
});

function App() {
  //as we are not using the data loading features of React-Router we'll go back to the declaritive style of route setup (like in world-wise rather than the fast-react-pizza)
  return (
    <>
      {/* Just like with other state management libraries we'll wrap the whole application in our new React(Tanstack)-Query query client */}
      <QueryClientProvider client={queryClient}>
        {/* Also, we've now npm installed the devtools so we can add it as a sibling component (this creates a little icon on our page which we can click to open) */}
        {/* <ReactQueryDevtools initialIsOpen={false} /> */}
        {/* Now we are implementing dark mode through a context provider implementation */}
        <DarkModeProvider>
          {/* Let's break up the loading with the suspense stategy */}
          {/* add our styles as a sibling component to our routes so it's available throughout the application */}
          <GlobalStyles />
          <Suspense fallback={<SpinnerFullPage />}>
            <BrowserRouter>
              <Routes>
                <Route element={<GuestLayout />}>
                  <Route index element={<Navigate replace to="welcome" />} />
                  <Route path="welcome" element={<Welcome />} />
                  <Route path="guest" element={<CreateGuest />} />
                  <Route path="cabin-details" element={<CabinDetails />} />
                  <Route
                    path="booking-details/:cabinId"
                    element={<CompleteBooking />}
                  />
                  <Route
                    path="confirm-booking/:cabinId"
                    element={<ConfirmBooking />}
                  />
                  {/* <Route path="dbtest" element={<DBTest />} />
                  <Route path="dbtest2" element={<DBTest2 />} /> */}
                </Route>
                {/* We're going to wrap these routes in a protected one now that we have started to implement authentication */}
                <Route
                  element={
                    <ProtectedRoute>
                      <AppLayout />
                    </ProtectedRoute>
                  }
                >
                  {/* <Route index element={<Navigate replace to="dashboard" />} /> */}
                  <Route path="dashboard" element={<Dashboard />} />
                  <Route path="bookings" element={<Bookings />} />
                  <Route path="bookings/:bookingId" element={<Booking />} />
                  <Route path="checkin/:bookingId" element={<Checkin />} />
                  <Route path="cabins" element={<Cabins />} />
                  <Route path="users" element={<Users />} />
                  <Route path="settings" element={<Settings />} />
                  <Route path="account" element={<Account />} />
                </Route>
                <Route path="login" element={<Login />} />
                <Route path="*" element={<PageNotFound />} />
              </Routes>
            </BrowserRouter>
          </Suspense>
          {/* For the more attractive notifications we have installed react-hot-toast package */}
          <Toaster
            position="top-center"
            gutter={8}
            containerStyle={{ margin: '8px' }}
            toastOptions={{
              success: {
                duration: 5000,
                style: {
                  backgroundColor: 'var(--color-green-700)',
                  color: 'var(--color-green-100)',
                },
              },
              error: {
                duration: 5000,
                style: {
                  backgroundColor: 'var(--color-red-800)',
                  color: 'var(--color-red-100)',
                },
              },
              style: {
                textAlign: 'center',
                lineHeight: '130%',
                fontSize: '16px',
                maxWidth: '400px',
                padding: '16px 24px',
                backgroundColor: 'var(--color-grey-800)',
                color: 'var(--color-grey-50)',
              },
            }}
          />
        </DarkModeProvider>
      </QueryClientProvider>
    </>
  );
}

export default App;
