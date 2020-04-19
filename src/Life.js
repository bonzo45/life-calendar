import React, {useEffect, useState, useRef} from 'react';
import { gsap } from 'gsap';
import classNames from 'classnames';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlay } from '@fortawesome/free-solid-svg-icons'

import './Life.scss';

const fadeIn = (duration, others) => ({autoAlpha: 1, duration, ...others});
const fadeOut = (duration, others) => ({autoAlpha: 0, duration, ...others});

const messageDuration = 0.5;

const messageAnimation = (timeline, className) => {
    timeline.to(`.Message.${className}`, fadeIn(messageDuration));
    timeline.from(`.Message.${className}`, {x: '400px', duration: messageDuration}, `+=${messageDuration}`);
};

const messageAnimationRef = (timeline, ref, className) => {
    const [translationX, translationY] = translationToCenter(ref);
    timeline.set(`.Message.${className}`, {scale: 0.5, filter: 'blur(2px)', x: translationX, y: translationY});
    timeline.to(`.Message.${className}`, fadeIn(1, {scale: 2, filter: 'blur(0px)'}));
    timeline.to(`.Message.${className}`, {x: 0, y: 0, scale: 1, duration: 1}, '+=1');
};

const steps = [
    {
        year: 1,
        month: 1,
        animate: (timeline, ref) => {
            messageAnimationRef(timeline, ref, 'BirthMonth');
        },
    },
    {
        year: 1,
        month: 11,
        animate: (timeline) => {
            messageAnimation(timeline, 'Christmas');
        }
    },
    {
        year: 5,
        month: 1,
        animate: (timeline) => {
            messageAnimation(timeline, 'Five');
        }
    },
    {
        year: 27,
        month: 3,
        animate: (timeline) => {
            messageAnimation(timeline, 'Now');
        }
    },
    {
        year: 90,
        month: 12,
        animate: timeline => {
            messageAnimation(timeline, 'Ninety');
        },
    },
];

function getMonthsBetween(stepA, stepB) {
    let yearFrom = 1;
    let monthFrom = 0;
    if (stepA) {
        yearFrom = stepA.year;
        monthFrom = stepA.month;
    }
    const yearTo = stepB.year;
    const monthTo = stepB.month;

    return (yearTo - yearFrom) * 12 + (monthTo - monthFrom);
}

