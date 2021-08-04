<script lang="ts">
  import { newTournament, contract } from "../stores";
  import Header from "./header.svelte";

  let numberOfPlayers = [2, 4, 6, 16, 32];
  let selected: number;
</script>

<Header />
<main>
  <h2>Register a new tournament</h2>
  <form>
    <label>
      <span>Number of players</span>
      <select bind:value={$newTournament.numberOfPlayers}>
        {#each numberOfPlayers as option}
          <option value={option}>{option}</option>
        {/each}
      </select>
    </label>
    <label>
      <span>Initial prize</span>
      <input type="number" bind:value={$newTournament.initialPrize} />
    </label>
    <label>
      <span>Registration fee</span>
      <input type="number" bind:value={$newTournament.registrationFee} />
    </label>
    <button on:click={contract.createTournament}>Register</button>
  </form>
</main>

<style>
  h2 {
    text-transform: uppercase;
  }

  main {
    width: 100%;
    max-width: 1024px;
    margin: 0 auto;
    padding: 0 16px;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  form {
    background-color: #fff;
    color: #333;
    padding: 24px;
    width: 100%;
    max-width: 480px;
  }

  label {
    display: flex;
    justify-content: space-between;
    margin-bottom: 16px;
  }

  select,
  input {
    height: 32px;
    width: 120px;
    font-size: 16px;
    border: 2px solid #333;
  }
  select {
    padding-left: 4px;
  }

  input {
    padding: 0 8px;
  }

  button {
    display: block;
    width: 120px;
    height: 40px;
    margin-left: auto;
  }
</style>
