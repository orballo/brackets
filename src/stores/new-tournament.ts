import { writable } from "svelte/store";

export default writable({
  numberOfPlayers: 2,
  initialPrize: 0,
  registrationFee: 0,
  isError: false,
  isSubmitting: false,
});
