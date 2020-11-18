import { Timeline, Animation } from './animation.js';
import { ease, easeIn, easeOut, easeInOut } from './ease.js';

let tl = new Timeline();
const obj = document.querySelector('#el').style;
const template = (v) => `translateX(${v}px)`;
let animation = new Animation(obj, 'transform', 0, 500, 2000, 0, easeInOut, template);
tl.add(animation);
tl.start();

document.getElementById('pause').addEventListener('click', () => tl.pause());
document.getElementById('resume').addEventListener('click', () => tl.resume());


document.querySelector('#el1').style.transition = 'transform ease-out 2s';
document.querySelector('#el1').style.transform = 'translateX(500px)';