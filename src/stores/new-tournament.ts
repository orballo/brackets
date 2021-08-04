import { writable } from "svelte/store";

const createNewTournament = () => {
  const { subscribe, update, set } = writable({
    numberOfPlayers: 2,
    initialPrize: 0,
    registrationFee: 0,
    isError: false,
    isSubmitting: false,
  });

  function updateField(field: string, value: number) {
    return update((self) => {
      self[field] = value;
      return self;
    });
  }

  return { subscribe, set, updateField };
};

export default createNewTournament();
