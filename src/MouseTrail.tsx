import {CSSProperties, useCallback, useEffect, useRef} from "react";
import {CanvasAnimation} from "./CanvasAnimation";

interface Coords {
    x: number,
    y: number,
}

interface Point extends Coords {
    age: number
}

const defaultStyle: CSSProperties = {
    pointerEvents: "none",
    position: "fixed",
    width: "100vw",
    height: "100vh",
    zIndex: 2,
    top: 0,
    left: 0,
}

interface MouseTrailProps {
    lineDuration?: number;
    lineWidthStart?: number;
    strokeColor?: string;
    lag?: number;
}

export function MouseTrail(props: MouseTrailProps): JSX.Element {
    const {
        lineDuration = 1,
        lineWidthStart = 8,
        strokeColor = `rgb(${[255, 0, 0].join(', ')})`,
        lag = 0.92
    } = props;

    const MAX_AGE = lineDuration * 1000 / 60;

    const mouseLocation = useRef<Coords>({x: 0, y: 0});
    const points = useRef<Point[]>([]);

    const updateMouse = useCallback((event: MouseEvent) => {
        mouseLocation.current = {
            x: event.clientX,
            y: event.clientY
        };
    }, [mouseLocation]);

    const makePath = useCallback((ctx: CanvasRenderingContext2D, start: Point, end: Point, color: string, lineWeight: number) => {
        ctx.lineWidth = lineWeight
        ctx.strokeStyle = color
        ctx.beginPath();

        ctx.moveTo(end.x, end.y);
        ctx.arcTo(start.x, start.y, end.x, end.y, 50);
        ctx.stroke();

        ctx.beginPath();
        ctx.fillStyle = color;
        ctx.arc(end.x, end.y, lineWeight / 2, 0, Math.PI * 2);
        ctx.fill();
    }, []);

    const animatePoints = useCallback((ctx: CanvasRenderingContext2D) => {
        ctx.clearRect(
            0, 0,
            ctx.canvas.width,
            ctx.canvas.height
        );

        points.current.forEach((point, i, arr) => {
            const prevPoint = i ? arr[i - 1] : arr[i];
            point.age += 1;
            if (point.age > MAX_AGE) {
                points.current.splice(i, 1);
            } else {
                const lineWeight = lineWidthStart / (point.age * 2)
                makePath(ctx, point, prevPoint, strokeColor, lineWeight);
            }
        });
    }, [points, makePath, MAX_AGE, lineWidthStart, strokeColor]);

    const draw = useCallback(() => {
        const mouse = mouseLocation.current;
        const lastPoint: Point = points.current[points.current.length - 1] || mouse;
        const x = mouse.x - (mouse.x - lastPoint.x) * lag;
        const y = mouse.y - (mouse.y - lastPoint.y) * lag;
        points.current.push({x, y, age: 0});
    }, [mouseLocation, points, lag]);

    useEffect(() => {
        document.body.addEventListener('mousemove', updateMouse);

        return () => {
            window.removeEventListener('mousemove', updateMouse);
        }
    }, [updateMouse]);

    return (
        <CanvasAnimation
            style={defaultStyle}
            draw={draw}
            animatePoints={animatePoints}/>
    )
}