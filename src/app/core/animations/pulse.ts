import { style, animate, animation, keyframes, trigger, transition, useAnimation, AnimationOptions } from '@angular/animations';

export const pulseAnimation = animation([
    animate('{{transition}} {{delay}} {{ease}}', keyframes([
        style({
            offset: 0.5,
            transform: 'scale(1.5)'
        }),
        style({ offset: 1 }),
    ]))],
    {
        params: {
            transition: '400ms',
            delay: '0s',
            ease: 'ease-out'
        }
    }
);

export const pulseTrigger = (options: AnimationOptions) => {
    return trigger('pulse', [
        transition('* => pulse', [
            useAnimation(pulseAnimation, options)
        ])
    ]);
};
