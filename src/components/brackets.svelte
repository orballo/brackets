<script lang="ts">
  import { connection, tournament, contract } from "../stores";
  import { decrypt } from "../utils";
  import Header from "./header.svelte";
  import UserIcon from "./user-icon.svelte";
  import Address from "./address.svelte";

  export let params: Record<string, any> = {};

  let rounds: number[][];

  $: if ($tournament) {
    rounds = [];

    for (
      let i = $tournament.numberOfPlayers, j = 0;
      i >= 1;
      j += i, i = i / 2
    ) {
      rounds = [...rounds, Array.from({ length: i }, (_, index) => index + j)];
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
            <div class="bracket">
              {#if $tournament.participants[bracket]}
                <UserIcon
                  address={$tournament.brackets[bracket].participant}
                /><Address
                  address={$tournament.brackets[bracket].participant}
                />
              {/if}
            </div>
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
    justify-content: center;
    min-height: 100%;
    min-width: 100%;
    position: absolute;
    top: 0;
    left: 0;
    padding: 40px;
  }

  .round {
    margin: 0 80px;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
  }

  .bracket {
    min-height: 60px;
    min-width: 100px;
    padding: 0 12px;
    background: #ccc;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .bracket > :global(span) {
    margin-left: 8px;
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
