
import { createElement } from './framework.js'
import Carousel from './Carousel';
import Button from './Button'
import List from './List'

const images = [
  {
    img: 'https://static001.geekbang.org/resource/image/bb/21/bb38fb7c1073eaee1755f81131f11d21.jpg',
    url: 'http://www.baidu.com',
    title: '黑猫'
  },
  {
    img: 'https://static001.geekbang.org/resource/image/1b/21/1b809d9a2bdf3ecc481322d7c9223c21.jpg',
    url: 'https://static001.geekbang.org/resource/image/1b/21/1b809d9a2bdf3ecc481322d7c9223c21.jpg',
    title: '橘猫'
  },
  {
    img: 'https://static001.geekbang.org/resource/image/b6/4f/b6d65b2f12646a9fd6b8cb2b020d754f.jpg',
    url: 'http://www.baidu.com',
    title: '橘猫加白'
  },
  {
    img: 'https://static001.geekbang.org/resource/image/73/e4/730ea9c393def7975deceb48b3eb6fe4.jpg',
    url: 'http://www.baidu.com',
    title: '田园猫'
  }
]

// const swipper = <Carousel src={images} onChange={event => console.log(event.detail.position)} onClick={event => window.location.href = event.detail.data.url} />;


// let button = <Button>content</Button>

let list = <List data={images}>
  {
    (item) => {
      return (
        <div>
          <img src={item.img}></img>
          <a href={item.url}>{item.title}</a>
        </div>
      )
    }
  }
</List>

list.mountTo(document.body);