<script lang="ts">
  import { connection, tournament, contract } from "../stores";
  import { decrypt } from "../utils";
  import Header from "./header.svelte";
  import TournamentItem from "./tournament-item.svelte";

  export let params: Record<string, any> = {};

  $: $connection.isConnected &&
    contract.getTournament(parseInt(decrypt(params.code)));
</script>

<Header />
<main>
  <h2>Tournament</h2>
  {#if $tournament}
    <TournamentItem tournament={$tournament} />
  {/if}
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
</style>
