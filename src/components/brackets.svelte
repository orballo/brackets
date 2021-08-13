<script lang="ts">
  import { connection, tournament, contract } from "../stores";
  import { decrypt } from "../utils";
  import Header from "./header.svelte";

  export let params: Record<string, any> = {};

  $: $connection.isConnected &&
    contract.getTournament(parseInt(decrypt(params.code)));
</script>

<Header />
<main>
  {#if $tournament}
    <div>
      {#each Array.from({ length: $tournament.numberOfPlayers }, (_, i) => i + 1) as bracket}
        <div>{bracket}</div>
      {/each}
    </div>
  {/if}
</main>
