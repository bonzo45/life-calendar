import React, {useEffect, useState} from 'react';
import { gsap } from 'gsap';
import classNames from 'classnames';

import './Life.css';

// Title
// Calendar
// Tutorial, Months, Tutorial, Months, Tutorial, Months, Tutorial.... <-- Next

const fadeIn = (duration, others) => ({autoAlpha: 1, duration, ...others});

const tutorials = [
    {
        year: 1,
        month: 1,
        tutorial: <div className='Tutorial'>You were born!</div>,
        className: 'BirthMonth',
        animate: timeline => {
            timeline.addLabel('birth');
            const birthDuration = 0.5;
            const birthStagger = 0.5;
            timeline.from('.MonthHeading.BirthMonth', {y: '-18px', duration: birthDuration, stagger: birthStagger}, 'birth');
            timeline.to('.MonthHeading.BirthMonth', fadeIn(birthDuration), 'birth');
            timeline.from('.Month.BirthMonth', {x: '-40px', duration: birthDuration, stagger: birthStagger}, 'birth');
            timeline.to('.Month.BirthMonth', fadeIn(birthDuration), 'birth');
            timeline.from('.Month.BirthMonth > .Tutorial', {x: '-40px', duration: birthDuration});
            timeline.to('.Month.BirthMonth > .Tutorial', fadeIn(birthDuration));
        },
    },
    {
        year: 1,
        month: 11,
        tutorial: <div className='Tutorial'>Your first Christmas 🎄'</div>,
        className: 'Christmas',
    },
    {
        year: 90,
        month: 12,
        tutorial: <div className='Tutorial Right'>You are 90!</div>,
        className: 'Ninety',
        animate: timeline => {
            const ninetyDuration = 0.5;
            timeline.from('.Month.Ninety > .Tutorial', {x: '40px', duration: ninetyDuration});
            timeline.to('.Month.Ninety > .Tutorial', fadeIn(ninetyDuration));
        }
    },
];

function Life() {
    const [ state, setState ] = useState(0);

    const prepareAnimation = () => {
        const timeline = gsap.timeline();
        timeline.to('.MonthHeading.BirthMonth, .Month.BirthMonth, .MonthHeading:not(.BirthMonth), .Month:not(.BirthMonth)', {opacity: 0, duration: 0});
    };

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

                tutorials[0].animate(timeline);
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

                tutorials[2].animate(timeline);
                break;
        }
        setState(state + 1);
    };

    useEffect(prepareAnimation, []);
    useEffect(runAnimation, []);

    const numYears = 90;
    const years = Array(numYears);
    for (let y = 0; y < numYears; y++) {
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
                <Months/>
                {
                    years.map((year, y) => {
                        return (
                            <Year y={y+1} tutorials={tutorials}/>
                        );
                    })
                }
            </div>
        </div>
  );
}

function Months() {
    const months = ['Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan'];
    return (
        <div className="MonthHeadings">
            <div key={0} className="MonthHeading BirthMonth">{months[0]}</div>
            {
                months.slice(1).map((month, i) => <div key={i + 1} className="MonthHeading">{month}</div>)
            }
        </div>
    );
}

function Year({y, tutorials}) {
    const months = ['Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan'];
    const yearClass = `Year Year${y}`;

    return (
        <div className={yearClass}>
            { months.map((month, m) => {
                const monthNum = m + 1;
                let monthClasses = 'Month';
                for (const tutorial of tutorials) {
                    monthClasses = classNames(monthClasses, {
                        [tutorial.className]: y === tutorial.year && monthNum === tutorial.month,
                        TutorialMonth: y === tutorial.year && monthNum === tutorial.month,
                    })
                }

                return (
                    <div key={monthNum} style={{zIndex: 12 - monthNum}}
                         className={monthClasses}
                    >
                        { tutorials.map((tutorial, t) =>
                            y === tutorial.year && monthNum === tutorial.month ? tutorial.tutorial : null
                        )}
                    </div>
                );
            })}
        </div>
    );
}

export default Life;
