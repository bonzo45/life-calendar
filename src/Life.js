import React, {useEffect, useState} from 'react';
import { gsap } from 'gsap';
import './Life.css';

function Life() {

    // const states = ['start', 'title', 'calendar', 'birth'];
    const [ state, setState ] = useState('start');

    const runAnimation = () => {
        const timeline = gsap.timeline();

        if (state === 'start') {
            const arrowAnimation = {opacity: 0, x: '-10px', duration: 0.5};
            timeline.from('.ArrowRight', arrowAnimation);
            setState('title');
        } else if (state === 'title') {
            const titleAnimation = {opacity: 0, y: '-100px', duration: 1.25};
            timeline.from('.LifeTitleWrapper', titleAnimation);
            setState('calendar');
        } else if (state === 'calendar') {
            timeline.from('.LifeCalendar', {opacity: 0, scale: 0.95, duration: 0.5}, '-=0.25');
            setState('birth');
        } else if (state === 'birth') {
            timeline.addLabel('Birth');
            const birthDuration = 0.5;
            const birthStagger = 0.5;
            const monthHeadingAnimation = {opacity: 0, y: '-18px', duration: birthDuration, stagger: birthStagger};
            const birthAnimation = {opacity: 0, x: '-40px', duration: birthDuration, stagger: birthStagger};
            timeline.from('.MonthHeading.BirthMonth', monthHeadingAnimation, 'Birth');
            timeline.from('.Year1 > .Month.BirthMonth', birthAnimation, 'Birth');
            setState('year1');
        } else if (state === 'year1') {
            timeline.addLabel('Year 1');
            const year1Duration = 0.5;
            const year1Stagger = 0.5;
            const monthHeadingAnimation = {opacity: 0, y: '-18px', duration: year1Duration, stagger: year1Stagger};
            const year1Animation = {opacity: 0, x: '-40px', duration: year1Duration, stagger: year1Stagger};
            timeline.from('.MonthHeading:not(.BirthMonth)', monthHeadingAnimation, 'Year 1');
            timeline.from('.Year1 > .Month:not(.BirthMonth)', year1Animation, 'Year 1');
        }
    };
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
                    <div key={0} style={{zIndex: 12}} className="Month BirthMonth"></div>
                    { months.slice(1).map((month, i) => <div key={i + 1} style={{zIndex: 12 - (i + 1)}} className="Month"></div>) }
                </div>
                {
                    years.map((year, y) => {
                        return (
                            <div className="Year">
                                { months.map((month, i) => <div key={i} style={{visibility: 'hidden', zIndex: 12 - i}} className="Month"></div>) }
                            </div>
                        );
                    })
                }
            </div>
        </div>
  );
}

export default Life;
