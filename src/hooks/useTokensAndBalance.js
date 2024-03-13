import { tokens as tokenlist } from "../tokenlist.json";
import erc20Abi from "../abi/erc20.json";
import multicallAbi from "../abi/multicall2.json";
import {
    Contract,
    Interface,
    JsonRpcProvider,
    ZeroAddress,
    isAddress,
} from "ethers";
import { multicall2Address } from "../constants";
import { useEffect } from "react";
import { useMemo } from "react";
import { useState } from "react";

const mainnetTokens = tokenlist.filter((x) => x.chainId === 1);

const useTokensAndBalance = (address) => {
    const [tokens, setTokens] = useState([]);
    const tokenAddresses = useMemo(
        () => mainnetTokens.map((x) => x.address),
        []
    );

    const validAddress = useMemo(
        () => (isAddress(address) ? address : ZeroAddress),
        [address]
    );

    const intfce = useMemo(() => new Interface(erc20Abi), []);

    const calls = useMemo(
        () =>
            tokenAddresses.map((address) => ({
                target: address,
                callData: intfce.encodeFunctionData("balanceOf", [
                    validAddress,
                ]),
            })),
        [intfce, tokenAddresses, validAddress]
    );

    useEffect(() => {
        (async () => {
            const provider = new JsonRpcProvider(
                import.meta.env.VITE_mainnet_rpc_url
            );

            const multicall = new Contract(
                multicall2Address,
                multicallAbi,
                provider
            );

            // eslint-disable-next-line no-unused-vars
            const [_, balancesResult] = await multicall.aggregate.staticCall(
                calls
            );

            const decodedBalances = balancesResult.map((result) =>
                intfce.decodeFunctionResult("balanceOf", result).toString()
            );

            const newObj = mainnetTokens.map((token, index) => ({
                ...token,
                balance: decodedBalances[index],
            }));

            setTokens(newObj);
        })();
    }, [calls, intfce]);

    return { tokens, address: validAddress };
};

export default useTokensAndBalance;
