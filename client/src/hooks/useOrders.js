import { useContext } from "react";
import {AdminContext} from "@/context/AdminContext";

export const useOrders = () => useContext(AdminContext);
