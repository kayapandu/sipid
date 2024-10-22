import {View, Platform} from 'react-native';
import {
  BufferConfig,
  DRMType,
  ISO639_1,
  SelectedTrackType,
  TextTrackType,
} from 'react-native-video';

export const isIos = Platform.OS === 'ios';

export const isAndroid = Platform.OS === 'android';

export const textTracksSelectionBy = SelectedTrackType.INDEX;
export const audioTracksSelectionBy = SelectedTrackType.INDEX;

export const srcList = [
  {
    title: 'Earth',
    url: 'https://file-examples.com/storage/fea570b16e6703ef79e65b4/2017/04/file_example_MP4_480_1_5MG.mp4',
  },
  {
    title: 'Bunny',
    url: 'https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
  },
];
