import { useEffect, useLayoutEffect, useState } from "react";
import { generateClient } from "aws-amplify/api";
import { Schema } from "../amplify/data/resource";

type MessagePanelProps = {
    username: string
    currentRoomId: string
}

const client = generateClient<Schema>()
var content = "--"
export function MessagePanel({ username, currentRoomId }: MessagePanelProps) {

    useEffect(() => {
        // Add message subscriptions here
        const sub = client.subscriptions.subscribeMessage({
            roomId: currentRoomId,
            myUsername: "default"
        }).subscribe({
            next: (event) => {
                if (!event) { return }
                // Handle incoming messages here
                content = event.content
                if (event.username === username) { return }
            }
        })
        return () => sub.unsubscribe()
    }, [username, currentRoomId])

    return (
        <div>
            <div>
                <button onClick={
                    async () => {
                    const { data: message } = await client.models.Message.create({
                        roomId: currentRoomId,
                        username: "default",
                        content: `message sent`,
                        createdDate: "2025-11-18T20:23:00.000Z",
                        lastUpdatedDate: "2025-11-18T20:23:00.000Z"
                    })
                    window.alert("Message sent")
                }}>Send Message</button>
            </div>
            <div>
                Message Room: {currentRoomId} | Message as: default | Message: {content}
            </div>
        </div>
    )
}