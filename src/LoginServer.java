import com.sun.net.httpserver.HttpServer;
import com.sun.net.httpserver.HttpHandler;
import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.Headers;

import java.io.*;
import java.net.InetSocketAddress;
import java.nio.charset.StandardCharsets;

public class LoginServer {
    public static void main(String[] args) throws IOException {
        // Create the HTTP server on port 8080
        HttpServer server = HttpServer.create(new InetSocketAddress(8080), 0);
        System.out.println("Server is running on http://localhost:8080");

        // Define the /api/login endpoint
        server.createContext("/api/login", new LoginHandler());

        // Start the server
        server.setExecutor(null); // Use the default executor
        server.start();
    }

    static class LoginHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            Headers headers = exchange.getResponseHeaders();

            // Add CORS headers
            headers.add("Access-Control-Allow-Origin", "*"); // Allow all origins
            headers.add("Access-Control-Allow-Methods", "GET, POST, OPTIONS"); // Allow specific methods
            headers.add("Access-Control-Allow-Headers", "Content-Type"); // Allow specific headers

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
}
