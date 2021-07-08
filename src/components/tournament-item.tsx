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
    align-items: center;
    flex-wrap: wrap;
    width: 100%;

    &:last-of-type {
      margin-bottom: 0;
    }
  `;

  const divStyles = css`
    padding: 4px 8px;
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
  `;

  return (
    <li class={liStyles}>
      <div class={divStyles}>ID: {id}</div>
      <div class={divStyles}>Number of players: {numberOfPlayers}</div>
      <div class={divStyles}>Registration: {registerMethod}</div>
      <div class={divStyles}>Status: {status}</div>
      <button class={buttonStyles}>Register as participant</button>
    </li>
  );
};

export default TournamentItem;
