import * as React from "react";
import * as ReactDom from "react-dom";
import { Version } from "@microsoft/sp-core-library";
import { IPropertyPaneConfiguration, PropertyPaneTextField } from "@microsoft/sp-property-pane";
import { BaseClientSideWebPart } from "@microsoft/sp-webpart-base";

import * as strings from "PageHubWebPartStrings";
import PageHub from "./components/PageHub";
import { IPageHubProps } from "./components/IPageHubProps";
import PageHubService from "./services/PageHubService";

export interface IPageHubWebPartProps {
    contentType: string;
}

export default class PageHubWebPart extends BaseClientSideWebPart<IPageHubWebPartProps> {
    public render(): void {
        const element: React.ReactElement<IPageHubProps> = React.createElement(PageHub, {
            contentType: this.properties.contentType
        });
        ReactDom.render(element, this.domElement);
    }

    protected async onInit(): Promise<void> {
        await super.onInit();
        PageHubService.initializeInstance(this.context);
        this.properties.contentType = "Custom pages";
    }

    protected onDispose(): void {
        PageHubService.destroyInstance();
        ReactDom.unmountComponentAtNode(this.domElement);
    }

    protected get dataVersion(): Version {
        return Version.parse("1.0");
    }

    protected get disableReactivePropertyChanges(): boolean {
        return true;
    }

    protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
        return {
            pages: [
                {
                    header: {
                        description: strings.PropertyPaneDescription
                    },
                    groups: [
                        {
                            groupFields: [
                                PropertyPaneTextField("contentType", {
                                    label: strings.ContentTypeFieldLabel
                                })
                            ]
                        }
                    ]
                }
            ]
        };
    }
}
