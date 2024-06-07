import { Address, beginCell, Cell, Contract, contractAddress, ContractProvider, Sender, SendMode } from "ton-core";

// EQBg3dF9PhxC7OtjKzTRxPL1E_IDN9j4hBNX95TWtI96UgWL

export type MainContractConfig =  {
    number: number,
    address: Address,
    owner_address: Address
}

// Init config for first contract interaction
export function mainContractConfigToCell(config: MainContractConfig): Cell{
    return beginCell()
    .storeUint(config.number, 32)
    .storeAddress(config.address)
    .storeAddress(config.owner_address)
    .endCell();
}

export class MainContract implements Contract{
    constructor(
        readonly address: Address,
        readonly init?: {code: Cell; data: Cell}
    ){}

    static createFromConfig(config: MainContractConfig, code: Cell, workchain = 0){
        const data = mainContractConfigToCell(config);
        const init = {code, data};
        const address = contractAddress(workchain, init);

        return new MainContract(address, init);
    }


    async sendDeploy(provider: ContractProvider, via: Sender, value: bigint){
        await provider.internal(via, {
            value, sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell().storeUint(1, 32).endCell(),
        })
    }

    async sendIncreament(
        provider:ContractProvider,
        sender: Sender,
    value: bigint,
    increament_value: number
    ){
        const msg_body = beginCell().storeUint(1, 32).storeUint(increament_value, 32).endCell();
        await provider.internal(sender, {
            value, sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: msg_body,
        })
    }

    async sendDeposit(
        provider:ContractProvider,
        sender: Sender,
    value: bigint,
    ){
        const msg_body = beginCell().storeUint(2, 32).endCell(); // 2 - OPCODE
        await provider.internal(sender, {
            value, sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: msg_body,
        })
    }

    async sendNoDeposit(
        provider:ContractProvider,
        sender: Sender,
    value: bigint,
    ){
        const msg_body = beginCell().endCell(); // No OPCODE
        await provider.internal(sender, {
            value, sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: msg_body,
        })
    }

    async sendWithdrawalRequest(
        provider:ContractProvider,
        sender: Sender,
    value: bigint,
    amount: bigint
    ){
        const msg_body = beginCell()
        .storeUint(3, 32) // OP Code
        .storeCoins(amount).endCell(); 
        // ! value will be use for commission (gas fee)
        await provider.internal(sender, {
            value, 
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: msg_body,
        })
    }

    async getData(provider: ContractProvider){
        const {stack} = await provider.get("get_contract_storage", []);
    
        return {
            number: stack.readNumber(),
            recent_sender: stack.readAddress(),
            owner_address: stack.readAddress()
        }
    }

    async getBalance(provider: ContractProvider){
        const {stack} = await provider.get("getBalance", []);
    
        return {
            balance: stack.readNumber(),
        }
    }
}