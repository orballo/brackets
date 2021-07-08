import { css } from "@emotion/css";
import type { Component } from "solid-js";
import { useStore } from "../store";
import { Tournament } from "../types";

const TournamentItem: Component<Tournament> = ({
  id,
  numberOfPlayers,
  registerMethod,
  status,
  admin = false,
  participant = false,
}) => {
  const { actions } = useStore();

  const liStyles = css`
    background-color: #fff;
    color: #333;
    border-radius: 4px;
    margin-bottom: 12px;
    display: flex;
    padding: 12px;
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    width: 100%;

    &:last-of-type {
      margin-bottom: 0;
    }
  `;

  const divStyles = css`
    padding: 4px 12px;
    text-align: left;

    &:nth-of-type(2),
    &:nth-of-type(3),
    &:nth-of-type(4) {
      min-width: 180px;
    }
  `;

  const buttonStyles = css`
    height: 32px;
    margin-top: 12px;
    cursor: pointer;
    margin-left: auto;
  `;

  return (
    <li class={liStyles}>
      <div class={divStyles}>ID: {id}</div>
      <div class={divStyles}>Number of players: {numberOfPlayers}</div>
      <div class={divStyles}>Registration: {registerMethod}</div>
      <div class={divStyles}>Status: {status}</div>
      {admin && <div class={divStyles}>Admin</div>}
      {participant && <div class={divStyles}>Participant</div>}
      <button
        onClick={() => {
          if (!participant) actions.registerParticipant(id);
          else actions.unregisterParticipant(id);
        }}
        class={buttonStyles}
      >
        {!participant ? "Register" : "Unregister"} as participant
      </button>
    </li>
  );
};

export default TournamentItem;
