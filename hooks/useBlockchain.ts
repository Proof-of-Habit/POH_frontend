import {
  useBlockNumber,
  useContract,
  useReadContract,
  useSendTransaction,
  useTransactionReceipt,
} from "@starknet-react/core";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Abi, Contract, RpcProvider } from "starknet";
export const POH_CONTRACT_ADDRESS =
  "0x076b83bb4ce5733ffe43ac19db3b310cd887af1e26fd4e3f653f68f383e10d5c";

// Utility function to perform contract read operations
export function useContractFetch(
  abi: Abi,
  functionName: string,
  args: any[] = []
) {
  const {
    data: readData,
    refetch: dataRefetch,
    isError: readIsError,
    isLoading: readIsLoading,
    error: readError,
    isFetching: readRefetching,
  } = useReadContract({
    abi: abi,
    functionName: functionName,
    address: POH_CONTRACT_ADDRESS,
    args: args,
    refetchInterval: 600000,
  });

  return {
    readData,
    dataRefetch,
    readIsError,
    readIsLoading,
    readError,
    readRefetching,
  };
}

// Utility function to perform contract write operations
export function useContractWriteUtility(
  functionName: string,
  args: any[],
  abi: Abi
) {
  const { contract } = useContract({ abi, address: POH_CONTRACT_ADDRESS });

  const calls = useMemo(() => {
    if (
      !contract ||
      !args ||
      args.some(
        (arg) => arg === undefined || arg === null || arg === "0x" || arg === ""
      )
    ) {
      return undefined;
    }

    return [contract.populate(functionName, args)];
  }, [contract, functionName, args]);

  console.log(calls, "this is the call");

  const {
    send: writeAsync,
    data: writeData,
    isPending: writeIsPending,
  } = useSendTransaction({ calls });

  const {
    isLoading: waitIsLoading,
    data: waitData,
    status: waitStatus,
    isError: waitIsError,
    error: waitError,
  } = useTransactionReceipt({
    hash: writeData?.transaction_hash,
    watch: true,
  });

  return {
    writeAsync,
    writeData,
    writeIsPending,
    waitIsLoading,
    waitData,
    waitStatus,
    waitIsError,
    waitError,
    calls,
  };
}

export function useContractWriteUtilityWithArgs(
  functionName: string,
  abi: Abi
) {
  const { contract } = useContract({ abi, address: POH_CONTRACT_ADDRESS });

  const writeWithArgs = async (args: any[]) => {
    console.log(args, "calling contract with args");
    let calls;

    if (
      !contract ||
      !args ||
      args.some(
        (arg) => arg === undefined || arg === null || arg === "0x" || arg === ""
      )
    ) {
      calls = undefined;
    } else {
      calls = [contract.populate(functionName, args)];
    }
    console.log(calls, "calls");

    const {
      send: writeAsync,
      data: writeData,
      isPending: writeIsPending,
    } = useSendTransaction({ calls });

    const {
      isLoading: waitIsLoading,
      data: waitData,
      status: waitStatus,
      isError: waitIsError,
      error: waitError,
    } = useTransactionReceipt({
      hash: writeData?.transaction_hash,
      watch: true,
    });

    return {
      writeData,
      writeIsPending,
      waitIsLoading,
      waitData,
      waitStatus,
      waitIsError,
      waitError,
    };
  };

  return { writeWithArgs };
}

// Utility function to get contract events
type ContractEvent = {
  from_address: string;
  keys: string[];
  data: string[];
};

export function useContractEvents(
  enabled: boolean = true,
  interval: number = 3000,
  limit: number = 5
) {
  const provider = useMemo(
    () => new RpcProvider({ nodeUrl: process.env.NEXT_PUBLIC_RPC_URL! }),
    []
  );
  const [events, setEvents] = useState<ContractEvent[]>([]);
  const lastCheckedBlockRef = useRef(0);
  const { data: blockNumber } = useBlockNumber({ refetchInterval: interval });

  const checkForEvents = useCallback(
    async (currentBlockNumber: number) => {
      if (
        !POH_CONTRACT_ADDRESS ||
        currentBlockNumber <= lastCheckedBlockRef.current
      ) {
        return;
      }

      try {
        const fromBlock = lastCheckedBlockRef.current + 1;
        const fetchedEvents = await provider.getEvents({
          address: POH_CONTRACT_ADDRESS,
          from_block: { block_number: fromBlock },
          to_block: { block_number: currentBlockNumber },
          chunk_size: 500,
        });

        if (fetchedEvents?.events?.length) {
          setEvents((prev) => [...prev, ...fetchedEvents.events]);
        }

        lastCheckedBlockRef.current = currentBlockNumber;
      } catch (error) {
        console.error("Error checking for events:", error);
      }
    },
    [POH_CONTRACT_ADDRESS, provider]
  );

  useEffect(() => {
    if (enabled && POH_CONTRACT_ADDRESS && blockNumber) {
      checkForEvents(blockNumber);
    }
  }, [POH_CONTRACT_ADDRESS, blockNumber, checkForEvents, enabled]);

  const lastEvents = useMemo(() => {
    return [...events].reverse().slice(0, limit);
  }, [events, limit]);

  return {
    events,
    lastEvents,
    total: events.length,
  };
}

export async function readContractFunctionWithStarknetJs(
  functionName: string,
  args: any[] = []
): Promise<any> {
  const provider = new RpcProvider({
    nodeUrl: process.env.NEXT_PUBLIC_RPC_URL,
  });

  // Get the contract ABI from the chain
  const { abi } = await provider.getClassAt(POH_CONTRACT_ADDRESS);
  if (!abi) {
    throw new Error("No ABI found for the contract.");
  }

  // Instantiate contract
  const contract = new Contract(abi, POH_CONTRACT_ADDRESS, provider);

  // Dynamically call the function
  if (typeof contract[functionName] !== "function") {
    throw new Error(
      `Function '${functionName}' does not exist on the contract.`
    );
  }

  const result = await contract[functionName](...args);
  return result;
}

export const fetchContentFromIPFS = async (cid: string) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_PINATA_GATEWAY_URL}${cid}?pinataGatewayToken=${process.env.NEXT_PUBLIC_PINATA_GATEWAY_TOKEN}`
    );
    const data = await response.json();

    return { ...data, cid: cid };
  } catch (error) {
    console.error(`Error fetching data for CID ${cid}:`, error);
    return null;
  }
};
