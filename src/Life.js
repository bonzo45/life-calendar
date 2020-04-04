import React, {useEffect, useState} from 'react';
import { gsap } from 'gsap';
import './Life.css';

function Life() {

    // const states = ['start', 'title', 'calendar', 'birth'];
    const [ state, setState ] = useState('start');

    const prepareAnimation = () => {
        const timeline = gsap.timeline();
        timeline.to('.ArrowRight, .LifeTitleWrapper, .LifeCalendar, .MonthHeading.BirthMonth, .Month.BirthMonth, .MonthHeading:not(.BirthMonth), .Month:not(.BirthMonth)', {opacity: 0, duration: 0});
    };

    const runAnimation = () => {
        const timeline = gsap.timeline();

        if (state === 'start') {
            timeline.addLabel('start');
            const arrowAnimation = {x: '-10px', duration: 0.5};
            const arrowAnimationTo = {opacity: 1, duration: 0.5};
            timeline.from('.ArrowRight', arrowAnimation, 'start');
            timeline.to('.ArrowRight', arrowAnimationTo, 'start');
            setState('title');
        } else if (state === 'title') {
            timeline.addLabel('title');
            const titleAnimation = {y: '-100px', duration: 1.25};
            const titleAnimationTo = {opacity: 1, duration: 1.25};
            timeline.from('.LifeTitleWrapper', titleAnimation, 'title');
            timeline.to('.LifeTitleWrapper', titleAnimationTo, 'title');
            setState('birth');
        } else if (state === 'birth') {
            timeline.from('.LifeCalendar', {scale: 0.95, duration: 0.5}, '-=0.25');
            timeline.to('.LifeCalendar', {opacity: 1, duration: 0.5}, '-=0.25');

            timeline.addLabel('Birth');
            const birthDuration = 0.5;
            const birthStagger = 0.5;

            const monthHeadingAnimation = {y: '-18px', duration: birthDuration, stagger: birthStagger};
            const monthHeadingAnimationTo = {opacity: 1, duration: birthDuration, stagger: birthStagger};
            timeline.from('.MonthHeading.BirthMonth', monthHeadingAnimation, 'Birth');
            timeline.to('.MonthHeading.BirthMonth', monthHeadingAnimationTo, 'Birth');

            const birthAnimation = {x: '-40px', duration: birthDuration, stagger: birthStagger};
            const birthAnimationTo = {opacity: 1, duration: birthDuration, stagger: birthStagger};
            timeline.from('.Month.BirthMonth', birthAnimation, 'Birth');
            timeline.to('.Month.BirthMonth', birthAnimationTo, 'Birth');

            const birthTutorialAnimation = {x: '-40px', duration: birthDuration};
            const birthTutorialAnimationTo = {opacity: 1, duration: birthDuration};
            timeline.from('.Month.BirthMonth > .Tutorial', birthTutorialAnimation);
            timeline.to('.Month.BirthMonth > .Tutorial', birthTutorialAnimationTo);

            setState('year1');
        } else if (state === 'year1') {
            timeline.addLabel('Year 1');
            const year1Duration = 0.5;
            const year1Stagger = 0.25;
            const monthHeadingAnimation = {y: '-18px', duration: year1Duration, stagger: year1Stagger};
            const monthHeadingAnimationTo = {opacity: 1, duration: year1Duration, stagger: year1Stagger};
            timeline.from('.MonthHeading:not(.BirthMonth)', monthHeadingAnimation, 'Year 1');
            timeline.to('.MonthHeading:not(.BirthMonth)', monthHeadingAnimationTo, 'Year 1');

            const year1Animation = {opacity: 0, x: '-40px', duration: year1Duration, stagger: year1Stagger};
            const year1AnimationTo = {opacity: 1, duration: year1Duration, stagger: year1Stagger};
            timeline.from('.Year1 > .Month:not(.BirthMonth)', year1Animation, 'Year 1');
            timeline.to('.Year1 > .Month:not(.BirthMonth)', year1AnimationTo, 'Year 1');

            setState('restoflife');
        } else if (state === 'restoflife') {
            timeline.addLabel('Rest of Life');
            const restOfLifeDuration = 0.25;
            const restOfLifeStagger = 0.005;
            const restOfLifeAnimation = {opacity: 0, x: '-40px', duration: restOfLifeDuration, stagger: restOfLifeStagger};
            const restOfLifeAnimationTo = {opacity: 1, duration: restOfLifeDuration, stagger: restOfLifeStagger};
            timeline.from('.Year:not(.Year1) > .Month', restOfLifeAnimation, 'Year 1');
            timeline.to('.Year:not(.Year1) > .Month', restOfLifeAnimationTo, 'Year 1');

            const ninetyDuration = 0.5;
            const ninetyTutorialAnimation = {x: '40px', duration: ninetyDuration};
            const ninetyTutorialAnimationTo = {opacity: 1, duration: ninetyDuration};
            timeline.from('.Month.Ninety > .Tutorial', ninetyTutorialAnimation);
            timeline.to('.Month.Ninety > .Tutorial', ninetyTutorialAnimationTo);
        }
    };

    useEffect(prepareAnimation, []);
    useEffect(runAnimation, []);

    const months = ['Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan'];
    const numYears = 90;
    const numYearsHack = numYears - 1;
    const years = Array(numYearsHack);
    for (let y = 0; y < numYearsHack; y++) {
        years[y] = y+1;
    }

    return (
        <div className="Life">
            <div className="ArrowRight"
                 onClick={
                     () => runAnimation()
                 }
            />
            <div className="LifeTitleWrapper">
                <h1 className="LifeTitle">Your Life</h1>
            </div>
            <div className="LifeCalendar">
                <div className="MonthHeadings">
                    <div key={0} className="MonthHeading BirthMonth">{months[0]}</div>
                    {
                        months.slice(1).map((month, i) => <div key={i + 1} className="MonthHeading">{month}</div>)
                    }
                </div>
                <div className="Year Year1">
                    <div key={0} style={{zIndex: 12}} className="Month BirthMonth">
                        <div className="Tutorial">You were born!</div>
                    </div>
                    { months.slice(1).map((month, i) => <div key={i + 1} style={{zIndex: 12 - (i + 1)}} className="Month"></div>) }
                </div>
                {
                    years.map((year, y) => {
                        return (
                            <div className="Year">
                                { months.map((month, m) =>
                                    <div key={m} style={{zIndex: 12 - m}} className={`Month ${(y === 88 && m === 11) ? 'Ninety' : ''}`}>
                                        {(y === 88 && m === 11) ? <div className="Tutorial Right">You are 90!</div> : null}
                                    </div>
                                )}
                            </div>
                        );
                    })
                }
            </div>
        </div>
  );
}

export default Life;
