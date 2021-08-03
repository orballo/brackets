<script lang="ts">
  import { connection } from "../stores";
  import jazzicon from "@metamask/jazzicon";
</script>

<div title={$connection.address}>
  {@html jazzicon(32, parseInt($connection?.address?.slice(2, 10), 16))
    .outerHTML}
</div>

<style>
  div {
    height: 100%;
    display: flex;
    align-items: center;
    filter: grayscale(100%);
  }

  div > :global(div) {
    border: 2px solid #333;
  }
</style>
