import {headers} from 'next/headers';
import {cookieToInitialState} from 'wagmi';

import {config} from '@lib/contexts/WithMom';
import Providers from 'app/Providers';

import '../style.css';

import type {Metadata} from 'next';
import type {ReactNode} from 'react';

const frame = {
	version: 'next',
	imageUrl: 'https://smol-frame.vercel.app/og.png',
	button: {
		title: 'Launch',
		action: {
			type: 'launch_frame',
			name: 'Smol Frame',
			url: 'https://smol-frame.vercel.app/',
			iconImageUrl: 'https://smol-frame.vercel.app/avatar.png',
			splashImageUrl: 'https://smol-frame.vercel.app/avatar.png',
			splashBackgroundColor: '#ffffff'
		}
	}
};

export async function generateMetadata(): Promise<Metadata> {
	return {
		metadataBase: new URL('https://smol-frame.vercel.app/'),
		title: 'Smol Frame',
		openGraph: {
			title: 'Smol Frame',
			description: 'Simple, smart and elegant dapps, designed to make your crypto journey a little bit easier.',
			images: 'https://smol-frame.vercel.app/og.png'
		},
		other: {
			// eslint-disable-next-line @typescript-eslint/naming-convention
			'fc:frame': JSON.stringify(frame)
		}
	};
}

export default async function RootLayout(props: {children: ReactNode}): Promise<ReactNode> {
	const initialState = cookieToInitialState(config, (await headers()).get('cookie'));

	return (
		<html
			lang={'en'}
			className={'scrollbar-none'}
			suppressHydrationWarning>
			<head>
				<link
					rel={'preconnect'}
					href={'https://fonts.googleapis.com'}
				/>
				<link
					rel={'preconnect'}
					href={'https://fonts.gstatic.com'}
					crossOrigin={'anonymous'}
				/>
			</head>
			<body className={'bg-neutral-200 font-sans transition-colors duration-150'}>
				<main className={'flex h-app flex-col'}>
					<Providers initialState={initialState}>
						<div className={'mx-auto mt-10 w-full max-w-6xl'}>{props.children}</div>
					</Providers>
				</main>
			</body>
		</html>
	);
}
