
import React from "react";
import * as Icons from "lucide-react";

interface IconProps extends React.SVGProps<SVGSVGElement> {
  name: string;
  color?: string;
  size?: number;
  strokeWidth?: number;
  fallback?: string;
}

const Icon = ({
  name,
  color,
  size = 24,
  strokeWidth = 2,
  fallback = "CircleAlert",
  ...props
}: IconProps) => {
  const IconComponent = Icons[name as keyof typeof Icons] || Icons[fallback as keyof typeof Icons];

  if (!IconComponent) {
    console.warn(`Icon "${name}" not found, fallback "${fallback}" also not found.`);
    return null;
  }

  return <IconComponent color={color} size={size} strokeWidth={strokeWidth} {...props} />;
};

export default Icon;

