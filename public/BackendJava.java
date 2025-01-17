import com.sun.net.httpserver.HttpServer;
import com.sun.net.httpserver.HttpHandler;
import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.Headers;

import java.io.*;
import java.net.InetSocketAddress;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.Base64;

public class BackendJava {
    public static void main(String[] args) throws IOException {
        // Create the HTTP server on port 8080
        HttpServer server = HttpServer.create(new InetSocketAddress(8080), 0);
        System.out.println("Server is running on http://localhost:8080");

        // Register endpoints
        server.createContext("/api/login", new LoginHandler());
        server.createContext("/add-product", new AddProductHandler());
        server.createContext("/api/signup", new SignupHandler());

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


    static class SignupHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            Headers headers = exchange.getResponseHeaders();
    
            // Add CORS headers
            headers.add("Access-Control-Allow-Origin", "*");
            headers.add("Access-Control-Allow-Methods", "POST, OPTIONS");
            headers.add("Access-Control-Allow-Headers", "Content-Type");
    
            // Handle OPTIONS method for preflight requests
            if ("OPTIONS".equalsIgnoreCase(exchange.getRequestMethod())) {
                exchange.sendResponseHeaders(204, -1); // No content for OPTIONS
                return;
            }
    
            if ("POST".equalsIgnoreCase(exchange.getRequestMethod())) {
                InputStream is = exchange.getRequestBody();
                String requestBody = new String(is.readAllBytes(), StandardCharsets.UTF_8);
    
                // Parse JSON input
                String firstname = null;
                String lastname = null;
                String email = null;
                String password = null;
                if (requestBody.contains("\"firstname\"") && requestBody.contains("\"lastname\"") &&
                    requestBody.contains("\"email\"") && requestBody.contains("\"password\"")) {
                    firstname = requestBody.split("\"firstname\":\"")[1].split("\"")[0];
                    lastname = requestBody.split("\"lastname\":\"")[1].split("\"")[0];
                    email = requestBody.split("\"email\":\"")[1].split("\"")[0];
                    password = requestBody.split("\"password\":\"")[1].split("\"")[0];
                }
    
                if (firstname == null || lastname == null || email == null || password == null) {
                    String errorResponse = "Missing required fields.";
                    exchange.sendResponseHeaders(400, errorResponse.length());
                    try (OutputStream os = exchange.getResponseBody()) {
                        os.write(errorResponse.getBytes());
                    }
                    return;
                }
    
                // Generate username
                String username = generateUsername(firstname, lastname);
    
                // Hash the password
                String hashedPassword = hashPassword(password);
    
                // Save to CSV file
                String projectRoot = System.getProperty("user.dir");
                String filePath = projectRoot + File.separator + "public" + File.separator + "users.csv";
    
                File csvFile = new File(filePath);
                boolean isNewFile = false;
    
                if (!csvFile.exists()) {
                    File parentDir = csvFile.getParentFile();
                    if (parentDir != null && !parentDir.exists()) {
                        parentDir.mkdirs();
                    }
                    isNewFile = csvFile.createNewFile();
                }
    
                try (BufferedWriter writer = new BufferedWriter(new FileWriter(csvFile, true))) {
                    if (isNewFile) {
                        writer.write("First Name,Last Name,Email,Username,Password\n"); // Write header if new file
                    }
                    writer.write(String.format("%s,%s,%s,%s,%s\n", firstname, lastname, email, username, hashedPassword));
                }
    
                // Send success response
                String response = String.format("{\"status\":\"success\",\"message\":\"Signup successful\",\"username\":\"%s\"}", username);
                exchange.sendResponseHeaders(200, response.length());
                try (OutputStream os = exchange.getResponseBody()) {
                    os.write(response.getBytes());
                }
            } else {
                String response = "Method Not Allowed";
                exchange.sendResponseHeaders(405, response.getBytes(StandardCharsets.UTF_8).length);
                try (OutputStream os = exchange.getResponseBody()) {
                    os.write(response.getBytes());
                }
            }
        }
    
        // Generate username by combining firstname, lastname, and a random 2-digit number
        private String generateUsername(String firstname, String lastname) {
            String baseUsername = (firstname + lastname).toLowerCase().replaceAll("\\s+", "");
            int randomNumber = (int) (Math.random() * 90) + 10; // Generate a random 2-digit number
            return baseUsername + randomNumber;
        }
    
        // Hash password using SHA-256
        private String hashPassword(String password) {
            try {
                MessageDigest digest = MessageDigest.getInstance("SHA-256");
                byte[] encodedHash = digest.digest(password.getBytes(StandardCharsets.UTF_8));
                return Base64.getEncoder().encodeToString(encodedHash);
            } catch (NoSuchAlgorithmException e) {
                throw new RuntimeException("Error hashing password", e);
            }
        }
    }
    
}