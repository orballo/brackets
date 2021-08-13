<script lang="ts">
  import { connection, contract, tournaments } from "../stores";
  import Header from "./header.svelte";
  import TournamentItem from "./tournament-item.svelte";

  $: $connection.isConnected && contract.getTournaments();
</script>

<Header />
<main>
  <h2>List of tournaments</h2>
  <ul>
    {#each $tournaments as tournament}
      <TournamentItem {tournament} />
    {/each}
  </ul>
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
    text-transform: uppercase;
    margin-top: 40px;
  }
  ul {
    padding: 0;
    margin: 0;
    width: 100%;
    max-width: 600px;
    margin-bottom: 40px;
  }
</style>
