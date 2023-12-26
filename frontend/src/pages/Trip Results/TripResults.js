import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { backendOrigin } from '../../frontend.config';
import { useRecoilState, useRecoilValue } from 'recoil';
import { TripResultStates } from './states/TripResultStates';
import TripCard from '../../modules/TripResults/TripCard';

import {
    Container,
    Wrapper,
    StyledLoadButton,
    StyledButtonWrapper,
    Content,
} from './TripResultsStyles';
import SkeletonCard from '../../modules/TripResults/SkeletonCard';
import { LoadingStatusStates } from './states/LoadingStatusStates';

export default function TripResults() {
    const { search } = useLocation();
    const params = new URLSearchParams(search);

    const location = params.get('location');
    const fromDate = params.get('fromDate');
    const toDate = params.get('toDate');
    const instance = axios.create({
        withCredentials: true,
        baseURL: backendOrigin,
    });

    const [, setTripResults] = useRecoilState(TripResultStates);
    const tripResults = useRecoilValue(TripResultStates);
    const [, setLoadingStatus] = useRecoilState(LoadingStatusStates);
    const loadingStatus = useRecoilValue(LoadingStatusStates);

    const [tripCount, setTripCount] = useState(0);

    const fetchTripsHandler = async () => {
        try {
            setLoadingStatus({ ...loadingStatus, loading: false });
            const response = await instance.get('/trips', {
                params: {
                    page: loadingStatus.page,
                    location,
                    toDate,
                    fromDate,
                },
                headers: { 'Content-Type': 'application/json' },
            });
            if (response.status === 200) {
                const newTrips = response.data.data.trips;
                const existingKeys = tripResults.map((trip) => trip._id);
                const filteredNewTrips = newTrips.filter(
                    (trip) => !existingKeys.includes(trip.key)
                );
                setTripResults([...tripResults, ...filteredNewTrips]);
                setLoadingStatus({
                    loading: false,
                    page: loadingStatus.page + 1,
                });
            }
        } catch (error) {
            console.error('Error fetching trip results:', error);
        }
    };

    useEffect(() => {
        const countResultsHandler = async () => {
            try {
                const countResults = await instance.get('/trips/results', {
                    params: {
                        location,
                        toDate,
                        fromDate,
                    },
                    headers: { 'Content-Type': 'application/json' }
                });
                if (countResults.status === 200) {
                    setTripCount(countResults.data.data.tripsCount);
                    fetchTripsHandler();
                }
            } catch (error) {
                console.error('Error counting results:', error);
            }
        };

        countResultsHandler();
    }, []);

    const handleShowMore = async () => {
        await fetchTripsHandler();
    };

    const skeletonCount =
        (tripCount - (tripResults.length ?? 0)) / 9 >= 1
            ? 9
            : tripCount - (tripResults.length ?? 0);

    console.log(tripCount);
    return (
        <Content>
            <Wrapper>
                <Container id="trip-results-container">
                    {tripResults.map((trip) => {
                        console.log(tripResults);
                        return <TripCard key={trip._id} trip={trip} />;
                    })}
                    {loadingStatus.loading && (
                        <SkeletonCard cards={skeletonCount} />
                    )}
                </Container>
            </Wrapper>
            {((tripResults.length ?? 0) < tripCount && (tripCount !== 0)) && (
                <StyledButtonWrapper>
                    {
                        <StyledLoadButton onClick={handleShowMore}>
                            Show more
                        </StyledLoadButton>
                    }
                </StyledButtonWrapper>
            )}
        </Content>
    );
}
