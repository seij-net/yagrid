import React from "react";

export interface TestComponentProps {
  title: string;
}
export const TestComponent: React.FC<TestComponentProps> = ({ title }) => {
  return <div>{title}</div>;
};
