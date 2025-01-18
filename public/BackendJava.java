import com.sun.net.httpserver.HttpServer;
import com.sun.net.httpserver.HttpHandler;
import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.Headers;

import java.io.*;
import java.net.InetSocketAddress;
import java.nio.charset.StandardCharsets;
/*
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.Base64;
*/

public class BackendJava {
    public static void main(String[] args) throws IOException {
        // Create the HTTP server on port 8080
        HttpServer server = HttpServer.create(new InetSocketAddress(8080), 0);
        System.out.println("Server is running on http://localhost:8080");

        // Register endpoints
        server.createContext("/api/login", new LoginHandler());
        server.createContext("/add-product", new AddProductHandler());
        server.createContext("/api/signup", new SignupHandler());
        server.createContext("/api/saveOrder", new CheckoutHandler());


        // Start the server
        server.setExecutor(null); // Use the default executor
        server.start();
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



    static class LoginHandler implements HttpHandler {
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
    
            // Handle POST request for login
            if ("POST".equalsIgnoreCase(exchange.getRequestMethod())) {
                InputStream inputStream = exchange.getRequestBody();
                String requestBody = new String(inputStream.readAllBytes(), StandardCharsets.UTF_8);
    
                // Parse the JSON input (expecting email/username and password)
                String username = null;
                String password = null;
    
                if (requestBody.contains("\"username\"") && requestBody.contains("\"password\"")) {
                    username = requestBody.split("\"username\":\"")[1].split("\"")[0];
                    password = requestBody.split("\"password\":\"")[1].split("\"")[0];
                }
    
                if (username == null || password == null) {
                    String errorResponse = "Missing username or password.";
                    exchange.sendResponseHeaders(400, errorResponse.length());
                    try (OutputStream os = exchange.getResponseBody()) {
                        os.write(errorResponse.getBytes());
                    }
                    return;
                }
    
                // Validate login credentials by checking the CSV file
                String filePath = System.getProperty("user.dir") + File.separator + "public" + File.separator + "users.csv";
                File csvFile = new File(filePath);
    
                if (!csvFile.exists()) {
                    String errorResponse = "User data not found.";
                    exchange.sendResponseHeaders(404, errorResponse.length());
                    try (OutputStream os = exchange.getResponseBody()) {
                        os.write(errorResponse.getBytes());
                    }
                    return;
                }
    
                boolean loginSuccess = false;
    
                try (BufferedReader reader = new BufferedReader(new FileReader(csvFile))) {
                    String line;
                    reader.readLine(); // Skip header line
    
                    while ((line = reader.readLine()) != null) {
                        String[] userFields = line.split(",");
                        if (userFields.length >= 5) {
                            String storedUsername = userFields[3];  // Username is the 4th column
                            String storedPassword = userFields[4];  // Password is the 5th column
    
                            if (storedUsername.equals(username) && storedPassword.equals(password)) {
                                loginSuccess = true;
                                break;
                            }
                        }
                    }
                } catch (IOException e) {
                    e.printStackTrace();
                    String errorResponse = "Error reading user data.";
                    exchange.sendResponseHeaders(500, errorResponse.length());
                    try (OutputStream os = exchange.getResponseBody()) {
                        os.write(errorResponse.getBytes());
                    }
                    return;
                }
    
                // Send response based on login success
                if (loginSuccess) {
                    String response = "{\"status\":\"success\",\"message\":\"Login successful!\"}";
                    exchange.sendResponseHeaders(200, response.length());
                    try (OutputStream os = exchange.getResponseBody()) {
                        os.write(response.getBytes());
                    }
                } else {
                    String errorResponse = "Invalid username or password.";
                    exchange.sendResponseHeaders(401, errorResponse.length());
                    try (OutputStream os = exchange.getResponseBody()) {
                        os.write(errorResponse.getBytes());
                    }
                }
            } else {
                // Method Not Allowed for non-POST requests
                String response = "Method Not Allowed";
                exchange.sendResponseHeaders(405, response.getBytes(StandardCharsets.UTF_8).length);
                try (OutputStream os = exchange.getResponseBody()) {
                    os.write(response.getBytes());
                }
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
    
                // Default role is "user"
                String role = "user";  // Assign default role as "user"
    
                // Hash the password (using plain text for now, you may hash it later)
                String hashedPassword = password;
    
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
                        writer.write("First Name,Last Name,Email,Username,Password,Role,Done\n"); // Write header if new file
                    }
                    writer.write(String.format("%s,%s,%s,%s,%s,%s,%s\n", firstname, lastname, email, username, hashedPassword, "user","yes"));
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
    }
    
 
    /// 

    static class CheckoutHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            // Add CORS headers
            Headers headers = exchange.getResponseHeaders();
            headers.add("Access-Control-Allow-Origin", "*");
            headers.add("Access-Control-Allow-Methods", "POST, OPTIONS");
            headers.add("Access-Control-Allow-Headers", "Content-Type");

            // Handle OPTIONS method for preflight requests
            if ("OPTIONS".equalsIgnoreCase(exchange.getRequestMethod())) {
                exchange.sendResponseHeaders(204, -1); // No content for OPTIONS
                return;
            }

            // Handle only POST requests for checkout
            if ("POST".equalsIgnoreCase(exchange.getRequestMethod())) {
                String cartData = readRequestBody(exchange);
                if (cartData != null) {
                    System.out.println("Received Cart Data: " + cartData);

                    // Process cart data here (e.g., save to a CSV)
                    String response = saveCartDataToCsv(cartData);

                    // Send response back to the client
                    sendResponse(exchange, response, 200); // Send success response
                } else {
                    sendResponse(exchange, "No cart data received", 400); // Bad Request
                }
            } else {
                sendResponse(exchange, "Method Not Allowed", 405); // Method Not Allowed
            }
        }

