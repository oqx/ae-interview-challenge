import { atomWithStorage } from "jotai/utils";
import { AUTH_TOKEN } from "../constants";

export const authAtom = atomWithStorage<string | undefined>(AUTH_TOKEN, "");
