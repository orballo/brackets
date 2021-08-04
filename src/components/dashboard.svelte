<script>
  import { connection, contract } from "../stores";
  import Header from "./header.svelte";

  $: $connection.isConnected && contract.getTournaments();
</script>

<Header />
<main />

<style>
  main {
    width: 100%;
    max-width: 1024px;
  }
</style>
