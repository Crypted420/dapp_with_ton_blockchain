import { TonClient } from "ton"
import { useAsyncInitialize } from "./useAsyncInitialize"
import { getHttpEndpoint } from "@orbs-network/ton-access"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const useTonClient = () => {
    return useAsyncInitialize(
        async () => 
        new TonClient({
            endpoint: await getHttpEndpoint({network: 'testnet'})
    })
);
}