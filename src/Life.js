import React, {useEffect, useState} from 'react';
import { gsap } from 'gsap';
import './Life.css';

function Life() {
    const [ state, setState ] = useState(0);

    const prepareAnimation = () => {
        const timeline = gsap.timeline();
        timeline.to('.MonthHeading.BirthMonth, .Month.BirthMonth, .MonthHeading:not(.BirthMonth), .Month:not(.BirthMonth)', {opacity: 0, duration: 0});
    };

    const fadeIn = (duration, others) => ({autoAlpha: 1, duration, ...others});

    const runAnimation = () => {
        const timeline = gsap.timeline();

        switch (state) {
            default:
            case 0:
                timeline.addLabel('start');

                const titleDuration = 2;
                timeline.from('.LifeTitle', {y: '-100px', duration: titleDuration}, 'start');
                timeline.to('.LifeTitle', fadeIn(titleDuration), 'start');

                const buttonDuration = 0.5;
                const pulseSize = 0.025;
                timeline.set('.Continue', {scale: 0});
                timeline.to('.Continue', {scale: 1 + pulseSize, buttonDuration}, titleDuration);
                timeline.to('.Continue', fadeIn(buttonDuration), titleDuration);

                const pulseTimeline = gsap.timeline({repeat: -1});
                const pulseDuration = 1;
                pulseTimeline.to('.Continue', {scale: 1 - pulseSize, duration: pulseDuration, ease: "sine.inOut"});
                pulseTimeline.to('.Continue', {scale: 1 + pulseSize, duration: pulseDuration, ease: "sine.inOut"});
                timeline.add(pulseTimeline);

                // timeline.seek(10);
                break;

            case 1:
                timeline.addLabel('calendar');

                const calendarDuration = 1;
                timeline.from('.LifeCalendar', {scale: 0.95, duration: calendarDuration}, 'calendar');
                timeline.to('.LifeCalendar', fadeIn(calendarDuration), 'calendar');

                timeline.addLabel('birth');
                const birthDuration = 0.5;
                const birthStagger = 0.5;
                timeline.from('.MonthHeading.BirthMonth', {y: '-18px', duration: birthDuration, stagger: birthStagger}, 'birth');
                timeline.to('.MonthHeading.BirthMonth', fadeIn(birthDuration), 'birth');
                timeline.from('.Month.BirthMonth', {x: '-40px', duration: birthDuration, stagger: birthStagger}, 'birth');
                timeline.to('.Month.BirthMonth', fadeIn(birthDuration), 'birth');
                timeline.from('.Month.BirthMonth > .Tutorial', {x: '-40px', duration: birthDuration});
                timeline.to('.Month.BirthMonth > .Tutorial', fadeIn(birthDuration));
                break;

            case 2:
                timeline.addLabel('year1');
                const year1Duration = 0.5;
                const year1Stagger = 0.25;
                timeline.from('.MonthHeading:not(.BirthMonth)', {y: '-18px', duration: year1Duration, stagger: year1Stagger}, 'year1');
                timeline.to('.MonthHeading:not(.BirthMonth)', fadeIn(year1Duration, {stagger: year1Stagger}), 'year1');
                timeline.from('.Year1 > .Month:not(.BirthMonth)', {x: '-40px', duration: year1Duration, stagger: year1Stagger}, 'year1');
                timeline.to('.Year1 > .Month:not(.BirthMonth)', fadeIn(year1Duration, {stagger: year1Stagger}), 'year1');
                break;

            case 3:
                timeline.addLabel('Rest of Life');
                const restOfLifeDuration = 0.25;
                const restOfLifeStagger = 0.005;
                timeline.from('.Year:not(.Year1) > .Month', {x: '-40px', duration: restOfLifeDuration, stagger: restOfLifeStagger}, 'Year 1');
                timeline.to('.Year:not(.Year1) > .Month', fadeIn(restOfLifeDuration, {stagger: restOfLifeStagger}), 'Year 1');

                const ninetyDuration = 0.5;
                timeline.from('.Month.Ninety > .Tutorial', {x: '40px', duration: ninetyDuration});
                timeline.to('.Month.Ninety > .Tutorial', fadeIn(ninetyDuration));
                break;
        }
        setState(state + 1);
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
            <div className="LifeTitleWrapper">
                <h1 className="LifeTitle">
                    Your Life
                </h1>
                <div className="Continue"
                     onClick={
                         () => runAnimation()
                     }
                >
                </div>
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
