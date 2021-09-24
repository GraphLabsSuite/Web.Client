import {VariantWithAnswer} from "./generateStruct";

export function generateGraphVE(struct: VariantWithAnswer | undefined, vertexAmount: number, edgesAmount: number): VariantWithAnswer<"graph"> | VariantWithAnswer<"n-graphs"> {
    const pairs = Array.from(Array(vertexAmount).keys())
        .map(v1 => Array.from(Array(vertexAmount).keys()).filter(v => v > v1).map(v2 => [v1,v2]))
        .reduce((arr1, arr2) => arr1.concat(arr2))
        .sort(() => Math.random() - 0.5).slice(0, edgesAmount);
    if (struct) {
        switch (struct.task.type) {
            case "graph": {
                return {
                    answer: struct.answer,
                    task: {
                        type: "n-graphs",
                        value: {
                            count: 2,
                            graphs: [
                                struct.task.value,
                                {
                                    vertices: Array.from(Array(vertexAmount).keys()).map(e => `${e}`),
                                    edges: pairs.map((pair,key) => ({
                                        source: `${pair[0]}`,
                                        target: `${pair[1]}`,
                                            value: `${key}`
                                    }))
                                }
                            ]
                        }
                    }
                }
            }
            case "n-graphs": {
                return {
                    answer: struct.answer,
                    task: {
                        type: "n-graphs",
                        value: {
                            count: struct.task.value.count + 1,
                            graphs: struct.task.value.graphs.concat({
                                vertices: Array.from(Array(vertexAmount).keys()).map(e => `${e}`),
                                edges: pairs.map((pair,key) => ({
                                    source: `${pair[0]}`,
                                    target: `${pair[1]}`,
                                    value: `${key}`
                                }))
                            })
                        }
                    }
                }
            }
            default: {
                throw Error("К данной структуре нельзя добавить структуру графа!");
            }
        }
    } else {
        return {
            answer: "answer",
            task: {
                type: "graph",
                value: {
                    vertices: Array.from(Array(vertexAmount).keys()).map(e => `${e}`),
                    edges: pairs.map((pair,key) => ({
                        source: `${pair[0]}`,
                        target: `${pair[1]}`,
                        value: `${key}`
                    }))
                }
            }
        }
    }
}

export function generateAnswerGraphVE(struct: VariantWithAnswer | undefined, vertexAmount: number, edgesAmount: number): VariantWithAnswer {
    const pairs = Array.from(Array(vertexAmount).keys())
        .map(v1 => Array.from(Array(vertexAmount).keys()).filter(v => v > v1).map(v2 => [v1,v2]))
        .reduce((arr1, arr2) => arr1.concat(arr2))
        .sort(() => Math.random() - 0.5).slice(0, edgesAmount);
    if (struct) {
        return {
            answer: {
                type: "graph",
                value: {
                    vertices: Array.from(Array(vertexAmount).keys()).map(e => `${e}`),
                    edges: pairs.map((pair,key) => ({
                        source: `${pair[0]}`,
                        target: `${pair[1]}`,
                        value: `${key}`
                    }))
                }
            },
            task: struct.task
        }
    }
    else {
        return {
            answer: {
                type: "graph",
                value: {
                    vertices: Array.from(Array(vertexAmount).keys()).map(e => `${e}`),
                    edges: pairs.map((pair,key) => ({
                        source: `${pair[0]}`,
                        target: `${pair[1]}`,
                        value: `${key}`
                    }))
                }
            },
            task: {
                type: "type",
                value: "value"
            }
        }
    }
}