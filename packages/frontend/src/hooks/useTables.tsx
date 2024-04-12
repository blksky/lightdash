import { type ApiError, type ApiExploresResults } from '@lightdash/common';
import { useQuery, type UseQueryOptions } from '@tanstack/react-query';
import { lightdashApi } from '../api';
import useQueryError from './useQueryError';

const getTables = async (projectUuid: string, spaceUuid: string, filtered?: boolean) =>
    lightdashApi<ApiExploresResults>({
        url: `/projects/${projectUuid}/${spaceUuid}/tables?filtered=${
            filtered ? 'true' : 'false'
        }`,
        method: 'GET',
        body: undefined,
    });

export const useTables = (
    projectUuid: string,
    spaceUuid: string,
    filtered?: boolean,
    useQueryFetchOptions?: UseQueryOptions<ApiExploresResults, ApiError>,
) => {
    const setErrorResponse = useQueryError();
    const queryKey = ['tables', projectUuid, spaceUuid, filtered ? 'filtered' : 'all'];
    return useQuery<ApiExploresResults, ApiError>({
        queryKey,
        queryFn: () => getTables(projectUuid, spaceUuid,filtered),
        onError: (result) => setErrorResponse(result),
        retry: false,
        ...useQueryFetchOptions,
    });
};
