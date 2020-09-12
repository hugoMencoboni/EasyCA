import { style, animate, animation, transition, trigger, useAnimation } from '@angular/animations';

export const rotationAnimation = animation([
    animate('{{transition}} {{delay}} {{ease}}', style({ transform: 'rotate(360deg)' }))],
    {
        params: {
            transition: '300ms',
            delay: '0s',
            ease: 'ease-out'
        }
    },
);

export const rotateTrigger = trigger('rotate', [
    transition('* => rotation', [
        useAnimation(rotationAnimation)
    ])
]);

