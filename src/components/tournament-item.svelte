<script lang="ts">
  import { push } from "svelte-spa-router";
  import { contract } from "../stores";
  import ButtonShare from "./button-share.svelte";
  import UserIcon from "./user-icon.svelte";
  import Address from "./address.svelte";
  import type { Tournament } from "../stores/tournament";

  export let tournament: Tournament;
</script>

<div class="container">
  <header>
    <span>ID</span>
    {tournament.id}
    <ButtonShare code={tournament.code} />
  </header>
  <article>
    <section>
      <div>
        <span>Number of players</span>{tournament.participants.length} /
        {tournament.numberOfPlayers}
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
  {#if tournament.status !== "canceled"}
    <footer>
      <button on:click={() => push("/b/" + tournament.code)}>
        See brackets
      </button>
      {#if !tournament.isParticipant}
        <button on:click={() => contract.registerParticipant(tournament.id)}>
          Register as participant
        </button>
      {:else}
        <button on:click={() => contract.unregisterParticipant(tournament.id)}>
          Unregister as participant
        </button>
      {/if}
      {#if tournament.isAdmin}
        <!-- <button>Edit tournament</button> -->
        <button on:click={() => contract.cancelTournament(tournament.id)}
          >Cancel tournament</button
        >
        <button>Start tournament</button>
      {/if}
    </footer>
  {:else}
    <div class="canceled">Tournament canceled</div>
  {/if}
</div>

<style>
  .container {
    background-color: #fff;
    color: #333;
    margin-bottom: 16px;
    padding: 24px;
    padding-top: 16px;
    width: 100%;
    max-width: 600px;
    margin-bottom: 40px;
  }

  .container header {
    font-size: 20px;
    text-align: right;
    margin-bottom: 12px;
    display: flex;
    align-items: center;
    justify-content: flex-end;
  }

  .container header span {
    font-weight: bold;
    margin-right: 8px;
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

  section .participants {
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

  footer {
    margin-top: 16px;
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-gap: 16px;
  }

  button {
    border: 2px solid #333;
    background-color: #eee;
    font-size: 14px;
    text-transform: uppercase;
    padding: 8px;
    cursor: pointer;
  }

  button:hover {
    box-shadow: 0 0 2px 0px #333;
  }

  .canceled {
    display: flex;
    align-items: center;
    justify-content: center;
    text-transform: uppercase;
    font-weight: bold;
    padding: 24px;
  }
</style>
