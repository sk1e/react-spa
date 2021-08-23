export type PositionStyle = {
  left: string;
  top: string;
};

export type AnimationStatus = 'active' | 'finished';

export type RippleAnimation = {
  id: string;
  positionStyle: PositionStyle;
  status: AnimationStatus;
};
