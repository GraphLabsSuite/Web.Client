import {generateMatrix, generateAnswerMatrix} from "./generateMatrix";
import {generateGraphVE, generateAnswerGraphVE} from "./generateGraphVE";
import {generateGraphV, generateAnswerGraphV} from "./generateGraphV";

export interface VariantWithAnswer<Type extends "graph" | "n-graphs" | "matrix" | "n-matrices" | "type" = "graph" | "n-graphs" | "matrix" | "n-matrices" | "type"> {
    task: VariantStruct<Type>,
    answer: any
}

export type VariantStruct<T extends "graph" | "n-graphs" | "matrix" | "n-matrices" | "type"> =
    T extends "graph" ? {
            type: "graph",
            value: Graph
        } :
        T extends "n-graphs" ? {
                type: "n-graphs",
                value: {
                    count: number,
                    graphs: Graph[]
                }
            } :
            T extends "matrix" ? {
                    type: "matrix",
                    value: Matrix
                } :
                T extends "n-matrices" ? {
                        type: "n-matrices",
                        value: {
                            count: number,
                            matrices: Matrix[]
                        }
                    }:
                    T extends "type" ? {
                        type: "type",
                        value: "value"
                        } :  {
                            type: T
                            }

export interface Graph {
    vertices: string[],
    edges: Array<{
        source: string,
        target: string,
        value?: string
    }>
}

export interface Matrix {
    rows: string[],
    columns: string[],
    elements: string[][]
}

export function getJSON(currentStruct: string, structToGenerate: string, vertexAmount: number, edgesAmount: number, isAnswer: boolean) {
    let struct: VariantWithAnswer | undefined;
    try {
        struct = JSON.parse(currentStruct);
    } catch (e) {
        // Do nothing
    }
    if (isAnswer) {
        switch (structToGenerate) {
            case "graphV": {
                return JSON.stringify(generateAnswerGraphV(struct, vertexAmount, edgesAmount), null, 1);
            }
            case "graphVE": {
                return JSON.stringify(generateAnswerGraphVE(struct, vertexAmount, edgesAmount), null, 1);
            }
            case "matrix": {
                return JSON.stringify(generateAnswerMatrix(struct, vertexAmount, edgesAmount, false), null, 1);
            }
            case "symMatrix": {
                return JSON.stringify(generateAnswerMatrix(struct, vertexAmount, edgesAmount, true), null, 1);
            }
            default: {
                return "Здесь еще ничего нет";
            }
        }
    }
    else {
        switch (structToGenerate) {
            case "graphV": {
                return JSON.stringify(generateGraphV(struct, vertexAmount, edgesAmount), null, 1);
            }
            case "graphVE": {
                return JSON.stringify(generateGraphVE(struct, vertexAmount, edgesAmount), null, 1);
            }
            case "matrix": {
                return JSON.stringify(generateMatrix(struct, vertexAmount, edgesAmount, false), null, 1);
            }
            case "symMatrix": {
                return JSON.stringify(generateMatrix(struct, vertexAmount, edgesAmount, true), null, 1);
            }
            default: {
                return "Здесь еще ничего нет";
            }
        }
    }

}