import { SPFI, spfi, SPFx as spSPFx } from "@pnp/sp";
import { WebPartContext } from "@microsoft/sp-webpart-base";
import { LogLevel, PnPLogging } from "@pnp/logging";
import { GraphFI, graphfi, SPFx as SPFxGraph } from "@pnp/graph";
import "@pnp/graph/users";
import "@pnp/sp/search";
import "@pnp/graph/photos";
import "@pnp/graph/batching";

export default class PageHubService {
    static instance: PageHubService | undefined;
    protected _sp: SPFI;
    protected graph: GraphFI;
    protected context: WebPartContext;

    constructor(context: WebPartContext) {
        this._sp = spfi().using(spSPFx(context)).using(PnPLogging(LogLevel.Warning));
        this.graph = graphfi().using(SPFxGraph(context));
    }

    public static initializeInstance(context: WebPartContext): void {
        if (!PageHubService.instance) {
            PageHubService.instance = new PageHubService(context);
        }
    }

    public static getInstance = (): PageHubService => {
        if (!PageHubService.instance) {
            throw new Error("PageHubService is not initialized");
        }

        return PageHubService.instance;
    };

    public static destroyInstance(): void {
        PageHubService.instance = undefined;
    }

    public getSP(): SPFI {
        return this._sp;
    }

    public getGraph(): GraphFI {
        return this.graph;
    }
}
