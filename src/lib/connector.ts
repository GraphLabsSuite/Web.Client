import {failure, success} from "fp-ts/lib/Validation";

let config: any;

export function init(conf?: any) {
    if (!config) {
        config = conf;
    }
    return config;
}

export default class Connector {
    public static makeUrl(url: string) {
        return `${init().hostBase}${url}`;
    }
      public static async get(url: string) {
        try {
            const res = await fetch(Connector.makeUrl(url));
            return success(res);
        } catch(e) {
            return failure(e);
        }
      }
};