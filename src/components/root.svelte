<script lang="ts">
  import Router from "svelte-spa-router";
  import Home from "./home.svelte";
  import Dashboard from "./dashboard.svelte";

  const routes = {
    "/": Home,
    "/dashboard": Dashboard,
  };
</script>

<Router {routes} />
