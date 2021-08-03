<script lang="ts">
  import { connection } from "../stores";
  import Logo from "./logo.svelte";
  import ButtonConnect from "./button-connect.svelte";
  import ButtonDashboard from "./button-dashboard.svelte";
</script>

<header><Logo /></header>
<main>
  {#if !$connection.isConnected}
    <ButtonConnect />
  {:else}
    <ButtonDashboard />
  {/if}
</main>

<style>
  header {
    height: 360px;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #fff;
  }

  main {
    text-align: center;
    padding-top: 6em;
    max-width: 240px;
    margin: 0 auto;
  }
</style>
