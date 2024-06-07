import { useEffect, useState } from "react";
import { useTonClient } from "./useTonClient";
import { Address, OpenedContract, toNano } from "ton-core";
import { useAsyncInitialize } from "./useAsyncInitialize";
import { MainContract } from "../MainContract";
import { useTonConnect } from "./useTonconnect";


export function useMainContract(){
    const client = useTonClient();
    const {sender} = useTonConnect(); 

    const sleep = (time: number) => new Promise((resolve) => {
        setTimeout(resolve, time)
    })

    const [contractData, setContractData ] = useState<null | {
        counter_value: number,
        recent_sender: Address,
        owner_address: Address,
    }>();   

    const [contractBalance, setContractBalance] = useState<null | number>();

    const mainContract = useAsyncInitialize(async () => {
        if(!client) return;
        const contract = new MainContract(Address.parse("EQBg3dF9PhxC7OtjKzTRxPL1E_IDN9j4hBNX95TWtI96UgWL"));
        return client.open(contract) as OpenedContract<MainContract>;
    }, [client]);

    useEffect(()=> {
        async function getValue(){
            if(!mainContract) return;
            setContractData(null);
            const {number, recent_sender, owner_address} = await mainContract.getData();
            const {balance} = await mainContract.getBalance();
            setContractData({
                counter_value: number,
                recent_sender,
                owner_address
            })
            setContractBalance(balance)
            await sleep(10000);
            getValue();
        }
        getValue();
    }, [mainContract])

    return({
        contract_address: mainContract?.address.toString(),
        contract_balance: contractBalance,
        ...contractData,
        sendIncrement: async () => {
            return mainContract?.sendIncreament(sender, toNano("0.05"), 5)
        },
        sendDeposit: async () => {
            return mainContract?.sendDeposit(sender, toNano("1") )
        },
        sendWithdrawalRequest: async () => {
            return mainContract?.sendWithdrawalRequest(sender, toNano("0.5"), toNano("2"))
        }
    })
}