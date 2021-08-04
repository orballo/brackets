<script lang="ts">
  import { connection, contract, tournaments } from "../stores";
  import Header from "./header.svelte";
  import UserIcon from "./user-icon.svelte";
  import Address from "./address.svelte";

  $: $connection.isConnected && contract.getTournaments();
</script>

<Header />
<main>
  <h2>List of tournaments</h2>
  <ul>
    {#each $tournaments as tournament}
      <li>
        <header>
          <span>ID</span>
          {tournament.id}
        </header>
        <article>
          <section>
            <div>
              <span>Number of players</span>{tournament.participants.length} / {tournament.numberOfPlayers}
            </div>
            <div>
              <span>Initial prize</span>{tournament.initialPrize} Ξ
            </div>
            <div>
              <span>Registration fee</span>{tournament.registrationFee} Ξ
            </div>
          </section>
          <section>
            <div class="admin">
              <span>Admin</span>
              <div class="user">
                <UserIcon address={tournament.admin} size={"50%"} />
                <Address address={tournament.admin} />
              </div>
            </div>
            <div class="participants">
              {#if tournament.participants.length}
                <span>Players</span>
              {/if}
              {#each tournament.participants as participant}
                <div class="user">
                  <UserIcon address={participant} size={"50%"} />
                  <Address address={participant} />
                </div>
              {/each}
            </div>
          </section>
        </article>
        <footer>
          <button>Register as participant</button>
          <button>Cancel tournament</button>
          <button>Start tournament</button>
        </footer>
      </li>
    {/each}
  </ul>
</main>

<style>
  main {
    width: 100%;
    max-width: 1024px;
    margin: 0 auto;
    padding: 0 16px;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  h2 {
    text-transform: uppercase;
    margin-top: 40px;
  }
  ul {
    padding: 0;
    margin: 0;
    width: 100%;
    max-width: 600px;
    margin-bottom: 40px;
  }

  li {
    background-color: #fff;
    color: #333;
    margin-bottom: 16px;
    padding: 24px;
    padding-top: 16px;
  }

  li header {
    font-size: 20px;
    text-align: right;
    margin-bottom: 12px;
  }

  li header span {
    font-weight: bold;
  }

  article {
    display: grid;
    grid-template-columns: 1fr minmax(0, 1fr);
    grid-gap: 32px;
  }

  section > div {
    margin-bottom: 12px;
    display: flex;
    justify-content: space-between;
  }

  section .admin {
    display: block;
  }

  .user {
    display: flex;
    align-items: center;
  }

  .user :global(span) {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  .user :global(div) {
    margin-left: -6px;
    margin-top: -2px;
  }
</style>
