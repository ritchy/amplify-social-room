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
            myUsername: username
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
                        username: username,
                        content: `message sent`,
                        createdDate: new Date().toString(),
                        lastUpdatedDate: new Date().toString()
                    })
                    window.alert("Message sent")
                }}>Send Message</button>
            </div>
            <div>
                Message Room: {currentRoomId} | Message as: {username} | Message: {content}
            </div>
        </div>
    )
}