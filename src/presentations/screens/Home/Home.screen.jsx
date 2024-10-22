import React, { useCallback, useContext, useState, useMemo, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import Video from 'react-native-video';
import RNFS from 'react-native-fs';
import { ActivityIndicator, MD2Colors, MD3Colors, ProgressBar, Modal, Portal, Button } from 'react-native-paper';
import { Overlay, toast, VideoLoader } from '../../components';
import { useNavigation } from '@react-navigation/native';

import useDevice from '../../hooks/useDevice';

const listDownloadUri = [
  {
    title: 'Earth.mp4',
    url: 'https://file-examples.com/storage/fea570b16e6703ef79e65b4/2017/04/file_example_MP4_480_1_5MG.mp4',
  },
  {
    title: 'Bunny.mp4',
    url: 'https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
  },
  // {
  //   title: 'sinarmas.jpeg',
  //   url: 'https://www.sinarmas.com/images/86th-slide.jpeg',
  // }
];

console.log('xxx downloadpath', RNFS.DownloadDirectoryPath)
console.log('xxx documentpath', RNFS.DocumentDirectoryPath)


function Home () {
  const videoRef = useRef(null);
  const { navigate } = useNavigation();

  const { deviceInfo } = useDevice();
  const [progress, setProgress] = useState(0);
  const [prog, setProg] = useState({});
  const [srcVideo, setSrcVideo] = useState([]);
  const [currentSrc, setCurrentSrc] = useState('');

  const [showModal, setShowModal] = useState(false);

  const [paused, setPaused] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [controls, setControls] = useState(false);
  const [repeat, setRepeat] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [srcListId, setSrcListId] = useState(0);
  const [volume, setVolume] = useState(1);
  const [muted, setMuted] = useState(false);
  const [useCache, setUseCache] = useState(false);
  const [showPoster, setShowPoster] = useState(false);
  const [showNotificationControls, setShowNotificationControls] =
    useState(false);
  const [isSeeking, setIsSeeking] = useState(false);
  const [_, setVideoSize] = useState({videoWidth: 0, videoHeight: 0});

  const viewStyle = fullscreen ? styles.fullScreen : styles.halfScreen;

  const goToChannel = useCallback((channel) => {
    setSrcListId(channel);
    setDuration(0);
    setCurrentTime(0);
    setVideoSize({videoWidth: 0, videoHeight: 0});
    setIsLoading(false);
  }, []);

  const channelUp = useCallback(() => {
    console.log('channel up');
    goToChannel((srcListId + 1) % srcVideo.length);
  }, [goToChannel, srcListId]);

  const channelDown = useCallback(() => {
    console.log('channel down');
    goToChannel((srcListId + srcVideo.length - 1) % srcVideo.length);
  }, [goToChannel, srcListId]);

  const onProgress = (data) => {
    setCurrentTime(data.currentTime);
  };

  const onSeek = (data) => {
    setCurrentTime(data.currentTime);
    setIsSeeking(false);
  };

  const onVideoLoadStart = () => {
    console.log('onVideoLoadStart');
    setIsLoading(true);
  };

  const onAspectRatio = (data) => {
    console.log('onAspectRadio called ' + JSON.stringify(data));
    setVideoSize({videoWidth: data.width, videoHeight: data.height});
  };

  const _controlsStyles = {
    hideNavigationBarOnFullScreenMode: true,
    hideNotificationBarOnFullScreenMode: true,
    liveLabel: "LIVE"
  };

  const _renderLoader = <ActivityIndicator animating={true} color={MD2Colors.red800} />;

  const clearExisting = async (title) => {
    const filePath = `${RNFS.DocumentDirectoryPath}${title}.mp4`;
    RNFS.unlink(filePath)
      .then(() => {
        console.log('Previous file deleted');
      })
      .catch((err) => {
        console.log(err.message);
      });
  };

  const progressSet = useCallback((res, title) => {
    const gres = (res.bytesWritten / res.contentLength) * 100;
    // setProgress(prog.toFixed(2) / 100);
    setProg(prev => ({
      ...prev,
      [title]: gres.toFixed(2) / 100,
    }));
  }, []);

  const downloadFile = async (url, title) => {
    // const url = listDownloadUri[0].url;
    const filePath = `${RNFS.DocumentDirectoryPath}/${title}`;

    await clearExisting(title);

    setIsLoading(true);

    await RNFS.downloadFile({
        fromUrl: url,
        toFile: filePath,
        background: true, // Enable downloading in the background (iOS only)
        discretionary: true, // Allow the OS to control the timing and speed (iOS only)
        progressInterval: 100,
        progress: (res) => progressSet(res, title),
      })
        .promise.then((response) => {
          const newSrc = [...srcVideo];
          newSrc.push(filePath);
          console.log(newSrc);
          setSrcVideo(prev => [...prev, ...newSrc]);
          setCurrentSrc(filePath);
          console.log('File downloaded!', response);
          return new Promise.resolve(filePath);
        })
        .catch((err) => {
          console.log('Download error:', err);
          return new Promise.reject(err)
        });
  };

  const onDownloadFile = async () => {
    setShowModal(true);

    for(const item of listDownloadUri) {
        await downloadFile(item.url, item.title)
          .then(res => console.log(res))
          .catch(err => console.log(err));
    }

    setShowModal(false);
  };

  // console.log('xxx set', srcVideo[0])
  // console.log('xxx current', currentSrc)

  useEffect(() => {
    console.log('xxx prog', prog)
  }, [prog])

  const navigateToPlaylist = () => {
    navigate("Playlist");
  }

  const renderVideo = () => (
    <View style={styles.videoContainer}>
      <TouchableOpacity style={viewStyle}>
        <Video
          source={{uri: currentSrc}}
          ref={videoRef}
          repeat={repeat}
          paused={paused}
          volume={volume}
          muted={muted}
          onAspectRatio={onAspectRatio}
          onSeek={onSeek}
          renderLoader={_renderLoader}
          onProgress={onProgress}
          onError={(e) => console.log('xxx err', e)}
          style={viewStyle}
        />
      </TouchableOpacity>
      <Overlay
        setFullscreen={setFullscreen}
        srcListId={srcListId}
        controls={controls}
        audioTracks={[]}
        textTracks={[]}
        currentTime={currentTime}
        setMuted={setMuted}
        muted={muted}
        duration={duration}
        paused={paused}
        volume={volume}
        setControls={setControls}
        showPoster={showPoster}
        isLoading={isLoading}
        setIsSeeking={setIsSeeking}
        repeat={repeat}
        setRepeat={setRepeat}
        setShowPoster={setShowPoster}
        setShowNotificationControls={setShowNotificationControls}
        showNotificationControls={showNotificationControls}
        setUseCache={setUseCache}
        setVolume={setVolume}
        setPaused={setPaused}
        useCache={useCache}
        isSeeking={isSeeking}
        channelDown={channelDown}
        channelUp={channelUp}
      />
    </View>
  );

  const renderDeviceInfo = useMemo(() => (
    <View style={styles.deviceInfoContainer}>
      <Text>Os: {deviceInfo?.baseOs}</Text>
      <Text>Brand: {deviceInfo?.brand}</Text>
      <Text>Device: {deviceInfo?.device}</Text>
      <Text>DeviceId: {deviceInfo?.deviceId}</Text>
      <Text>DeviceName: {deviceInfo?.deviceName}</Text>
      <Text>DeviceType: {deviceInfo?.deviceType}</Text>
      <Text>Display: {deviceInfo?.display}</Text>
      <Text>Hardware: {deviceInfo?.hardware}</Text>
    </View>
  ), [deviceInfo]);

  const renderProgressText = useCallback((item, i) => {
    console.log('progress: ', item);
    return (
    <View key={`progress_${i}`} style={{ width: '50%' }}>
      <Text  style={{ fontWeight: '800', color: 'black' }}>Downloading</Text>
      <ProgressBar progress={item} color={MD3Colors.error50} />
    </View>
  )}, []);

  const renderDownloadButton = useMemo(() => (
    <TouchableOpacity onPress={onDownloadFile} style={styles.btnContainer}>
      <Text style={{ fontWeight: '800', color: '#fff' }}>Download</Text>
    </TouchableOpacity>
  ), []);

  const renderPlaylistButton = useMemo(() => (
    <TouchableOpacity onPress={() => setShowModal(true)} style={styles.btnContainer}>
      <Text style={{ fontWeight: '800', color: '#fff' }}>Playlist</Text>
    </TouchableOpacity>
  ), []);

  const renderModal = useCallback(() => (
    <Portal>
      <Modal visible={showModal} onDismiss={() => setShowModal(false)} contentContainerStyle={styles.modalContainer}>
        {listDownloadUri.map((item, i) => {
          return renderProgressText(prog[item.title], i);
        })}
      </Modal>
    </Portal>
  ), [prog, renderProgressText, showModal]);

  return (
    <SafeAreaView>
      <View style={styles.container}>
        <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', width: '100%' }}> 
          <Text style={styles.title}>
            Public Information Display
          </Text>
          {renderDownloadButton}
          {/* {renderPlaylistButton} */}
        </View>
        {/* {isLoading && renderProgressText} */}
        {/* {renderDeviceInfo} */}
      </View>
      {renderVideo()}
      {renderModal()}
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  modalContainer: {
    backgroundColor: 'white',
    padding: 20,
    alignItems: 'center',
  },
  container: {
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 5,
  },
  header: {
    position: 'absolute',
    top: 0,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%'
  },
  deviceInfoContainer: {
    display: 'flex',
    flexDirection: 'column',
    marginVertical: 20,
    borderColor: 'black',
    borderWidth: 1,
    color: 'black',
  },
  videoContainer: {
    display: 'flex',
    backgroundColor: 'black',
    padding: 10,
    borderColor: 'black',
    marginVertical: 10,
    borderWidth: 1,
    color: 'black',
    minHeight: '100%',
    minWidth: '100%',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'black',
  },
  btnContainer: {
    padding: 10,
    backgroundColor: '#33b8ff',
    borderColor: 'black',
    borderWidth: 0.5,
    borderRadius: 9,
  },
  txtProgress: {
    fontSize: 30,
    fontWeight: '900',
  },
  halfScreen: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 50,
    right: 50,
  },
  fullScreen: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
});


export default Home;

