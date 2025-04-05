import '../global.css'
import { Stack } from 'expo-router'
import {
	configureReanimatedLogger,
	ReanimatedLogLevel,
} from 'react-native-reanimated'

configureReanimatedLogger({
	level: ReanimatedLogLevel.warn,
	strict: false, // Reanimated runs in strict mode by default
})

export default function RootLayout() {
	return <Stack screenOptions={{ headerShown: false }} />
}
