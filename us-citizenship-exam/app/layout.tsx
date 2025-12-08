import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

export const metadata: Metadata = {
	title: 'Naturalization Practice Hub',
	description: 'Practice for the U.S. naturalization test'
};

const inter = Inter({ 
	subsets: ['latin'], 
	display: 'swap',
	variable: '--font-inter',
	preload: true,
});

export default function RootLayout({
	children
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en" suppressHydrationWarning>
			<body suppressHydrationWarning className={`gradient-bg text-slate-900 antialiased ${inter.className} ${inter.variable} font-sans`}>
				{children}
			</body>
		</html>
	);
}