function getMonthSelectorBetween(stepA, stepB) {
    let yearFrom = 1;
    let monthFrom = 0;
    if (stepA) {
        yearFrom = stepA.year;
        monthFrom = stepA.month;
    }
    const yearTo = stepB.year;
    const monthTo = stepB.month;

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

function animateBetween(timeline, stepA, stepB) {
    const targets = getMonthSelectorBetween(stepA, stepB);
    const months = getMonthsBetween(stepA, stepB);
    const duration = 0.5;
    const baseTime = 4;
    const stagger = baseTime / months;

    timeline.from(targets, {x: '-40px', duration: duration, stagger: stagger}, 'between');
    timeline.to(targets, fadeIn(duration, {stagger: stagger}), 'between');
}

function translationToCenter(elementRef) {
    const fromX = window.innerWidth / 2;
    const fromY = window.innerHeight / 2;
    const rect = elementRef.current.getBoundingClientRect();
    const currentX = rect.x + rect.width / 2;
    const currentY = rect.y + rect.height / 2;
    return [fromX - currentX, fromY - currentY];
}

function Life() {
    const [ state, setState ] = useState(0);

    const titleRef = useRef();
    const bornRef = useRef();

    const prepareAnimation = () => {
        const timeline = gsap.timeline();
        timeline.to('.MonthHeading.BirthMonth, .Month.BirthMonth, .MonthHeading:not(.BirthMonth), .Month:not(.BirthMonth)', {opacity: 0, duration: 0});
    };

    const runAnimation = () => {
        // const timeline = gsap.timeline({repeat: -1});
        const timeline = gsap.timeline();

        switch (state) {
            case 0:
                timeline.addLabel('start');

                const [translationX, translationY] = translationToCenter(titleRef);
                timeline.set('.LifeTitle', {scale: 0.5, filter: 'blur(5px)', x: translationX, y: translationY}, '+=0.5');
                timeline.to('.LifeTitle', fadeIn(2, {scale: 2, filter: 'blur(0px)'}));
                timeline.to('.LifeTitle', {x: 0, y: 0, scale: 1, duration: 1}, '+=1.5');

                const buttonDuration = 0.5;
                const pulseSize = 0.025;
                timeline.addLabel('continue');
                timeline.set('.Continue', {scale: 0}, 'continue');
                timeline.to('.Continue', {scale: 1 + pulseSize, duration: buttonDuration}, 'continue');
                timeline.to('.Continue', fadeIn(buttonDuration), 'continue');

                const pulseTimeline = gsap.timeline({repeat: -1});
                const pulseDuration = 1;
                pulseTimeline.to('.Continue', {scale: 1 - pulseSize, duration: pulseDuration, ease: "sine.inOut"});
                pulseTimeline.to('.Continue', {scale: 1 + pulseSize, duration: pulseDuration, ease: "sine.inOut"});
                timeline.add(pulseTimeline);

                timeline.seek(10);
                break;

            case 1:
                timeline.addLabel('calendar');

                const calendarDuration = 1.5;
                timeline.from('.LifeCalendar', {scale: 0.95, duration: calendarDuration}, 'calendar');
                timeline.to('.LifeCalendar', fadeIn(calendarDuration), 'calendar');

                timeline.to(
                    getMonthSelectorBetween({year: 1, month: 0}, {year: 90, month: 12}),
                    fadeIn(1, {stagger: {
                            amount: 2,
                            from: "random",
                            grid: "auto",
                        }})
                );

                const yearLabelDuration = 0.75;
                const yearLabelStagger = {
                    amount: 2,
                    from: "random",
                };
                timeline.addLabel('yearheadings');
                timeline.from('.YearLabelText', {
                    x: '-18px', duration: yearLabelDuration, stagger: yearLabelStagger
                }, 'headings');
                timeline.to('.YearLabelText', fadeIn(
                    yearLabelDuration, {stagger: yearLabelStagger}
                ), 'headings');

                const headingsDuration = 0.75;
                const headingsStagger = 0.125;
                timeline.addLabel('headings');
                timeline.from('.MonthHeading', {y: '-18px', duration: headingsDuration, stagger: headingsStagger}, 'headings');
                timeline.to('.MonthHeading', fadeIn(headingsDuration, {stagger: headingsStagger}), 'headings');

                // timeline.seek(10);
                break;

            default:
                animateBetween(timeline, steps[state - 3], steps[state - 2]);
                steps[state - 2].animate(timeline, bornRef);
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
                <h1 className="LifeTitle" ref={titleRef}>
                    Your Life
                </h1>
                <div className="Continue"
                     onClick={
                         () => runAnimation()
                     }
                >
                    <FontAwesomeIcon icon={faPlay} />
                </div>
            </div>
            <div className="LifeCalendarWrapper">
                <div className="Messages">
                    <div key='message-birth' className='Message BirthMonth' ref={bornRef}>You were born!</div>
                    <div key='message-christmas' className='Message Christmas'>🎄 Your first Christmas!</div>
                    <div key='message-five' className='Message Five'>You are 5!</div>
                    <div key='message-now' className='Message Now'>Now!</div>
                    <div key='message-ninety' className='Message Ninety'>You are 90!</div>
                </div>
                <div className="LifeCalendar">
                    <Months/>
                    {
                        years.map((year, y) => {
                            return (
                                <Year key={y+1} y={y+1} steps={steps}/>
                            );
                        })
                    }
                </div>
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

function Year({y, steps}) {
    const months = ['Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan'];
    const yearClass = `Year Year${y}`;

    return (
        <div className={yearClass}>
            <div className="YearLabelText">{1993 + y - 1}</div>
            { months.map((month, m) => {
                const monthNum = m + 1;
                let monthClasses = `Month Year${y} Month${monthNum}`;
                for (const step of steps) {
                    monthClasses = classNames(monthClasses, {
                        MonthWithMessage: y === step.year && monthNum === step.month,
                    })
                }

                return (
                    <div key={monthNum} style={{zIndex: 12 - monthNum}}
                         className={monthClasses}
                    />
                );
            })}
        </div>
    );
}

export default Life;
