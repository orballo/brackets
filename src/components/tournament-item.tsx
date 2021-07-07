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
    width: 100%;

    &:last-of-type {
      margin-bottom: 0;
    }
  `;

  const divStyles = css`
    padding: 4px 8px;
  `;

  return (
    <li class={liStyles}>
      <div class={divStyles}>ID: {id}</div>
      <div class={divStyles}>Number of players: {numberOfPlayers}</div>
      <div class={divStyles}>Registration method: {registerMethod}</div>
      <div class={divStyles}>Status: {status}</div>
    </li>
  );
};

export default TournamentItem;
