import { Value } from "webthing";

export const last = new Value(new Date().toISOString());
export const total = new Value(0);
export const username = new Value(process.env.USERNAME);
export const name = new Value("");
export const followers = new Value(0);
export const follows = new Value(0);
export const starred = new Value(0);
export const change = new Value(new Date().toISOString());
export const status = new Value("");
