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

  header > :global(svg) {
    width: auto;
    height: 52px;
  }

  main {
    padding-top: 6em;
    display: flex;
    justify-content: center;
  }

  @media (min-width: 768px) {
    header > :global(svg) {
      height: auto;
    }
  }
</style>
