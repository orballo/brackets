import { css } from "@emotion/css";
import type { Component } from "solid-js";
import { Tournament } from "../types";

const TournamentItem: Component<Tournament> = ({
  id,
  numberOfPlayers,
  registerMethod,
  status,
}) => {
  const liStyles = css`
    background-color: #fff;
    color: #333;
    border-radius: 4px;
    margin-bottom: 12px;
    display: flex;
    padding: 12px;
    display: flex;
    justify-content: space-between;
  `;

  return (
    <li class={liStyles}>
      <div>ID: {id}</div>
      <div># of players: {numberOfPlayers}</div>
      <div>Registration method: {registerMethod}</div>
      <div>Status: {status}</div>
    </li>
  );
};

export default TournamentItem;
