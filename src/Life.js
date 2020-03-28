import React, {useEffect} from 'react';
import { gsap } from 'gsap';
import './Life.css';

function Life() {
    useEffect(() => {
        const timeline = gsap.timeline();
        // timeline.from('.LifeTitle', {opacity: 0, y: '-100px', duration: 1.25});
        // timeline.from('.LifeCalendar', {opacity: 0, scale: 0.95, duration: 0.5}, '-=0.5');
        timeline.addLabel('Year 1');
        const year1Animation = {opacity: 0, x: '-40px', duration: 0.5, stagger: 0.25};
        timeline.from('.MonthHeading', year1Animation, 'Year 1');
        timeline.from('.Year1 > .Month', year1Animation, 'Year 1');
    });

    const months = ['Feb', 'Mar', 'Apr', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan'];
    const numYears = 20;
    const years = Array(numYears);
    for (let y = 0; y < numYears; y++) {
        years[y] = y+1;
    }

    return (
        <div className="Life">
            <h1 className="LifeTitle">Your Life</h1>
            <div className="LifeCalendar">
                <div className="MonthHeadings">
                    {
                        months.map((month, i) => <div key={i} className="MonthHeading">{month}</div>)
                    }
                </div>
                <div className="Year Year1">
                    { months.map((month, i) => <div key={i} className="Month"></div>) }
                </div>
                {
                    years.map((year, y) => {
                        return (
                            <div className="Year">
                                { months.map((month, i) => <div key={i} className="Month"></div>) }
                            </div>
                        );
                    })
                }
            </div>
        </div>
  );
}

export default Life;
