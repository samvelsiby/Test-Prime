export interface RippleButtonProps {
  children: React.ReactNode;
  className: string;
  onClick?: () => void;
}

export interface NavigationLink {
  href: string;
  label: string;
}

export interface VideoSettings {
  loopStartTime: number;
  loopEndTime: number;
  videoSrc: string;
  fallbackSrc: string;
}