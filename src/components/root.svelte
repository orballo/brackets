<script lang="ts">
  import { connection, contract } from "../stores";
  import Router from "svelte-spa-router";
  import Home from "./home.svelte";
  import Dashboard from "./dashboard.svelte";
  import NewTournament from "./new-tournament.svelte";
  import Tournament from "./tournament.svelte";
  import Brackets from "./brackets.svelte";

  const routes = {
    "/": Home,
    "/dashboard": Dashboard,
    "/new": NewTournament,
    "/t/:code": Tournament,
    "/b/:code": Brackets,
  };

  connection.detectProvider();
  $: $connection.isConnected && contract.getBalance();
</script>

<Router {routes} />
