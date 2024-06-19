import { atom, useAtom } from "jotai";

const networkAtom = atom('mainnet');
export const useNetwork = () => {
    return useAtom(networkAtom)[0];
}

const addressAtom = atom();
export const useAddress = () => {
    return useAtom(addressAtom);
}