import Providers from './providers';
import { ReactNode } from 'react';

export const metadata = {
  title: 'Next.js Todo App',
  description: 'A Todo List application using Next.js and NestJS',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
