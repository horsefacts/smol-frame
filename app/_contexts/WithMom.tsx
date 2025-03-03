'use client';

import {farcasterFrame} from '@farcaster/frame-wagmi-connector';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import {createConfig, fallback, http} from '@wagmi/core';
import {Fragment} from 'react';
import {WagmiProvider} from 'wagmi';

import {WithTokenList} from '@lib/contexts/WithTokenList';
import {networks} from '@lib/utils/tools.chains';

import type {ReactElement} from 'react';
import type {Chain} from 'viem';
import type {State} from 'wagmi';

export function withRPC(network: Chain): ReturnType<typeof fallback> {
	const httpTransport: string[] = [];

	const newRPC = process.env.RPC_URI_FOR?.[network.id] || '';
	const newRPCBugged = process.env[`RPC_URI_FOR_${network.id}`];
	const oldRPC = process.env.JSON_RPC_URI?.[network.id] || process.env.JSON_RPC_URL?.[network.id];
	const defaultJsonRPCURL = network?.rpcUrls?.public?.http?.[0];
	const injectedRPC = newRPC || oldRPC || newRPCBugged || defaultJsonRPCURL || '';

	if (injectedRPC) {
		httpTransport.push(injectedRPC);
	}
	if (network?.rpcUrls['alchemy']?.http[0] && process.env.ALCHEMY_KEY) {
		httpTransport.push(`${network?.rpcUrls['alchemy'].http[0]}/${process.env.ALCHEMY_KEY}`);
	}
	if (network?.rpcUrls['infura']?.http[0] && process.env.INFURA_PROJECT_ID) {
		httpTransport.push(`${network?.rpcUrls['infura'].http[0]}/${process.env.INFURA_PROJECT_ID}`);
	}
	if (!network.rpcUrls.default) {
		network.rpcUrls.default = {http: [], webSocket: []};
	}
	const defaultHttp = [...new Set([...httpTransport, ...(network.rpcUrls.default?.http || [])].filter(Boolean))];

	return fallback(defaultHttp.map(rpc => http(rpc)));
}

const allTransports: Record<number, ReturnType<typeof fallback>> = {};
for (const chain of networks) {
	allTransports[chain.id] = withRPC(chain);
}

type TWithMom = {
	children: ReactElement;
	initialState?: State;
	defaultNetwork?: Chain;
	supportedChains: Chain[];
	tokenLists?: string[];
};

const queryClient = new QueryClient();

export const config = createConfig({
	chains: [networks[0], ...networks.slice(1)],
	transports: allTransports,
	connectors: [farcasterFrame()]
});

function WithMom({children, tokenLists, initialState}: TWithMom): ReactElement {
	function isIframe(): boolean {
		if (typeof window === 'undefined') {
			return false;
		}
		if (
			window !== window.top ||
			window.top !== window.self ||
			(document?.location?.ancestorOrigins || []).length !== 0
		) {
			return true;
		}
		return false;
	}

	return (
		<WagmiProvider
			config={config}
			reconnectOnMount={!isIframe()}
			initialState={initialState}>
			<QueryClientProvider client={queryClient}>
				<WithTokenList lists={tokenLists}>
					<Fragment>{children}</Fragment>
				</WithTokenList>
			</QueryClientProvider>
		</WagmiProvider>
	);
}

export {WithMom};
