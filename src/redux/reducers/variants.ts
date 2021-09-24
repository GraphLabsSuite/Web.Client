import {IPageableState} from "../../types/redux";
import {Reducer} from "redux";
import {createAsyncReducer} from "./asyncReducer";
import {actions} from "../actions";
import {ModuleData} from "./modules";

export interface VariantsData {
    id: number,
    name: string,
    variantData: string
    taskModule: ModuleData
}

export interface VariantsState extends IPageableState<VariantsData> {}


export const reducer: Reducer<VariantsState> = createAsyncReducer<VariantsState>({
    pending: actions['getVariantListAsyncStart'],
    fail: actions['getVariantListAsyncFail'],
    success: actions['getVariantListAsyncSuccess']
});