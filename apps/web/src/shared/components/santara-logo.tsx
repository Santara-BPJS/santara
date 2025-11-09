import logoImg from "../../../logo.png";

type SantaraLogoProps = {
  size?: number;
  className?: string;
};

export default function SantaraLogo({
  size = 32,
  className = "",
}: SantaraLogoProps) {
  return (
    <img
      alt="Santara Logo"
      className={className}
      height={size}
      src={logoImg}
      width={size}
    />
  );
}
