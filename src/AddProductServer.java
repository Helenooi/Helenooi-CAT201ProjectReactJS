
import com.sun.net.httpserver.HttpServer;
import com.sun.net.httpserver.HttpHandler;
import com.sun.net.httpserver.HttpExchange;

import java.io.*;
import java.net.InetSocketAddress;
import java.nio.charset.StandardCharsets;

public class AddProductServer {
    public static void main(String[] args) throws IOException {
        // Create HTTP server
        HttpServer server = HttpServer.create(new InetSocketAddress(8080), 0);
        server.createContext("/add-product", new AddProductHandler());
        server.setExecutor(null); // Use the default executor
        server.start();
        System.out.println("Server started on http://localhost:8080");
    }

    static class AddProductHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            // Set CORS headers to allow requests from any origin (or specify your frontend domain)
            exchange.getResponseHeaders().set("Access-Control-Allow-Origin", "*");
            exchange.getResponseHeaders().set("Access-Control-Allow-Methods", "POST, OPTIONS");
            exchange.getResponseHeaders().set("Access-Control-Allow-Headers", "Content-Type");

            // Handle OPTIONS request for preflight check
            if ("OPTIONS".equalsIgnoreCase(exchange.getRequestMethod())) {
                exchange.sendResponseHeaders(200, -1); // Respond OK for preflight
                return;
            }

            if ("POST".equalsIgnoreCase(exchange.getRequestMethod())) {
                // Read request body
                InputStream inputStream = exchange.getRequestBody();
                String body = new String(inputStream.readAllBytes(), StandardCharsets.UTF_8);

                // Parse data (assuming it's sent as plain text)
                String[] parts = body.split(",");
                if (parts.length != 5) {
                    exchange.sendResponseHeaders(400, -1); // Bad Request
                    return;
                }

                String clothesName = parts[0];
                String size = parts[1];
                String retailPrice = parts[2];
                String picturePath = parts[3];
                String description = parts[4];

                // Define file path;;;;;;
                File csvFile = new File("data/products.csv");

                // Create file if it doesn't exist
                boolean isNewFile = false;
                if (!csvFile.exists()) {
                    isNewFile = csvFile.createNewFile();
                }

                // Append to CSV file
                try (BufferedWriter writer = new BufferedWriter(new FileWriter(csvFile, true))) {
                    // Write headers if it's a new file
                    if (isNewFile) {
                        writer.write("Clothes Name,Size,Retail Price,Picture,Description\n");
                    }
                    writer.write(clothesName + "," + size + "," + retailPrice + "," + picturePath + "," + description + "\n");
                }

                // Send response
                String response = "Product added successfully!";
                exchange.sendResponseHeaders(200, response.length());
                OutputStream outputStream = exchange.getResponseBody();
                outputStream.write(response.getBytes());
                outputStream.close();
            } else {
                exchange.sendResponseHeaders(405, -1); // Method Not Allowed
            }
        }
    }
}
