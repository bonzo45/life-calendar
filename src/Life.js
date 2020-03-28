import React, {useEffect} from 'react';
import { gsap } from 'gsap';
import './Life.css';

function Life() {
    const runAnimation = () => {
        const timeline = gsap.timeline();
        const titleAnimation = {opacity: 0, y: '-100px', duration: 1.25};
        timeline.from('.LifeTitleWrapper', titleAnimation);
        timeline.from('.LifeCalendar', {opacity: 0, scale: 0.95, duration: 0.5}, '-=0.25');
        timeline.addLabel('Year 1');
        const year1Duration = 0.5;
        const year1Stagger = 0.5;
        const monthHeadingAnimation = {opacity: 0, y: '-18px', duration: year1Duration, stagger: year1Stagger};
        const year1Animation = {opacity: 0, x: '-40px', duration: year1Duration, stagger: year1Stagger};
        timeline.from('.MonthHeading', monthHeadingAnimation, 'Year 1');
        timeline.from('.Year1 > .Month', year1Animation, 'Year 1');
        const arrowAnimation = {opacity: 0, x: '-10px', duration: 0.5};
        timeline.from('.ArrowRight', arrowAnimation);
    };
    useEffect(runAnimation);

    const months = ['Feb', 'Mar', 'Apr', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan'];
    const numYears = 90;
    const numYearsHack = numYears - 1;
    const years = Array(numYearsHack);
    for (let y = 0; y < numYearsHack; y++) {
        years[y] = y+1;
    }

    return (
        <div className="Life">
            <div className="LifeTitleWrapper">
                <h1 className="LifeTitle">Your Life</h1>
                <div className="ArrowRight"
                     onClick={
                         () => runAnimation()
                     }
                />
            </div>
            <div className="LifeCalendar">
                <div className="MonthHeadings">
                    {
                        months.map((month, i) => <div key={i} className="MonthHeading">{month}</div>)
                    }
                </div>
                <div className="Year Year1">
                    { months.map((month, i) => <div key={i} style={{zIndex: 12 - i}} className="Month"></div>) }
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
