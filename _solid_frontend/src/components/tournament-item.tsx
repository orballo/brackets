import { css } from "@emotion/css";
import { Component, createSignal } from "solid-js";
import { useStore } from "../store";
import { Tournament } from "../types";

const TournamentItem: Component<Tournament> = ({
  id,
  code,
  numberOfPlayers,
  status,
  admin,
  participants,
  isAdmin,
  isParticipant,
}) => {
  const { actions } = useStore();
  const [copied, setCopied] = createSignal(false);

  const liStyles = css`
    background-color: #fff;
    color: #333;
    border-radius: 4px;
    margin-bottom: 12px;
    display: flex;
    padding: 12px;
    display: flex;
    flex-direction: column;
    width: 100%;

    &:last-of-type {
      margin-bottom: 0;
    }
  `;

  const divStyles = css`
    padding: 4px 12px;
    text-align: left;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;

    &:nth-of-type(2),
    &:nth-of-type(3),
    &:nth-of-type(4) {
      min-width: 180px;
    }

    span {
      display: block;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
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
      <div class={divStyles}>Status: {status}</div>
      <div class={divStyles}>
        Admin:<span>{admin}</span>
      </div>
      <div class={divStyles}>
        Participants:
        {participants.map((p) => (
          <span>{p}</span>
        ))}
      </div>
      {isAdmin && <div class={divStyles}>Is admin</div>}
      {isParticipant && <div class={divStyles}>Is participant</div>}
      <button
        onClick={() => {
          if (!isParticipant) actions.registerParticipant(id);
          else actions.unregisterParticipant(id);
        }}
        class={buttonStyles}
      >
        {!isParticipant ? "Register" : "Unregister"} as participant
      </button>
      <button
        onClick={async () => {
          await navigator.clipboard.writeText(
            window.location.protocol +
              "//" +
              window.location.host +
              "/t/" +
              code
          );
          setCopied(true);
          setTimeout(() => {
            setCopied(false);
          }, 1000);
        }}
      >
        {copied() ? "Copied!" : "Copy link"}
      </button>
    </li>
  );
};

export default TournamentItem;
