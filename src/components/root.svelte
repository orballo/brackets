<script lang="ts">
  import { connection } from "../stores";
  import Router from "svelte-spa-router";
  import Home from "./home.svelte";
  import Dashboard from "./dashboard.svelte";

  const routes = {
    "/": Home,
    "/dashboard": Dashboard,
  };

  connection.detectProvider();
</script>

<Router {routes} />
