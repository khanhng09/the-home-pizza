import { IconProps } from "./icon.type";

export function IcClock(props: IconProps) {
    return (
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
            <circle cx="16" cy="16" r="12" stroke="currentColor" strokeWidth="2" />
            <path d="M16 9.5V16L20.5 18.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}
