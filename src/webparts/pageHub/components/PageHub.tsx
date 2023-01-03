import * as React from "react";
import { DocumentCard, DocumentCardActivity, DocumentCardTitle, DocumentCardDetails, DocumentCardImage } from "@fluentui/react/lib/DocumentCard";
import { Stack } from "@fluentui/react/lib/Stack";
import { ImageFit } from "@fluentui/react/lib/Image";
import { Pagination } from "@pnp/spfx-controls-react/lib/pagination";
import { Text } from "@fluentui/react";

import styles from "./PageHub.module.scss";
import * as strings from "PageHubWebPartStrings";
import { SearchResult, useSearchPage } from "../hooks/useSearchPage";
import { IPageHubProps } from "./IPageHubProps";

const PageHub: React.FC<IPageHubProps> = (props: IPageHubProps) => {
    const [currentPage, setCurrentPage] = React.useState<number>(1);
    const { customPages, totalPages } = useSearchPage(props.contentType, currentPage);

    return (
        <Stack tokens={{ childrenGap: 15 }}>
            {customPages && customPages.length ? (
                <>
                    <Stack horizontal wrap>
                        {customPages.map((page: SearchResult) => (
                            <DocumentCard aria-label={`${page.Title} Custom pages`} className={styles.pagesCard} onClickHref={page.OriginalPath}>
                                <DocumentCardImage height={150} imageFit={ImageFit.cover} imageSrc={page.PictureThumbnailURL} />
                                <DocumentCardDetails>
                                    <DocumentCardTitle title={page.Title} shouldTruncate />
                                </DocumentCardDetails>
                                <DocumentCardActivity
                                    activity={`Last modified ${new Date(page.LastModifiedTime.toLocaleString()).toLocaleDateString()}`}
                                    people={[{ name: page.Author, profileImageSrc: page.ProfileImageUrl }]}
                                />
                            </DocumentCard>
                        ))}
                    </Stack>
                    {totalPages === 1 ? null : <Pagination currentPage={currentPage} totalPages={totalPages} onChange={(page) => setCurrentPage(page)} limiter={6} />}
                </>
            ) : (
                <Text>{strings.NoResult}</Text>
            )}
        </Stack>
    );
};

export default PageHub;
