import {
    ApiCompiledQueryResults,
    ApiErrorPayload,
    ApiExploreResults,
    ApiExploresResults,
    ApiSuccessEmpty,
    MetricQuery,
} from '@lightdash/common';
import {
    Body,
    Get,
    Middlewares,
    OperationId,
    Path,
    Post,
    Put,
    Request,
    Response,
    Route,
    SuccessResponse,
    Tags,
} from '@tsoa/runtime';
import express from 'express';
import knex from 'knex';
import { CsvService } from '../services/CsvService/CsvService';
import {
    allowApiKeyAuthentication,
    isAuthenticated,
    unauthorisedInDemo,
} from './authentication';
import { BaseController } from './baseController';

@Route('/api/v1/projects/{projectUuid}/{spaceUuid}/tables')
@Response<ApiErrorPayload>('default', 'Error')
@Tags('Projects')
export class TablesController extends BaseController {
    @Middlewares([allowApiKeyAuthentication, isAuthenticated])
    @SuccessResponse('200', 'Success')
    @Get('/')
    @OperationId('GetTables')
    async GetTables(
        @Path() projectUuid: string,
        @Path() spaceUuid: string,
        @Request() req: express.Request,
    ): Promise<{ status: 'ok'; results: ApiExploresResults }> {
        this.setStatus(200);
        const space: any = await this.services
            .getSpaceService()
            .getSpace(projectUuid, req.user!, spaceUuid);
        const database = knex({
            client: 'mysql',
            connection: {
                host: '127.0.0.1',
                user: space.database.dbUser,
                password: space.database.dbPassword,
                database: 'graph_platform',
            },
        });
        const results: ApiExploresResults = [];
        database
            .raw('SHOW TABLES')
            .then((tables) => {
                const allTables = tables[0].map(
                    (row: any) => row.Tables_in_your_database,
                );
                console.log(allTables);
            })
            .catch((error) => {
                console.error(error);
            });

        return {
            status: 'ok',
            results,
        };
    }

    @Middlewares([allowApiKeyAuthentication, isAuthenticated])
    @SuccessResponse('200', 'Success')
    @Get('{exploreId}')
    @OperationId('GetExplore')
    async GetExplore(
        @Path() exploreId: string,

        @Path() projectUuid: string,
        @Request() req: express.Request,
    ): Promise<{ status: 'ok'; results: ApiExploreResults }> {
        this.setStatus(200);
        const results = await this.services
            .getProjectService()
            .getExplore(req.user!, projectUuid, exploreId);

        return {
            status: 'ok',
            results,
        };
    }

    @Middlewares([allowApiKeyAuthentication, isAuthenticated])
    @SuccessResponse('200', 'Success')
    @Post('{exploreId}/compileQuery')
    @OperationId('CompileQuery')
    async CompileQuery(
        @Path() exploreId: string,
        @Path() projectUuid: string,
        @Request() req: express.Request,
        @Body() body: MetricQuery,
    ): Promise<{ status: 'ok'; results: ApiCompiledQueryResults }> {
        this.setStatus(200);

        const results = (
            await this.services
                .getProjectService()
                .compileQuery(req.user!, body, projectUuid, exploreId)
        ).query;

        return {
            status: 'ok',
            results,
        };
    }

    @Middlewares([allowApiKeyAuthentication, isAuthenticated])
    @SuccessResponse('200', 'Success')
    @Post('{exploreId}/downloadCsv')
    @OperationId('DownloadCsvFromExplore')
    async DownloadCsvFromExplore(
        @Path() exploreId: string,
        @Path() projectUuid: string,
        @Request() req: express.Request,
        @Body()
        body: MetricQuery & {
            onlyRaw: boolean;
            csvLimit: number | null | undefined;
            showTableNames: boolean;
            customLabels?: { [key: string]: string };
            columnOrder: string[];
            hiddenFields?: string[];
            chartName?: string;
        },
    ): Promise<{ status: 'ok'; results: { jobId: string } }> {
        this.setStatus(200);
        const {
            onlyRaw,
            csvLimit,
            showTableNames,
            customLabels,
            columnOrder,
            hiddenFields,
        } = body;
        const metricQuery: MetricQuery = {
            exploreName: body.exploreName,
            dimensions: body.dimensions,
            metrics: body.metrics,
            filters: body.filters,
            sorts: body.sorts,
            limit: body.limit,
            tableCalculations: body.tableCalculations,
            additionalMetrics: body.additionalMetrics,
            customDimensions: body.customDimensions,
        };
        const {
            jobId,
        } = await req.services.getCsvService().scheduleDownloadCsv(req.user!, {
            userUuid: req.user?.userUuid!,
            projectUuid,
            exploreId,
            metricQuery,
            onlyRaw,
            csvLimit,
            showTableNames,
            customLabels,
            columnOrder,
            hiddenFields,
            chartName: body.chartName,
        });

        return {
            status: 'ok',
            results: {
                jobId,
            },
        };
    }
}
