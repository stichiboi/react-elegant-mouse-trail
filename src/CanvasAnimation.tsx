import { CSSProperties, MutableRefObject, useCallback, useEffect, useRef } from "react";


export interface ElementProps {
    style?: CSSProperties,
    className?: string
}

interface CanvasAnimationProps extends ElementProps {

    draw: (canvas: HTMLCanvasElement) => unknown,
    animatePoints: (ctx: CanvasRenderingContext2D) => unknown
}

export function CanvasAnimation({
                                    draw,
                                    animatePoints,
                                    ...elementProps
                                }: CanvasAnimationProps): JSX.Element {
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
    const animationFrameIdRef = useRef(0);

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
        animationFrameIdRef.current = window.requestAnimationFrame(loop);
    }, [drawRef, animatePointsRef]);

    useEffect(() => {
        loop();
        return () => {
            window.cancelAnimationFrame(animationFrameIdRef.current);
        }
    }, []);

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
        <canvas ref={canvas} {...elementProps}/>
    );
}