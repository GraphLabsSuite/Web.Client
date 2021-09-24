import {Dispatch} from "redux";
import {actions} from "./index";
import api from "../../api";


export const variants = {
    getVariants: (moduleId?: number | string) => {
        return (dispatch: Dispatch) => {
            dispatch(actions['getVariantListAsyncStart']());
            api.getVariantList(moduleId)
                .then((res) => {
                    const data = res.getOrElse({value: []});
                    if (data.value) {
                        dispatch(actions['getVariantListAsyncSuccess']({data: data.value}));
                    } else {
                        dispatch(actions['getVariantListAsyncFail']());
                    }
                })
                .catch(() => {
                    dispatch(actions['getVariantListAsyncFail']());
                });
        };
    },
    saveVariant: (data: any, name: string, moduleId: string, id?: string) => {
        return (dispatch: Dispatch) => {
            dispatch(actions['editVariantAsyncStart']());
            api.saveVariant({
                data,
                meta: {
                    name,
                    moduleId,
                    id
                }
            }).then(() => {
                dispatch(actions['editVariantAsyncSuccess']());
            }).catch(() => {
                dispatch(actions['editVariantAsyncFail']());
            });
        }
    },
    _deleteVariant: (id: number, filter?: string | number) => {
        return (dispatch: Dispatch) => {
            dispatch(actions['deleteVariantAsyncStart']());
            api.deleteVariant(id)
                .then(() => {
                    dispatch(actions['deleteVariantAsyncSuccess']());
                    if (filter) {
                        variants.getVariants(filter)(dispatch);
                    } else {
                        variants.getVariants()(dispatch);
                    }
                })
                .catch(() => {
                    dispatch(actions['deleteVariantAsyncFail']())
                });
        }
    }
};