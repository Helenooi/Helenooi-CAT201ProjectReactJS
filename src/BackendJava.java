import com.sun.net.httpserver.HttpServer;
import com.sun.net.httpserver.HttpHandler;
import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.Headers;

import java.io.*;
import java.net.InetSocketAddress;
import java.nio.charset.StandardCharsets;

public class BackendJava {
    public static void main(String[] args) throws IOException {
        // Create the HTTP server on port 8080
        HttpServer server = HttpServer.create(new InetSocketAddress(8080), 0);
        System.out.println("Server is running on http://localhost:8080");

        // Register the endpoints for login and add-product functionalities
        server.createContext("/api/login", new LoginHandler());
        server.createContext("/add-product", new AddProductHandler());

        // Start the server
        server.setExecutor(null); // Use the default executor
        server.start();
    }

    // LoginHandler to handle login requests
    static class LoginHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            Headers headers = exchange.getResponseHeaders();

            // Add CORS headers
            headers.add("Access-Control-Allow-Origin", "*");
            headers.add("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
            headers.add("Access-Control-Allow-Headers", "Content-Type");

            // Handle OPTIONS method for preflight requests
            if ("OPTIONS".equalsIgnoreCase(exchange.getRequestMethod())) {
                exchange.sendResponseHeaders(204, -1); // No content for OPTIONS
                return;
            }

            // Handle POST method for actual login
            if ("POST".equalsIgnoreCase(exchange.getRequestMethod())) {
                InputStream is = exchange.getRequestBody();
                String requestBody = new String(is.readAllBytes(), StandardCharsets.UTF_8);

                // Parse username and password from the request body
                String username = null;
                String password = null;
                if (requestBody.contains("\"username\"") && requestBody.contains("\"password\"")) {
                    username = requestBody.split("\"username\":\"")[1].split("\"")[0];
                    password = requestBody.split("\"password\":\"")[1].split("\"")[0];
                }

                // Mock user credentials
                String adminUsername = "admin";
                String adminPassword = "adminpassword";
                String userUsername = "user";
                String userPassword = "userpassword";

                // Prepare the response
                String jsonResponse;
                if (adminUsername.equals(username) && adminPassword.equals(password)) {
                    jsonResponse = "{\"status\":\"success\",\"role\":\"admin\"}";
                } else if (userUsername.equals(username) && userPassword.equals(password)) {
                    jsonResponse = "{\"status\":\"success\",\"role\":\"user\"}";
                } else {
                    jsonResponse = "{\"status\":\"error\",\"message\":\"Invalid username or password\"}";
                }

                // Send response
                headers.set("Content-Type", "application/json");
                exchange.sendResponseHeaders(200, jsonResponse.getBytes(StandardCharsets.UTF_8).length);
                OutputStream os = exchange.getResponseBody();
                os.write(jsonResponse.getBytes(StandardCharsets.UTF_8));
                os.close();
            } else {
                // Handle non-POST requests
                String response = "Method Not Allowed";
                exchange.sendResponseHeaders(405, response.getBytes(StandardCharsets.UTF_8).length);
                OutputStream os = exchange.getResponseBody();
                os.write(response.getBytes(StandardCharsets.UTF_8));
                os.close();
            }
        }
    }

    // AddProductHandler to handle adding products
    static class AddProductHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            // Set CORS headers to allow requests from any origin
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

                // Define file path
                File csvFile = new File("product.csv");

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
