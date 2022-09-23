// Button.stories.ts|tsx

import {ComponentStory, ComponentMeta} from '@storybook/react';

import {MouseTrail} from "../MouseTrail";

export default {
    /* 👇 The title prop is optional.
    * See https://storybook.js.org/docs/react/configure/overview#configure-story-loading
    * to learn how to generate automatic titles
    */
    title: 'Mouse Trail',
    component: MouseTrail,
    argTypes: {
        lag: {
            control: {
                type: 'range', min: '0.1', max: '0.99', step: '0.01'
            }
        },
        lineDuration: {
            control: {
                type: 'range', min: '0.1', max: '5', step: '0.1'
            }
        }
    }
} as ComponentMeta<typeof MouseTrail>;

export const Primary: ComponentStory<typeof MouseTrail> = (args) => <MouseTrail {...args}/>;
