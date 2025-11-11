import { VideoPlayer } from '@amazon-devices/react-native-w3cmedia';

export interface CaptionButtonProps {
  onPress: () => void;
  video: VideoPlayer;
  captionMenuVisibility: boolean;
  testID: string;
  playerControlType?: string;
  isCaptionButtonFocused: boolean | null;
}

export interface CaptionOptionProps {
  video: VideoPlayer;
  enableCaption: (captionId: string) => void;
  selectedCaptionId: string | null;
}

export interface CaptionMenuItemProps {
  text: string;
  index?: string;
  selected?: boolean;
  onPress: () => void;
  testID?: string;
}

export interface CaptionMenuProps {
  captionMenuVisibility: boolean;
  video: VideoPlayer;
  setSelectedCaption: (id: string) => void;
  setCaptionMenuVisibility: (visible: boolean) => void;
}
