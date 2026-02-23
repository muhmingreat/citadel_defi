'use client';

import * as React from 'react';
import '@rainbow-me/rainbowkit/styles.css';
import {
    getDefaultConfig,
    RainbowKitProvider,
    darkTheme,
} from '@rainbow-me/rainbowkit';
import { WagmiProvider } from 'wagmi';
import {
    mainnet,
    bsc,
    bscTestnet,
    base,
} from 'wagmi/chains';
import {
    QueryClientProvider,
    QueryClient,
} from '@tanstack/react-query';
import { http } from 'wagmi';

const config = getDefaultConfig({
    appName: 'Citadel DeFi',
    projectId: process.env.NEXT_PUBLIC_PROJECT_ID || 'd168d18408f6d89569607ebc629fb665',
    chains: [bscTestnet, bsc, mainnet, base],
    ssr: true,
    transports: {
        [bscTestnet.id]: http('/api/rpc'), // Use local proxy
        [bsc.id]: http(),
        [mainnet.id]: http(),
        [base.id]: http(),
    },
});

const queryClient = new QueryClient();

export function Web3Provider({ children }: { children: React.ReactNode }) {
    return (
        <WagmiProvider config={config}>
            <QueryClientProvider client={queryClient}>
                <RainbowKitProvider
                    theme={darkTheme({
                        accentColor: '#10B981', // emerald-500
                        accentColorForeground: 'white',
                        borderRadius: 'medium',
                        fontStack: 'system',
                        overlayBlur: 'small',
                    })}
                >
                    {children}
                </RainbowKitProvider>
            </QueryClientProvider>
        </WagmiProvider>
    );
}
