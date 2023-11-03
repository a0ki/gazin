import './globals.css';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import Providers from './lib/Providers';

export const metadata = {
  title: 'GazinTech',
  description: 'Developers Dashboard',
};

export default async function RootLayout({ children }) {
  return (
    <html lang='pt-BR' className='h-full bg-gray-50 bg-image'>
      <body className='h-full'>
        <ToastContainer
          position='top-right'
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick={true}
          rtl={false}
          pauseOnFocusLoss={false}
          draggable={false}
          pauseOnHover={false}
          theme='light'
        />
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}