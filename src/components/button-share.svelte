<script lang="ts">
  import IconShare from "./icon-share.svelte";

  let copied = false;

  export let code: string;
</script>

<button
  class="share"
  disabled={copied}
  on:click={async () => {
    await navigator.clipboard.writeText(
      window.location.protocol + "//" + window.location.host + "/#/t/" + code
    );
    copied = true;
    setTimeout(() => {
      copied = false;
    }, 1000);
  }}
>
  <IconShare />
</button>

<style>
  .share {
    background: none;
    border: none;
    padding: 0;
    display: flex;
    align-items: center;
    margin-left: 20px;
    cursor: pointer;
  }

  .share:disabled {
    color: #ccc;
  }
</style>
