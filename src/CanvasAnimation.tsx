import {CSSProperties, MutableRefObject, useCallback, useEffect, useRef} from "react";


export interface ElementProps {
    style?: CSSProperties,
    className?: string
}

interface CanvasAnimationProps extends ElementProps {
    move?: (canvas: HTMLCanvasElement) => unknown,
    draw: (ctx: CanvasRenderingContext2D) => unknown,
    onContextCreate?: (ctx: CanvasRenderingContext2D) => unknown
}

export function CanvasAnimation({
                                    move,
                                    draw,
                                    onContextCreate,
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
    const drawRef = useRef(move);
    const animatePointsRef = useRef(draw);
    const animationFrameIdRef = useRef(0);

    useEffect(() => {
        drawRef.current = move;
        animatePointsRef.current = draw;
    }, [move, drawRef, animatePointsRef, draw]);

    const loop = useCallback(() => {
        if (canvas.current && drawRef.current) {
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
        if (onContextCreate) {
            onContextCreate(tempContext);
        }
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