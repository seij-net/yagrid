import React from 'react';
import { Story, Meta } from '@storybook/react';

import { TestComponent, TestComponentProps } from './TestComponent';
import { mult } from './mult';

export default {
  title: 'Example/TestComponent',
  component: TestComponent,
} as Meta;

const Template: Story<TestComponentProps> = (args) => <TestComponent {...args} />;

export const Primary = Template.bind({});
Primary.args = {
    title: "Hey you " + mult(10,2)
};

