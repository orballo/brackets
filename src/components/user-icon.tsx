import { css } from "@emotion/css";
import type { Component } from "solid-js";

const UserIcon: Component<{ userAddress: string }> = ({ userAddress = "" }) => {
  const styles = css`
    border-radius: 50%;
    border: 2px solid #000;
  `;

  return (
    <div title={userAddress}>
      <svg
        className={styles}
        width="128"
        height="128"
        data-jdenticon-hash={userAddress.slice(2)}
      />
    </div>
  );
};

export default UserIcon;
