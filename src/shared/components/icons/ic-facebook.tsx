import { IconProps, getIconSize } from "./icon.type";

export function IcFacebook({ size = 'md', className, title, ...props }: IconProps) {
    const sizeValue = getIconSize(size);
    return (
        <svg width={sizeValue} height={sizeValue} viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} {...props}>
            {title ? <title>{title}</title> : null}
            <path d="M16.8 6.03027C10.8158 6.03027 5.96472 10.8814 5.96472 16.8656C5.96472 22.2737 9.92701 26.7564 15.107 27.5692V19.9977H12.3559V16.8656H15.107V14.4784C15.107 11.7628 16.7247 10.2628 19.1997 10.2628C20.3852 10.2628 21.6251 10.4744 21.6251 10.4744V13.1409H20.2589C18.9129 13.1409 18.493 13.9762 18.493 14.8331V16.8656H21.4981L21.0177 19.9977H18.493V27.5692C23.673 26.7564 27.6353 22.2739 27.6353 16.8656C27.6353 10.8814 22.7842 6.03027 16.8 6.03027Z" fill="currentColor" />
        </svg>

    )
}