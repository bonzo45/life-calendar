import React, {useEffect, useState} from 'react';
import { gsap } from 'gsap';
import classNames from 'classnames';

import './Life.css';

// Title
// Calendar, MonthHeadings
// Tutorial, Months + Tutorial, Months, Tutorial, Months, Tutorial.... <-- Next

const fadeIn = (duration, others) => ({autoAlpha: 1, duration, ...others});

const tutorialDuration = 0.5;

const tutorials = [
    {
        year: 1,
        month: 1,
        tutorial: <div key='tutorial-birth' className='Tutorial'>You were born!</div>,
        className: 'BirthMonth',
        animate: timeline => {
            timeline.addLabel('birth');
            const birthDuration = 0.5;
            const birthStagger = 0.5;
            timeline.from('.Month.BirthMonth', {x: '-40px', duration: birthDuration, stagger: birthStagger}, 'birth');
            timeline.to('.Month.BirthMonth', fadeIn(birthDuration), 'birth');
            timeline.from('.Month.BirthMonth > .Tutorial', {x: '-40px', duration: birthDuration});
            timeline.to('.Month.BirthMonth > .Tutorial', fadeIn(birthDuration));
        },
    },
    {
        year: 1,
        month: 11,
        tutorial: <div key='tutorial-christmas' className='Tutorial'>Your first Christmas 🎄'</div>,
        className: 'Christmas',
        animate: (timeline) => {
            timeline.from('.Month.Christmas > .Tutorial', {x: '-40px', duration: tutorialDuration});
            timeline.to('.Month.Christmas > .Tutorial', fadeIn(tutorialDuration));
        }
    },
    {
        year: 90,
        month: 12,
        tutorial: <div key='tutorial-ninety' className='Tutorial Right'>You are 90!</div>,
        className: 'Ninety',
        animate: timeline => {
            const ninetyDuration = 0.5;
            timeline.from('.Month.Ninety > .Tutorial', {x: '40px', duration: ninetyDuration});
            timeline.to('.Month.Ninety > .Tutorial', fadeIn(ninetyDuration));
        },
        quickly: true,
    },
];

function getMonthsBetween(tutorialA, tutorialB) {
    const yearFrom = tutorialA.year;
    const monthFrom = tutorialA.month;
    const yearTo = tutorialB.year;
    const monthTo = tutorialB.month;

    let selectors = [];
    let currentYear = yearFrom;
    let currentMonth = monthFrom;
    const incrementMonth = (currentYear, currentMonth) => {
        currentMonth++;
        if (currentMonth === 13) {
            currentYear++;
            currentMonth = 1;
        }
        return [currentYear, currentMonth];
    };

    [currentYear, currentMonth] = incrementMonth(currentYear, currentMonth);
    const addToResult = (year, month) => {
        selectors.push(`.Year${year}.Month${month}`);
    };

    while ((currentYear < yearTo) || ((currentYear === yearTo) && (currentMonth <= monthTo))) {
        addToResult(currentYear, currentMonth);
        [currentYear, currentMonth] = incrementMonth(currentYear, currentMonth);
    }

    return selectors.join(',');
}

function animateBetween(timeline, tutorialA, tutorialB) {
    const targets = getMonthsBetween(tutorialA, tutorialB);

    const duration = tutorialB.quickly ? 0.25 : 0.5;
    const stagger = tutorialB.quickly ? 0.005 : 0.125;
    timeline.from(targets, {x: '-40px', duration: duration, stagger: stagger}, 'between');
    timeline.to(targets, fadeIn(duration, {stagger: stagger}), 'between');
}

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
                timeline.to('.Continue', {scale: 1 + pulseSize, duration: buttonDuration}, titleDuration);
                timeline.to('.Continue', fadeIn(buttonDuration), titleDuration);

                const pulseTimeline = gsap.timeline({repeat: -1});
                const pulseDuration = 1;
                pulseTimeline.to('.Continue', {scale: 1 - pulseSize, duration: pulseDuration, ease: "sine.inOut"});
                pulseTimeline.to('.Continue', {scale: 1 + pulseSize, duration: pulseDuration, ease: "sine.inOut"});
                timeline.add(pulseTimeline);

                timeline.seek(10);
                break;

            case 1:
                timeline.addLabel('calendar');

                const calendarDuration = 1;
                timeline.from('.LifeCalendar', {scale: 0.95, duration: calendarDuration}, 'calendar');
                timeline.to('.LifeCalendar', fadeIn(calendarDuration), 'calendar');

                timeline.addLabel('year1');
                const headingsDuration = 0.5;
                const headingsStagger = 0.125;
                timeline.from('.MonthHeading', {y: '-18px', duration: headingsDuration, stagger: headingsStagger}, 'headings');
                timeline.to('.MonthHeading', fadeIn(headingsDuration, {stagger: headingsStagger}), 'headings');

                break;

            case 2:
                tutorials[0].animate(timeline);
                break;

            case 3:
                animateBetween(timeline, tutorials[0], tutorials[1]);
                tutorials[1].animate(timeline);
                break;

            case 4:
                animateBetween(timeline, tutorials[1], tutorials[2]);
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
                            <Year key={y+1} y={y+1} tutorials={tutorials}/>
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
                let monthClasses = `Month Year${y} Month${monthNum}`;
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
