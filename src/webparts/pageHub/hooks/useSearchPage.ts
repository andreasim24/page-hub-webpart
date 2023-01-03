import * as React from "react";
import PageHubService from "../services/PageHubService";
import { ISearchQuery, ISearchResult, SortDirection } from "@pnp/sp/search";
import { Logger } from "@pnp/logging";

export interface SearchResult extends ISearchResult {
    CreatedBy: string;
    ProfileImageUrl: string;
}

interface IUseSearchPage {
    customPages: SearchResult[];
    totalPages: number;
}

export const useSearchPage = (contentType: string, currentPage: number): IUseSearchPage => {
    const pageHubService = PageHubService.getInstance();
    const sp = pageHubService.getSP();
    const graph = pageHubService.getGraph();
    const [customPages, setCustomPages] = React.useState<SearchResult[]>();
    const [totalPages, setTotalPages] = React.useState<number>();
    const pageSize = 6;

    const getCustomPagesByTag = async (contentType: string, pageNumber: number): Promise<void> => {
        try {
            const response = await sp.search(<ISearchQuery>{
                Querytext: `contenttype: ${contentType}`,
                SelectProperties: ["CreatedBy", "LastModifiedTime", "Title", "Author", "PictureThumbnailURL", "Created"],
                RowLimit: pageSize,
                StartRow: (pageNumber - 1) * pageSize,
                SortList: [{ Property: "Created", Direction: SortDirection.Descending }]
            });
            await getProfilePhotos(response.PrimarySearchResults as SearchResult[]);
            setCustomPages(response.PrimarySearchResults as SearchResult[]);
            setTotalPages(Math.ceil(response.TotalRows / pageSize));
        } catch (error) {
            Logger.error(error);
        }
    };

    const getProfilePhotos = async (pages: SearchResult[]): Promise<void> => {
        try {
            for (const page of pages) {
                const createdBy = page.CreatedBy;
                const email = createdBy.split("|")[0].trim();
                await graph.users
                    .getById(email)
                    .photo.getBlob()
                    .then((result) => {
                        const url = window.URL || window.webkitURL;
                        const blobUrl = url.createObjectURL(result);
                        page.ProfileImageUrl = blobUrl;
                    });
            }
        } catch (error) {
            Logger.error(error);
        }
    };

    React.useEffect(() => {
        getCustomPagesByTag(contentType, currentPage);
    }, [contentType, currentPage]);

    return { customPages, totalPages };
};
