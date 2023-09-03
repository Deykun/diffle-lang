import clsx from 'clsx';

import './CircleScale.scss'

const CircleScale = ({ breakPoints = [], value }) => {
    const maxPoint = breakPoints.at(-1);

    console.log('maxPoint', maxPoint);

    return (
        <div className="circle-scale">
            {breakPoints.map((breakPoint) => <>
                <span className={clsx('circle-scale-border', {
                    'circle-scale-border-checked': value >= breakPoint,
                })} style={{ width: `${(breakPoint / maxPoint) * 100}%` }}><span>{breakPoint}</span></span>
            </>)}
        </div>
    )
};

export default CircleScale;
