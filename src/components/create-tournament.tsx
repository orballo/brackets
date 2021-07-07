import { Component } from "solid-js";
import { css } from "@emotion/css";
import { useStore } from "../store";

const CreateTournament: Component = () => {
  const { state, actions } = useStore();

  const handleSubmit = (event: any) => {
    event.preventDefault();
    actions.createTournament();
  };

  const formStyles = css`
    background: #fff;
    color: #333;
    display: flex;
    flex-direction: column;
    width: 25%;
    padding: 24px;
    border-radius: 4px;
    min-width: 360px;
    max-width: 420px;
  `;

  const labelStyles = css`
    margin-bottom: 12px;
    display: flex;
    align-items: center;
  `;

  const spanStyles = css`
    margin-right: 4px;
    flex-grow: 1;
  `;

  const selectStyles = css`
    padding: 4px;
    min-width: 150px;
  `;

  const buttonStyles = css`
    background-color: #333;
    color: #fff;
    border: none;
    font-size: 16px;
    cursor: pointer;
    border-radius: 4px;
    margin-left: auto;
    padding: 12px 16px;
    margin-top: 12px;
  `;

  return (
    <form onSubmit={handleSubmit} class={formStyles}>
      <label class={labelStyles}>
        <span class={spanStyles}>Number of players:</span>
        <select class={selectStyles}>
          <option value="2" label="2" />
          <option value="4" label="4" />
          <option value="8" label="8" />
          <option value="16" label="16" />
          <option value="32" label="32" />
        </select>
      </label>
      <label class={labelStyles}>
        <span class={spanStyles}>Registration method:</span>
        <select class={selectStyles}>
          <option value="direct" label="Direct" />
          <option value="invitation" label="Invitation" />
        </select>
      </label>
      <button
        class={buttonStyles}
        disabled={state.createTournament.isSubmitting}
      >
        Create tournament
      </button>
    </form>
  );
};

export default CreateTournament;
