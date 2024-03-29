# react-elegant-mouse-trail

A plug and play react element that follows your cursor.

Every frame, it records the position of the mouse.
Then it draws an arc between all the points, creating a cool trail.

Install with
```shell
npm i @stichiboi/react-elegant-mouse-trail
```

Then use it in your components
```typescript jsx
import { MouseTrail } from "@stichiboi/react-elegant-mouse-trail";

export function Layout({ children }: { children: ReactNode }): JSX.Element {
    return (
        <>
            <MouseTrail strokeColor={"#FF8541"}/>
            <main>{children}</main>
        </>
    );
}
```

## Demo

[See it in action](https://stichiboi-website-next.vercel.app/)

Or you can clone the repo and run

```
npm storybook
```

## Options

| Prop name        | Type      | Description                                                                                                                                                                             |
|------------------|-----------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `lineDuration`   | `number`  | How long it takes for the trail to fade away                                                                                                                                            |
| `lineWidthStart` | `number`  | The size of the points when they are created                                                                                                                                            |
| `strokeColor`    | `string`  | Color of the trail. It should be in a format accepted by [strokeStyle](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/strokeStyle). E.g. `"rgb(255, 0, 0)"`) |
| `lag`            | `number`  | How long it takes for the trail head to reach the cursor. Should be in the range `[0, 1)`                                                                                               |