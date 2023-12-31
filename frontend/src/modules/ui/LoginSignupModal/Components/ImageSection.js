import React from 'react';
import {
    Image,
    ImageContainer,
    ImageOverlayText,
    AnimatedSideComponent,
} from '../Styles/Styles';

const elements = [
    {
        title: 'Paris',
        vertical: 'top',
        verticalPercentage: '10%',
        horizontal: 'left',
        horizontalPercentage: '0%',
    },
    {
        title: 'Hawai',
        vertical: 'top',
        verticalPercentage: '20%',
        horizontal: 'right',
        horizontalPercentage: '0%',
    },
    {
        title: 'Thailand',
        vertical: 'bottom',
        verticalPercentage: '20%',
        horizontal: 'left',
        horizontalPercentage: '0%',
    },
    {
        title: 'Manali',
        vertical: 'bottom',
        verticalPercentage: '30%',
        horizontal: 'right',
        horizontalPercentage: '0%',
    },
];

export default function ImageSection({ position }) {
    return (
        <ImageContainer
            initial={{ x: position === 'left' ? '100%' : '-100%' }}
            animate={{ x: 0 }}
            transition={{ stiffness: 120 }}
        >
            {elements.map((element, index) => {
                return (
                    <AnimatedSideComponent element={element} index={index} />
                );
            })}
            <ImageOverlayText>Find Your TripZip</ImageOverlayText>
            <Image src="/images/fallback/AuthModal.jpg" alt="Background" />
        </ImageContainer>
    );
}
