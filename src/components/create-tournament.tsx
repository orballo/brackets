import { Component } from "solid-js";
import { css } from "@emotion/css";
import { useStore } from "../store";

const CreateTournament: Component = () => {
  const { state, actions } = useStore();

  const handleChange = (event: any) => {
    actions.updateTournamentName(event.target.value);
  };

  const handleSubmit = (event: any) => {
    event.preventDefault();
    actions.createTournament();
  };

  const formStyles = css`
    background: #fff;
    color: #333;
    display: flex;
    flex-direction: column;
  `;

  return (
    <form onSubmit={handleSubmit} class={formStyles}>
      <button disabled={state.createTournament.isSubmitting}>
        Create tournament
      </button>
    </form>
  );
};

export default CreateTournament;
