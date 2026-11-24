import { Suspense } from 'react';
import { Provider } from 'react-redux';
import { RouterProvider } from 'react-router-dom';
import { router } from '@/app/router';
import { ThemeSync } from '@/components/layout/ThemeSync';
import { PageSkeleton } from '@/components/ui/Skeleton';
import { ToastProvider } from '@/components/ui/Toast';
import { store } from '@/store/store';

export default function App() {
  return (
    <Provider store={store}>
      <ToastProvider>
        <ThemeSync />
        <Suspense fallback={<PageSkeleton />}>
          <RouterProvider router={router} />
        </Suspense>
      </ToastProvider>
    </Provider>
  );
}
