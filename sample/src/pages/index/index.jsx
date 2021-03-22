import { Component } from 'react'
import { View, Text } from '@tarojs/components'
import './index.css'

export default class Index extends Component {

  componentWillMount () { }

  componentDidMount () { }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

  render () {
    return (
      <View className='bg-blue-300 h-full flex justify-center items-center'>
        <Text className='animate-spin'>Hello TailwindCSS 2.0!</Text>
      </View>
    )
  }
}
