import { writable } from "svelte/store";
import type { Tournament } from "./tournament";

export default writable([] as Tournament[]);
