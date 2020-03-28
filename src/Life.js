import React, {useEffect} from 'react';
import { gsap } from 'gsap';
import './Life.css';

function Life() {
    useEffect(() => {
        const timeline = gsap.timeline();
        timeline.from('.LifeTitle', {opacity: 0, y: '-100px', duration: 1.25});
        timeline.from('.LifeCalendar', {opacity: 0, scale: 0.95, duration: 0.5}, '-=0.5');
        timeline.from('.MonthHeading', {opacity: 0, scale: 0.95, duration: 0.5, stagger: 0.25});
    });

    const months = ['Feb', 'Mar', 'Apr', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan'];

    return (
        <div className="Life">
            <h1 className="LifeTitle">Your Life</h1>
            <div className="LifeCalendar">
                <div className="MonthHeadings">
                    {
                        months.map((month, i) => <div className="MonthHeading">month</div>)
                    }
                </div>
            </div>
        </div>
  );
}

export default Life;
