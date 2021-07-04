import { render } from "solid-js/web";
import App from "./components";
import Store from "./store";

import "./index.css";

render(
  () => (
    <Store>
      <App />
    </Store>
  ),
  document.getElementById("root")
);