        // Function to read the request body (cart data)
        private String readRequestBody(HttpExchange exchange) throws IOException {
            InputStream inputStream = exchange.getRequestBody();
            return new String(inputStream.readAllBytes(), StandardCharsets.UTF_8);
        }

        // Function to save the cart data to a CSV file
        private String saveCartDataToCsv(String cartData) {
            String filePath = "orderrecord.csv";
            StringBuilder response = new StringBuilder();

            // Example: Save cart data to CSV (adapt the following as per your actual data)
            try (BufferedWriter writer = new BufferedWriter(new FileWriter(filePath, true))) {
                // Check if the file is empty and write headers if necessary
                File file = new File(filePath);
                if (file.length() == 0) {
                    writer.write("Email,Clothes Code,Clothes Name,Size,Price\n");
                }

                // Example: Parse and write the cart data
                String[] cartItems = cartData.substring(1, cartData.length() - 1).split("\\},\\{");
                for (String item : cartItems) {
                    // Manually extract values from the cart item (adapt as needed)
                    String email = extractValue(item, "\"email\""); // assuming email is passed as part of the data
                    String clothesCode = extractValue(item, "\"Clothes Code\"");
                    String clothesName = extractValue(item, "\"Clothes Name\"");
                    String size = extractValue(item, "\"Size\"");
                    String rentPrice = extractValue(item, "\"Rent Price\"");

                    writer.write(String.format("%s,%s,%s,%s,%s\n", email, clothesCode, clothesName, size, rentPrice));
                }

                response.append("Checkout data received and saved successfully!");
            } catch (IOException e) {
                e.printStackTrace();
                response.append("Error saving data to CSV: ").append(e.getMessage());
            }

            return response.toString();
        }

        // Helper function to extract the value for a given key
        private String extractValue(String item, String key) {
            String value = "";
            String searchKey = key + "\":\"";
            int startIdx = item.indexOf(searchKey);

            if (startIdx != -1) {
                startIdx += searchKey.length();
                int endIdx = item.indexOf("\"", startIdx);
                if (endIdx != -1) {
                    value = item.substring(startIdx, endIdx);
                }
            }
            return value;
        }

        // Function to send a response back to the client
        private void sendResponse(HttpExchange exchange, String response, int statusCode) throws IOException {
            exchange.sendResponseHeaders(statusCode, response.getBytes().length);
            try (OutputStream os = exchange.getResponseBody()) {
                os.write(response.getBytes());
            }
        }
    }
} 