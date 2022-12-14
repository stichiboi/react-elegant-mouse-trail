import {CSSProperties, MutableRefObject, useCallback, useEffect, useRef} from "react";

export function CanvasAnimation({
                                    style,
                                    draw,
                                    animatePoints
                                }: { style: CSSProperties, draw: (canvas: HTMLCanvasElement) => unknown, animatePoints: (ctx: CanvasRenderingContext2D) => unknown }): JSX.Element {
    const canvas = useRef<HTMLCanvasElement>() as MutableRefObject<HTMLCanvasElement>;
    const context = useRef<CanvasRenderingContext2D>();

    const resizeCanvas = useCallback(() => {
        if (context.current?.canvas) {
            context.current.canvas.width = window.innerWidth;
            context.current.canvas.height = window.innerHeight
        }
    }, [context]);

    // wrap in refs since it will be used as an animation frame callback
    const drawRef = useRef(draw);
    const animatePointsRef = useRef(animatePoints);

    useEffect(() => {
        drawRef.current = draw;
        animatePointsRef.current = animatePoints;
    }, [draw, drawRef, animatePointsRef, animatePoints]);

    const loop = useCallback(() => {
        if (canvas.current) {
            drawRef.current(canvas.current);
        }
        if (context.current) {
            animatePointsRef.current(context.current);
        }
        window.requestAnimationFrame(loop);
    }, [drawRef, animatePointsRef]);

    useEffect(() => loop(), []);

    useEffect(() => {
        const tempContext = canvas.current.getContext('2d');
        if (!tempContext) throw Error("Cannot create canvas context");
        tempContext.lineJoin = "round";
        context.current = tempContext;

        window.addEventListener('resize', resizeCanvas);

        resizeCanvas();
        return () => {
            window.removeEventListener('resize', resizeCanvas);
        }
    }, [context, canvas, loop, resizeCanvas]);

    return (
        <canvas ref={canvas} style={style}/>
    );
}