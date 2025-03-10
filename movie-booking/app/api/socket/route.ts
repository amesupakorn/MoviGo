import { WebSocketServer, WebSocket } from "ws";

declare global {
  // eslint-disable-next-line no-var
  var wss: WebSocketServer | undefined;
}

const reservedSeats = new Set<string>(); // Store reserved seats

export async function GET() {
  if (!global.wss) {
    console.log("⚡ Setting up WebSocket server...");

    global.wss = new WebSocketServer({ port: 3001 });

    global.wss.on("connection", (ws: WebSocket) => {
      console.log("🔗 User Connected");

      // Send current reserved seats to the new user
      ws.send(JSON.stringify([...reservedSeats]));

      ws.on("message", (data) => {
        try {
          const seatData = JSON.parse(data.toString());
          const seatIdentifier = `${seatData.row}${seatData.number}`;

          if (seatData.action === "release") {
            if (reservedSeats.has(seatIdentifier)) {
                reservedSeats.delete(seatIdentifier);
        
                const releaseMessage = JSON.stringify({ 
                    row: seatData.row, 
                    number: seatData.number, 
                    action: "release" 
                });
        
                global.wss?.clients.forEach((client) => {
                    if (client.readyState === WebSocket.OPEN) {
                        client.send(releaseMessage);
                    }
                });
            }
         
          } else {
            // Handle new seat reservations
            if (!reservedSeats.has(seatIdentifier)) {
              reservedSeats.add(seatIdentifier);

              // Broadcast updated reservations
              global.wss?.clients.forEach((client) => {
                if (client.readyState === WebSocket.OPEN) {
                  client.send(JSON.stringify({ row: seatData.row, number: seatData.number, isAvailable: false }));
                }
              });
            }
          }
        } catch (error) {
          console.error("❌ Error processing WebSocket message:", error);
        }
      });

      ws.on("close", () => {
        console.log("❌ User Disconnected");
      });
    });
  }

  return new Response("WebSocket Server Running", { status: 200 });
}