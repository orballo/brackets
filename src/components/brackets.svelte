<script lang="ts">
  import { connection, tournament, contract } from "../stores";
  import { decrypt } from "../utils";
  import Header from "./header.svelte";

  export let params: Record<string, any> = {};

  let rounds: number[][];

  $: if ($tournament) {
    rounds = [];

    for (let i = $tournament.numberOfPlayers; i >= 1; i = i / 2) {
      rounds = [...rounds, Array.from({ length: i }, (_, index) => index + 1)];
    }
  }

  $: $connection.isConnected &&
    contract.getTournament(parseInt(decrypt(params.code)));
</script>

<Header />
<main>
  {#if $tournament}
    <div class="wrapper">
      {#each rounds as round}
        <div class="round">
          {#each round as bracket}
            <div class="bracket">{bracket}</div>
          {/each}
        </div>
      {/each}
    </div>
  {/if}
</main>

<style>
  main {
    display: flex;
    align-items: stretch;
    justify-content: center;
    height: calc(100vh - 52px);
    overflow: auto;
    position: relative;
  }

  main::-webkit-scrollbar {
    display: none;
  }

  .wrapper {
    display: flex;
    min-height: min-content;
    position: absolute;
    top: 0;
    left: 0;
    padding: 40px;
  }

  .round {
    margin: 0 120px;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    /* align-items: space-between; */
  }

  .bracket {
    height: 32px;
    width: 96px;
    background: #ccc;

    display: flex;
    align-items: center;
    justify-content: center;
  }

  .bracket:nth-of-type(odd) {
    margin-bottom: 12px;
    margin-top: 32px;
  }
  .bracket:nth-of-type(even) {
    margin-bottom: 32px;
    margin-top: 12px;
  }

  .bracket:last-of-type {
    margin-bottom: 0;
  }
  .bracket:first-of-type {
    margin-top: 0;
  }
</style>
