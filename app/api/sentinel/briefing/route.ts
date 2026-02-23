import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        const { volatility, mode, query } = await req.json();

        // In a production environment, this would call an LLM (OpenAI/Google Gemini)
        // For this hackathon/demo, we use an advanced context-aware generator 
        // that simulates real AI reasoning based on protocol state.

        let status = "System Nominal";
        let rationaleFragments: string[] = [];
        let briefingFragments: string[] = [];

        // 1. Define Intent Fragments
        const intents = [
            {
                keys: ['risk', 'volatility', 'safe', 'danger', 'panic'],
                getFragment: () => volatility > 65
                    ? `Neural sensors detect CRITICAL turbulence (${volatility}%). I have engaged the Deep Fortress protocol.`
                    : `Market entropy is within nominal parameters (${volatility}%). Defensive shields are on standby.`,
                rationale: "Risk telemetry analyzed."
            },
            {
                keys: ['strategy', 'yield', 'apy', 'growth', 'fortress', 'mode'],
                getFragment: () => mode === 'growth'
                    ? `The system is in GROWTH configuration, stacking yields for maximum capital efficiency.`
                    : `We are currently in FORTRESS mode, prioritizing capital preservation over yield exposure.`,
                rationale: "Strategic posture confirmed."
            },
            {
                keys: ['asterdex', 'anchor'],
                getFragment: () => mode === 'growth'
                    ? "AsterDEX Hyper-LPs are utilized for high-frequency liquidity mining."
                    : "Capital is anchored in the AsterDEX Safety Vault for 99.9% principal protection.",
                rationale: "AsterDEX routing verified."
            },
            {
                keys: ['pancake', 'swap', 'farm', 'cauliflower'], // cauliflower is a test key
                getFragment: () => mode === 'growth'
                    ? "PancakeSwap farms are yielding active boosters on BNB Chain."
                    : "PancakeSwap exposure has been restricted to mitigate volatility leakage.",
                rationale: "PancakeSwap farm status checked."
            },
            {
                keys: ['vault', 'funds', 'money', 'deposit', 'balance'],
                getFragment: () => `Vault integrity is verified. Current buffer stands at ${100 - volatility}%.`,
                rationale: "Vault health audit complete."
            }
        ];

        // 2. Synthesize Briefing based on Semantic Intent
        if (query) {
            const q = query.toLowerCase();
            intents.forEach(intent => {
                if (intent.keys.some(k => q.includes(k))) {
                    briefingFragments.push(intent.getFragment());
                    rationaleFragments.push(intent.rationale);
                }
            });

            if (briefingFragments.length === 0) {
                briefingFragments.push(`I am monitoring a ${volatility}% volatility index. Current orientation: ${mode.toUpperCase()}.`);
                rationaleFragments.push("General status sync.");
            }
        } else {
            // General Briefing Generator (Fallback/Default)
            if (volatility > 65) {
                status = "DEEP FORTRESS ENGAGED";
                briefingFragments.push("Market instability detected. Capital has been retracted to safety. Neural monitoring is at 100% frequency.");
                rationaleFragments.push("High turbulence auto-response.");
            } else {
                status = "GROWTH CHANNELS ACTIVE";
                briefingFragments.push("Market is stable. Capital is diversified across high-yield growth strategies.");
                rationaleFragments.push("Low volatility optimization.");
            }
        }

        // Simulate Neural Processing Delay
        await new Promise(resolve => setTimeout(resolve, 300 + Math.random() * 500));

        return NextResponse.json({
            briefing: `> ${briefingFragments.join(" ")}`,
            status: status,
            rationale: `Synthesized via Neural Lattice: ${rationaleFragments.join(" | ")}`,
            telemetry: {
                sync: "Nominal",
                logic: "Autonomous",
                response: `< ${Math.floor(Math.random() * 50) + 100}ms`,
                neuralWeight: (0.88 + Math.random() * 0.1).toFixed(4)
            }
        });

    } catch (error) {
        return NextResponse.json({ error: 'Sentinel Core Offline' }, { status: 500 });
    }
}
