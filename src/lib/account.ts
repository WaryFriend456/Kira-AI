import { EmailMessage, SyncResponse, SyncUpdatedResponse } from "@/types";
import axios from "axios";

export class Account {
    private token: string;

    constructor(token: string) {
        this.token = token;
    }

    private async startSync() {
        const response = await axios.post<SyncResponse>("https://api.aurinko.io/v1/email/sync", {}, {
            headers: {
                Authorization: `Bearer ${this.token}`
            },
            params: {
                daysWithin: 3,
                bodyType: "html"
        }
        });
        return response.data;
    }

    async getUpdatedEmails({ deltaToken, pageToken }: { deltaToken?: string, pageToken?: string }) {
        let params: Record<string, string> = {};
        if (deltaToken) {
            params.deltaToken = deltaToken;
        }
        if (pageToken) {
            params.pageToken = pageToken;
        } 

        const response = await axios.get<SyncUpdatedResponse>("https://api.aurinko.io/v1/email/sync/updated", {
            headers: {
                Authorization: `Bearer ${this.token}`,
            },
            params
        });
        return response.data;
    }

    async performInitialSync() {
        // perform initial sync
        try {
            let syncResponse = await this.startSync();
            while (!syncResponse.ready) {
                await new Promise(resolve => setTimeout(resolve, 1000));
                syncResponse = await this.startSync();
            }

            // get the bookmark delta token
            let storedDeltaToken: string = syncResponse.syncUpdatedToken;

            let updatedresponse = await this.getUpdatedEmails({ deltaToken: storedDeltaToken });

            if (updatedresponse.nextDeltaToken) {
                storedDeltaToken = updatedresponse.nextDeltaToken;
            }

            let allEmails: EmailMessage[] = updatedresponse.records;

            // fetch all pages if available
            while (updatedresponse.nextPageToken) {
                updatedresponse = await this.getUpdatedEmails({ pageToken: updatedresponse.nextPageToken });
                allEmails = allEmails.concat(updatedresponse.records);
                if(updatedresponse.nextDeltaToken) {
                    storedDeltaToken = updatedresponse.nextDeltaToken;
                }
            }

            console.log("Total emails fetched : ", allEmails.length);

            // store delta token for future sync
            await this.getUpdatedEmails({ deltaToken: storedDeltaToken });

            return {
                emails: allEmails,
                deltaToken: storedDeltaToken
            }

        } catch (error) {
            if(axios.isAxiosError(error)) {
                console.error("Error during initial sync : ", JSON.stringify(error.response?.data , null, 2));
            } else {
                console.error("Error during initial sync : ", error);
            }

        }
    }
}