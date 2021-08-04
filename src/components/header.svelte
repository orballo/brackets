<script lang="ts">
  import Logo from "./logo.svelte";
  import UserIcon from "./user-icon.svelte";
</script>

<header>
  <div class="container">
    <div class="left">
      <a href="/"><Logo /></a>
    </div>
    <div class="right">
      <a class="new-tournament" href="#/new"
        ><span>+</span><span>New tournament</span></a
      >
      <a href="#/dashboard">
        <UserIcon />
      </a>
    </div>
  </div>
</header>

<style>
  header {
    height: 52px;
    background-color: #fff;
    color: #333;
  }

  .container {
    display: flex;
    height: 100%;
    width: 100%;
    max-width: 1024px;
    margin: 0 auto;
    padding: 0 16px;
  }

  .left,
  .right {
    display: flex;
    height: 100%;
    align-items: center;
  }

  .left > a,
  .right > a {
    display: flex;
    align-items: center;
  }

  .left > a > :global(svg) {
    height: 32px;
    width: auto;
  }

  .right {
    margin-left: auto;
  }

  .new-tournament {
    text-transform: uppercase;
    font-size: 18px;
    font-weight: bolder;
    margin-right: 32px;
  }

  .new-tournament span:first-of-type {
    margin-bottom: 2px;
    font-size: 40px;
    line-height: 40px;
    font-weight: lighter;
    margin-right: 4px;
  }

  @media (max-width: 767px) {
    .new-tournament span:last-of-type {
      display: none;
    }
  }
</style>
