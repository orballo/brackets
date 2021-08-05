<script lang="ts">
  import { newTournament, contract } from "../stores";
  import Header from "./header.svelte";
</script>

<Header />
<main>
  <h2>Register a new tournament</h2>
  <form on:submit|preventDefault={() => contract.createTournament()}>
    <label>
      <span>Number of players</span>
      <select bind:value={$newTournament.numberOfPlayers}>
        {#each [2, 4, 8, 16, 32] as option}
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
    <button type="submit">Register</button>
  </form>
</main>

<style>
  main {
    width: 100%;
    max-width: 1024px;
    margin: 0 auto;
    padding: 0 16px;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  h2 {
    margin-top: 40px;
    text-transform: uppercase;
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

  select:focus,
  input:focus {
    outline: none;
  }
  button {
    font-size: 14px;
    text-transform: uppercase;
    border: 2px solid #333;
    background-color: #eee;
    cursor: pointer;
    display: block;
    width: 160px;
    padding: 8px;
    margin-left: auto;
  }

  button:hover {
    box-shadow: 0 0 2px 0px #333;
  }
</style>
