<script lang="ts">
  import { connection } from "../stores";
</script>

<button on:click={() => connection.connect()}>Connect to Metamask</button>

<style>
  button {
    display: inline-flex;
    justify-content: center;
    align-items: center;
    border: none;
    height: 52px;
    font-size: 18px;
    text-transform: uppercase;
    padding: 0 20px;
    cursor: pointer;
    background-color: #fff;
  }

  button:hover {
    box-shadow: 0 0 4px 2px #000;
  }
</style>
