import {VariantWithAnswer} from "./generateStruct";

export function generateMatrix(struct: VariantWithAnswer | undefined, vertexAmount: number, edgesAmount: number, isSym: boolean): VariantWithAnswer<"matrix"> | VariantWithAnswer<"n-matrices"> {
     const elements = Array.from(Array(vertexAmount))
        .map(() => Array.from(Array(edgesAmount).keys())
            .map(() => Math.round(Math.random())));
    if (isSym) {
        for (let i = 0; i < vertexAmount; i++) {
            for (let j = i; j < vertexAmount; j++) {
                (i === j) ? elements[i][j] = 0 : elements[i][j] = elements[j][i]
            }
        }
    }
    if (struct) {
        switch (struct.task.type) {
            case "matrix": {
                return {
                    answer: struct.answer,
                    task: {
                        type: "n-matrices",
                        value: {
                            count: 2,
                            matrices: [
                                struct.task.value,
                                {
                                    rows: Array.from(Array(vertexAmount).keys()).map(e => `${e}`),
                                    columns: Array.from(Array(edgesAmount).keys()).map(e => `${e}`),
                                    elements: elements.map(e => e.map(a => `${a}`))
                                }
                            ]
                        }
                    }
                }

            }
            case "n-matrices": {
                return {
                    answer: struct.answer,
                    task: {
                        type: "n-matrices",
                        value: {
                            count: struct.task.value.count + 1,
                            matrices: struct.task.value.matrices.concat({
                                rows: Array.from(Array(vertexAmount).keys()).map(e => `${e}`),
                                columns: Array.from(Array(edgesAmount).keys()).map(e => `${e}`),
                                elements: elements.map(e => e.map(a => `${a}`))
                            })
                        }
                    }
                }
            }
            default: {
                throw Error("К данной структуре нельзя добавить структуру матрицы!");
            }
        }
    } else {
        return {
            answer: "answer",
            task: {
                type: "matrix",
                value: {
                    rows: Array.from(Array(vertexAmount).keys()).map(e => `${e}`),
                    columns: Array.from(Array(edgesAmount).keys()).map(e => `${e}`),
                    elements: elements.map(e => e.map(a => `${a}`))
                }
            }
        }
    }
}

export function generateAnswerMatrix(struct: VariantWithAnswer | undefined, vertexAmount: number, edgesAmount: number, isSym: boolean): VariantWithAnswer {
    const elements = Array.from(Array(vertexAmount))
        .map(() => Array.from(Array(edgesAmount).keys())
            .map(() => Math.round(Math.random())));
    if (isSym) {
        for (let i = 0; i < vertexAmount; i++) {
            for (let j = i; j < vertexAmount; j++) {
                (i === j) ? elements[i][j] = 0 : elements[i][j] = elements[j][i]
            }
        }
    }
    if (struct) {
        return {
            answer: {
                type: "matrix",
                value: {
                    rows: Array.from(Array(vertexAmount).keys()).map(e => `${e}`),
                    columns: Array.from(Array(edgesAmount).keys()).map(e => `${e}`),
                    elements: elements.map(e => e.map(a => `${a}`))
                    }
                },
            task: struct.task
        }
    }
    else {
        return {
            answer: {
                type: "matrix",
                value: {
                    rows: Array.from(Array(vertexAmount).keys()).map(e => `${e}`),
                    columns: Array.from(Array(edgesAmount).keys()).map(e => `${e}`),
                    elements: elements.map(e => e.map(a => `${a}`))
                }
            },
            task: {
                type: "type",
                value: "value"
            }
        }
    }
}