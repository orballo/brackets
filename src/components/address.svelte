<script lang="ts">
  export let address = "";
</script>

<span>{address.slice(0, 6)}...{address.slice(-4)}</span>
