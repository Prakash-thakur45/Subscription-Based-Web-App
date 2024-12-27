import { Inter } from 'next/font/google';
import Footer from '../components/footer/Footer';
import './globals.css';
import Navbar from '../components/navbar/Navbar';
import Script from 'next/script';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Login Page',
  description: 'Login Page For Website',
};

export default function RootLayout({ children }) {
  return (
        <>
        <html lang="en">
       <body className={inter.className}>
        <Navbar/>
        {children}
        <Footer/>
        </body>
        </html>
        <Script src="https://checkout.razorpay.com/v1/checkout.js"
          />
        </>
  );
}
