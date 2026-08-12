import AppButton, { AppButtonLabel } from '@/components/ui/buttons/AppButton/AppButton';
import { AuthRepository } from '@/lib/repositories/authRepository/auth.repository';
import { Image } from 'expo-image';
import { GlassView } from 'expo-glass-effect';
import { Avatar, Dialog } from 'heroui-native';
import { StyleSheet, useWindowDimensions, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AppHeading from '@/components/ui/text/Heading/AppHeading';
import Animated, { useAnimatedScrollHandler, useAnimatedStyle, useSharedValue } from 'react-native-reanimated';
import AppParagraph from '@/components/ui/text/Paragraph/AppParagraph';

const profileImageSize = 144;
const profileImageRadius = profileImageSize / 2;
const AnimatedImage = Animated.createAnimatedComponent(Image);

export default function Profile() {
  const { height } = useWindowDimensions();
  const profileHeaderHeight = height / 2;
  const scrollY = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler((event) => {
    scrollY.value = event.contentOffset.y;
  });

  const imageAnimatedStyle = useAnimatedStyle(() => {
    const isStretching = scrollY.value < 0;
    return {
      transform: [
        { translateY: isStretching ? -scrollY.value / 2 : 0 },
        {
          scale: isStretching ? 1 - scrollY.value / profileHeaderHeight : 1,
        },
      ],
    };
  });

  return (
    <View className="flex-1">
      <View className="inset-0 absolute" style={{ height: profileHeaderHeight }}>
        <AnimatedImage
          contentFit="cover"
          style={[styles.profileBackground, imageAnimatedStyle]}
          source={require('@/assets/images/profile/profileBackground.jpeg')}
        />
      </View>
      <Animated.ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingTop: profileHeaderHeight, paddingBottom: 24 }}
        contentInsetAdjustmentBehavior="never"
        automaticallyAdjustContentInsets={false}
        showsVerticalScrollIndicator={false}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
      >
        <SafeAreaView style={{ flex: 1, minHeight: height - profileHeaderHeight }} edges={['bottom']}>
          <View className="bg-background flex-1 ">
            <View className="absolute top-0 left-1/2 -translate-x-1/2">
              <Dialog>
                <Dialog.Trigger>
                  <GlassView style={styles.glassView} glassEffectStyle="clear">
                    <Avatar className="w-full h-full border-2 ">
                      <Avatar.Fallback />
                      <Avatar.Image source={require('@/assets/images/profile/gaga.jpg')} />
                    </Avatar>
                  </GlassView>
                </Dialog.Trigger>
                <Dialog.Portal>
                  <Dialog.Overlay></Dialog.Overlay>
                  <Dialog.Content>
                    <AppButton
                      onPress={async () => {
                        await AuthRepository.signOut();
                      }}
                    >
                      <AppButtonLabel>Logout</AppButtonLabel>
                    </AppButton>
                  </Dialog.Content>
                </Dialog.Portal>
              </Dialog>
            </View>

            <View style={styles.belowView} className="px-4 mt-4 flex-1 flex-col gap-4">
              <View>
                <AppHeading type="h1">{"Gaga's Profile"}</AppHeading>
                <AppParagraph>{"This is Gaga's profile page."}</AppParagraph>
              </View>
              <View className="flex-1 h-full justify-center items-center">
                <AppParagraph>{'No Posts Yet'}</AppParagraph>
              </View>
            </View>
          </View>
        </SafeAreaView>
      </Animated.ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  belowView: {
    boxSizing: 'border-box',
    paddingTop: profileImageRadius,
  },

  glassView: {
    width: 144,
    height: 144,
    borderRadius: profileImageRadius,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    borderWidth: 2,
    borderColor: '#94a3b8',
    overflow: 'hidden',
    padding: 10,
    top: -profileImageRadius,
    zIndex: 10,
  },

  profileBackground: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    top: 0,
    zIndex: -1,
  },
});
