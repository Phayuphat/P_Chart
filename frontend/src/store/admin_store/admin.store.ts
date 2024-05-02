//adminstore.store.ts

import {create} from "zustand";
import { AdminForm } from "./interface/admin.interface";
export const AdminStore = create<AdminForm>((...args) => {
    const [set,get] = args;
    return{
        data:[],
        setdata(newDataArray){
            set({data:newDataArray});
        },
    };
});