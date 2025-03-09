import { useState } from "react";

interface ImageProps {
  src: string;
  defaultSrc: string;
  alt: string;
}

const Image = ({ defaultSrc, src, alt }: ImageProps) => {
  const [isNoIcon, setIsNoIcon] = useState(false);

  return (
    <img
      src={isNoIcon ? defaultSrc : src}
      alt={alt}
      onError={() => setIsNoIcon(true)}
      className="w-[24px] h-[24px]"
    />
  );
};

export default Image;
