import React from "react";
import { GridProps } from "../types";
import "tailwindcss/dist/tailwind.min.css";
import "@tailwindcss/forms/dist/forms.min.css";
import "./YAGridPlayground.css";
import { Table } from "../Table";
export const YAGridPlayground: React.FC<GridProps<any>> = ({ children, ...args }) => {
  return (
    <div>
      <h1 className="text-2xl">Playground</h1>
      <p>
        Note that YAGrid doesn't provide any CSS or style to stay style-agnostic. Here we use <code>tailwindcss</code>{" "}
        and <code>tailwindcss/forms</code> for a default styling. edit-inline, edit-add and edit-delete plugins are
        provided. <br />
        OK it's ugly, but useful for component design-time.
      </p>
      <p>&nbsp;</p>
      <Table className="table-auto yagrid-table-playground" {...args} />
    </div>
  );
};
