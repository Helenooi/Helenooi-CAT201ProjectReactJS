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

        // Register endpoints
        server.createContext("/api/login", new LoginHandler());
        server.createContext("/add-product", new AddProductHandler());

        // Start the server
        server.setExecutor(null); // Use the default executor
        server.start();
    }

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

            // Handle POST method for login
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
                String response = "Method Not Allowed";
                exchange.sendResponseHeaders(405, response.getBytes(StandardCharsets.UTF_8).length);
                OutputStream os = exchange.getResponseBody();
                os.write(response.getBytes(StandardCharsets.UTF_8));
                os.close();
            }
        }
    }


    static class AddProductHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            Headers headers = exchange.getResponseHeaders();
    
            // Add CORS headers
            headers.add("Access-Control-Allow-Origin", "*");
            headers.add("Access-Control-Allow-Methods", "POST, OPTIONS");
            headers.add("Access-Control-Allow-Headers", "Content-Type");
    
            // Handle OPTIONS method for preflight requests
            if ("OPTIONS".equalsIgnoreCase(exchange.getRequestMethod())) {
                exchange.sendResponseHeaders(204, -1);
                return;
            }
    
            if ("POST".equalsIgnoreCase(exchange.getRequestMethod())) {
                try {
                    InputStream inputStream = exchange.getRequestBody();
                    String body = new String(inputStream.readAllBytes(), StandardCharsets.UTF_8);
    
                    // Parse data (expecting 6 fields now)
                    String[] parts = body.split(",");
                    if (parts.length != 6) {
                        String errorResponse = "Invalid number of fields. Expected 6 fields.";
                        exchange.sendResponseHeaders(400, errorResponse.length());
                        try (OutputStream os = exchange.getResponseBody()) {
                            os.write(errorResponse.getBytes());
                        }
                        return;
                    }
    
                    // Match the order from frontend
                    String clothesCode = parts[0];
                    String clothesName = parts[1];
                    String size = parts[2];
                    String rentPrice = parts[3];
                    String picturePath = parts[4];
                    String description = parts[5];
    
                    String projectRoot = System.getProperty("user.dir");
                    String filePath = projectRoot + File.separator + "public" + File.separator + "product.csv";
    
                    // Create the file if it doesn't exist
                    File csvFile = new File(filePath);
                    boolean isNewFile = false;
                    if (!csvFile.exists()) {
                        File parentDir = csvFile.getParentFile();
                        if (parentDir != null && !parentDir.exists()) {
                            parentDir.mkdirs();
                        }
                        isNewFile = csvFile.createNewFile();
                    }
    
                    // Append to the CSV file
                    try (BufferedWriter writer = new BufferedWriter(new FileWriter(csvFile, true))) {
                        if (isNewFile) {
                            writer.write("Clothes Code,Clothes Name,Size,Rent Price,Picture,Description\n");
                        }
                        writer.write(String.format("%s,%s,%s,%s,%s,%s\n",
                            clothesCode, clothesName, size, rentPrice, picturePath, description));
                    }
    
                    // Send success response
                    String response = "Product added successfully!";
                    exchange.sendResponseHeaders(200, response.length());
                    try (OutputStream os = exchange.getResponseBody()) {
                        os.write(response.getBytes());
                    }
                } catch (Exception e) {
                    e.printStackTrace();
                    String errorResponse = "Internal server error: " + e.getMessage();
                    exchange.sendResponseHeaders(500, errorResponse.length());
                    try (OutputStream os = exchange.getResponseBody()) {
                        os.write(errorResponse.getBytes());
                    }
                }
            } else {
                exchange.sendResponseHeaders(405, -1); // Method Not Allowed
            }
        }
    } 
}