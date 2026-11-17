import { createContext, useContext } from "react";
export const LedgerEditingContext = createContext(null);
export const useLedgerEditing = () => useContext(LedgerEditingContext);
