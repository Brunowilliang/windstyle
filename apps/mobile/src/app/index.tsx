import React from 'react'
import { View, Text } from 'react-native'
import { Example } from '../components/Button'

export default function Page() {
	return (
		<View className='flex-1 items-center justify-center bg-white'>
			<Text className='text-4xl font-bold'>Home</Text>
			<Example />
		</View>
	)
}
