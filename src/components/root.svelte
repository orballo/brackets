<script lang="ts">
  import { connection } from "../stores";
  import Router from "svelte-spa-router";
  import Home from "./home.svelte";
  import Dashboard from "./dashboard.svelte";
  import NewTournament from "./new-tournament.svelte";

  const routes = {
    "/": Home,
    "/dashboard": Dashboard,
    "/new": NewTournament,
  };

  connection.detectProvider();
</script>

<Router {routes} />
