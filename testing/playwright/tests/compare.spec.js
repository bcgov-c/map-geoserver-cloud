import { test, expect } from "@playwright/test";

import wmsMapRequests from "../fixtures/wms-map-requests.json";
import wmsGetCapRequests from "../fixtures/wms-get-capabilities-requests.json";
import wfsFeatureRequests from "../fixtures/wfs-feature-requests.json";

const { XMLParser } = require("fast-xml-parser");

const referenceHost = 'http://kamelos.dmz:8080';
const testHost = 'https://gscloud.test.api.gov.bc.ca';

test.describe("WFS GetFeature Responses", () => {

    wfsFeatureRequests.forEach((requestUrl, index) => {

        const referenceRequestUrl = referenceHost + requestUrl;
        const testRequestUrl = testHost + requestUrl;

        test(index, 
            async ({ page }) => {
                let referenceResponse = await page.goto(referenceRequestUrl);
                const referenceJson = await referenceResponse.json();
                let testResponse = await page.goto(testRequestUrl);
                const testJson = await testResponse.json();
                // We test specific elements because the entire JSON will not match (for example, timestamp will differ)
                expect(testJson.totalFeatures).toEqual(referenceJson.totalFeatures);
                if (referenceJson.features[0] && testJson.features[0]) {
                    expect(testJson.features[0].id).toEqual(referenceJson.features[0].id);
                }
                expect(testJson.numberMatched).toEqual(referenceJson.numberMatched);
                expect(testJson.numberReturned).toEqual(referenceJson.numberReturned);
            }
        );
    });
});

test.describe("WMS GetCapabilities Responses", () => {
    const options = {
        ignoreAttributes : false
    };
    const xmlParser = new XMLParser(options);

    wmsGetCapRequests.forEach((requestUrl, index) => {
        const referenceRequestUrl = referenceHost + requestUrl;
        const testRequestUrl = testHost + requestUrl;

        test(index, 
            async ({ page }) => {
                let referenceResponse = await page.goto(referenceRequestUrl);
                const referenceXML = xmlParser.parse(await referenceResponse.text());
                let testResponse = await page.goto(testRequestUrl);
                const testXML = xmlParser.parse(await testResponse.text());

                expect(testXML.WMS_Capabilities.Capability.Layer.Layer.Name)
                    .toEqual(referenceXML.WMS_Capabilities.Capability.Layer.Layer.Name);
                expect(testXML.WMS_Capabilities.Capability.Layer.Layer.Title)
                    .toEqual(referenceXML.WMS_Capabilities.Capability.Layer.Layer.Title);
            }
        );
    });
});
