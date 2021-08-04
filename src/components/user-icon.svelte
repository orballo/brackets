<script lang="ts">
  import { connection } from "../stores";
  import jazzicon from "@metamask/jazzicon";

  export let address = "";
  export let size = "100%";
</script>

<div title={$connection.address} style="--size: {size}">
  {@html jazzicon(
    32,
    parseInt((!!address ? address : $connection?.address)?.slice(2, 10), 16)
  ).outerHTML}
</div>

<style>
  div {
    display: flex;
    align-items: center;
    filter: grayscale(100%);
    transform: scale(var(--size));
  }

  div > :global(div) {
    border: 2px solid #333;
  }
</style>
