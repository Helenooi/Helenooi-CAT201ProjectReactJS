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
        HttpServer server = HttpServer.create(new InetSocketAddress(8080), 0);
        System.out.println("Server is running on http://localhost:8080");

        server.createContext("/api/login", new LoginHandler());
        server.createContext("/add-product", new AddProductHandler());
        server.createContext("/api/signup", new SignupHandler());
        server.createContext("/api/saveOrder", new CheckoutHandler());


     
        server.setExecutor(null); 
        server.start();
    }

 
    static class AddProductHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            Headers headers = exchange.getResponseHeaders();
    
   
            headers.add("Access-Control-Allow-Origin", "*");
            headers.add("Access-Control-Allow-Methods", "POST, OPTIONS");
            headers.add("Access-Control-Allow-Headers", "Content-Type");
    
            if ("OPTIONS".equalsIgnoreCase(exchange.getRequestMethod())) {
                exchange.sendResponseHeaders(204, -1);
                return;
            }
    
            if ("POST".equalsIgnoreCase(exchange.getRequestMethod())) {
                try {
                    InputStream inputStream = exchange.getRequestBody();
                    String body = new String(inputStream.readAllBytes(), StandardCharsets.UTF_8);
    
         
                    String[] parts = body.split(",");
                    if (parts.length != 6) {
                        String errorResponse = "Invalid number of fields. Expected 6 fields.";
                        exchange.sendResponseHeaders(400, errorResponse.length());
                        try (OutputStream os = exchange.getResponseBody()) {
                            os.write(errorResponse.getBytes());
                        }
                        return;
                    }
    
                    String clothesCode = parts[0];
                    String clothesName = parts[1];
                    String size = parts[2];
                    String rentPrice = parts[3];
                    String picturePath = parts[4];
                    String description = parts[5];
    
                    String projectRoot = System.getProperty("user.dir");
                    String filePath = projectRoot + File.separator + "public" + File.separator + "product.csv";
    
                  
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
                            writer.write("Clothes Code,Clothes Name,Size,Rent Price,Picture,Description\n");
                        }
                        writer.write(String.format("%s,%s,%s,%s,%s,%s\n",
                            clothesCode, clothesName, size, rentPrice, picturePath, description));
                    }
    
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
    
     
            headers.add("Access-Control-Allow-Origin", "*");
            headers.add("Access-Control-Allow-Methods", "POST, OPTIONS");
            headers.add("Access-Control-Allow-Headers", "Content-Type");
    
            
            if ("OPTIONS".equalsIgnoreCase(exchange.getRequestMethod())) {
                exchange.sendResponseHeaders(204, -1); 
                return;
            }
    
            if ("POST".equalsIgnoreCase(exchange.getRequestMethod())) {
                InputStream inputStream = exchange.getRequestBody();
                String requestBody = new String(inputStream.readAllBytes(), StandardCharsets.UTF_8);
    
            
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
                    reader.readLine(); 
    
                    while ((line = reader.readLine()) != null) {
                        String[] userFields = line.split(",");
                        if (userFields.length >= 5) {
                            String storedUsername = userFields[3]; 
                            String storedPassword = userFields[4]; 
    
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
    
            headers.add("Access-Control-Allow-Origin", "*");
            headers.add("Access-Control-Allow-Methods", "POST, OPTIONS");
            headers.add("Access-Control-Allow-Headers", "Content-Type");
    
            if ("OPTIONS".equalsIgnoreCase(exchange.getRequestMethod())) {
                exchange.sendResponseHeaders(204, -1); 
                return;
            }
    
            if ("POST".equalsIgnoreCase(exchange.getRequestMethod())) {
                InputStream is = exchange.getRequestBody();
                String requestBody = new String(is.readAllBytes(), StandardCharsets.UTF_8);
    

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
    
                String username = generateUsername(firstname, lastname);
    
    
                String role = "user";  
    
                String hashedPassword = password;
    
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
    
        private String generateUsername(String firstname, String lastname) {
            String baseUsername = (firstname + lastname).toLowerCase().replaceAll("\\s+", "");
            int randomNumber = (int) (Math.random() * 90) + 10; 
            return baseUsername + randomNumber;
        }
    }
    
 

    static class CheckoutHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {

            Headers headers = exchange.getResponseHeaders();
            headers.add("Access-Control-Allow-Origin", "*");
            headers.add("Access-Control-Allow-Methods", "POST, OPTIONS");
            headers.add("Access-Control-Allow-Headers", "Content-Type");

            if ("OPTIONS".equalsIgnoreCase(exchange.getRequestMethod())) {
                exchange.sendResponseHeaders(204, -1); 
                return;
            }

            if ("POST".equalsIgnoreCase(exchange.getRequestMethod())) {
                String cartData = readRequestBody(exchange);
                if (cartData != null) {
                    System.out.println("Received Cart Data: " + cartData);

                 
                    String response = saveCartDataToCsv(cartData);

                    sendResponse(exchange, response, 200);
                } else {
                    sendResponse(exchange, "No cart data received", 400); 
                }
            } else {
                sendResponse(exchange, "Method Not Allowed", 405); 
            }
        }

        private String readRequestBody(HttpExchange exchange) throws IOException {
            InputStream inputStream = exchange.getRequestBody();
            return new String(inputStream.readAllBytes(), StandardCharsets.UTF_8);
        }

        private String saveCartDataToCsv(String cartData) {
            String filePath = "orderrecord.csv";
            StringBuilder response = new StringBuilder();

            try (BufferedWriter writer = new BufferedWriter(new FileWriter(filePath, true))) {
                File file = new File(filePath);
                if (file.length() == 0) {
                    writer.write("Email,Clothes Code,Clothes Name,Size,Price\n");
                }

                String[] cartItems = cartData.substring(1, cartData.length() - 1).split("\\},\\{");
                for (String item : cartItems) {
                    String email = extractValue(item, "\"email\""); 
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

        private void sendResponse(HttpExchange exchange, String response, int statusCode) throws IOException {
            exchange.sendResponseHeaders(statusCode, response.getBytes().length);
            try (OutputStream os = exchange.getResponseBody()) {
                os.write(response.getBytes());
            }
        }
    }
} 